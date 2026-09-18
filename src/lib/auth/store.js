import { getDb } from "@/lib/mongodb";
import { hashToken, normaliseEmail, TOKEN_TTL_MINUTES } from "./session";

// Every collection this feature touches, with the indexes it needs. Indexes are
// created once per process — Mongo treats a repeat createIndex as a no-op.

let indexesReady = null;

async function collections() {
  const db = await getDb();
  const users = db.collection("users");
  const tokens = db.collection("loginTokens");
  const baskets = db.collection("userBaskets");

  if (!indexesReady) {
    indexesReady = Promise.all([
      users.createIndex({ email: 1 }, { unique: true }),
      // Mongo deletes expired login links itself, so this stays near-empty.
      tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      tokens.createIndex({ tokenHash: 1 }, { unique: true }),
      baskets.createIndex({ email: 1 }, { unique: true }),
      // A basket nobody touches for 120 days is abandoned.
      baskets.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 120 * 86400 }),
      // Analytics logs grow with every visitor forever; customer records do not.
      db.collection("chatConversations").createIndex(
        { startedAt: 1 },
        { expireAfterSeconds: 180 * 86400 }
      ),
      db.collection("searchLogs").createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 180 * 86400 }
      ),
    ]).catch(() => {
      // A failed index must not stop sign-in; retry on the next call.
      indexesReady = null;
    });
  }
  await indexesReady;

  return { baskets, db, tokens, users };
}

export async function saveLoginToken({ email, tokenHash, ip }) {
  const { tokens } = await collections();
  await tokens.insertOne({
    createdAt: new Date(),
    email: normaliseEmail(email),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60000),
    ip: ip ?? null,
    tokenHash,
    usedAt: null,
  });
}

/**
 * Redeem a login link. Atomic, so a link forwarded to two people can only ever
 * sign in the first of them.
 * @returns {Promise<string|null>} the email, or null if the link is bad or spent
 */
export async function consumeLoginToken(rawToken) {
  const { tokens } = await collections();
  const result = await tokens.findOneAndUpdate(
    { expiresAt: { $gt: new Date() }, tokenHash: hashToken(rawToken), usedAt: null },
    { $set: { usedAt: new Date() } },
    { returnDocument: "after" }
  );
  const doc = result?.value ?? result;
  return doc?.email ?? null;
}

/** How many links this address has asked for recently — the abuse guard. */
export async function recentTokenCount(email, minutes = 60) {
  const { tokens } = await collections();
  return tokens.countDocuments({
    createdAt: { $gt: new Date(Date.now() - minutes * 60000) },
    email: normaliseEmail(email),
  });
}

export async function upsertUser(email) {
  const { users } = await collections();
  const value = normaliseEmail(email);
  await users.updateOne(
    { email: value },
    { $set: { email: value, lastSeenAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  return users.findOne({ email: value }, { projection: { _id: 0 } });
}

export async function getUser(email) {
  const { users } = await collections();
  return users.findOne({ email: normaliseEmail(email) }, { projection: { _id: 0 } });
}

export async function updateProfile(email, profile) {
  const { users } = await collections();
  const allowed = {};
  for (const key of ["name", "company", "phone", "city"]) {
    if (typeof profile?.[key] === "string") allowed[key] = profile[key].trim().slice(0, 120);
  }
  if (!Object.keys(allowed).length) return getUser(email);

  await users.updateOne({ email: normaliseEmail(email) }, { $set: allowed });
  return getUser(email);
}

/* ---------------------------------------------------------------- baskets */

export async function getSavedBasket(email) {
  const { baskets } = await collections();
  const doc = await baskets.findOne({ email: normaliseEmail(email) }, { projection: { _id: 0 } });
  return doc?.items ?? [];
}

export async function saveBasket(email, items) {
  const { baskets } = await collections();
  const clean = (Array.isArray(items) ? items : []).slice(0, 20).map((item) => ({
    addedAt: typeof item?.addedAt === "string" ? item.addedAt : new Date().toISOString(),
    countryOfOrigin: String(item?.countryOfOrigin ?? "").slice(0, 80),
    image: String(item?.image ?? "").slice(0, 300),
    imageAlt: String(item?.imageAlt ?? "").slice(0, 200),
    name: String(item?.name ?? "").slice(0, 200),
    principalName: String(item?.principalName ?? "").slice(0, 120),
    principalSlug: String(item?.principalSlug ?? "").slice(0, 120),
    slug: String(item?.slug ?? "").slice(0, 160),
  }));

  await baskets.updateOne(
    { email: normaliseEmail(email) },
    { $set: { email: normaliseEmail(email), items: clean, updatedAt: new Date() } },
    { upsert: true }
  );
  return clean;
}

/* ------------------------------------------------------- quote history */

/** Past quote requests for this address, newest first. */
export async function getQuoteHistory(email, limit = 25) {
  const { db } = await collections();
  return db
    .collection("formSubmissions")
    .find(
      {
        $or: [{ accountEmail: normaliseEmail(email) }, { email: normaliseEmail(email) }],
        formType: { $in: ["quote-basket", "demo-booking"] },
      },
      {
        projection: {
          _id: 0,
          formType: 1,
          items: 1,
          productCount: 1,
          productName: 1,
          reference: 1,
          submittedAt: 1,
        },
      }
    )
    .sort({ submittedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getSavedSolutionReports(email, limit = 12) {
  const { db } = await collections();
  return db.collection("solutionFinderSessions")
    .find(
      { accountEmail: normaliseEmail(email), saved: true },
      { projection: { _id: 0, sessionId: 1, institution: 1, labels: 1, recommendations: { $slice: 1 }, updatedAt: 1 } }
    )
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();
}
