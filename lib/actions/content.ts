"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const titledBody = z.object({
  title: z.string().trim().max(120),
  body: z.string().trim().max(400),
});
const labelValue = z.object({
  label: z.string().trim().max(120),
  value: z.string().trim().max(240),
});

const landingSchema = z.object({
  hero: z.object({
    eyebrow: z.string().trim().max(120),
    titleLine1: z.string().trim().max(60),
    titleAccent: z.string().trim().max(20),
    taglineLine1: z.string().trim().max(80),
    taglineLine2: z.string().trim().max(80),
    description: z.string().trim().max(400),
    date: z.string().trim().max(80),
    venue: z.string().trim().max(120),
    ctaPrimary: z.string().trim().max(40),
    ctaSecondary: z.string().trim().max(40),
  }),
  intro: z.object({
    index: z.string().trim().max(4),
    eyebrow: z.string().trim().max(60),
    title: z.string().trim().max(160),
    paragraphs: z.array(z.string().trim().max(1000)).max(6),
  }),
  categories: z.object({
    index: z.string().trim().max(4),
    eyebrow: z.string().trim().max(60),
    title: z.string().trim().max(160),
    description: z.string().trim().max(400),
  }),
  featured: z.object({
    index: z.string().trim().max(4),
    eyebrow: z.string().trim().max(60),
    title: z.string().trim().max(160),
  }),
  why: z.object({
    index: z.string().trim().max(4),
    eyebrow: z.string().trim().max(60),
    title: z.string().trim().max(160),
    points: z.array(titledBody).max(9),
  }),
  journey: z.object({
    index: z.string().trim().max(4),
    eyebrow: z.string().trim().max(60),
    title: z.string().trim().max(160),
    steps: z.array(titledBody).max(9),
  }),
  info: z.object({
    index: z.string().trim().max(4),
    eyebrow: z.string().trim().max(60),
    title: z.string().trim().max(160),
    items: z.array(labelValue).max(10),
  }),
  finalCta: z.object({
    title: z.string().trim().max(200),
    description: z.string().trim().max(400),
    ctaPrimary: z.string().trim().max(40),
    ctaSecondary: z.string().trim().max(40),
  }),
  footer: z.object({
    tagline: z.string().trim().max(160),
    contactEmail: z.string().trim().max(160),
    dates: z.string().trim().max(80),
  }),
});

export type ContentState =
  | { ok: false; error: string }
  | { ok: true; message: string }
  | null;

export async function updateLandingContent(
  _prev: ContentState,
  formData: FormData,
): Promise<ContentState> {
  await requireAdmin();

  const raw = String(formData.get("content") ?? "");
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Could not read the form data." };
  }

  const result = landingSchema.safeParse(parsedJson);
  if (!result.success) {
    return { ok: false, error: "Some fields are invalid or too long." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, content: result.data }, { onConflict: "id" });

  if (error) return { ok: false, error: "Could not save changes." };

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { ok: true, message: "Landing page updated." };
}
