import type { Metadata } from "next";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ParticipantIdCard } from "@/components/dashboard/participant-id-card";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-6">
        <ParticipantIdCard profile={profile} />
        <p className="text-sm text-muted">
          Your participant ID is permanent and identifies you across every event
          and payment. Keep it handy.
        </p>
      </div>

      <Card>
        <h1 className="font-display text-xl font-semibold text-foreground">
          Edit your details
        </h1>
        <p className="mt-1 text-sm text-muted">
          Keep these accurate — organizers use them to verify registrations.
        </p>
        <div className="mt-6">
          <ProfileForm profile={profile} />
        </div>
      </Card>
    </div>
  );
}
