// Dexter's "did you mean": the real pages closest to an address that didn't
// match, scored on letter pairs so typos, dropped words and swapped order all
// still find the page.

const pairs = (text) => {
  const clean = ` ${String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
  const out = new Map();
  for (let i = 0; i < clean.length - 1; i += 1) {
    const pair = clean.slice(i, i + 2);
    out.set(pair, (out.get(pair) ?? 0) + 1);
  }
  return out;
};

function similarity(a, b) {
  const pa = pairs(a);
  const pb = pairs(b);
  let shared = 0;
  let total = 0;
  pa.forEach((count, pair) => {
    total += count;
    shared += Math.min(count, pb.get(pair) ?? 0);
  });
  pb.forEach((count) => {
    total += count;
  });
  return total ? (2 * shared) / total : 0;
}

/**
 * The closest pages to a broken path. candidates: [{ href, title }].
 * Scores the last part of the path against each page's address and title.
 */
export function closestPages(path, candidates, limit = 3) {
  const wanted = String(path).split("/").filter(Boolean).pop() ?? "";
  if (!wanted) return [];
  return candidates
    .map((page) => ({
      ...page,
      score: Math.max(similarity(wanted, page.href.split("/").pop()), similarity(wanted, page.title)),
    }))
    .filter((page) => page.score > 0.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
