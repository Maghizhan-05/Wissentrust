import { createClient } from "@/lib/supabase/server";
import type {
  RegistrationRow,
  RegistrationWithEvent,
} from "@/types/database";

/** Event ids the current user has an active registration for. */
export async function getMyRegisteredEventIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("registrations")
    .select("event_id")
    .neq("registration_status", "cancelled");
  return new Set((data ?? []).map((r) => (r as { event_id: string }).event_id));
}

/** Current user's registrations with their event, newest first. */
export async function getMyRegistrations(): Promise<RegistrationWithEvent[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("*, event:events(*)")
    .order("registered_at", { ascending: false });
  return (data as RegistrationWithEvent[]) ?? [];
}

/** A single registration owned by the current user (RLS-scoped). */
export async function getMyRegistration(
  id: string,
): Promise<RegistrationWithEvent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("*, event:events(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as RegistrationWithEvent) ?? null;
}

/** The current user's registration for a specific event, if any. */
export async function getMyRegistrationForEvent(
  eventId: string,
): Promise<RegistrationRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("registrations")
    .select("*")
    .eq("event_id", eventId)
    .eq("profile_id", user.id)
    .maybeSingle();
  return (data as RegistrationRow) ?? null;
}
