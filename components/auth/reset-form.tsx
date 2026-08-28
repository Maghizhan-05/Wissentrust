"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { updatePassword, type AuthState } from "@/lib/actions/auth";

export function ResetForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    null,
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Choose a new password
      </h1>
      <p className="mt-2 text-sm text-muted">
        Enter and confirm your new password below.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <Field label="New password" htmlFor="password" hint="At least 8 characters" required>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirm" required>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>

        {state && !state.ok && (
          <p className="rounded-lg border border-alert/30 bg-alert/10 px-3 py-2 text-sm text-alert">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending} withArrow>
          Update password
        </Button>
      </form>
    </div>
  );
}
