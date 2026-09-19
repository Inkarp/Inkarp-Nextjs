import { getDb } from "@/lib/mongodb";
import { currentUserEmail } from "@/lib/auth/server";
import { recommendFinderProducts, sanitizeFinderAnswers, validateFinderAnswers, finderLabels } from "@/lib/solutionFinder";
import { getCachedFinderSession } from "@/lib/finderSessionFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validSessionId(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{12,40}$/.test(value);
}

export async function GET(_request, { params }) {
  const { sessionId } = await params;
  if (!validSessionId(sessionId)) return Response.json({ success: false }, { status: 400 });
  try {
    const db = await getDb();
    const session = await db.collection("solutionFinderSessions").findOne(
      { sessionId },
      { projection: { _id: 0, accountEmail: 0 } }
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
  const email = await currentUserEmail();

  try {
    const db = await getDb();
    const existing = await db.collection("solutionFinderSessions").findOne({ sessionId });
    if (!existing) return Response.json({ success: false }, { status: 404 });

    if (body?.action === "save") {
      if (!email) return Response.json({ success: false, signInRequired: true }, { status: 401 });
      await db.collection("solutionFinderSessions").updateOne(
        { sessionId },
        { $set: { saved: true, accountEmail: email, updatedAt: new Date() } }
      );
      return Response.json({ success: true, saved: true });
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
