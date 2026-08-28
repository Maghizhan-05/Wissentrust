"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/utils";
import { notifyWelcome } from "@/lib/email/notify";
import {
  forgotSchema,
  loginSchema,
  resetSchema,
  signupSchema,
} from "@/lib/validation/auth";

export type AuthState =
  | { ok: false; error: string }
  | { ok: true; message?: string }
  | null;

function firstError(flat: Record<string, string[] | undefined>): string {
  for (const key of Object.keys(flat)) {
    const msgs = flat[key];
    if (msgs && msgs.length) return msgs[0];
  }
  return "Please check your details and try again.";
}

/** Email + password sign in. Redirects to `next` (or dashboard) on success. */
export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: firstError(parsed.error.flatten().fieldErrors) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, error: "Invalid email or password." };
  }

  const next = String(formData.get("next") ?? "/dashboard") || "/dashboard";
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

/** Sign up + profile metadata. Profile row is created by a DB trigger. */
export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    college: formData.get("college"),
    course: formData.get("course"),
    year: formData.get("year"),
  });
  if (!parsed.success) {
    return { ok: false, error: firstError(parsed.error.flatten().fieldErrors) };
  }
  const { email, password, ...meta } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: meta,
      emailRedirectTo: siteUrl("/auth/callback?next=/dashboard"),
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already"))
      return { ok: false, error: "An account with this email already exists." };
    return { ok: false, error: error.message };
  }

  // Welcome email with the participant ID (profile is created by a DB trigger).
  if (data.user) {
    try {
      await notifyWelcome(data.user.id);
    } catch (e) {
      console.error("welcome email failed:", e);
    }
  }

  // If email confirmation is disabled, a session exists → go straight in.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard?welcome=1");
  }
  return {
    ok: true,
    message: "Check your email to confirm your account, then log in.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, error: firstError(parsed.error.flatten().fieldErrors) };
  }
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: siteUrl("/auth/callback?next=/reset-password"),
  });
  // Always report success to avoid leaking which emails are registered.
  return {
    ok: true,
    message: "If that email is registered, a reset link is on its way.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { ok: false, error: firstError(parsed.error.flatten().fieldErrors) };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  redirect("/dashboard?reset=1");
}
