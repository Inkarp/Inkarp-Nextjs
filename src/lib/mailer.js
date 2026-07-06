import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "SMTP_HOST/SMTP_USER/SMTP_PASS are not set — add them to .env before submitting forms."
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

function renderRow([key, value]) {
  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#444;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 12px;color:#111;">${String(value ?? "").replace(/</g, "&lt;")}</td></tr>`;
}

// Sends a plain notification email listing every submitted field, so nothing
// needs custom templating per form — new fields just show up as new rows.
export async function sendFormNotification({ subject, fields }) {
  const to = process.env.MAIL_TO || "sharath@inkarp.co.in";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const rows = Object.entries(fields).filter(([, value]) => value !== undefined && value !== "");

  await getTransporter().sendMail({
    from,
    to,
    subject,
    html: `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">${rows.map(renderRow).join("")}</table>`,
  });
}
