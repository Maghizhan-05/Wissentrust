import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/types/database";

/** All events, newest-dated first (nulls last). */
export async function getEvents(): Promise<EventRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("featured", { ascending: false })
    .order("event_date", { ascending: true, nullsFirst: false });
  return (data as EventRow[]) ?? [];
}

export async function getFeaturedEvents(limit = 4): Promise<EventRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("featured", true)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(limit);
  return (data as EventRow[]) ?? [];
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as EventRow) ?? null;
}

/** Slugs for generateStaticParams / sitemap. */
export async function getAllEventSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("slug");
  return (data ?? []).map((r) => (r as { slug: string }).slug);
}

/** Count of active (non-cancelled) registrations per event id. */
export async function getEventRegistrationCounts(): Promise<
  Record<string, number>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("event_id")
    .neq("registration_status", "cancelled");
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { event_id: string }[]) {
    counts[row.event_id] = (counts[row.event_id] ?? 0) + 1;
  }
  return counts;
}
