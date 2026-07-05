import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in the browser (client components).
 * Uses the anonymous key which is safe for public use.
 *
 * @example
 * ```ts
 * const supabase = createClient()
 * const { data } = await supabase.from("appointments").select("*")
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
