import { getDb } from "@/lib/mongodb";
import { normalizeFinderText } from "@/lib/solutionFinder";
import { solutionFinderInstitutions } from "@/data/solutionFinder";
import { ensureInstitutionSeeds } from "@/lib/institutionStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicInstitution(institution) {
  return { id: institution.id, name: institution.name };
}

function seedMatches(query) {
  return solutionFinderInstitutions
    .map((institution) => {
      const name = normalizeFinderText(institution.name);
      const aliases = institution.aliases.map(normalizeFinderText);
      const shortName = normalizeFinderText(institution.shortName);
      const exact = shortName === query || name === query;
      const prefix = name.startsWith(query) || aliases.some((alias) => alias.startsWith(query));
      const partial = name.includes(query) || aliases.some((alias) => alias.includes(query));
      return { institution, score: exact ? 3 : prefix ? 2 : partial ? 1 : 0 };
    })
    .filter((item) => item.score)
    .sort((a, b) => b.score - a.score || a.institution.name.localeCompare(b.institution.name))
    .slice(0, 8)
    .map(({ institution }) => publicInstitution(institution));
}

export async function GET(request) {
  const rawQuery = new URL(request.url).searchParams.get("q") ?? "";
  const query = normalizeFinderText(rawQuery).slice(0, 80);
  if (query.length < 2) return Response.json({ results: [] });

  try {
    const db = await getDb();
    await ensureInstitutionSeeds(db);
    const words = query.split(" ").filter(Boolean).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const expression = new RegExp(words.join(".*"), "i");
    const records = await db.collection("institutions")
      .find(
        { status: "approved", $or: [{ normalizedName: expression }, { name: expression }, { aliases: expression }] },
        { projection: { _id: 0, id: 1, name: 1 } }
      )
      .sort({ name: 1 })
      .limit(8)
      .toArray();

    if (records.length) return Response.json({ results: records.map(publicInstitution) });
  } catch {
    // The checked-in seed makes the finder usable before a customer database is imported.
  }

  return Response.json({ results: seedMatches(query) });
}
