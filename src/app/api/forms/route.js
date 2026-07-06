import { getDb } from "@/lib/mongodb";
import { sendFormNotification } from "@/lib/mailer";

const FORM_LABELS = {
  contact: "Contact form",
  service: "Service & installation request",
  "demo-booking": "Demo booking",
};

// Single endpoint for every site form (contact, service, product demo booking).
// Each submission is saved to MongoDB first, then a notification email is
// fired to MAIL_TO — a mail failure doesn't lose the lead, since it's already
// in the database by that point.
export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return Response.json({ success: false, message: "Invalid submission" }, { status: 400 });
  }

  const { formType = "contact", ...fields } = body;

  const submission = {
    formType,
    ...fields,
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
    });
  } catch (error) {
    console.error("[forms] failed to send notification email:", error.message);
  }

  return Response.json({ success: true });
}
