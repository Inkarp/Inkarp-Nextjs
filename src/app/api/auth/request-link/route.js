import { sendUserAcknowledgement } from "@/lib/mailer";
import { authConfigured, createLoginToken, isValidEmail, normaliseEmail, TOKEN_TTL_MINUTES } from "@/lib/auth/session";
import { recentTokenCount, saveLoginToken } from "@/lib/auth/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LINKS_PER_HOUR = 5;

function siteUrl(request) {
  return process.env.SITE_URL || new URL(request.url).origin;
}

export async function POST(request) {
  if (!authConfigured()) {
    return Response.json(
      { success: false, message: "Sign-in is not available right now." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = normaliseEmail(body?.email);

  if (!isValidEmail(email)) {
    return Response.json(
      { success: false, message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  // Never reveal whether an address is already registered — the reply below is
  // identical whether the email is new, known, or rate limited.
  const sent = { success: true, message: "Check your inbox for the sign-in link." };

  try {
    if ((await recentTokenCount(email)) >= MAX_LINKS_PER_HOUR) return Response.json(sent);

    const { token, tokenHash } = createLoginToken();
    await saveLoginToken({
      email,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      tokenHash,
    });

    const link = `${siteUrl(request)}/api/auth/verify?token=${encodeURIComponent(token)}`;
    await sendUserAcknowledgement({
      intro:
        `Click the button below to sign in to your Inkarp account. ` +
        `The link works once and expires in ${TOKEN_TTL_MINUTES} minutes.\n\n${link}\n\n` +
        `If you did not request this, you can ignore this email.`,
      subject: "Your Inkarp sign-in link",
      to: email,
    });
  } catch (error) {
    console.error("[auth] could not send sign-in link:", error.message);
    return Response.json(
      { success: false, message: "We could not send the email. Please try again shortly." },
      { status: 500 }
    );
  }

  return Response.json(sent);
}
