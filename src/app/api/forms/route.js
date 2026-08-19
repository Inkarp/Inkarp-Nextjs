import { getDb } from "@/lib/mongodb";
import { sendFormNotification, sendUserAcknowledgement } from "@/lib/mailer";
import { normalizeTracking, omitTrackingFields } from "@/lib/serverTracking";
import { PRODUCT_ENQUIRY_FIELDS, validateProductEnquiry } from "@/lib/formValidation";

// Product-page "pick something, then send it to Inkarp" tools. They all
// share the same required fields (name/email/configuration) and all route
// to info@inkarp.co.in, so they're declared together rather than repeated
// across the three maps below.
const PRODUCT_TOOL_LABELS = {
  "setup-configurator": "Setup configurator submission",
  "scenario-picker": "Scenario planner submission",
  "readiness-checklist": "Installation readiness checklist",
  "workflow-score": "Workflow score submission",
  "suitability-check": "Suitability checker submission",
  "fit-quiz": "Fit quiz submission",
  "config-wizard": "Configuration wizard submission",
  "roi-calculator": "ROI calculator submission",
  "solvent-calculator": "Solvent recovery calculator submission",
  "throughput-calculator": "Screening throughput calculator submission",
};

const FORM_LABELS = {
  contact: "Contact form",
  service: "Service & installation request",
  "demo-booking": "Product quote request",
  webinar: "Webinar registration",
  catalyst: "CATALYSTCue physical copy request",
  feedback: "Product profile feedback",
  "blog-comment": "Blog comment",
  "product-search-no-results": "Product search no-result request",
  ...PRODUCT_TOOL_LABELS,
};

const REQUIRED_FIELDS = {
  contact: ["name", "email", "phone", "inquiryType"],
  service: ["customerName", "companyName", "contactNumber", "serialNumber", "instrumentName", "warranty", "department"],
  webinar: ["name", "email", "contact"],
  catalyst: ["name", "email", "institutionName", "mobileNumber"],
  feedback: ["name", "email", "interests"],
  "blog-comment": ["name", "email", "message"],
  "product-search-no-results": ["searchQuery", "name", "email", "phone"],
  ...Object.fromEntries(
    Object.keys(PRODUCT_TOOL_LABELS).map((formType) => [formType, ["name", "email", "configuration"]])
  ),
  // The product enquiry form collects a full set of buyer details.
  "demo-booking": PRODUCT_ENQUIRY_FIELDS,
};

const FORM_RECIPIENTS = {
  "product-search-no-results": "info@inkarp.co.in",
  ...Object.fromEntries(Object.keys(PRODUCT_TOOL_LABELS).map((formType) => [formType, "info@inkarp.co.in"])),
};

function validate(formType, fields) {
  const required = REQUIRED_FIELDS[formType] || [];
  const missing = required.filter((field) => !String(fields[field] ?? "").trim());
  return missing;
}

function acknowledgementFor(formType) {
  switch (formType) {
    case "contact":
      return "Thank you for contacting Inkarp. We have received your enquiry and our team will get back to you shortly.";
    case "webinar":
      return "We have received your webinar registration. Our team will share the joining information with you soon.";
    case "catalyst":
      return "We have received your request for a CATALYSTCue physical copy. Our team will contact you for delivery confirmation.";
    case "feedback":
      return "We have received your feedback. Thank you for sharing your interests with us.";
    case "blog-comment":
      return "We have received your blog comment submission. Thank you for engaging with Inkarp.";
    case "product-search-no-results":
      return "We have received your product search request. Our team will check the query and get back to you with suitable options.";
    case "service":
      return "We have received your service request. Our service team will contact you shortly.";
    case "setup-configurator":
      return "We have received your setup configuration. Our team will review it and get back to you with a complete quotation.";
    case "scenario-picker":
      return "We have received the scenario you selected. Our team will review it and get back to you with guidance.";
    case "readiness-checklist":
      return "We have received your installation readiness checklist. Our team will confirm what still needs to be arranged.";
    case "workflow-score":
      return "We have received your workflow score submission. Our team will get back to you on how to simplify the steps you selected.";
    case "suitability-check":
      return "We have received your suitability check results. Our team will confirm the best fit for your workflow.";
    case "fit-quiz":
      return "We have received your quiz results. Our team will confirm the best configuration for your workflow.";
    case "config-wizard":
      return "We have received your configuration. Our team will confirm availability and pricing.";
    case "roi-calculator":
      return "We have received your ROI estimate. Our team will follow up with a tailored quote.";
    case "throughput-calculator":
      return "Thanks for sending your screening throughput numbers. An Inkarp specialist will confirm the right configuration for that workload.";
    case "solvent-calculator":
      return "We have received your solvent recovery estimate. Our team will follow up with a tailored quote.";
    case "demo-booking":
      return "We have received your quote request. Our team will get back to you with pricing and availability shortly.";
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

  // Re-run the product enquiry rules here; the browser checks are a
  // convenience, not a guarantee.
  if (formType === "demo-booking") {
    const errors = validateProductEnquiry(fields);
    if (Object.keys(errors).length) {
      return Response.json(
        { success: false, message: "Please correct the highlighted fields.", errors },
        { status: 400 }
      );
    }
  }

  const tracking = normalizeTracking(fields, request);
  const submission = {
    formType,
    formLabel: FORM_LABELS[formType] ?? formType,
    ...omitTrackingFields(fields),
    tracking,
    submittedAt: new Date(),
  };

  let saved = false;
  let notificationSent = false;

  try {
    const db = await getDb();
    await db.collection("formSubmissions").insertOne(submission);
    saved = true;
  } catch (error) {
    console.error("[forms] failed to save submission:", error.message);
  }

  try {
    await sendFormNotification({
      subject: `New ${FORM_LABELS[formType] ?? formType} submission`,
      fields: submission,
      tracking,
      replyTo: fields.email,
      to: FORM_RECIPIENTS[formType],
    });
    notificationSent = true;
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

  if (!saved && !notificationSent) {
    return Response.json(
      { success: false, message: "Could not submit your request. Please try again shortly." },
      { status: 500 }
    );
  }

  return Response.json({ success: true, saved, notificationSent });
}
