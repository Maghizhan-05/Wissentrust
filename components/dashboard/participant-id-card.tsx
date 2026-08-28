import { BadgeCheck } from "lucide-react";
import type { ProfileRow } from "@/types/database";

/** Prominent, membership-card style participant ID display. */
export function ParticipantIdCard({ profile }: { profile: ProfileRow }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-surface p-6">
      <div className="brand-glow absolute inset-0 opacity-70" />
      <div className="medical-grid absolute inset-0 opacity-40" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-brand">
          <BadgeCheck className="size-4" /> Participant ID
        </div>
        <p className="mt-3 font-mono text-4xl font-semibold tracking-[0.3em] text-foreground sm:text-5xl">
          {profile.participant_id}
        </p>
        <p className="mt-4 font-display text-lg font-semibold text-foreground">
          {profile.full_name || "Participant"}
        </p>
        <p className="text-sm text-muted">{profile.email}</p>
      </div>
    </div>
  );
}
