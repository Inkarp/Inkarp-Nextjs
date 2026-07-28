// Server-side counterpart to browserTracking.js. Every API route that saves
// a form submission builds its `tracking` sub-object through
// normalizeTracking() so every collection in the database ends up with the
// exact same tracking shape, and renders it in notification emails through
// the shared buildTrackingEmailHtml/Text helpers so no route hand-rolls its
// own visitor-tracking section.

// Trust order for the visitor's real IP behind a proxy/CDN — the raw socket
// address is just the edge network's own internal IP, never the visitor's.
const IP_HEADERS = [
  "x-vercel-forwarded-for", // Vercel edge-injected, not spoofable by the client
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "true-client-ip",
];

export const TRACKING_FIELD_KEYS = [
  "pageUrl",
  "pagePath",
  "deviceType",
  "userAgent",
  "trafficSource",
  "referrer",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "gclid",
  "fbclid",
  "landingTimestamp",
  "timestamp",
];

function stripIpv6Prefix(ip) {
  return ip.replace(/^::ffff:/i, "");
}

export function getClientIp(request) {
  const headers = request?.headers;
  if (!headers || typeof headers.get !== "function") return "Unknown";

  for (const name of IP_HEADERS) {
    const value = headers.get(name);
    if (!value) continue;
    const first = value.split(",")[0].trim();
    if (first) return stripIpv6Prefix(first);
  }

  return "Unknown";
}

// Builds the one canonical tracking sub-object every form's backend route
// stores. `formData` is whatever the client sent (from collectTracking());
// `requestOrIp` is the request (IP is derived from it, server-side, never
// trusted from the client) or, if already resolved, the IP string itself.
export function normalizeTracking(formData = {}, requestOrIp) {
  const ip = typeof requestOrIp === "string" ? requestOrIp : getClientIp(requestOrIp);

  return {
    ip,
    deviceType: formData.deviceType || "",
    trafficSource: formData.trafficSource || "Direct / None",
    referrer: formData.referrer || "Direct / None",
    pageUrl: formData.pageUrl || "",
    pagePath: formData.pagePath || "",
    utmSource: formData.utmSource || null,
    utmMedium: formData.utmMedium || null,
    utmCampaign: formData.utmCampaign || null,
    utmTerm: formData.utmTerm || null,
    utmContent: formData.utmContent || null,
    gclid: formData.gclid || null,
    fbclid: formData.fbclid || null,
    userAgent: formData.userAgent || "",
    landingTimestamp: formData.landingTimestamp || null,
    timestamp: formData.timestamp || new Date().toISOString(),
  };
}

// Returns a shallow copy of formData with the raw client-supplied tracking
// keys removed, so a route's business fields don't duplicate what's already
// captured in the normalized `tracking` sub-object.
export function omitTrackingFields(formData = {}) {
  const rest = { ...formData };
  for (const key of TRACKING_FIELD_KEYS) {
    delete rest[key];
  }
  return rest;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatLocalTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return String(isoString);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata",
  });
}

const TRACKING_ROWS = [
  ["ip", "IP Address", (value) => value],
  ["deviceType", "Device Type", (value) => value],
  ["trafficSource", "Traffic Source", (value) => value],
  ["referrer", "Referrer", (value) => value],
  ["pageUrl", "Page URL", (value) => value],
  ["pagePath", "Page Path", (value) => value],
  ["utmSource", "UTM Source", (value) => value],
  ["utmMedium", "UTM Medium", (value) => value],
  ["utmCampaign", "UTM Campaign", (value) => value],
  ["utmTerm", "UTM Term", (value) => value],
  ["utmContent", "UTM Content", (value) => value],
  ["gclid", "GCLID", (value) => value],
  ["fbclid", "FBCLID", (value) => value],
  ["userAgent", "User Agent", (value) => value],
  ["landingTimestamp", "Landing Time", formatLocalTime],
  ["timestamp", "Submitted At", formatLocalTime],
];

function displayValue(tracking, key, format) {
  const raw = tracking[key];
  if (raw === null || raw === undefined || raw === "") return "-";
  return format(raw);
}

export function buildTrackingEmailHtml(tracking = {}) {
  return TRACKING_ROWS.map(([key, label, format]) => {
    const display = displayValue(tracking, key, format);
    return `<tr><td style="padding:6px 12px;font-weight:600;color:#444;white-space:nowrap;vertical-align:top;border:1px solid #e6e6e6;background:#fafafa;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111;border:1px solid #e6e6e6;white-space:pre-wrap;">${escapeHtml(display)}</td></tr>`;
  }).join("");
}

export function buildTrackingEmailText(tracking = {}) {
  return TRACKING_ROWS.map(([key, label, format]) => `${label}: ${displayValue(tracking, key, format)}`).join("\n");
}
