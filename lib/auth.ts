import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

/** Returns the current auth user or null. Revalidates the token. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Returns the current user's profile row, or null if signed out. */
export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as ProfileRow) ?? null;
}

/** Requires a signed-in user; redirects to /login otherwise. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/** Requires a profile; redirects to /login otherwise. */
export async function requireProfile(): Promise<ProfileRow> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  return profile;
}

/** Requires an admin profile; redirects home for non-admins. */
export async function requireAdmin(): Promise<ProfileRow> {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.role !== "admin") redirect("/");
  return profile;
}
