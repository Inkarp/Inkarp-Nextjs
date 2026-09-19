import { getDb } from "@/lib/mongodb";
import { currentUserEmail } from "@/lib/auth/server";
import { ensureInstitutionSeeds } from "@/lib/institutionStore";
import { isFinderOption } from "@/lib/finderOptionStore";
import { cacheFinderSession } from "@/lib/finderSessionFallback";
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

async function resolveInstitution(db, selected) {
  const databaseRecord = await db.collection("institutions").findOne(
    { id: selected.id, status: "approved" },
    { projection: { _id: 0 } }
  );
  return databaseRecord ?? findSeedInstitution(selected.id);
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const answers = sanitizeFinderAnswers(body?.answers);
  const missing = validateFinderAnswers(answers);
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
    const recommendations = recommendFinderProducts(answers);
    const sessionId = createFinderSessionId();
    const accountEmail = await currentUserEmail();
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
      recommendationVersion: FINDER_VERSION,
      saved: Boolean(accountEmail),
      accountEmail: accountEmail ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("solutionFinderSessions").insertOne(session);
    await db.collection("finderEvents").insertOne({
      sessionId,
      event: "finder_completed",
      institutionId: institution.id,
      industry: answers.industry,
      objective: answers.objective,
      createdAt: now,
    });

    return Response.json({ success: true, sessionId, resultUrl: `/solution-finder/results/${sessionId}` });
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
      recommendationVersion: FINDER_VERSION,
      saved: false,
      accountEmail: null,
      temporary: true,
      createdAt: now,
      updatedAt: now,
    };
    cacheFinderSession(session);
    return Response.json({ success: true, temporary: true, sessionId, resultUrl: `/solution-finder/results/${sessionId}` });
  }
}
