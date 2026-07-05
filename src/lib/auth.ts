import { createClient } from "@/lib/supabase/server";
import { redirect, unauthorized } from "next/navigation";
import { jwtVerify } from "jose";
import type { User } from "@supabase/supabase-js";
import type { MemberRole } from "@/lib/constants";

/**
 * Retrieves the current user's session from the server.
 *
 * @returns The session object, or `null` if no session exists.
 *
 * @example
 * ```ts
 * const session = await getSession()
 * if (session) { /* user is authenticated *\/ }
 * ```
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Retrieves the currently authenticated user.
 *
 * Calls `getUser()` which verifies the JWT — more secure than relying
 * solely on session data.
 *
 * @returns The user object, or `null` if not authenticated.
 *
 * @example
 * ```ts
 * const user = await getUser()
 * if (user) { /* do something *\/ }
 * ```
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Retrieves the current user or redirects to the login page.
 *
 * Uses `unauthorized()` from Next.js navigation (requires
 * `authInterrupts` enabled in `next.config.ts`).
 *
 * @returns The authenticated user (guaranteed).
 *
 * @example
 * ```ts
 * const user = await getUserOrRedirect()
 * // user is guaranteed to exist here
 * ```
 */
export async function getUserOrRedirect(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Next.js 16 — triggers auth interruption if enabled
    unauthorized();
  }

  return user!;
}

/**
 * Retrieves the current user's clinic ID.
 *
 * First checks `app_metadata.clinic_id` (set at login/registration),
 * then falls back to querying the `clinic_members` table.
 *
 * @returns The clinic ID string, or `null` if the user is not
 *          associated with any clinic.
 *
 * @example
 * ```ts
 * const clinicId = await getClinicId()
 * if (!clinicId) { /* user has no clinic *\/ }
 * ```
 */
export async function getClinicId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Priority 1: Check app_metadata (fast, no DB query)
  const clinicIdFromMetadata = user.app_metadata?.clinic_id as
    | string
    | undefined;
  if (clinicIdFromMetadata) return clinicIdFromMetadata;

  // Priority 2: Query clinic_members table (fallback)
  const { data } = await supabase
    .from("clinic_members")
    .select("clinic_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.clinic_id ?? null;
}

/**
 * Gets the current user's role within their clinic.
 *
 * @returns The member role, or `null` if not associated with a clinic.
 *
 * @example
 * ```ts
 * const role = await getUserRole()
 * if (role === 'admin') { /* has admin access *\/ }
 * ```
 */
export async function getUserRole(): Promise<MemberRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("clinic_members")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data?.role as MemberRole) ?? null;
}

/**
 * Verifies a JWT token using the `jose` library.
 * Useful for validating public tokens (quotes, patient portal).
 *
 * @param token - The JWT string to verify.
 * @param secret - The secret key used to sign the token.
 * @returns The decoded payload if valid, or `null` if invalid/expired.
 *
 * @example
 * ```ts
 * const payload = await verifyToken(someToken, process.env.JWT_SECRET!)
 * if (payload?.sub) { /* token is valid *\/ }
 * ```
 */
export async function verifyToken<T = Record<string, unknown>>(
  token: string,
  secret: string,
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload as T;
  } catch {
    return null;
  }
}
