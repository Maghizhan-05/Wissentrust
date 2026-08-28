"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import type { ProfileRow } from "@/types/database";

const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Final Year",
  "Intern",
  "Postgraduate",
];

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    null,
  );

  useEffect(() => {
    if (state?.ok) toast.success(state.message);
    else if (state && !state.ok) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Field label="Full name" htmlFor="full_name" required>
        <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
      </Field>

      <Field label="Email" htmlFor="email" hint="Email can't be changed here">
        <Input id="email" defaultValue={profile.email} disabled />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} required />
        </Field>
        <Field label="College" htmlFor="college" required>
          <Input id="college" name="college" defaultValue={profile.college ?? ""} required />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Course" htmlFor="course" required>
          <Input id="course" name="course" defaultValue={profile.course ?? ""} required />
        </Field>
        <Field label="Year" htmlFor="year" required>
          <Select id="year" name="year" defaultValue={profile.year ?? ""} required>
            <option value="" disabled>
              Select
            </option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="pt-2">
        <Button type="submit" loading={pending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
