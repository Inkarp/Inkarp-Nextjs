import crypto from "node:crypto";
import { getAllProducts } from "@/data/products/principals";
import {
  finderChallenges,
  finderIndustries,
  finderObjectives,
  finderRoles,
  finderTimelines,
  industryNameToSlug,
  solutionFinderInstitutions,
} from "@/data/solutionFinder";

export const FINDER_VERSION = 1;
export const MAX_RECOMMENDATIONS = 12;

export function normalizeFinderText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim();
}

function cleanString(value, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionValue(value, options) {
  const clean = cleanString(value, 120);
  return options.some((option) => option.value === clean) ? clean : "";
}

export function sanitizeFinderAnswers(input = {}) {
  const institution = input.institution && typeof input.institution === "object"
    ? {
        id: cleanString(input.institution.id, 100),
        name: cleanString(input.institution.name, 180),
      }
    : null;

  const challenges = Array.isArray(input.challenges)
    ? input.challenges
        .map((value) => optionValue(value, finderChallenges))
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return {
    institution: institution?.id && institution?.name ? institution : null,
    role: cleanString(input.role, 100),
    industry: optionValue(input.industry, finderIndustries),
    objective: cleanString(input.objective, 100),
    challenges: [...new Set(challenges)],
    automation: ["manual", "semi-automated", "automated", "no-preference"].includes(input.automation)
      ? input.automation
      : "no-preference",
    timeline: optionValue(input.timeline, finderTimelines) || "exploring",
    notes: cleanString(input.notes, 600),
  };
}

export function validateFinderAnswers(answers) {
  const missing = [];
  if (!answers.institution) missing.push("institution");
  if (!answers.role) missing.push("role");
  if (!answers.industry) missing.push("industry");
  if (!answers.objective) missing.push("objective");
  return missing;
}

function flatten(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (typeof value === "object") return Object.values(value).flatMap(flatten);
  return [String(value)];
}

function productText(product) {
  return normalizeFinderText(flatten([
    product.name,
    product.category,
    product.industry,
    product.applications,
    product.processApplication,
    product.industryTags,
    product.workflowTags,
    product.problemSolutionTags,
    product.tags,
    product.searchTags,
    product.searchKeywords,
    product.synonymUseCaseKeywords,
    product.overview,
    product.features,
  ]).join(" "));
}

function words(value) {
  return normalizeFinderText(value).split(" ").filter((word) => word.length > 2);
}

function phraseMatch(text, value) {
  const phrase = normalizeFinderText(value);
  return phrase && text.includes(phrase);
}

function wordHits(text, value) {
  return words(value).filter((word) => text.includes(word)).length;
}

function labelFor(value, options) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function scoreProduct(product, answers) {
  const text = productText(product);
  let score = 0;
  const reasons = [];
  const objectiveLabel = labelFor(answers.objective, finderObjectives);
  const industryLabel = labelFor(answers.industry, finderIndustries);
  const objectiveHits = wordHits(text, answers.objective);
  const industryHits = wordHits(text, `${answers.industry} ${industryLabel}`);

  if (phraseMatch(text, answers.objective)) score += 34;
  score += Math.min(objectiveHits, 5) * 7;
  if (objectiveHits) reasons.push(`Supports ${objectiveLabel.toLowerCase()} workflows`);

  if (phraseMatch(text, industryLabel) || phraseMatch(text, answers.industry)) score += 18;
  score += Math.min(industryHits, 3) * 4;
  if (industryHits) reasons.push(`Relevant to ${industryLabel.toLowerCase()}`);

  for (const challenge of answers.challenges) {
    const hits = wordHits(text, challenge);
    if (hits) {
      score += Math.min(hits, 3) * 6;
      const label = labelFor(challenge, finderChallenges);
      if (reasons.length < 3) reasons.push(`Addresses ${label.toLowerCase()}`);
    }
  }

  if (answers.automation !== "no-preference") {
    const automationTerms = answers.automation === "automated"
      ? "automation automated unattended high throughput"
      : answers.automation === "semi-automated"
        ? "automation control programmable"
        : "manual compact routine";
    if (wordHits(text, automationTerms)) {
      score += 7;
      if (reasons.length < 3) reasons.push(`Fits the ${answers.automation.replace("-", " ")} preference`);
    }
  }

  // Procurement visitors need robust comparison choices; scientists get a
  // slight preference for products with detailed application information.
  if (answers.role === "procurement" && product.technicalSpecs) score += 3;
  if (["research-scientist", "faculty", "student"].includes(answers.role) && product.applications) score += 3;

  return { score, reasons: reasons.slice(0, 3) };
}

export function recommendFinderProducts(answers, limit = MAX_RECOMMENDATIONS) {
  const ranked = getAllProducts()
    .map((product) => ({ product, ...scoreProduct(product, answers) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  const highest = ranked[0]?.score || 1;
  return ranked.slice(0, limit).map(({ product, score, reasons }, index) => ({
    rank: index + 1,
    score,
    match: Math.max(55, Math.min(98, Math.round((score / highest) * 94))),
    reasons: reasons.length ? reasons : ["Related to your selected laboratory requirement"],
    product: {
      slug: product.slug,
      href: product.href || `/products/${product.slug}`,
      name: product.name,
      image: product.image ?? "",
      imageAlt: product.imageAlt ?? product.name,
      principalSlug: product.principalSlug ?? "",
      principalName: product.principalName ?? "",
      countryOfOrigin: product.countryOfOrigin ?? "",
      industry: product.industry ?? product.category ?? "Scientific instrument",
    },
  }));
}

export function findSeedInstitution(id) {
  return solutionFinderInstitutions.find((institution) => institution.id === id) ?? null;
}

export function institutionIndustrySlug(institution) {
  return industryNameToSlug[institution?.industry] ?? "";
}

export function createFinderSessionId() {
  return crypto.randomBytes(12).toString("base64url");
}

export function finderLabels(answers) {
  return {
    role: labelFor(answers.role, finderRoles),
    industry: labelFor(answers.industry, finderIndustries),
    objective: labelFor(answers.objective, finderObjectives),
    challenges: answers.challenges.map((value) => labelFor(value, finderChallenges)),
    automation: answers.automation === "no-preference"
      ? "No automation preference"
      : answers.automation.replace("-", " ").replace(/^./, (letter) => letter.toUpperCase()),
    timeline: labelFor(answers.timeline, finderTimelines),
  };
}
