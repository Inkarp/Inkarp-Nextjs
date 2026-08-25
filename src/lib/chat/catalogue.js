// Server-side catalogue view for the assistant.
//
// Two layers, deliberately: a compact index of everything Inkarp sells goes in
// the (cached) system prompt so the model always knows the shape of the
// catalogue, and the detail — specs, FAQs, documents — is only ever reached
// through a tool call. A model reciting a detection limit from memory is how a
// distributor site ends up quoting a wrong figure to a QC buyer, so the detail
// never enters the prompt unless a tool actually read it from the product data.

import {
  getAllProducts,
  getProductBySlug,
  searchProducts,
} from "@/data/products/principals";
import { workflowChallenges } from "@/data/workflowChallenges";
import { workflowIndustries } from "@/data/homeShowcase";
import { stagesWithSlugs } from "@/data/workflowWheel";

let indexCache = null;

function firstSentence(text, limit = 110) {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const stop = clean.indexOf(". ");
  const line = stop > 20 ? clean.slice(0, stop) : clean;
  return line.length > limit ? `${line.slice(0, limit - 1)}…` : line;
}

/** One line per product: enough to reason about, small enough to cache. */
export function getCatalogueIndex() {
  if (indexCache) return indexCache;

  const byPrincipal = new Map();
  for (const product of getAllProducts()) {
    if (!product?.slug) continue;
    const key = product.principalName || product.principalSlug || "Other";
    if (!byPrincipal.has(key)) byPrincipal.set(key, []);
    byPrincipal.get(key).push(
      `- ${product.name} [${product.slug}]${product.industry ? ` · ${product.industry}` : ""}`
    );
  }

  const lines = [];
  for (const [principal, products] of [...byPrincipal].sort()) {
    lines.push(`\n## ${principal} (${products.length})`);
    lines.push(...products.sort());
  }

  indexCache = lines.join("\n");
  return indexCache;
}

let categoryCache = null;

/**
 * Brands and their product-count only — a fraction of the full index. Used by
 * engines on a tokens-per-minute budget, where the search tool does retrieval
 * instead of the prompt carrying every product name.
 */
export function getCatalogueSummary() {
  if (categoryCache) return categoryCache;

  const counts = new Map();
  const categories = new Set();
  for (const product of getAllProducts()) {
    if (!product?.slug) continue;
    const brand = product.principalName || product.principalSlug || "Other";
    counts.set(brand, (counts.get(brand) ?? 0) + 1);
    if (product.industry) categories.add(product.industry);
  }

  const brands = [...counts]
    .sort((a, b) => b[1] - a[1])
    .map(([brand, count]) => `${brand} (${count})`)
    .join(", ");

  categoryCache =
    `Brands: ${brands}.

` +
    `Product areas: ${[...categories].sort().slice(0, 40).join(", ")}.`;
  return categoryCache;
}

export function getIndustryList() {
  return workflowIndustries.map((item) => item.industry);
}

/** Products matching a free-text query, trimmed to what the model needs. */
export function findProducts({ query, principal, industry, limit = 8 } = {}) {
  const filters = {};
  if (query) filters.q = query;
  if (principal) filters.principals = [principal];

  let results = searchProducts(filters);

  if (industry) {
    const needle = String(industry).toLowerCase();
    const narrowed = results.filter((product) =>
      String(product.industry ?? "").toLowerCase().includes(needle)
    );
    // A tighter match is better, but an empty list is worse than a loose one.
    if (narrowed.length) results = narrowed;
  }

  // searchProducts casts a wide net (synonyms, related accessories), which is
  // right for a filter page but puts chillers above evaporators when someone
  // asks for an evaporator. Re-rank so the words they actually typed win.
  const terms = String(query ?? "")
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2);

  if (terms.length) {
    const score = (product) => {
      const name = String(product.name ?? "").toLowerCase();
      const category = `${product.industry ?? ""} ${product.categoryName ?? ""}`.toLowerCase();
      let points = 0;
      for (const term of terms) {
        if (name.includes(term)) points += 10;
        else if (category.includes(term)) points += 3;
      }
      // A name carrying every term is what the person almost certainly meant.
      if (terms.every((term) => name.includes(term))) points += 25;
      return points;
    };
    results = [...results].sort((a, b) => score(b) - score(a));
  }

  return results.slice(0, limit).map((product) => ({
    name: product.name,
    slug: product.slug,
    brand: product.principalName ?? product.principalSlug,
    origin: product.countryOfOrigin ?? "",
    industry: product.industry ?? "",
    url: `/products/${product.slug}`,
    summary: firstSentence(product.overview ?? product.longForm?.heroLead),
  }));
}

/** Everything the model may state about one product — all read from the data. */
export function describeProduct(slug) {
  const product = getProductBySlug(slug);
  if (!product) return { found: false, slug };

  const lf = product.longForm ?? {};
  const specs = (product.technicalSpecs ?? []).slice(0, 20).map((row) => ({
    parameter: row.parameter ?? row.label ?? row.name,
    value: row.value ?? row.specification ?? row.spec,
  }));

  return {
    found: true,
    name: product.name,
    slug: product.slug,
    brand: product.principalName ?? product.principalSlug,
    origin: product.countryOfOrigin ?? "",
    url: `/products/${product.slug}`,
    summary: firstSentence(product.overview ?? lf.heroLead, 240),
    highlights: (lf.stats ?? []).slice(0, 8).map((stat) => `${stat.value} — ${stat.label}`),
    keyFeatures: (product.features ?? []).slice(0, 8).map((feature) =>
      typeof feature === "string" ? feature : feature.title ?? feature.name ?? ""
    ),
    applications: (product.applications ?? []).slice(0, 8).map((application) =>
      typeof application === "string"
        ? application
        : application.title ?? application.name ?? ""
    ),
    specifications: specs,
    faqs: (product.faqs ?? []).slice(0, 3).map((faq) => ({
      q: faq.question ?? faq.q,
      a: faq.answer ?? faq.a,
    })),
    // Stated plainly so the model has an answer for "how much is it?"
    pricing: "Not published. Inkarp quotes per configuration — offer to raise a quote request.",
  };
}

/** Stage-level problems and the instruments that address them. */
export function describeWorkflow({ industry, stage } = {}) {
  const match = workflowIndustries.find(
    (item) => item.industry.toLowerCase() === String(industry ?? "").toLowerCase()
  );
  if (!match) {
    return { found: false, availableIndustries: getIndustryList() };
  }

  const stages = stagesWithSlugs(match.cat);
  if (!stage) {
    return {
      found: true,
      industry: match.industry,
      stages: stages.map((item) => item.name),
    };
  }

  const needle = String(stage).toLowerCase();
  const picked =
    stages.find((item) => item.name.toLowerCase() === needle) ??
    stages.find((item) => item.name.toLowerCase().includes(needle));

  if (!picked) {
    return { found: false, industry: match.industry, stages: stages.map((s) => s.name) };
  }

  const challenges = workflowChallenges?.[match.cat]?.[picked.name] ?? [];

  return {
    found: true,
    industry: match.industry,
    stage: picked.name,
    url: `/workflows/${match.cat}/${picked.slug}`,
    challenges: challenges.slice(0, 5).map((entry) => ({
      challenge: entry.challenge,
      solution: entry.solution,
      products: (entry.products ?? [])
        .filter((item) => item.slug)
        .slice(0, 4)
        .map((item) => ({ name: item.name, slug: item.slug, url: `/products/${item.slug}` })),
    })),
  };
}
