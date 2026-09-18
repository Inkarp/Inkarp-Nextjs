import {
  finderChallenges,
  finderIndustries,
  finderObjectives,
  finderRoles,
  finderTimelines,
} from "@/data/solutionFinder";
import { normalizeFinderText } from "@/lib/solutionFinder";

const optionSeeds = {
  role: finderRoles,
  industry: finderIndustries,
  objective: finderObjectives,
  challenge: finderChallenges,
  timeline: finderTimelines,
  automation: [
    { value: "no-preference", label: "No preference" },
    { value: "manual", label: "Manual" },
    { value: "semi-automated", label: "Semi-automated" },
    { value: "automated", label: "Automated / unattended" },
  ],
};

export const FINDER_OPTION_TYPES = new Set(Object.keys(optionSeeds));
let seedPromise;

export function finderOptionId(type, label) {
  return `${type}:${normalizeFinderText(label).replace(/\s+/g, "-").slice(0, 100)}`;
}

export async function ensureFinderOptions(db) {
  if (!seedPromise) {
    const operations = Object.entries(optionSeeds).flatMap(([type, options]) =>
      options.map((option) => ({
        updateOne: {
          filter: { id: finderOptionId(type, option.label) },
          update: {
            $setOnInsert: {
              id: finderOptionId(type, option.label),
              type,
              value: option.value,
              label: option.label,
              description: option.description ?? "",
              normalizedLabel: normalizeFinderText(option.label),
              source: "system",
              status: "active",
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      }))
    );
    seedPromise = db.collection("finderOptions").bulkWrite(operations, { ordered: false })
      .then(() => Promise.all([
        db.collection("finderOptions").createIndex({ id: 1 }, { unique: true }),
        db.collection("finderOptions").createIndex({ type: 1, status: 1, normalizedLabel: 1 }),
      ]))
      .catch((error) => { seedPromise = null; throw error; });
  }
  return seedPromise;
}

export async function isFinderOption(db, type, value) {
  await ensureFinderOptions(db);
  return Boolean(await db.collection("finderOptions").findOne({ type, value, status: "active" }, { projection: { _id: 1 } }));
}
