import { getDb } from "@/lib/mongodb";
import { sendFormNotification, sendUserAcknowledgement } from "@/lib/mailer";
import { recommendFinderProducts, sanitizeFinderAnswers, validateFinderAnswers, finderLabels } from "@/lib/solutionFinder";
import { getCachedFinderSession } from "@/lib/finderSessionFallback";
import { SITE_URL } from "@/data/pageSeo";
import { siteConfig } from "@/data/siteConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Anyone holding a report link can ask for it by email, so cap how many times
// one report can be sent to stop it being used to mail arbitrary addresses.
const MAX_REPORT_EMAILS = 3;

function validSessionId(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{12,40}$/.test(value);
}

/**
 * "Email me this report": records the address as a lead, sends it the report
 * link, and tells sales. Sessions from before email was required get the
 * address as their contact email.
 */
async function emailReport({ db, existing, request, sessionId, email }) {
  if ((existing.reportEmailsSent ?? 0) >= MAX_REPORT_EMAILS) {
    return Response.json(
      { success: false, message: `This report has already been emailed a few times. Write to ${siteConfig.contact.email} and we will help.` },
      { status: 429 }
    );
  }

  const now = new Date();
  const sessions = db.collection("solutionFinderSessions");
  await sessions.updateOne(
    { sessionId },
    { $set: { updatedAt: now, ...(existing.contactEmail ? {} : { contactEmail: email }) } }
  );
  await db.collection("solutionFinderLeads").updateOne(
    { email },
    {
      $set: {
        email,
        institutionId: existing.institution?.id,
        institutionName: existing.institution?.name,
        role: existing.answers?.role,
        objective: existing.answers?.objective,
        industry: existing.answers?.industry,
        latestSessionId: sessionId,
        sourcePage: existing.sourcePage,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  // Production links must point at the public site, not whatever host the
  // request arrived on behind the proxy.
  const origin = process.env.NODE_ENV === "production" ? SITE_URL : new URL(request.url).origin;
  const reportUrl = `${origin}${existing.resultUrl}`;

  try {
    await sendUserAcknowledgement({
      to: email,
      subject: "Your Inkarp solution report",
      intro:
        `Here is the solution report for ${existing.institution?.name ?? "your laboratory"}: ${reportUrl}\n\n` +
        `For help confirming technical fit, configuration or pricing, write to ${siteConfig.contact.email} ` +
        `or call ${siteConfig.contact.phone}.`,
    });
  } catch (error) {
    console.error("[solution-finder-session] report email failed:", error.message);
    return Response.json(
      { success: false, message: "We could not send the email. Please try again shortly." },
      { status: 502 }
    );
  }

  await sessions.updateOne({ sessionId }, { $inc: { reportEmailsSent: 1 } });
  await db.collection("finderEvents").insertOne({
    sessionId,
    event: "report_emailed",
    institutionId: existing.institution?.id,
    createdAt: now,
  });

  try {
    await sendFormNotification({
      subject: `Solution Finder report emailed: ${existing.institution?.name ?? sessionId}`,
      fields: {
        sessionId,
        institution: existing.institution?.name,
        role: existing.labels?.role,
        objective: existing.labels?.objective,
        email,
        sourcePage: existing.sourcePage,
        resultUrl: reportUrl,
      },
      replyTo: email,
    });
  } catch (error) {
    // The visitor already has their report; a missed sales alert is not their problem.
    console.error("[solution-finder-session] sales notification failed:", error.message);
  }

  return Response.json({ success: true });
}

export async function GET(_request, { params }) {
  const { sessionId } = await params;
  if (!validSessionId(sessionId)) return Response.json({ success: false }, { status: 400 });
  try {
    const db = await getDb();
    // accountEmail is no longer written, but sessions saved while sign-in existed still carry it.
    const session = await db.collection("solutionFinderSessions").findOne(
      { sessionId },
      { projection: { _id: 0, accountEmail: 0, contactEmail: 0 } }
    );
    if (!session) return Response.json({ success: false }, { status: 404 });
    return Response.json({ success: true, session });
  } catch {
    const session = getCachedFinderSession(sessionId);
    return session
      ? Response.json({ success: true, temporary: true, session })
      : Response.json({ success: false }, { status: 503 });
  }
}

export async function PATCH(request, { params }) {
  const { sessionId } = await params;
  if (!validSessionId(sessionId)) return Response.json({ success: false }, { status: 400 });
  const body = await request.json().catch(() => null);

  try {
    const db = await getDb();
    const existing = await db.collection("solutionFinderSessions").findOne({ sessionId });
    if (!existing) return Response.json({ success: false }, { status: 404 });

    if (body?.action === "email-report") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
      }
      return await emailReport({ db, email, existing, request, sessionId });
    }

    if (body?.action === "update-answers") {
      const answers = sanitizeFinderAnswers({ ...existing.answers, ...body.answers, institution: existing.answers.institution });
      if (validateFinderAnswers(answers).length) return Response.json({ success: false }, { status: 400 });
      const recommendations = recommendFinderProducts(answers);
      await db.collection("solutionFinderSessions").updateOne(
        { sessionId },
        { $set: { answers, labels: finderLabels(answers), recommendations, updatedAt: new Date() } }
      );
      return Response.json({ success: true });
    }

    return Response.json({ success: false, message: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("[solution-finder-session] failed:", error.message);
    return Response.json({ success: false }, { status: 500 });
  }
}
