"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { paymentVerificationService } from "@/lib/ocr";
import { notifyPaymentUnderReview } from "@/lib/email/notify";
import {
  BUCKETS,
  SCREENSHOT_ACCEPTED_TYPES,
  SCREENSHOT_MAX_BYTES,
  type PaymentStatus,
} from "@/lib/constants";
import type { RegistrationRow } from "@/types/database";

export type AnalyzeResult =
  | { ok: false; error: string }
  | { ok: true; ref: string | null; confidence: number; path: string };

export type ConfirmResult =
  | { ok: false; error: string }
  | { ok: true; status: PaymentStatus };

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/**
 * Uploads the screenshot to the PRIVATE bucket, persists it against the
 * registration ('uploaded'), then runs server-side OCR and returns a candidate
 * reference for the user to confirm. The OCR key never leaves the server.
 */
export async function analyzeScreenshot(
  formData: FormData,
): Promise<AnalyzeResult> {
  const registrationId = String(formData.get("registration_id") ?? "");
  const file = formData.get("file");
  if (!registrationId) return { ok: false, error: "Missing registration." };
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: "Please choose a screenshot to upload." };

  if (!SCREENSHOT_ACCEPTED_TYPES.includes(file.type as never))
    return { ok: false, error: "Upload a PNG, JPG or WebP image." };
  if (file.size > SCREENSHOT_MAX_BYTES)
    return { ok: false, error: "Image is too large (max 5 MB)." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  // Confirm the registration is the caller's (RLS scopes this select).
  const { data: reg } = await supabase
    .from("registrations")
    .select("id, profile_id")
    .eq("id", registrationId)
    .maybeSingle();
  if (!reg || (reg as { profile_id: string }).profile_id !== user.id)
    return { ok: false, error: "Registration not found." };

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT[file.type] ?? "png";
  const path = `${user.id}/${registrationId}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKETS.paymentScreenshots)
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (upErr) return { ok: false, error: "Upload failed. Please try again." };

  const ocr = await paymentVerificationService.extract(buffer, file.type);

  // Persist the screenshot + OCR immediately (status 'uploaded'), even if the
  // user abandons before confirming a transaction id.
  await supabase.rpc("submit_payment", {
    p_registration_id: registrationId,
    p_transaction_id: null,
    p_screenshot: path,
    p_ocr_raw: ocr.raw || null,
    p_ocr_conf: ocr.confidence || null,
  });

  revalidatePath(`/dashboard/payment/${registrationId}`);
  return { ok: true, ref: ocr.ref, confidence: ocr.confidence, path };
}

/**
 * Confirms the (possibly user-corrected) transaction id. Duplicate detection
 * and status transitions happen inside the submit_payment RPC.
 */
export async function confirmPayment(
  formData: FormData,
): Promise<ConfirmResult> {
  const registrationId = String(formData.get("registration_id") ?? "");
  const transactionId = String(formData.get("transaction_id") ?? "").trim();
  if (!registrationId) return { ok: false, error: "Missing registration." };
  if (transactionId.length < 6)
    return { ok: false, error: "Enter a valid transaction / UTR number." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_payment", {
    p_registration_id: registrationId,
    p_transaction_id: transactionId,
    p_screenshot: null,
    p_ocr_raw: null,
    p_ocr_conf: null,
  });

  if (error) return { ok: false, error: "Could not submit payment." };

  const reg = (Array.isArray(data) ? data[0] : data) as RegistrationRow;
  revalidatePath(`/dashboard/payment/${registrationId}`);
  revalidatePath("/dashboard/registrations");
  revalidatePath("/dashboard");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/registrations");
  revalidatePath("/admin");

  // Fire-and-catch notification (best effort — never blocks the response).
  if (reg.payment_status === "under_review") {
    try {
      await notifyPaymentUnderReview(registrationId);
    } catch (e) {
      console.error("payment email failed:", e);
    }
  }

  return { ok: true, status: reg.payment_status };
}
