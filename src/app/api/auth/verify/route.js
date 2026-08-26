import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, createSessionValue, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";
import { consumeLoginToken, upsertUser } from "@/lib/auth/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!authConfigured()) redirect("/signin?error=unavailable");

  const token = new URL(request.url).searchParams.get("token");
  if (!token) redirect("/signin?error=invalid");

  let email = null;
  try {
    email = await consumeLoginToken(token);
  } catch (error) {
    console.error("[auth] token lookup failed:", error.message);
    redirect("/signin?error=unavailable");
  }

  // Expired, already used, or never existed — one message for all three.
  if (!email) redirect("/signin?error=expired");

  try {
    await upsertUser(email);
  } catch (error) {
    console.error("[auth] could not record the user:", error.message);
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionValue(email), SESSION_COOKIE_OPTIONS);

  redirect("/account");
}
