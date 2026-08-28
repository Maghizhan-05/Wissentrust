/**
 * Shared enums, labels and small constants used across the app.
 * These MIRROR the Postgres enums defined in the migrations. If you change
 * one, change the other (supabase/migrations/0001_init.sql).
 */

export const EVENT_CATEGORIES = [
  "workshop",
  "debate",
  "poster",
  "paper",
  "competition",
  "academic",
  "other",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  workshop: "Workshop",
  debate: "Debate",
  poster: "Poster Presentation",
  paper: "Paper Presentation",
  competition: "Competition",
  academic: "Academic Event",
  other: "Other",
};

export const REGISTRATION_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "rejected",
] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "unpaid",
  "uploaded",
  "under_review",
  "verified",
  "rejected",
  "duplicate",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  uploaded: "Uploaded",
  under_review: "Under Review",
  verified: "Verified",
  rejected: "Rejected",
  duplicate: "Duplicate",
};

/** Storage bucket names — must match supabase/migrations/0003_storage.sql */
export const BUCKETS = {
  eventImages: "event-images",
  paymentScreenshots: "payment-screenshots",
  profileImages: "profile-images",
} as const;

/** Payment screenshot upload constraints (also enforced server-side). */
export const SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const SCREENSHOT_ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const SITE = {
  name: "Wissendrust'27",
  tagline: "Where Medicine Meets Curiosity",
  description:
    "Wissendrust'27 — a medical symposium of workshops, debates, paper and poster presentations, and academic competitions. Discover events, register, and participate.",
} as const;
