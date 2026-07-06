import { getDb } from "@/lib/mongodb";

// Logs product-search queries so real search demand can inform catalog/SEO
// priorities. Called before the results fetch fires, so the query is on
// record even if the user navigates away before results render.
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
    timestamp: new Date(),
  };

  try {
    const db = await getDb();
    await db.collection("searchLogs").insertOne(entry);
  } catch (error) {
    console.error("[search-log] failed to save:", error.message);
    return Response.json({ success: false, error: "Could not save search" }, { status: 500 });
  }

  return Response.json({ success: true });
}
