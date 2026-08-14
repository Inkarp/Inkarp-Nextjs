import { MongoClient } from "mongodb";

// Cached across hot-reloads/serverless invocations so we don't open a new
// connection per request — the standard pattern for Mongo in Next.js.
let clientPromise = globalThis._mongoClientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set — add it to .env before submitting forms.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, {
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
    }).connect();
    globalThis._mongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "inkarp");
}
