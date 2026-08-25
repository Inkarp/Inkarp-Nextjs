// Catalogue-search assistant used when no ANTHROPIC_API_KEY is configured.
//
// This is not a language model. It reads the intent of a message from keywords,
// then answers from the real catalogue — the same data the tools hand to Claude,
// so every product, link and specification it shows is genuine. It exists so the
// chat is demonstrable before the API is funded, and it stays afterwards as the
// fallback for an outage, an expired key or an exhausted balance.
//
// When ANTHROPIC_API_KEY is set, the route uses Claude instead and never calls
// into here.

import { describeProduct, describeWorkflow, findProducts, getIndustryList } from "./catalogue";
import { getAllPrincipals } from "@/data/products/principals";

const STOP_WORDS = new Set([
  "a", "an", "and", "any", "are", "can", "could", "do", "does", "for", "from", "get",
  "give", "has", "have", "hi", "hello", "how", "i", "in", "is", "it", "looking", "me",
  "my", "need", "of", "on", "or", "our", "please", "show", "some", "suggest", "tell",
  "that", "the", "there", "they", "to", "want", "we", "what", "which", "with", "you",
  "your", "lab", "laboratory", "instrument", "instruments", "product", "products",
]);

const INTENT_WORDS = new Set([
  "price", "pricing", "cost", "costs", "quote", "quotation", "rate", "rates", "much",
  "budget", "contact", "call", "reach", "talk", "speak", "expert", "engineer", "sales",
  "email", "phone", "service", "repair", "breakdown", "amc", "maintenance", "spare",
  "spares", "installation", "install", "calibration", "calibrate", "support",
  "someone", "somebody", "person", "team", "help", "enquiry", "enquire", "inquiry",
  "buy", "purchase", "order", "available", "availability",
]);

function keywords(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function productLine(product) {
  const brand = product.brand ? ` — ${product.brand}` : "";
  return `- [${product.name}](${product.url})${brand}`;
}

function matchIndustry(text) {
  const lower = String(text ?? "").toLowerCase();
  return getIndustryList().find((industry) => {
    const head = industry.toLowerCase().split(/[^a-z]/)[0];
    if (head.length <= 3) return false;
    return lower.includes(head) || lower.includes(head.slice(0, 6));
  });
}

const GREETING = /^(hi|hey|hello|good (morning|afternoon|evening)|namaste)\b/i;
const PRICE = /(price|pricing|cost|quote|quotation|rate|how much|budget)/i;
const SERVICE = /(service|repair|breakdown|calibrat|installation|install|amc|maintenance|spare)/i;
const CONTACT = /(contact|call|reach|talk to|speak|expert|engineer|sales|email|phone)/i;
const BRANDS = /(brand|principal|manufacturer|partner|who do you represent|distribut)/i;
const WHAT_YOU_DO = /(what do you (sell|do|have|supply)|about inkarp|who are you|what is inkarp)/i;

/**
 * Answer one message from the catalogue.
 * @returns {{text: string, activity?: string}}
 */
export function answerLocally(message, history = []) {
  const text = String(message ?? "").trim();
  const words = keywords(text);

  if (!text || GREETING.test(text)) {
    return {
      text:
        "Hello — I'm Dexter. Tell me what you're working on, or name an instrument, and I'll " +
        "find what Inkarp supplies for it.\n\nYou can ask things like *rotary evaporators*, " +
        "*moisture analysis for plastics*, or *what suits pharma QC*.",
    };
  }

  if (WHAT_YOU_DO.test(text)) {
    const principals = getAllPrincipals().length;
    return {
      text:
        `Inkarp has supplied and serviced laboratory instruments across India since 1985 — ` +
        `authorized distributor for ${principals} global manufacturers, covering demonstration, ` +
        `installation, training, AMC and spares.\n\nTell me the application you're working on and ` +
        `I'll point you at the right range, or browse everything at [our catalogue](/products).`,
    };
  }

  if (BRANDS.test(text)) {
    const names = getAllPrincipals()
      .map((principal) => principal.principalName)
      .filter(Boolean)
      .slice(0, 14);
    return {
      text:
        `Inkarp represents ${names.length > 13 ? "brands including" : ""} ${names.join(", ")}` +
        ` and more.\n\nAll of them are on the [principals page](/products). Which area are you ` +
        `looking at?`,
    };
  }

  const productWords = words.filter((word) => !INTENT_WORDS.has(word));

  if (PRICE.test(text) && !productWords.length) {
    return {
      text:
        "Inkarp doesn't publish prices — every quote depends on the configuration, accessories " +
        "and application.\n\nTell me which instrument you're after and I'll point you at it, or " +
        "raise it with the team on the [contact page](/contact).",
    };
  }

  if (CONTACT.test(text) && !productWords.length) {
    return {
      text:
        "The quickest route is the [contact page](/contact) — the team covers demonstration, " +
        "configuration and service enquiries across India.\n\nIf you tell me the application " +
        "first, I can point you at the right range so the conversation starts further along.",
    };
  }

  if (SERVICE.test(text) && !productWords.length) {
    return {
      text:
        "Inkarp handles installation, calibration, breakdown support, AMC and genuine spares " +
        "across India.\n\nRaise it on the [service page](/service) and the team will pick it up — " +
        "or tell me the instrument and I'll check what's covered.",
    };
  }

  // A product search is the most useful thing to do with almost any other message.
  const query = productWords.join(" ");
  const industry = matchIndustry(text);
  const results = query ? findProducts({ query, industry, limit: 6 }) : [];

  if (results.length) {
    const detail = results.length === 1 ? describeProduct(results[0].slug) : null;

    if (detail?.found) {
      const specs = detail.specifications
        .filter((row) => row.parameter && row.value)
        .slice(0, 5)
        .map((row) => `- ${row.parameter}: ${row.value}`)
        .join("\n");

      return {
        activity: "Reading the product data",
        text:
          `**[${detail.name}](${detail.url})**${detail.brand ? ` — ${detail.brand}` : ""}\n\n` +
          `${detail.summary}\n\n` +
          (specs ? `${specs}\n\n` : "") +
          `Pricing depends on the configuration, so Inkarp quotes it per requirement — you can ` +
          `[request a quote](${detail.url}#booking) on the product page, or add it to your quote ` +
          `list and send several together.`,
      };
    }

    const heading = industry
      ? `Here's what Inkarp supplies for ${industry.toLowerCase()} along those lines:`
      : `Here's what matched in the Inkarp catalogue:`;

    return {
      activity: "Searching the catalogue",
      text:
        `${heading}\n\n${results.map(productLine).join("\n")}\n\n` +
        `Open any of them for full specifications, or tell me more about the application and ` +
        `I'll narrow it down.`,
    };
  }

  if (industry) {
    const workflow = describeWorkflow({ industry });
    if (workflow.found) {
      return {
        activity: "Checking that workflow",
        text:
          `For ${workflow.industry}, Inkarp maps the work into these stages:\n\n` +
          workflow.stages.map((stage) => `- ${stage}`).join("\n") +
          `\n\nTell me which stage you're working in and I'll show the instruments that fit.`,
      };
    }
  }

  if (PRICE.test(text)) {
    return {
      text:
        "Inkarp doesn't publish prices — every quote depends on the configuration, accessories " +
        "and application.\n\nTell me which instrument you're after and I'll point you at it, or " +
        "raise it directly with the team on the [contact page](/contact).",
    };
  }

  if (CONTACT.test(text)) {
    return {
      text:
        "The quickest route is the [contact page](/contact) — the team covers demonstration, " +
        "configuration and service enquiries across India.\n\nIf you tell me the application " +
        "first, I can point you at the right range so the conversation starts further along.",
    };
  }

  return {
    text:
      `I couldn't find a match for that in the catalogue.\n\nTry naming the technique or the ` +
      `measurement — *evaporation*, *moisture content*, *viscosity*, *particle size* — or browse ` +
      `[all products](/products). If it's specialised, the [team](/contact) will know whether ` +
      `Inkarp can source it.`,
  };
}
