import { currentUserEmail } from "@/lib/auth/server";
import { getSavedBasket, saveBasket } from "@/lib/auth/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The basket saved against this account, so it follows them between devices. */
export async function GET() {
  const email = await currentUserEmail();
  if (!email) return Response.json({ signedIn: false, items: [] });

  try {
    return Response.json({ items: await getSavedBasket(email), signedIn: true });
  } catch (error) {
    console.error("[basket] read failed:", error.message);
    return Response.json({ items: [], signedIn: true });
  }
}

export async function PUT(request) {
  const email = await currentUserEmail();
  if (!email) return Response.json({ signedIn: false }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.items)) {
    return Response.json({ success: false, message: "Expected an items array." }, { status: 400 });
  }

  try {
    return Response.json({ items: await saveBasket(email, body.items), success: true });
  } catch (error) {
    console.error("[basket] save failed:", error.message);
    // The browser copy is still intact, so this is not fatal for the visitor.
    return Response.json({ success: false, message: "Could not save your list." }, { status: 500 });
  }
}
