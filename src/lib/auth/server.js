import { cookies } from "next/headers";
import { readSessionValue, SESSION_COOKIE } from "./session";

/**
 * The signed-in address, or null. Reads the cookie only — no database call — so
 * it is cheap enough for any server component to use.
 */
export async function currentUserEmail() {
  try {
    const jar = await cookies();
    const raw = jar.get(SESSION_COOKIE)?.value;
    return raw ? readSessionValue(raw)?.email ?? null : null;
  } catch {
    return null;
  }
}
