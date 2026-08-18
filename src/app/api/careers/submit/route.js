import { after } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendFormNotification, sendUserAcknowledgement } from "@/lib/mailer";
import { TRACKING_FIELD_KEYS, normalizeTracking } from "@/lib/serverTracking";

export const runtime = "nodejs";

const REQUIRED_FIELDS = ["name", "email", "phone", "role", "location", "department"];
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
// Kept in sync with CareersForm. 4MB rather than 5: serverless hosts cap
// request bodies at ~4.5MB, so anything larger 413s before reaching this route.
const MAX_FILE_SIZE = 4 * 1024 * 1024;

function extensionOf(filename = "") {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
}

function fieldValue(formData, key) {
  return String(formData.get(key) || "").trim();
}

async function sendCareerEmails({ fields, submission, tracking, resume, resumeBuffer }) {
  let notificationSent = false;

  try {
    await sendFormNotification({
      subject: `New Career Application: ${fields.role}`,
      fields: submission,
      tracking,
      replyTo: fields.email,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
          contentType: resume.type,
        },
      ],
    });
    notificationSent = true;
  } catch (error) {
    console.error("[careers] failed to send notification email:", error.message);
  }

  try {
    await sendUserAcknowledgement({
      to: fields.email,
      name: fields.name,
      subject: "Thank you for applying to Inkarp",
      intro: `We have received your application for the ${fields.role} position at Inkarp. Our team will review it and get back to you soon.`,
    });
  } catch (error) {
    console.error("[careers] failed to send acknowledgement email:", error.message);
  }

  return notificationSent;
}

export async function POST(request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return Response.json({ success: false, message: "Invalid application" }, { status: 400 });
  }

  const fields = Object.fromEntries(
    REQUIRED_FIELDS.concat("message").map((key) => [key, fieldValue(formData, key)])
  );
  const missing = REQUIRED_FIELDS.filter((key) => !fields[key]);

  if (missing.length) {
    return Response.json(
      { success: false, message: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const resume = formData.get("resume");

  if (!resume || typeof resume === "string" || !resume.name) {
    return Response.json({ success: false, message: "Resume file is required" }, { status: 400 });
  }

  const extension = extensionOf(resume.name);
  if (!ALLOWED_EXTENSIONS.has(extension) || !ALLOWED_TYPES.has(resume.type)) {
    return Response.json(
      { success: false, message: "Only PDF or Word documents (PDF/DOC/DOCX) are allowed" },
      { status: 400 }
    );
  }

  if (resume.size > MAX_FILE_SIZE) {
    return Response.json({ success: false, message: "File size should be less than 4MB" }, { status: 400 });
  }

  const rawTracking = Object.fromEntries(TRACKING_FIELD_KEYS.map((key) => [key, fieldValue(formData, key)]));
  const tracking = normalizeTracking(rawTracking, request);
  const submission = {
    formType: "career",
    formLabel: "Career application",
    ...fields,
    resumeName: resume.name,
    resumeType: resume.type,
    resumeSize: resume.size,
    tracking,
    submittedAt: new Date(),
  };

  let saved = false;

  try {
    const db = await getDb();
    await db.collection("careerApplications").insertOne(submission);
    saved = true;
  } catch (error) {
    console.error("[careers] failed to save application:", error.message);
  }

  const resumeBuffer = Buffer.from(await resume.arrayBuffer());

  if (!saved) {
    const notificationSent = await sendCareerEmails({
      fields,
      submission,
      tracking,
      resume,
      resumeBuffer,
    });

    if (!notificationSent) {
      return Response.json(
        { success: false, message: "Could not submit your application. Please try again shortly." },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, saved, notificationSent, message: "Application submitted successfully" },
      { status: 201 }
    );
  }

  after(() =>
    sendCareerEmails({
      fields,
      submission,
      tracking,
      resume,
      resumeBuffer,
    })
  );

  return Response.json({ success: true, saved, message: "Application submitted successfully" }, { status: 201 });
}
