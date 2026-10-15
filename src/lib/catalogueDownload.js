import crypto from "node:crypto";

export const CATALOGUE_FILE = "Inkarp_product_profile_2026.pdf";
export const OTP_TTL_MS = 10 * 60_000;
export const DOWNLOAD_TTL_MS = 5 * 60_000;
export const VERIFIED_EMAIL_TTL_MS = 24 * 60 * 60_000;
export const VERIFIED_EMAIL_COOKIE = "inkarp_catalogue_verified";

function secret() {
  const value = process.env.CATALOGUE_DOWNLOAD_SECRET;
  if (value) {
    if (value.length < 32) {
      throw new Error("CATALOGUE_DOWNLOAD_SECRET must contain at least 32 characters.");
    }
    return crypto.createHash("sha256").update(value).digest();
  }

  // Existing installations may not have the dedicated key yet. Derive a
  // stable server-only signing key from two independent configured secrets so
  // catalogue OTPs work immediately, while still preferring the dedicated key
  // in production deployments.
  const fallback = `${process.env.SMTP_PASS || ""}|${process.env.MONGODB_URI || ""}`;
  if (fallback.length < 32) {
    throw new Error("Set CATALOGUE_DOWNLOAD_SECRET to a random value of at least 32 characters.");
  }
  return crypto.createHash("sha256").update(fallback).digest();
}

export function hashOtp({ otp, requestId, email }) {
  return crypto
    .createHmac("sha256", secret())
    .update(`${requestId}:${email.toLowerCase()}:${otp}`)
    .digest("hex");
}

export function otpMatches(expected, actual) {
  const left = Buffer.from(expected || "", "hex");
  const right = Buffer.from(actual || "", "hex");
  return left.length === right.length && left.length > 0 && crypto.timingSafeEqual(left, right);
}

export function createDownloadToken({ requestId, productSlug }) {
  const payload = Buffer.from(JSON.stringify({
    requestId,
    productSlug,
    expiresAt: Date.now() + DOWNLOAD_TTL_MS,
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function createVerifiedEmailToken(email) {
  const payload = Buffer.from(JSON.stringify({
    email: String(email).trim().toLowerCase(),
    expiresAt: Date.now() + VERIFIED_EMAIL_TTL_MS,
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(`verified:${payload}`).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyEmailToken(token) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;
  const expected = crypto.createHmac("sha256", secret()).update(`verified:${payload}`).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!parsed.email || !parsed.expiresAt || parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function verifyDownloadToken(token) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!parsed.requestId || !parsed.expiresAt || parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}
