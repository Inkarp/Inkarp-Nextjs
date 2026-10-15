import nodemailer from "nodemailer";
import { buildTrackingEmailHtml, buildTrackingEmailText } from "./serverTracking";

let transporter;
const NOTIFICATION_RECIPIENT = "sharath@inkarp.co.in";

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "SMTP_HOST/SMTP_USER/SMTP_PASS are not set. Add them to .env before submitting forms."
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function labelize(key) {
  return key
    .replace(/^_/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

function renderRow([key, value]) {
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#444;white-space:nowrap;vertical-align:top;border:1px solid #e6e6e6;background:#fafafa;">${escapeHtml(labelize(key))}</td><td style="padding:6px 12px;color:#111;border:1px solid #e6e6e6;white-space:pre-wrap;">${escapeHtml(value ?? "")}</td></tr>`;
}

export async function sendFormNotification({ subject, fields, tracking, to, replyTo, attachments = [] }) {
  const configuredRecipients = to || process.env.MAIL_TO || NOTIFICATION_RECIPIENT;
  const recipients = Array.from(
    new Set(
      `${configuredRecipients},${NOTIFICATION_RECIPIENT}`
        .split(",")
        .map((address) => address.trim())
        .filter(Boolean)
    )
  );
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const rows = Object.entries(fields).filter(
    ([, value]) => value !== undefined && value !== "" && typeof value !== "object"
  );

  const trackingHtml = tracking
    ? `<h3 style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#444;margin:18px 0 8px;">Visitor &amp; Campaign Tracking</h3><table style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;width:100%;max-width:760px;">${buildTrackingEmailHtml(tracking)}</table>`
    : "";
  const trackingText = tracking ? `\n\nVisitor & Campaign Tracking\n${buildTrackingEmailText(tracking)}` : "";

  await getTransporter().sendMail({
    from,
    to: recipients,
    replyTo,
    subject,
    attachments,
    html: `<table style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;width:100%;max-width:760px;">${rows.map(renderRow).join("")}</table>${trackingHtml}`,
    text: `${rows.map(([key, value]) => `${labelize(key)}: ${value}`).join("\n")}${trackingText}`,
  });
}

export async function sendUserAcknowledgement({ to, name, subject, intro }) {
  if (!to) {
    return;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const safeName = name || "there";

  await getTransporter().sendMail({
    from,
    to,
    subject: subject || "Thank you for contacting Inkarp",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.6;">
        <h2 style="color:#BE0010;margin-bottom:8px;">Thank you for contacting Inkarp</h2>
        <p>Dear ${escapeHtml(safeName)},</p>
        <p>${escapeHtml(intro || "We have received your submission and our team will get back to you soon.")}</p>
        <p>Regards,<br/>Team Inkarp</p>
      </div>
    `,
  });
}

export async function sendCatalogueOtp({ to, name, otp, productName }) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const safeName = escapeHtml(name || "there");
  const safeProduct = escapeHtml(productName || "the requested product");

  await getTransporter().sendMail({
    from,
    to,
    subject: "Your Inkarp catalogue verification code",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.6;max-width:560px;">
        <h2 style="color:#BE0010;margin-bottom:8px;">Verify your catalogue download</h2>
        <p>Dear ${safeName},</p>
        <p>Use this one-time code to download the catalogue for <strong>${safeProduct}</strong>.</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:8px;margin:22px 0;color:#111;">${escapeHtml(otp)}</p>
        <p>This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p>
        <p>Regards,<br/>Team Inkarp</p>
      </div>
    `,
    text: `Dear ${name || "there"},\n\nYour Inkarp verification code is ${otp}. It expires in 10 minutes.\n\nRequested catalogue: ${productName || "Product catalogue"}\n\nTeam Inkarp`,
  });
}
