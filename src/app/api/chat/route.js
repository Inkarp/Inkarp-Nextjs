import Anthropic from "@anthropic-ai/sdk";
import { buildCompactSystemPrompt, buildSystemPrompt } from "@/lib/chat/systemPrompt";
import { CHAT_TOOLS, runTool } from "@/lib/chat/tools";
import { answerLocally } from "@/lib/chat/localAssistant";
import { runGroqTurn } from "@/lib/chat/groqEngine";
import { getDb } from "@/lib/mongodb";

// MongoDB and the streaming loop both need the Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-5";
const MAX_TOKENS = 8000;
// Chat wants to feel responsive; raise to "high" if answers need more depth.
const EFFORT = "medium";
const MAX_TOOL_ROUNDS = 5;
const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 2000;

// Per-IP throttle. In-process on purpose: this is a spike guard for one server,
// not a distributed quota.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived process.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((time) => now - time < WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

const SSE_HEADERS = {
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "Content-Type": "text/event-stream; charset=utf-8",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Trim to recent turns and drop anything that isn't a well-formed message. */
function sanitiseHistory(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_CHARS),
    }));
}

async function logConversation(entry) {
  try {
    const db = await getDb();
    await db.collection("chatConversations").insertOne(entry);
  } catch {
    // Analytics must never take the chat down.
  }
}

export async function POST(request) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return Response.json(
      { error: "rate_limited", message: "You are sending messages very quickly. Give it a moment." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const history = sanitiseHistory(body?.messages);
  if (!history.length || history[history.length - 1].role !== "user") {
    return Response.json({ error: "bad_request", message: "No message to answer." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const startedAt = Date.now();
  // Best available engine wins: Claude, then Groq's free tier, then the
  // catalogue search that needs no key at all.
  const engine = process.env.ANTHROPIC_API_KEY
    ? "claude"
    : process.env.GROQ_API_KEY
      ? "groq"
      : "catalogue";

  // No key configured: answer from the catalogue directly, over the same stream
  // shape, so the widget behaves identically and swaps to the model the moment
  // a key exists.
  if (engine === "catalogue") {
    const question = history[history.length - 1].content;
    const localStream = new ReadableStream({
      async start(controller) {
        const send = (event, data) =>
          controller.enqueue(encoder.encode(`event: ${event}
data: ${JSON.stringify(data)}

`));
        const { activity, text, offerContact } = answerLocally(question, history);

        if (activity) {
          send("tools", { names: [], label: activity });
          await sleep(420);
        }

        // Typed out rather than dumped, so reading keeps pace with arrival.
        for (const token of text.match(/\S+\s*/g) ?? []) {
          send("delta", { text: token });
          await sleep(18);
        }

        send("done", { stopReason: "end_turn", source: "catalogue", offerContact: offerContact === true });
        controller.close();
        logConversation({
          ip,
          startedAt: new Date(startedAt),
          durationMs: Date.now() - startedAt,
          question,
          answer: text,
          turns: history.length,
          toolsUsed: [],
          source: "catalogue",
        });
      },
    });

    return new Response(localStream, { headers: SSE_HEADERS });
  }

  if (engine === "groq") {
    const question = history[history.length - 1].content;
    const groqStream = new ReadableStream({
      async start(controller) {
        const send = (event, data) =>
          controller.enqueue(encoder.encode(`event: ${event}
data: ${JSON.stringify(data)}

`));

        let answer = "";
        let toolsUsed = [];
        let offerContact = false;
        let source = "groq";
        try {
          const result = await runGroqTurn({
            history,
            send,
            system: buildCompactSystemPrompt(),
          });
          answer = result.answer;
          toolsUsed = result.toolsUsed;

          // An empty turn is worse than a plain answer — fall back rather than
          // leave the visitor looking at nothing. Logged honestly as a
          // fallback rather than as "groq" so this doesn't hide how often it
          // actually happens.
          if (!answer.trim()) {
            const local = answerLocally(question, history);
            answer = local.text;
            offerContact = local.offerContact === true;
            source = "groq-empty-fallback";
            for (const token of local.text.match(/\S+\s*/g) ?? []) {
              send("delta", { text: token });
              await sleep(12);
            }
          }
          send("done", { stopReason: "end_turn", source, offerContact });
        } catch {
          // A key problem, an exhausted quota (including a 429) or a network
          // blip shouldn't leave the visitor with nothing — the catalogue
          // engine always answers.
          const local = answerLocally(question, history);
          answer = local.text;
          offerContact = local.offerContact === true;
          source = "catalogue-fallback";
          for (const token of local.text.match(/\S+\s*/g) ?? []) {
            send("delta", { text: token });
            await sleep(12);
          }
          send("done", { stopReason: "end_turn", source, offerContact });
        } finally {
          controller.close();
          logConversation({
            ip,
            startedAt: new Date(startedAt),
            durationMs: Date.now() - startedAt,
            question,
            answer,
            turns: history.length,
            toolsUsed,
            source,
          });
        }
      },
    });

    return new Response(groqStream, { headers: SSE_HEADERS });
  }

  const client = new Anthropic();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      const messages = [...history];
      const toolsUsed = [];
      let answer = "";
      let source = "claude";

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
          // As with the Groq engine, the last round drops tools so the model
          // is forced to answer in text from whatever it already looked up —
          // otherwise a turn that was still mid-tool-call on the final round
          // ended at "tool_limit" with no chance to use the tool's result,
          // leaving the visitor with only a preamble or nothing at all.
          const isFinalRound = round === MAX_TOOL_ROUNDS;
          const runner = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            // The system prompt carries the whole catalogue index and never
            // varies, so caching it turns most of each request into a cache read.
            system: [
              {
                type: "text",
                text: buildSystemPrompt(),
                cache_control: { type: "ephemeral" },
              },
            ],
            thinking: { type: "adaptive" },
            output_config: { effort: EFFORT },
            ...(isFinalRound ? {} : { tools: CHAT_TOOLS }),
            messages,
          });

          runner.on("text", (delta) => {
            answer += delta;
            send("delta", { text: delta });
          });

          const response = await runner.finalMessage();

          if (response.stop_reason === "refusal") {
            send("error", {
              message:
                "I can't help with that one. Ask me about instruments, applications or service and I'll do my best.",
            });
            break;
          }

          if (response.stop_reason !== "tool_use") {
            send("done", { stopReason: response.stop_reason, source });
            break;
          }

          const calls = response.content.filter((block) => block.type === "tool_use");
          send("tools", { names: calls.map((call) => call.name) });

          // Parallel calls must all come back in one user message.
          const results = await Promise.all(
            calls.map(async (call) => {
              toolsUsed.push(call.name);
              const result = await runTool(call.name, call.input);
              return {
                type: "tool_result",
                tool_use_id: call.id,
                content: JSON.stringify(result),
              };
            })
          );

          messages.push({ role: "assistant", content: response.content });
          messages.push({ role: "user", content: results });
        }
      } catch (error) {
        // Nothing streamed yet (the common case for a 429 or an auth/network
        // blip on the very first call) — the catalogue engine always answers,
        // so use it instead of leaving the visitor with a dead end. If some
        // of the reply already streamed, stop there instead of risking a
        // second, unrelated answer glued onto the first.
        if (!answer.trim()) {
          const local = answerLocally(history[history.length - 1].content, history);
          answer = local.text;
          source = "catalogue-fallback";
          for (const token of local.text.match(/\S+\s*/g) ?? []) {
            send("delta", { text: token });
            await sleep(12);
          }
          send("done", { stopReason: "end_turn", source, offerContact: local.offerContact === true });
        } else {
          const status = error?.status;
          send("error", {
            message:
              status === 429
                ? "The assistant is busy right now. Try again in a moment."
                : "Something went wrong on my side.",
          });
        }
      } finally {
        controller.close();
        logConversation({
          ip,
          startedAt: new Date(startedAt),
          durationMs: Date.now() - startedAt,
          question: history[history.length - 1].content,
          answer,
          turns: history.length,
          toolsUsed,
          source,
        });
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
