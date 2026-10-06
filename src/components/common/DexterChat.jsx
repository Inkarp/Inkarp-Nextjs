"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiCornerUpLeft, FiPhone } from "react-icons/fi";
import { siteConfig } from "@/data/siteConfig";
import { pushEvent } from "@/lib/analytics";

const CONTACT_PHONE = siteConfig.contact.phone;
const CONTACT_PHONE_DIGITS = CONTACT_PHONE.replace(/\D/g, "");
const CONTACT_PHONE_TEL = CONTACT_PHONE.replace(/\s+/g, "");

const SUGGESTIONS = [
  "What rotary evaporators do you have?",
  "I need to measure moisture in plastics",
  "Which instruments suit pharma QC?",
];

const TOOL_LABELS = {
  search_products: "Searching the catalogue",
  get_product_details: "Reading the product data",
  recommend_workflow: "Checking that workflow",
  list_industries: "Looking up industries",
};

/**
 * Renders assistant text: paragraphs, plus [label](/path) links so product
 * mentions are clickable. Everything else stays literal — no HTML is
 * interpreted, so a model response can never inject markup.
 */
function RichText({ text }) {
  return text.split(/\n{2,}/).map((paragraph, blockIndex) => {
    const pieces = [];
    const pattern = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
    let cursor = 0;
    let match;

    while ((match = pattern.exec(paragraph)) !== null) {
      if (match.index > cursor) pieces.push(paragraph.slice(cursor, match.index));
      pieces.push(
        <Link
          className="font-semibold text-red underline underline-offset-2 hover:text-rose-700"
          href={match[2]}
          key={`${blockIndex}-${match.index}`}
        >
          {match[1]}
        </Link>
      );
      cursor = match.index + match[0].length;
    }
    if (cursor < paragraph.length) pieces.push(paragraph.slice(cursor));

    return (
      <p className="whitespace-pre-wrap [&:not(:first-child)]:mt-2.5" key={blockIndex}>
        {pieces}
      </p>
    );
  });
}

function ContactActions({ label = "Talk to a person:" }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-medium text-ink-soft">{label}</span>
      <a
        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#1fb85a]"
        href={`https://wa.me/${CONTACT_PHONE_DIGITS}`}
        onClick={() => pushEvent("whatsapp_clicked", { source: "chatbot" })}
        rel="noreferrer"
        target="_blank"
      >
        <FaWhatsapp aria-hidden="true" /> {CONTACT_PHONE}
      </a>
      <a
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100"
        href={`tel:${CONTACT_PHONE_TEL}`}
        onClick={() => pushEvent("phone_clicked", { source: "chatbot" })}
      >
        <FiPhone aria-hidden="true" /> Call
      </a>
    </div>
  );
}

export default function DexterChat({ onFallback }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activity, setActivity] = useState("");
  const [notice, setNotice] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, activity]);

  useEffect(() => {
    const prompt = SUGGESTIONS.at(-1);
    if (messages.length || draft || !prompt) return undefined;
    let timer;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setTimeout(() => setTypedPrompt(prompt), 0);
      return () => window.clearTimeout(timer);
    }

    let index = 0;
    let deleting = false;

    const type = () => {
      if (!deleting) {
        index += 1;
        setTypedPrompt(prompt.slice(0, index));
        if (index === prompt.length) deleting = true;
        timer = window.setTimeout(type, index === prompt.length ? 1800 : 55);
        return;
      }

      index -= 1;
      setTypedPrompt(prompt.slice(0, index));
      if (index === 0) deleting = false;
      timer = window.setTimeout(type, index === 0 ? 500 : 28);
    };

    timer = window.setTimeout(type, 650);
    return () => window.clearTimeout(timer);
  }, [draft, messages.length]);

  const ask = (question) => {
    const text = question.trim();
    if (!text || streaming) return;
    setDraft("");
    send([...messages, { role: "user", content: text }]);
  };

  const retry = () => {
    if (streaming) return;
    // Cut back to the last user turn — drops any partial/failed assistant
    // reply so we resend the same question instead of duplicating it.
    const lastUserIndex = messages.map((message) => message.role).lastIndexOf("user");
    if (lastUserIndex === -1) return;
    const history = messages.slice(0, lastUserIndex + 1);
    setMessages(history);
    send(history);
  };

  const send = async (history) => {
    setMessages([...history, { role: "assistant", content: "" }]);
    setNotice("");
    setStreaming(true);
    setActivity("Thinking");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (response.status === 503) {
        // Not configured — hand back to the guided flow rather than fail.
        onFallback?.();
        return;
      }

      if (!response.ok || !response.body) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.message || "Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // The stream is SSE: blank-line-separated `event:` / `data:` pairs.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let split;
        while ((split = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, split);
          buffer = buffer.slice(split + 2);

          const event = /^event: (.*)$/m.exec(chunk)?.[1];
          const payload = /^data: (.*)$/m.exec(chunk)?.[1];
          if (!event || !payload) continue;
          const data = JSON.parse(payload);

          if (event === "delta") {
            setActivity("");
            setMessages((current) => {
              const next = [...current];
              next[next.length - 1] = {
                role: "assistant",
                content: next[next.length - 1].content + data.text,
              };
              return next;
            });
          } else if (event === "tools") {
            setActivity(TOOL_LABELS[data.names?.[0]] ?? "Looking that up");
          } else if (event === "error") {
            setNotice(data.message);
          } else if (event === "done" && data.offerContact) {
            setMessages((current) => {
              const next = [...current];
              const last = next[next.length - 1];
              if (last?.role === "assistant") next[next.length - 1] = { ...last, offerContact: true };
              return next;
            });
          }
        }
      }
    } catch {
      setNotice("I couldn't reach the assistant.");
    } finally {
      setStreaming(false);
      setActivity("");
      // Drop a trailing empty bubble if nothing ever streamed into it.
      setMessages((current) =>
        current.length && current[current.length - 1].role === "assistant" && !current[current.length - 1].content
          ? current.slice(0, -1)
          : current
      );
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-[300px] flex-1 space-y-3 overflow-y-auto px-1 py-2" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-ink shadow-[0_6px_22px_rgba(0,0,0,0.08)]">
              Hello, I&apos;m Dexter. Tell me what you&apos;re working on and I&apos;ll help you find the right instrument.
            </div>
            <p className="px-2 text-center text-[11px] font-medium text-ink-soft">
              Try one of these, or ask your own question
            </p>
            <div className="space-y-3 py-1">
              {SUGGESTIONS.slice(0, -1).map((suggestion, index) => (
                <button
                  className={`block max-w-[86%] rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium leading-5 text-ink shadow-[0_6px_22px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:text-red hover:shadow-[0_10px_26px_rgba(190,0,16,0.12)] ${
                    index % 2 ? "ml-auto rounded-tr-sm" : "rounded-tl-sm"
                  }`}
                  key={suggestion}
                  onClick={() => ask(suggestion)}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((message, index) => {
          if (message.role === "user") {
            return (
              <div className="flex justify-end animate-[hvc-fade_300ms_ease] motion-reduce:animate-none" key={index}>
                <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm leading-6 text-rose-900">
                  {message.content}
                </p>
              </div>
            );
          }

          // Skip the empty placeholder bubble while a reply is still streaming in —
          // the activity indicator below covers that state instead.
          if (!message.content) return null;

          // Claude and Groq both write a plain `[...](/contact)` link when the system
          // prompt tells them to hand a visitor over to the team — catch that free-form
          // phrasing too, not just the local rule engine's explicit offerContact flag.
          const showContactActions = message.offerContact || /\]\(\/contact\)/.test(message.content);

          return (
            <div className="space-y-1.5" key={index}>
              <div className="flex items-start gap-2.5 animate-[hvc-fade_300ms_ease] motion-reduce:animate-none">
                <img
                  alt=""
                  aria-hidden="true"
                  className="mt-0.5 size-7 shrink-0 rounded-full object-cover"
                  src="/chatbot-icon.webp"
                />
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-parchment-alt px-3.5 py-2.5 text-sm leading-6 text-ink">
                  <RichText text={message.content} />
                </div>
              </div>
              {showContactActions ? (
                <div className="ml-[38px] animate-[hvc-fade_300ms_ease] motion-reduce:animate-none">
                  <ContactActions />
                </div>
              ) : null}
            </div>
          );
        })}

        {activity ? (
          <div className="flex items-center gap-2.5 animate-[hvc-fade_300ms_ease] motion-reduce:animate-none">
            <img
              alt=""
              aria-hidden="true"
              className="size-7 shrink-0 rounded-full object-cover motion-safe:animate-[dexter-think_1.1s_ease-in-out_infinite]"
              src="/chatbot-icon.webp"
            />
            <p className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-parchment-alt px-3.5 py-2.5 text-xs font-medium text-ink-soft">
              <span aria-hidden className="inline-flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-red [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-red [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-red" />
              </span>
              {activity}…
            </p>
          </div>
        ) : null}

        {notice ? (
          <div className="space-y-2.5 rounded-lg border border-red/20 bg-red/5 px-3 py-2.5 animate-[hvc-fade_300ms_ease] motion-reduce:animate-none">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-red">{notice}</p>
              <button
                className="shrink-0 rounded-full border border-red/30 px-2.5 py-1 text-[11px] font-bold text-red transition hover:bg-red/10 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={streaming}
                onClick={retry}
                type="button"
              >
                Retry
              </button>
            </div>
            <div className="border-t border-red/10 pt-2.5">
              <ContactActions label="Or talk to a person:" />
            </div>
          </div>
        ) : null}
      </div>

      <form
        className="mt-3"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
      >
        <div className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-red p-[3px] shadow-[0_10px_28px_rgba(38,99,235,0.18)]">
          <div className="flex items-end gap-2 rounded-[13px] bg-white px-3 py-1.5">
            <textarea
              aria-label="Message Dexter"
              className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-1 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/80"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask(draft);
              }
            }}
            placeholder={typedPrompt ? `${typedPrompt}|` : "Ask Dexter a question…"}
            ref={inputRef}
            rows={1}
            value={draft}
            />
            <button
              aria-label="Send message"
              className="mb-0.5 inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-red text-white shadow-md shadow-red/20 transition hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={streaming || !draft.trim()}
              type="submit"
            >
              <FiArrowUp />
            </button>
          </div>
        </div>

        <button
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft transition hover:text-red"
          onClick={() => onFallback?.()}
          type="button"
        >
          <FiCornerUpLeft aria-hidden /> Use the enquiry forms instead
        </button>
      </form>
    </div>
  );
}
