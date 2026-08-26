import { getAllProducts } from "@/data/products/principals";
import { productMatchesSearch } from "@/lib/productSearch";

// The catalogue lives here rather than in the browser. Matching runs against the
// full product records — specs, FAQs, synonyms and all — so results are exactly
// what a client-side search would have produced, without shipping 9.5 MB to
// every visitor to read one page.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 24;

/** Only the fields the results list renders. */
function toResult(product) {
  return {
    name: product.name,
    slug: product.slug,
    href: product.href || `/products/${product.slug}`,
    principalName: product.principalName ?? "",
    principalSlug: product.principalSlug ?? "",
    countryOfOrigin: product.countryOfOrigin ?? "",
    industry: product.industry ?? "",
  };
}

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(Number(searchParams.get("limit")) || 12, MAX_LIMIT);

  if (query.length < 2) {
    return Response.json({ success: true, query, total: 0, results: [] });
  }

  const matches = getAllProducts().filter((product) =>
    productMatchesSearch(product, query)
  );

  return Response.json({
    success: true,
    query,
    // The full count, so the caller can say "showing 12 of 40" and log honestly.
    total: matches.length,
    results: matches.slice(0, limit).map(toResult),
  });
}
