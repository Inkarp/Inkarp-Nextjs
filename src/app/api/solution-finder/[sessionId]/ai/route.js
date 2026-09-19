import { getDb } from "@/lib/mongodb";
import { buildFinderFallbackGuidance, generateFinderGuidance } from "@/lib/solutionFinderAi";
import { getCachedFinderSession, updateCachedFinderSession } from "@/lib/finderSessionFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request, { params }) {
  const { sessionId } = await params;
  if (!/^[A-Za-z0-9_-]{12,40}$/.test(sessionId)) {
    return Response.json({ success: false, message: "Invalid report." }, { status: 400 });
  }
  let session = null;
  try {
    const db = await getDb();
    session = await db.collection("solutionFinderSessions").findOne({ sessionId });
    if (!session) return Response.json({ success: false, message: "Report not found." }, { status: 404 });
    if (session.aiGuidance?.summary) {
      return Response.json({ success: true, cached: true, guidance: session.aiGuidance });
    }

    const guidance = await generateFinderGuidance(session);
    const savedGuidance = { ...guidance, generatedAt: new Date() };
    await db.collection("solutionFinderSessions").updateOne(
      { sessionId, aiGuidance: { $exists: false } },
      { $set: { aiGuidance: savedGuidance, updatedAt: new Date() } }
    );
    return Response.json({ success: true, cached: false, guidance: savedGuidance });
  } catch (error) {
    console.error("[solution-finder-ai] failed:", error.message);
    session ??= getCachedFinderSession(sessionId);
    const guidance = buildFinderFallbackGuidance(session);
    if (session) updateCachedFinderSession(sessionId, { aiGuidance: guidance });
    return Response.json({
      success: true,
      cached: false,
      fallback: true,
      guidance,
    });
  }
}
