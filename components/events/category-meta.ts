import {
  Wrench,
  MessagesSquare,
  Presentation,
  FileText,
  Trophy,
  GraduationCap,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { EventCategory } from "@/lib/constants";

/**
 * Plain (server-safe) category metadata. Kept out of any "use client" module so
 * Server Components can import and use CATEGORY_ICON directly.
 */
export const CATEGORY_ICON: Record<EventCategory, LucideIcon> = {
  workshop: Wrench,
  debate: MessagesSquare,
  poster: Presentation,
  paper: FileText,
  competition: Trophy,
  academic: GraduationCap,
  other: Stethoscope,
};

/** Deterministic tint per category for placeholder gradients. */
export const CATEGORY_HUE: Record<EventCategory, string> = {
  workshop: "from-brand/25",
  debate: "from-brand-2/25",
  poster: "from-emerald-400/20",
  paper: "from-cyan-400/20",
  competition: "from-teal-300/25",
  academic: "from-sky-400/20",
  other: "from-brand/20",
};
