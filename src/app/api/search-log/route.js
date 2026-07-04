// Logs product-search queries so real search demand can inform catalog/SEO
// priorities. No database is wired up yet — entries are written to the server
// log. Swap the body of POST for a real insert once storage is chosen.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";

  if (!query) {
    return Response.json({ success: false, error: "Missing query" }, { status: 400 });
  }

  const entry = {
    query,
    brands: Array.isArray(body.brands) ? body.brands.filter((b) => typeof b === "string") : [],
    resultsCount: typeof body.resultsCount === "number" ? body.resultsCount : null,
    timestamp: new Date().toISOString(),
  };

  console.log("[search-log]", JSON.stringify(entry));

  return Response.json({ success: true });
}
