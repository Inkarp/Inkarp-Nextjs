import { getDb } from "@/lib/mongodb";
import { ensureInstitutionSeeds } from "@/lib/institutionStore";
import { isFinderOption } from "@/lib/finderOptionStore";
import { cacheFinderSession } from "@/lib/finderSessionFallback";
import { sendFormNotification } from "@/lib/mailer";
import {
  createFinderSessionId,
  FINDER_VERSION,
  finderLabels,
  findSeedInstitution,
  institutionIndustrySlug,
  recommendFinderProducts,
  sanitizeFinderAnswers,
  validateFinderAnswers,
} from "@/lib/solutionFinder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Which site-wide prompt started the session, so completions can be compared
// per placement. The full wizard page sends none.
const FINDER_PLACEMENTS = new Set(["stripe", "stripe-compact", "launcher", "product-page"]);

async function resolveInstitution(db, selected) {
  const databaseRecord = await db.collection("institutions").findOne(
    { id: selected.id, status: "approved" },
    { projection: { _id: 0 } }
  );
  return databaseRecord ?? findSeedInstitution(selected.id);
}

// Best-effort: a lead should never be lost over a flaky SMTP connection, so
// this is always called from inside its own try/catch at the call site.
async function notifyFinderLead(session) {
  await sendFormNotification({
    subject: `New Solution Finder lead: ${session.institution.name}`,
    fields: {
      sessionId: session.sessionId,
      institution: session.institution.name,
      city: session.institution.city,
      state: session.institution.state,
      role: session.labels.role,
      industry: session.labels.industry,
      objective: session.labels.objective,
      challenges: session.labels.challenges.join(", "),
      automation: session.labels.automation,
      timeline: session.labels.timeline,
      notes: session.answers.notes,
      contactEmail: session.contactEmail,
      sourcePage: session.sourcePage,
      placement: session.sourcePlacement || "wizard",
      resultUrl: session.resultUrl,
    },
    replyTo: session.contactEmail,
  });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const contactEmail = typeof body?.contactEmail === "string"
    ? body.contactEmail.trim().toLowerCase().slice(0, 254)
    : "";
  // Every finder report is a lead, so an email is required, not optional.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return Response.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
  }
  const sourcePlacement = FINDER_PLACEMENTS.has(body?.placement) ? body.placement : null;
  const answers = sanitizeFinderAnswers(body?.answers);
  // The compact home finder intentionally does not ask visitors to repeat an
  // industry answer we already know from their selected institution.
  if (!answers.industry) {
    const seedInstitution = findSeedInstitution(answers.institution?.id);
    if (seedInstitution) answers.industry = institutionIndustrySlug(seedInstitution);
  }
  const missing = validateFinderAnswers(answers).filter((field) => field !== "industry");
  if (missing.length) {
    return Response.json(
      { success: false, message: `Complete: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  let session;
  try {
    const db = await getDb();
    await ensureInstitutionSeeds(db);
    const [validRole, validObjective] = await Promise.all([
      isFinderOption(db, "role", answers.role),
      isFinderOption(db, "objective", answers.objective),
    ]);
    if (!validRole || !validObjective) {
      return Response.json({ success: false, message: "Select or add valid role and interest options." }, { status: 400 });
    }
    const institution = await resolveInstitution(db, answers.institution);
    if (!institution || institution.name !== answers.institution.name) {
      return Response.json({ success: false, message: "Select a valid institution." }, { status: 400 });
    }

    // Use an institution's known sector as a helpful default, never as an
    // override: multidisciplinary institutions can legitimately choose another.
    if (!answers.industry) answers.industry = institutionIndustrySlug(institution);
    if (!answers.industry) {
      return Response.json({ success: false, message: "We could not determine an industry for this institution." }, { status: 400 });
    }
    const recommendations = recommendFinderProducts(answers);
    const sessionId = createFinderSessionId();
    const now = new Date();
    session = {
      sessionId,
      version: FINDER_VERSION,
      status: "completed",
      answers,
      labels: finderLabels(answers),
      institution: {
        id: institution.id,
        name: institution.name,
        industry: institution.industry ?? "",
        city: institution.city ?? "",
        state: institution.state ?? "",
      },
      recommendations,
      sourcePage: typeof body?.sourcePage === "string" ? body.sourcePage.slice(0, 180) : "/solution-finder",
      sourcePlacement,
      resultUrl: `/solution-finder/results/${sessionId}`,
      recommendationVersion: FINDER_VERSION,
      contactEmail,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("solutionFinderSessions").insertOne(session);
    await db.collection("solutionFinderLeads").updateOne(
      { email: contactEmail },
      {
        $set: {
          email: contactEmail,
          institutionId: institution.id,
          institutionName: institution.name,
          role: answers.role,
          objective: answers.objective,
          industry: answers.industry,
          latestSessionId: sessionId,
          sourcePage: session.sourcePage,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
    await db.collection("finderEvents").insertOne({
      sessionId,
      event: "finder_completed",
      institutionId: institution.id,
      industry: answers.industry,
      objective: answers.objective,
      sourcePage: session.sourcePage,
      sourcePlacement,
      createdAt: now,
    });

    try {
      await notifyFinderLead(session);
    } catch (error) {
      console.error("[solution-finder] failed to send lead notification email:", error.message);
    }

    return Response.json({ success: true, sessionId, resultUrl: session.resultUrl });
  } catch (error) {
    console.error("[solution-finder] failed:", error.message);
    // The recommendation engine is local and can still produce a useful
    // report during a temporary database outage. Only use checked-in
    // institutions here; user-added records still require database validation.
    const institution = findSeedInstitution(answers.institution?.id);
    if (!institution || institution.name !== answers.institution?.name) {
      return Response.json(
        { success: false, message: "The report service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    if (!answers.industry) answers.industry = institutionIndustrySlug(institution);
    const sessionId = createFinderSessionId();
    const now = new Date();
    session = {
      sessionId,
      version: FINDER_VERSION,
      status: "completed",
      answers,
      labels: finderLabels(answers),
      institution: {
        id: institution.id,
        name: institution.name,
        industry: institution.industry ?? "",
        city: institution.city ?? "",
        state: institution.state ?? "",
      },
      recommendations: recommendFinderProducts(answers),
      sourcePage: typeof body?.sourcePage === "string" ? body.sourcePage.slice(0, 180) : "/solution-finder",
      sourcePlacement,
      resultUrl: `/solution-finder/results/${sessionId}`,
      recommendationVersion: FINDER_VERSION,
      contactEmail,
      temporary: true,
      createdAt: now,
      updatedAt: now,
    };
    cacheFinderSession(session);

    try {
      await notifyFinderLead(session);
    } catch (notifyError) {
      console.error("[solution-finder] failed to send lead notification email:", notifyError.message);
    }

    return Response.json({ success: true, temporary: true, sessionId, resultUrl: session.resultUrl });
  }
}
