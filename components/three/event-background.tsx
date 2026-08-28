"use client";

import dynamic from "next/dynamic";
import type { EventCategory } from "@/lib/constants";

const MoleculeField = dynamic(() => import("./molecule-field"), {
  ssr: false,
});

const CATEGORY_COLOR: Record<EventCategory, string> = {
  workshop: "#32d6c1",
  debate: "#6cefe2",
  poster: "#34d399",
  paper: "#22d3ee",
  competition: "#2dd4bf",
  academic: "#38bdf8",
  other: "#32d6c1",
};

/** Small deterministic seed from the slug so each event drifts differently. */
function seedFrom(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 997;
  return (h % 100) / 16;
}

/**
 * Fixed, scroll-reactive 3D backdrop for an event page. Sits behind the page
 * content (content is z-10), pointer-events-none, and kept at low opacity so it
 * never competes with the text. Lazily loaded (three.js off the critical path)
 * and hidden on very small screens to protect mobile performance.
 */
export function EventBackground({
  category,
  slug,
}: {
  category: EventCategory;
  slug: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)] sm:block"
    >
      <MoleculeField seed={seedFrom(slug)} color={CATEGORY_COLOR[category]} />
    </div>
  );
}
