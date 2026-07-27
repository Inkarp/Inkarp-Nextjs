import nodemailer from "nodemailer";
import { getDb } from "@/lib/mongodb";
import { CHATBOT_CONFIG, CHATBOT_FIELDS } from "@/data/chatbotConfig";
import { getServerTracking as getBaseTracking } from "@/lib/tracking";

const ALLOWED_CATEGORIES = new Set(["Product", "Service", "Quote", "Talk to expert", "Workflow quiz"]);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const MAX_STRING_LENGTH = 2000;
const MAX_ARRAY_ITEMS = 20;
const MAX_OBJECT_KEYS = 80;
const rateLimitStore = globalThis._chatRateLimitStore || new Map();
globalThis._chatRateLimitStore = rateLimitStore;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeValue(value, depth = 0) {
  if (typeof value === "string") return value.trim().slice(0, MAX_STRING_LENGTH);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    if (depth > 2) return [];
    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => normalizeValue(item, depth + 1));
  }
  if (value && typeof value === "object") {
    if (depth > 2) return {};
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, MAX_OBJECT_KEYS)
        .map(([key, nestedValue]) => [String(key).slice(0, 80), normalizeValue(nestedValue, depth + 1)])
    );
  }
  return "";
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  return normalizeValue(payload);
}

function formatValue(value) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.stringify(value, null, 2);
  }
  return value ?? "";
}

function labelize(key) {
  return key.replace(/^_/, "").replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function getDeviceTypeFromUserAgent(userAgent = "") {
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

function getHostUrl(request) {
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return host ? `${proto}://${host}` : "";
}

function getServerTracking(request, payload = {}) {
  const userAgent = request.headers.get("user-agent") || payload._userAgent || "";
  const base = getBaseTracking(request, payload);

  return {
    ...base,
    _pageUrl: base._pageUrl || getHostUrl(request),
    _deviceType: payload._deviceType || getDeviceTypeFromUserAgent(userAgent),
    _userAgent: userAgent,
    _trackingCapturedAt: new Date(),
  };
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "Not available";
}

function checkRateLimit(ip) {
  const now = Date.now();
  if (rateLimitStore.size > 500) {
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) rateLimitStore.delete(key);
    }
  }
  const record = rateLimitStore.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (record.resetAt <= now) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  record.count += 1;
  rateLimitStore.set(ip, record);
  return record.count <= RATE_LIMIT_MAX;
}

function getRequiredFields(category) {
  const fields = CHATBOT_FIELDS[category] || [];
  const required = fields.filter((field) => field.required).map((field) => field.name);
  return required;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return ["Invalid JSON payload"];
  if (!ALLOWED_CATEGORIES.has(payload.category)) return ["Invalid enquiry category"];

  if (payload.category === "Workflow quiz") {
    const errors = [];
    const requiredWorkflowFields = [
      "productName",
      "inquiryType",
      "name",
      "email",
      "phone",
      "company",
      "city",
      "state",
      "application",
    ];

    if (!Array.isArray(payload.answers) || payload.answers.length !== 3) errors.push("Workflow answers are required");
    if (!String(payload.recommendedProduct ?? "").trim()) errors.push("recommendedProduct is required");
    if (!String(payload.recommendedProductSlug ?? "").trim()) errors.push("recommendedProductSlug is required");

    for (const field of requiredWorkflowFields) {
      if (!String(payload[field] ?? "").trim()) errors.push(`${field} is required`);
    }

    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) errors.push("Invalid email");
    if (payload.phone && !/^[+\d][\d\s().-]{6,19}$/.test(String(payload.phone))) errors.push("Invalid phone");

    return errors;
  }

  const missing = getRequiredFields(payload.category).filter((field) => !String(payload[field] ?? "").trim());
  const errors = missing.map((field) => `${field} is required`);

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) errors.push("Invalid email");
  if (payload.contact && !/^[+\d][\d\s().-]{6,19}$/.test(String(payload.contact))) errors.push("Invalid phone");

  return errors;
}

function renderTable(title, rows, headerColor) {
  const visibleRows = rows.filter(([, value]) => value !== undefined && value !== null && String(value) !== "");
  if (!visibleRows.length) return "";

  return `
    <table style="width:100%;border-collapse:collapse;margin:0 0 18px 0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">
      <thead>
        <tr>
          <th colspan="2" style="background:${headerColor};color:#ffffff;text-align:left;padding:10px 12px;border:1px solid #e5e7eb;font-size:15px;">${escapeHtml(title)}</th>
        </tr>
      </thead>
      <tbody>
        ${visibleRows
          .map(
            ([key, value]) => `
              <tr>
                <td style="width:34%;padding:9px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;color:#111827;vertical-align:top;">${escapeHtml(labelize(key))}</td>
                <td style="padding:9px 12px;border:1px solid #e5e7eb;background:#ffffff;color:#111827;vertical-align:top;white-space:pre-wrap;">${escapeHtml(formatValue(value))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

let transporter;
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_HOST/SMTP_USER/SMTP_PASS are not set.");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

async function sendChatEmail(submission) {
  const to = process.env.COMPANY_EMAIL || process.env.MAIL_TO || "sharath@inkarp.co.in";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const brandBlue = CHATBOT_CONFIG.colors.brandBlue;
  const visitorRows = [
    ["pageUrl", submission._pageUrl],
    ["referrerUrl", submission._referrerUrl],
    ["trafficSource", submission._trafficSource],
    ["trafficMedium", submission._trafficMedium],
    ["utmCampaign", submission._utmCampaign],
    ["utmContent", submission._utmContent],
    ["searchKeyword", submission._searchKeyword],
    ["landingPageUrl", submission._landingPageUrl],
    ["landingCapturedAt", submission._landingCapturedAt],
    ["deviceType", submission._deviceType],
    ["ip", submission.visitorIp],
    ["userAgent", submission._userAgent],
  ];
  const submissionRows = Object.entries(submission).filter(
    ([key]) => !["_id", "submittedAt", "visitorIp"].includes(key) && !key.startsWith("_")
  );

  await getTransporter().sendMail({
    from,
    to,
    replyTo: submission.email,
    subject: `${CHATBOT_CONFIG.emailSubject} - ${submission.category}`,
    html: `
      <div style="background:#f3f4f6;padding:20px;">
        <div style="max-width:820px;margin:0 auto;background:#ffffff;padding:20px;border:1px solid #e5e7eb;">
          <h2 style="margin:0 0 16px 0;color:#111827;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(CHATBOT_CONFIG.emailSubject)}</h2>
          ${renderTable("Visitor Intelligence", visitorRows, brandBlue)}
          ${renderTable("Submission Details", submissionRows, brandBlue)}
        </div>
      </div>
    `,
  });
}

export async function POST(request) {
  const visitorIp = getClientIp(request);
  if (!checkRateLimit(visitorIp)) {
    return Response.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
  }

  const rawPayload = await request.json().catch(() => null);
  if (rawPayload?.website) {
    return Response.json({ success: true, spamFiltered: true });
  }

  const payload = normalizePayload(rawPayload);
  const errors = validatePayload(payload);
  if (errors.length) {
    return Response.json({ success: false, message: errors.join(", ") }, { status: 400 });
  }

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => key !== "website")
  );
  const submission = {
    ...cleanPayload,
    ...getServerTracking(request, cleanPayload),
    visitorIp,
    submittedAt: new Date(),
  };
  let insertedId;

  try {
    const db = await getDb();
    const result = await db.collection(CHATBOT_CONFIG.mongoCollectionName).insertOne(submission);
    insertedId = result.insertedId;
  } catch (error) {
    console.error("[chat] failed to save submission:", error.message);
    return Response.json({ success: false, message: "Could not save your enquiry. Please try again shortly." }, { status: 500 });
  }

  let notificationSent = false;
  try {
    await sendChatEmail({ ...submission, _id: insertedId });
    notificationSent = true;
  } catch (error) {
    console.error("[chat] failed to send notification email:", error.message);
  }

  return Response.json({ success: true, id: String(insertedId), notificationSent });
}


