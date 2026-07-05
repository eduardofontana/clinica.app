import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Updates the session by refreshing the auth cookie on every request.
 *
 * Use this in your `proxy.ts` file (Next.js 16 replaces `middleware.ts`
 * with `proxy.ts`).
 *
 * @example
 * ```ts
 * // src/proxy.ts
 * import { updateSession } from "@/lib/supabase/middleware"
 * import type { NextRequest } from "next/server"
 *
 * export async function proxy(request: NextRequest) {
 *   return await updateSession(request)
 * }
 * ```
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh the session — do NOT remove this call
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Protected route handling ──────────────────────────────────────────
  const isAppRoute = request.nextUrl.pathname.startsWith("/app");

  if (isAppRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // ─── Auth route redirect (already logged in) ───────────────────────────
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
