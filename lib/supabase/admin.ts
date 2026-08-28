import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. BYPASSES Row Level Security — use ONLY in
 * trusted server code (Route Handlers / Server Actions) and ONLY for the
 * narrow operations RLS cannot express safely:
 *   - reconciling duplicate transaction IDs across users
 *   - reading payment screenshots for admin review via signed URLs
 *
 * The `server-only` import makes the build fail if this module is ever pulled
 * into a client bundle. Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
