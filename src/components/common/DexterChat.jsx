"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowUp, FiCornerUpLeft } from "react-icons/fi";

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

export default function DexterChat({ onFallback }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activity, setActivity] = useState("");
  const [notice, setNotice] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, activity]);

  const ask = async (question) => {
    const text = question.trim();
    if (!text || streaming) return;

    const history = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
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
          }
        }
      }
    } catch {
      setNotice("I couldn't reach the assistant. You can still reach the team on the contact page.");
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
      <div className="min-h-[220px] flex-1 space-y-3 overflow-y-auto" ref={scrollRef}>
        {messages.length === 0 ? (
          <div>
            <p className="text-sm leading-6 text-ink">
              Hello, I&apos;m Dexter. Tell me what you&apos;re working on and I&apos;ll find the right
              instrument — or answer questions about anything Inkarp supplies.
            </p>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  className="block w-full border border-line-light bg-parchment-alt px-3 py-2 text-left text-xs font-medium text-ink transition hover:border-red hover:text-red dark:border-zinc-700 dark:bg-zinc-800"
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

        {messages.map((message, index) =>
          message.role === "user" ? (
            <div className="flex justify-end" key={index}>
              <p className="max-w-[85%] whitespace-pre-wrap border border-rose-200 bg-rose-50 px-3 py-2 text-sm leading-6 text-rose-900">
                {message.content}
              </p>
            </div>
          ) : (
            <div className="max-w-[92%] text-sm leading-6 text-ink" key={index}>
              <RichText text={message.content} />
            </div>
          )
        )}

        {activity ? (
          <p className="flex items-center gap-2 text-xs font-medium text-ink-soft">
            <span aria-hidden className="inline-flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-red [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-red [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-red" />
            </span>
            {activity}…
          </p>
        ) : null}

        {notice ? (
          <p className="border border-red/20 bg-red/5 px-3 py-2 text-xs font-semibold text-red">{notice}</p>
        ) : null}
      </div>

      <form
        className="mt-3 border-t border-line-light pt-3 dark:border-zinc-700"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            aria-label="Message Dexter"
            className="max-h-28 min-h-[42px] flex-1 resize-none border border-line-light bg-parchment-alt px-3 py-2.5 text-sm text-ink outline-none transition focus:border-red focus:ring-2 focus:ring-red/15 dark:border-zinc-700 dark:bg-zinc-800"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask(draft);
              }
            }}
            placeholder="Ask about an instrument or describe your application…"
            ref={inputRef}
            rows={1}
            value={draft}
          />
          <button
            aria-label="Send message"
            className="inline-flex size-[42px] shrink-0 items-center justify-center border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={streaming || !draft.trim()}
            type="submit"
          >
            <FiArrowUp />
          </button>
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
