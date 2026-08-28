import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Uses the ANON key only — every privileged
 * operation is gated by Row Level Security. Never import the service-role key
 * into anything that runs in the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
