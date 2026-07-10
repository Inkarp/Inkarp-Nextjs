import { getDb } from "@/lib/mongodb";
import { sendFormNotification, sendUserAcknowledgement } from "@/lib/mailer";

export const runtime = "nodejs";

const REQUIRED_FIELDS = ["name", "email", "phone", "role", "location", "department"];
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getClientIp(request) {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.headers.get("x-real-ip") || "Not available";
}

function getDeviceInfo(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
  return {
    deviceType: isMobile ? "Mobile / Tablet" : "Desktop / Laptop",
    userAgent,
  };
}

function extensionOf(filename = "") {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
}

function fieldValue(formData, key) {
  return String(formData.get(key) || "").trim();
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
    return Response.json({ success: false, message: "File size should be less than 5MB" }, { status: 400 });
  }

  const { deviceType, userAgent } = getDeviceInfo(request);
  const submission = {
    formType: "career",
    formLabel: "Career application",
    ...fields,
    resumeName: resume.name,
    resumeType: resume.type,
    resumeSize: resume.size,
    clientIp: getClientIp(request),
    deviceType,
    userAgent,
    submittedAt: new Date(),
  };

  try {
    const db = await getDb();
    await db.collection("careerApplications").insertOne(submission);
  } catch (error) {
    console.error("[careers] failed to save application:", error.message);
    return Response.json(
      { success: false, message: "Could not save your application. Please try again shortly." },
      { status: 500 }
    );
  }

  try {
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    await sendFormNotification({
      subject: `New Career Application: ${fields.role}`,
      fields: submission,
      replyTo: fields.email,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
          contentType: resume.type,
        },
      ],
    });
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

  return Response.json({ success: true, message: "Application submitted successfully" }, { status: 201 });
}