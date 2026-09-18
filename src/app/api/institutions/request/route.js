import { getDb } from "@/lib/mongodb";
import { normalizeFinderText } from "@/lib/solutionFinder";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 180) : "";
  if (name.length < 3) {
    return Response.json({ success: false, message: "Enter a valid institution name." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const normalizedName = normalizeFinderText(name);
    const id = `visitor-${normalizedName.replace(/\s+/g, "-").slice(0, 90)}`;
    await db.collection("institutionRequests").updateOne(
      { normalizedName, status: "pending" },
      {
        $setOnInsert: {
          name,
          normalizedName,
          city: typeof body.city === "string" ? body.city.trim().slice(0, 100) : "",
          website: typeof body.website === "string" ? body.website.trim().slice(0, 200) : "",
          status: "pending",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    // Visitor additions are deliberately limited to a public name and stable
    // ID. Internal organisation metadata is filled in later by the admin import.
    await db.collection("institutions").updateOne(
      { id },
      {
        $setOnInsert: {
          id, name, normalizedName, aliases: [], status: "approved",
          source: "visitor", createdAt: new Date(),
        },
        $set: { lastUsedAt: new Date() },
      },
      { upsert: true }
    );
    return Response.json({ success: true, institution: { id, name } });
  } catch (error) {
    console.error("[institution-request] failed:", error.message);
    return Response.json({ success: false, message: "Could not save the request." }, { status: 500 });
  }
}
