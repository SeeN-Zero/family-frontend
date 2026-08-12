import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "./auth-keys";

/**
 * Server-side authentication check.
 * Returns true only if a session token cookie is present.
 */
export async function isAuthenticatedServer(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get(AUTH_TOKEN_COOKIE)?.value);
  } catch {
    return false;
  }
}