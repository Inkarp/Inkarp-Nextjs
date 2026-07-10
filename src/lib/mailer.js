import nodemailer from "nodemailer";

let transporter;

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

function renderRow([key, value]) {
  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#444;white-space:nowrap;vertical-align:top;border:1px solid #e6e6e6;background:#fafafa;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111;border:1px solid #e6e6e6;white-space:pre-wrap;">${escapeHtml(value ?? "")}</td></tr>`;
}

export async function sendFormNotification({ subject, fields, to, replyTo, attachments = [] }) {
  const recipients = to || process.env.MAIL_TO || "sharath@inkarp.co.in";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const rows = Object.entries(fields).filter(([, value]) => value !== undefined && value !== "");

  await getTransporter().sendMail({
    from,
    to: recipients,
    replyTo,
    subject,
    attachments,
    html: `<table style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;width:100%;max-width:760px;">${rows.map(renderRow).join("")}</table>`,
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