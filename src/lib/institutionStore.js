import { solutionFinderInstitutions } from "@/data/solutionFinder";
import { normalizeFinderText } from "@/lib/solutionFinder";

let seedPromise;

/**
 * Adds the checked-in starter directory without overwriting future admin edits.
 * Once the user's full institution file is imported, those records can coexist
 * with or replace these stable IDs.
 */
export async function ensureInstitutionSeeds(db) {
  if (!seedPromise) {
    seedPromise = db.collection("institutions").bulkWrite(
      solutionFinderInstitutions.map((institution) => ({
        updateOne: {
          filter: { id: institution.id },
          update: {
            $setOnInsert: {
              ...institution,
              normalizedName: normalizeFinderText(institution.name),
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      })),
      { ordered: false }
    ).then(async () => {
      await Promise.all([
        db.collection("institutions").createIndex({ id: 1 }, { unique: true }),
        db.collection("institutions").createIndex({ status: 1, normalizedName: 1 }),
        db.collection("solutionFinderSessions").createIndex({ sessionId: 1 }, { unique: true }),
        db.collection("solutionFinderSessions").createIndex({ accountEmail: 1, updatedAt: -1 }),
        db.collection("finderEvents").createIndex({ createdAt: 1 }, { expireAfterSeconds: 365 * 86400 }),
      ]);
    }).catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
