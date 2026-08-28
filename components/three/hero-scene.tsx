"use client";

import dynamic from "next/dynamic";

/**
 * Lazily-loaded 3D hero object. `ssr: false` keeps three.js out of the server
 * bundle and off the critical path; a themed placeholder holds the space while
 * it loads.
 */
const DnaHelix = dynamic(() => import("./dna-helix"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-40 rounded-full brand-glow blur-2xl" />
    </div>
  ),
});

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <DnaHelix />
    </div>
  );
}
