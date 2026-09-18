const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export function buildFinderFallbackGuidance(session) {
  const labels = session?.labels ?? {};
  const firstProducts = (session?.recommendations ?? []).slice(0, 3)
    .map((item) => item.product?.name)
    .filter(Boolean);
  const objective = labels.objective?.toLowerCase() || "your selected laboratory workflow";
  const industry = labels.industry?.toLowerCase() || "your sector";
  return {
    summary: `The shortlist below was matched to ${objective} for ${industry}. ${firstProducts.length ? `${firstProducts.join(", ")} rank highest against the information provided.` : "The available products have been ranked against the information provided."} Final capacity, sample compatibility, accessories, and configuration should be confirmed with an Inkarp application specialist.`,
    priorities: [
      labels.automation ? `Confirm the ${labels.automation.toLowerCase()} requirement` : "Confirm the preferred operating method",
      labels.timeline ? `Plan against the ${labels.timeline.toLowerCase()} purchase timeline` : "Confirm the expected purchase timeline",
      ...(labels.challenges ?? []).slice(0, 2).map((item) => `Validate the requirement for ${item.toLowerCase()}`),
    ].slice(0, 4),
    questions: [
      "What sample type, volume, and throughput should the selected system handle?",
      "Which measurements, standards, or compliance requirements are mandatory?",
      "Is this a new installation, replacement, upgrade, or expansion?",
    ],
    nextStep: "Share the sample, throughput, and configuration requirements with an Inkarp specialist before requesting the final quotation.",
    source: "catalogue",
  };
}

function cleanGuidance(value) {
  if (!value || typeof value !== "object") return null;
  const text = (item, max = 500) => typeof item === "string" ? item.trim().slice(0, max) : "";
  const list = (items, maxItems = 4) => Array.isArray(items)
    ? items.map((item) => text(item, 220)).filter(Boolean).slice(0, maxItems)
    : [];
  const guidance = {
    summary: text(value.summary, 700),
    priorities: list(value.priorities),
    questions: list(value.questions, 3),
    nextStep: text(value.nextStep, 350),
  };
  return guidance.summary ? guidance : null;
}

export async function generateFinderGuidance(session) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

  const shortlist = (session.recommendations ?? []).slice(0, 6).map((item) => ({
    name: item.product?.name,
    brand: item.product?.principalName,
    category: item.product?.industry,
    match: item.match,
    reasons: item.reasons,
    url: item.product?.href,
  }));
  const context = {
    institution: session.institution?.name,
    role: session.labels?.role,
    industry: session.labels?.industry,
    objective: session.labels?.objective,
    challenges: session.labels?.challenges,
    automation: session.labels?.automation,
    timeline: session.labels?.timeline,
    visitorNotes: session.answers?.notes,
    shortlist,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        temperature: 0.2,
        max_tokens: 850,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an application-support assistant for Inkarp Instruments.
You receive a visitor profile and a product shortlist created by a deterministic catalogue engine.
Explain the shortlist; never add, replace, or invent a product. Never invent specifications, prices,
performance, availability, compatibility, or delivery dates. Do not state that a product is suitable
with certainty. Explain that final configuration requires an Inkarp specialist.
Return JSON only with: summary (string), priorities (array of short strings), questions (array of up
to three clarification questions), nextStep (string). Keep the complete answer concise and practical.`,
          },
          { role: "user", content: JSON.stringify(context) },
        ],
      }),
    });
    if (!response.ok) throw new Error(`Groq request failed (${response.status})`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    const guidance = cleanGuidance(JSON.parse(content ?? "{}"));
    if (!guidance) throw new Error("Groq returned incomplete guidance");
    return { ...guidance, model: payload.model ?? process.env.GROQ_MODEL ?? DEFAULT_MODEL };
  } finally {
    clearTimeout(timeout);
  }
}
