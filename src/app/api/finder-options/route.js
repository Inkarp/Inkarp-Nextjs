import { getDb } from "@/lib/mongodb";
import { ensureFinderOptions, FINDER_OPTION_TYPES, finderOptionId } from "@/lib/finderOptionStore";
import { normalizeFinderText } from "@/lib/solutionFinder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanType(value) {
  return FINDER_OPTION_TYPES.has(value) ? value : "";
}

function publicOption(option) {
  return { value: option.value, label: option.label, description: option.description ?? "", userAdded: option.source === "visitor" };
}

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const type = cleanType(params.get("type"));
  const query = normalizeFinderText(params.get("q") ?? "").slice(0, 100);
  if (!type) return Response.json({ results: [] }, { status: 400 });

  try {
    const db = await getDb();
    await ensureFinderOptions(db);
    const filter = { type, status: "active" };
    if (query) filter.normalizedLabel = { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const records = await db.collection("finderOptions")
      .find(filter, { projection: { _id: 0, value: 1, label: 1, description: 1, source: 1 } })
      .sort({ source: 1, label: 1 })
      .limit(30)
      .toArray();
    return Response.json({ results: records.map(publicOption) });
  } catch (error) {
    console.error("[finder-options] load failed:", error.message);
    return Response.json({ results: [] }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const type = cleanType(body?.type);
  const label = typeof body?.label === "string" ? body.label.trim().replace(/\s+/g, " ").slice(0, 100) : "";
  const normalizedLabel = normalizeFinderText(label);
  if (!type || normalizedLabel.length < 2) {
    return Response.json({ success: false, message: "Enter at least two characters." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await ensureFinderOptions(db);
    const id = finderOptionId(type, label);
    const value = label;
    await db.collection("finderOptions").updateOne(
      { id },
      {
        $setOnInsert: {
          id, type, value, label, normalizedLabel, description: "Added by a website visitor",
          source: "visitor", status: "active", createdAt: new Date(),
        },
        $set: { lastUsedAt: new Date() },
        $inc: { submissionCount: 1 },
      },
      { upsert: true }
    );
    const option = await db.collection("finderOptions").findOne({ id });
    return Response.json({ success: true, option: publicOption(option) });
  } catch (error) {
    console.error("[finder-options] add failed:", error.message);
    return Response.json({ success: false, message: "Could not save this option." }, { status: 500 });
  }
}
