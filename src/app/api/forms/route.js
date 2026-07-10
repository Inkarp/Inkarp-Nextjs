import { getDb } from "@/lib/mongodb";
import { sendFormNotification, sendUserAcknowledgement } from "@/lib/mailer";

const FORM_LABELS = {
  contact: "Contact form",
  service: "Service & installation request",
  "demo-booking": "Product demo booking",
  webinar: "Webinar registration",
  catalyst: "CATALYSTCue physical copy request",
  feedback: "Product profile feedback",
  "blog-comment": "Blog comment",
};

const REQUIRED_FIELDS = {
  contact: ["name", "email", "phone", "inquiryType"],
  service: ["customerName", "companyName", "contactNumber", "serialNumber", "instrumentName", "warranty", "department"],
  webinar: ["name", "email", "contact"],
  catalyst: ["name", "email", "institutionName", "mobileNumber"],
  feedback: ["name", "email", "interests"],
  "blog-comment": ["name", "email", "message"],
};

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

function validate(formType, fields) {
  const required = REQUIRED_FIELDS[formType] || [];
  const missing = required.filter((field) => !String(fields[field] ?? "").trim());
  return missing;
}

function acknowledgementFor(formType) {
  switch (formType) {
    case "webinar":
      return "We have received your webinar registration. Our team will share the joining information with you soon.";
    case "catalyst":
      return "We have received your request for a CATALYSTCue physical copy. Our team will contact you for delivery confirmation.";
    case "feedback":
      return "We have received your feedback. Thank you for sharing your interests with us.";
    case "blog-comment":
      return "We have received your blog comment submission. Thank you for engaging with Inkarp.";
    case "service":
      return "We have received your service request. Our service team will contact you shortly.";
    default:
      return "We have received your enquiry and our team will get back to you soon.";
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return Response.json({ success: false, message: "Invalid submission" }, { status: 400 });
  }

  const { formType = "contact", ...fields } = body;
  const missing = validate(formType, fields);

  if (missing.length) {
    return Response.json(
      { success: false, message: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const { deviceType, userAgent } = getDeviceInfo(request);
  const submission = {
    formType,
    formLabel: FORM_LABELS[formType] ?? formType,
    ...fields,
    clientIp: getClientIp(request),
    deviceType,
    userAgent,
    submittedAt: new Date(),
  };

  try {
    const db = await getDb();
    await db.collection("formSubmissions").insertOne(submission);
  } catch (error) {
    console.error("[forms] failed to save submission:", error.message);
    return Response.json(
      { success: false, message: "Could not save your submission. Please try again shortly." },
      { status: 500 }
    );
  }

  try {
    await sendFormNotification({
      subject: `New ${FORM_LABELS[formType] ?? formType} submission`,
      fields: submission,
      replyTo: fields.email,
    });
  } catch (error) {
    console.error("[forms] failed to send notification email:", error.message);
  }

  try {
    await sendUserAcknowledgement({
      to: fields.email,
      name: fields.name || fields.customerName,
      intro: acknowledgementFor(formType),
    });
  } catch (error) {
    console.error("[forms] failed to send acknowledgement email:", error.message);
  }

  return Response.json({ success: true });
}