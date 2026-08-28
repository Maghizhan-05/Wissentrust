"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";

export function ForgotForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    null,
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Reset your password
      </h1>
      <p className="mt-2 text-sm text-muted">
        Enter your email and we&rsquo;ll send you a reset link.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <Field label="Email" htmlFor="email" required>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>

        {state?.ok && state.message && (
          <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            {state.message}
          </p>
        )}
        {state && !state.ok && (
          <p className="rounded-lg border border-alert/30 bg-alert/10 px-3 py-2 text-sm text-alert">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending} withArrow>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-brand hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
