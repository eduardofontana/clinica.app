import { createClient } from "@/lib/supabase/server";
import { unauthorized } from "next/navigation";
import { jwtVerify } from "jose";
import type { User } from "@supabase/supabase-js";
import type { MemberRole } from "@/lib/constants";

/**
 * Retrieves the current user's session from the server.
 *
 * @returns The session object, or `null` if no session exists.
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
 */
export async function getUserOrRedirect(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    unauthorized();
  }

  return user!;
}

/**
 * Retrieves the current user's clinic ID.
 */
export async function getClinicId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const clinicIdFromMetadata = user.app_metadata?.clinic_id as
    | string
    | undefined;
  if (clinicIdFromMetadata) return clinicIdFromMetadata;

  const { data } = await supabase
    .from("clinic_members")
    .select("clinic_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.clinic_id ?? null;
}

/**
 * Gets the current user's role within their clinic.
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
 * Combined helper: returns user + clinicId + role in one call,
 * sharing a single Supabase client instance.
 */
export async function getUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, clinicId: null, role: null };

  const clinicIdFromMetadata = user.app_metadata?.clinic_id as
    | string
    | undefined;

  let clinicId: string | null = clinicIdFromMetadata ?? null;
  let role: MemberRole | null = null;

  if (!clinicId) {
    const { data: memberData } = await supabase
      .from("clinic_members")
      .select("clinic_id, role")
      .eq("user_id", user.id)
      .maybeSingle();
    clinicId = memberData?.clinic_id ?? null;
    role = (memberData?.role as MemberRole) ?? null;
  } else {
    const { data: roleData } = await supabase
      .from("clinic_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("clinic_id", clinicId)
      .maybeSingle();
    role = (roleData?.role as MemberRole) ?? null;
  }

  return { user, clinicId, role };
}

/**
 * Verifies a JWT token using the `jose` library.
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
