import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side usage (Server Components,
 * Server Actions, Route Handlers).
 *
 * Uses the anonymous key with the user's session cookies so that
 * Row Level Security policies are applied correctly.
 *
 * @example
 * ```ts
 * const supabase = await createClient()
 * const { data } = await supabase.from("appointments").select("*")
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — can be safely ignored.
          }
        },
      },
    },
  );
}

/**
 * Creates a Supabase admin client that uses the service_role key.
 *
 * This client **bypasses Row Level Security** and should ONLY be used
 * in trusted server-side contexts:
 * - Server Actions with authorization checks
 * - Route Handlers with authentication verification
 * - Database seed scripts and migrations
 *
 * NEVER expose this client or its results to the client-side.
 *
 * @example
 * ```ts
 * const supabase = await createAdminClient()
 * const { data } = await supabase.from("clinics").select("*")
 * ```
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — can be safely ignored.
          }
        },
      },
    },
  );
}
