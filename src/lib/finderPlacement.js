import { finderObjectives } from "@/data/solutionFinder";

/**
 * Where the site-wide Solution Finder prompt belongs on a page.
 *
 * - "stripe":   the full campaign stripe under the header — discovery pages where a
 *               visitor has a lab need but no product yet.
 * - "launcher": only the small floating pill — brand and evaluation pages.
 * - "none":     nothing — pages where the visitor is already converting (quote,
 *               contact), has converted, is not a buyer, or already has a finder
 *               entry of its own (the wizard and its analysis screen, and product
 *               pages' in-page prompt).
 */
export function finderPlacement(pathname = "/") {
  if (pathname === "/" || pathname === "/products" || pathname === "/application-resources") return "stripe";
  if (/^\/(workflows|blog)(\/|$)/.test(pathname)) return "stripe";
  if (/^\/(quote|contact|service|thank-you|careers|privacy-policy|terms-and-conditions)(\/|$)/.test(pathname)) return "none";
  if (/^\/products\/./.test(pathname)) return "none";
  if (/^\/solution-finder(\/analyze)?$/.test(pathname)) return "none";
  return "launcher";
}

// Checked against lowercased text; the earliest hit in the text wins, so
// "sample preparation in analytical labs" reads as sample preparation.
const OBJECTIVE_HINTS = [
  ["cold storage stability chamber", /stabilit|shelf.life|storage|freezer|humidity|chamber|incubat/],
  ["quality control compliance", /\bqc\b|quality control|release|compliance|validation/],
  ["environmental water testing", /environmental (testing|monitoring|analysis)|water (testing|analysis|quality)|wastewater|soil|pollut/],
  ["bioprocess cell culture protein", /bioprocess|cell culture|protein|ferment|bioreactor/],
  ["synthesis reaction screening", /synthes|reaction|reactor|photochem|flow chem|hydrogenat/],
  ["separation purification chromatography", /purif|separat|chromatograph|hplc|uplc|evaporat|distill|extract|filtrat|isolation|clean.up|lyophili|freeze dry/],
  ["material characterization microscopy thermal particle", /material|microscop|thermal|calorimetr|\bafm\b|particle|surface|rheolog|viscom|texture|imaging/],
  ["analytical characterization spectroscopy", /spectro|nmr|raman|ft.?ir|mass spec|detection|identif|quantif|titrat|characteri/],
  ["sample preparation", /sampl|weigh|balance|dissolution|prep|homogeni|sonicat|ultrason|mixing|stirr|shak|grind|digest|\blysis|centrifug/],
  ["automation high throughput", /automat|throughput|robot|liquid handling/],
];

function objectiveFor(text) {
  const haystack = String(text ?? "").toLowerCase().replace(/[-_]+/g, " ");
  let best = null;
  for (const [value, pattern] of OBJECTIVE_HINTS) {
    const index = haystack.search(pattern);
    if (index !== -1 && (!best || index < best.index)) best = { index, value };
  }
  return best?.value ?? null;
}

/**
 * The finder objective a page or product most likely points at, as
 * { value, label }, or null when nothing is a confident match. Texts are tried
 * in order, so pass the most specific (a product name) first.
 */
export function inferFinderObjective(...texts) {
  for (const text of texts) {
    const value = objectiveFor(text);
    if (value) {
      const option = finderObjectives.find((item) => item.value === value);
      if (option) return { value: option.value, label: option.label };
    }
  }
  return null;
}

/** Pre-fill from the URL: workflow stages and blog posts name their topic in the slug. */
export function finderPrefillForPath(pathname = "/") {
  const match = pathname.match(/^\/(?:workflows\/[^/]+|blog)\/([^/]+)/);
  return match ? inferFinderObjective(match[1]) : null;
}
