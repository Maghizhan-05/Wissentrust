import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client bound to the request's cookies. Use this in
 * Server Components, Server Actions and Route Handlers. Runs as the signed-in
 * user, so RLS applies. Cookie writes are best-effort: they throw when called
 * from a Server Component render, which is expected and safe to ignore because
 * the middleware refreshes the session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
            // Called from a Server Component — ignored; middleware refreshes.
          }
        },
      },
    },
  );
}
