import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { currentUserEmail } from "@/lib/auth/server";
import { getUser } from "@/lib/auth/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Who is signed in, for the header and any client component that needs it. */
export async function GET() {
  const email = await currentUserEmail();
  if (!email) return Response.json({ signedIn: false });

  let user = null;
  try {
    user = await getUser(email);
  } catch {
    // The session is still valid even if the profile lookup fails.
  }

  return Response.json({ signedIn: true, user: user ?? { email } });
}

/** Sign out. */
export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  return Response.json({ success: true });
}
