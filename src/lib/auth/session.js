import crypto from "node:crypto";

// Passwordless sign-in. A visitor asks for a link, we email a one-time token,
// and clicking it sets a signed cookie. No password is ever stored, so there is
// nothing in the database worth stealing if it ever leaked.

export const SESSION_COOKIE = "ikp_session";
export const SESSION_MAX_AGE_DAYS = 30;
export const TOKEN_TTL_MINUTES = 15;

/** Auth is inert until a secret is configured, so the site never half-works. */
export function authConfigured() {
  return Boolean(process.env.AUTH_SECRET && process.env.MONGODB_URI);
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  }
  return value;
}

export function normaliseEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function isValidEmail(email) {
  const value = normaliseEmail(email);
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value);
}

/** The raw token goes in the email; only its hash is stored. */
export function createLoginToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/**
 * A session is `email.issuedAt.signature` — readable, tamper-evident, and it
 * needs no database lookup on every request.
 */
export function createSessionValue(email) {
  const payload = `${Buffer.from(normaliseEmail(email)).toString("base64url")}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

/** @returns {{email: string, issuedAt: number} | null} */
export function readSessionValue(value) {
  if (typeof value !== "string") return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [encodedEmail, issuedAtRaw, signature] = parts;
  const payload = `${encodedEmail}.${issuedAtRaw}`;

  const expected = sign(payload);
  // Constant-time compare so a signature can't be guessed byte by byte.
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return null;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return null;
  if (Date.now() - issuedAt > SESSION_MAX_AGE_DAYS * 86400000) return null;

  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  return isValidEmail(email) ? { email, issuedAt } : null;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE_DAYS * 86400,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
