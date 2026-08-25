// Groq engine — the free-tier conversational path.
//
// Groq serves open-weight models over an OpenAI-compatible API, so this talks to
// it with plain fetch rather than a vendor SDK. It is deliberately separate from
// the Anthropic path: same tools, same catalogue, different wire format.
//
// The free tier's tokens-per-minute ceiling is tighter than its request ceiling,
// which is why this uses the compact system prompt (a category list) instead of
// the full 371-product index — retrieval happens through the search tool.

import { CHAT_TOOLS, runTool } from "./tools";

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
// Override with GROQ_MODEL; check the Groq console for what your account can use.
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const MAX_TOOL_ROUNDS = 4;
const MAX_TOKENS = 1200;

/** CHAT_TOOLS translated into OpenAI function-calling shape. */
function toOpenAiTools() {
  return CHAT_TOOLS.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}

/**
 * Tool-call fragments arrive spread across deltas, keyed by index — the name
 * lands early, the JSON arguments accumulate character by character.
 */
function mergeToolCalls(store, deltas) {
  for (const delta of deltas ?? []) {
    const slot = store[delta.index] ?? { id: "", name: "", args: "" };
    if (delta.id) slot.id = delta.id;
    if (delta.function?.name) slot.name = delta.function.name;
    if (delta.function?.arguments) slot.args += delta.function.arguments;
    store[delta.index] = slot;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Seconds Groq asks us to wait, from its own headers, capped so nobody hangs. */
function retryDelayMs(response) {
  const header =
    response.headers.get("retry-after") ??
    response.headers.get("x-ratelimit-reset-tokens") ??
    "2";
  const seconds = parseFloat(String(header).replace(/[^\d.]/g, "")) || 2;
  return Math.min(Math.max(seconds, 1), 8) * 1000 + 250;
}

async function requestWithRetry(init, attempt = 0) {
  const response = await fetch(ENDPOINT, init);
  if (response.ok && response.body) return response;

  // 429 here is the per-minute token bucket, which refills in seconds.
  if (response.status === 429 && attempt < 2) {
    await sleep(retryDelayMs(response));
    return requestWithRetry(init, attempt + 1);
  }

  const detail = await response.text().catch(() => "");
  const error = new Error(`Groq request failed (${response.status}) ${detail.slice(0, 200)}`);
  error.status = response.status;
  throw error;
}

/**
 * Streams one assistant turn, running tools as needed.
 * @param {object} options
 * @param {string} options.system  System prompt (use the compact one).
 * @param {Array}  options.history [{role, content}] conversation so far.
 * @param {(event: string, data: object) => void} options.send  SSE emitter.
 * @returns {Promise<{answer: string, toolsUsed: string[]}>}
 */
export async function runGroqTurn({ system, history, send }) {
  const messages = [{ role: "system", content: system }, ...history];
  const toolsUsed = [];
  let answer = "";

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
    const response = await requestWithRetry({
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        max_tokens: MAX_TOKENS,
        messages,
        stream: true,
        temperature: 0.3,
        tools: toOpenAiTools(),
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const pendingCalls = {};
    let finishReason = null;
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let cut;
      while ((cut = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, cut).trim();
        buffer = buffer.slice(cut + 1);
        if (!line.startsWith("data:")) continue;

        const payload = line.slice(5).trim();
        if (payload === "[DONE]") break;

        let chunk;
        try {
          chunk = JSON.parse(payload);
        } catch {
          continue; // A partial frame; the next read completes it.
        }

        const choice = chunk.choices?.[0];
        if (!choice) continue;
        if (choice.finish_reason) finishReason = choice.finish_reason;

        const text = choice.delta?.content;
        if (text) {
          answer += text;
          send("delta", { text });
        }
        mergeToolCalls(pendingCalls, choice.delta?.tool_calls);
      }
    }

    const calls = Object.values(pendingCalls).filter((call) => call.name);
    if (finishReason !== "tool_calls" && !calls.length) {
      return { answer, toolsUsed };
    }

    send("tools", { names: calls.map((call) => call.name) });

    // The assistant turn that requested the calls has to go back verbatim.
    messages.push({
      role: "assistant",
      content: answer || null,
      tool_calls: calls.map((call) => ({
        id: call.id,
        type: "function",
        function: { name: call.name, arguments: call.args || "{}" },
      })),
    });

    for (const call of calls) {
      toolsUsed.push(call.name);
      let input = {};
      try {
        input = JSON.parse(call.args || "{}");
      } catch {
        // A malformed argument string is the model's error to recover from.
      }
      const result = await runTool(call.name, input);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }

    // Text emitted before a tool call is preamble; the real answer follows.
    answer = "";
  }

  return { answer, toolsUsed };
}
