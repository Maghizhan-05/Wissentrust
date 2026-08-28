"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { RegistrationRow } from "@/types/database";

export type ActionResult = { ok: false; error: string } | { ok: true };

const RPC_ERRORS: Record<string, string> = {
  AUTH_REQUIRED: "Please sign in to register.",
  EVENT_NOT_FOUND: "That event no longer exists.",
  REGISTRATION_CLOSED: "Registration for this event is closed.",
  ALREADY_REGISTERED: "You're already registered for this event.",
  EVENT_FULL: "This event has reached capacity.",
};

function mapRpcError(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  for (const key of Object.keys(RPC_ERRORS)) {
    if (message.includes(key)) return RPC_ERRORS[key];
  }
  return "Something went wrong. Please try again.";
}

/**
 * Registers the current user for an event via the capacity-safe RPC, then
 * routes to payment (paid events) or the registrations list (free events).
 */
export async function registerForEvent(formData: FormData): Promise<ActionResult> {
  const eventId = String(formData.get("event_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!eventId) return { ok: false, error: "Missing event." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/events/${slug}`);

  const { data, error } = await supabase.rpc("register_for_event", {
    p_event_id: eventId,
  });
  if (error) return { ok: false, error: mapRpcError(error.message) };

  const reg = data as RegistrationRow;
  revalidatePath("/dashboard/registrations");
  revalidatePath(`/events/${slug}`);

  if (reg.payment_status === "verified") {
    // Free event — already confirmed.
    redirect("/dashboard/registrations?joined=1");
  }
  redirect(`/dashboard/payment/${reg.id}`);
}

/** Cancels the current user's still-unpaid registration. */
export async function cancelRegistration(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("registration_id") ?? "");
  if (!id) return { ok: false, error: "Missing registration." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_registration", {
    p_registration_id: id,
  });

  if (error) return { ok: false, error: "Could not cancel registration." };
  revalidatePath("/dashboard/registrations");
  return { ok: true };
}
