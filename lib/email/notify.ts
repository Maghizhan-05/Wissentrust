import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "./mailer";
import {
  paymentConfirmedEmail,
  paymentUnderReviewEmail,
  registrationEmail,
  welcomeEmail,
} from "./templates";
import type { EventRow, ProfileRow, RegistrationRow } from "@/types/database";

/** Fetches a registration with its event + owner profile (admin client). */
async function loadRegistration(registrationId: string): Promise<{
  registration: RegistrationRow;
  event: EventRow;
  profile: ProfileRow;
} | null> {
  const admin = createAdminClient();
  const { data: reg } = await admin
    .from("registrations")
    .select("*, event:events(*)")
    .eq("id", registrationId)
    .maybeSingle();
  if (!reg) return null;

  const registration = reg as RegistrationRow & { event: EventRow };
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", registration.profile_id)
    .maybeSingle();
  if (!profile) return null;

  return {
    registration,
    event: registration.event,
    profile: profile as ProfileRow,
  };
}

export async function notifyWelcome(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return;
  const p = profile as ProfileRow;
  const { subject, html } = welcomeEmail(p.full_name, p.participant_id);
  await sendMail({ to: p.email, subject, html });
}

export async function notifyRegistration(registrationId: string): Promise<void> {
  const data = await loadRegistration(registrationId);
  if (!data) return;
  const { subject, html } = registrationEmail(
    data.profile.full_name,
    data.profile.participant_id,
    data.event,
    data.registration.amount,
  );
  await sendMail({ to: data.profile.email, subject, html });
}

export async function notifyPaymentUnderReview(registrationId: string): Promise<void> {
  const data = await loadRegistration(registrationId);
  if (!data) return;
  const { subject, html } = paymentUnderReviewEmail(
    data.profile.full_name,
    data.event,
    data.registration.amount,
    data.registration.transaction_id,
  );
  await sendMail({ to: data.profile.email, subject, html });
}

export async function notifyPaymentConfirmed(registrationId: string): Promise<void> {
  const data = await loadRegistration(registrationId);
  if (!data) return;
  const { subject, html } = paymentConfirmedEmail(
    data.profile.full_name,
    data.event,
  );
  await sendMail({ to: data.profile.email, subject, html });
}
