import { currentUserEmail } from "@/lib/auth/server";
import { getQuoteHistory, getUser, updateProfile } from "@/lib/auth/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const email = await currentUserEmail();
  if (!email) return Response.json({ signedIn: false }, { status: 401 });

  try {
    const [user, quotes] = await Promise.all([getUser(email), getQuoteHistory(email)]);
    return Response.json({ quotes, signedIn: true, user: user ?? { email } });
  } catch (error) {
    console.error("[account] load failed:", error.message);
    return Response.json({ quotes: [], signedIn: true, user: { email } });
  }
}

export async function PUT(request) {
  const email = await currentUserEmail();
  if (!email) return Response.json({ signedIn: false }, { status: 401 });

  const body = await request.json().catch(() => null);
  try {
    return Response.json({ success: true, user: await updateProfile(email, body) });
  } catch (error) {
    console.error("[account] profile save failed:", error.message);
    return Response.json({ success: false }, { status: 500 });
  }
}
