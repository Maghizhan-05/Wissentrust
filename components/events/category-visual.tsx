import Image from "next/image";
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
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/lib/constants";

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
const CATEGORY_HUE: Record<EventCategory, string> = {
  workshop: "from-brand/25",
  debate: "from-brand-2/25",
  poster: "from-emerald-400/20",
  paper: "from-cyan-400/20",
  competition: "from-teal-300/25",
  academic: "from-sky-400/20",
  other: "from-brand/20",
};

/**
 * Event thumbnail: real image when provided, otherwise an art-directed
 * placeholder with the category glyph over a clinical grid — so the site looks
 * intentional even before admins upload artwork.
 */
export function EventThumb({
  src,
  alt,
  category,
  className,
  sizes,
  priority,
}: {
  src: string | null;
  alt: string;
  category: EventCategory;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const Icon = CATEGORY_ICON[category];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full bg-gradient-to-br to-surface-2",
        CATEGORY_HUE[category],
        className,
      )}
      aria-hidden
    >
      <div className="medical-grid absolute inset-0 opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="size-16 text-brand/60" strokeWidth={1.25} />
      </div>
    </div>
  );
}
