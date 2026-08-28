import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_LANDING,
  mergeLanding,
  type LandingContent,
} from "@/lib/content/landing";

/**
 * Reads the editable landing content, merged over built-in defaults. Resilient:
 * if the table isn't there yet or the query fails, returns the defaults so the
 * public site always renders.
 */
export async function getLandingContent(): Promise<LandingContent> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("content")
      .eq("id", 1)
      .maybeSingle();
    return mergeLanding(
      (data?.content as Partial<LandingContent> | undefined) ?? null,
    );
  } catch {
    return DEFAULT_LANDING;
  }
}
