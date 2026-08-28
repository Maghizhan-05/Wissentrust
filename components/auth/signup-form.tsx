"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { signUp, type AuthState } from "@/lib/actions/auth";

const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Final Year",
  "Intern",
  "Postgraduate",
];

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, null);

  if (state?.ok && state.message) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          ✓
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-foreground">
          Almost there
        </h1>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
        >
          Go to login →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-muted">
        You&rsquo;ll get a unique participant ID to register for events.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <Field label="Full name" htmlFor="full_name" required>
          <Input id="full_name" name="full_name" autoComplete="name" required />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters" required>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="Phone" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </Field>
        <Field label="College" htmlFor="college" required>
          <Input id="college" name="college" required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Course" htmlFor="course" required>
            <Input id="course" name="course" placeholder="MBBS" required />
          </Field>
          <Field label="Year" htmlFor="year" required>
            <Select id="year" name="year" defaultValue="" required>
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

        {state && !state.ok && (
          <p className="rounded-lg border border-alert/30 bg-alert/10 px-3 py-2 text-sm text-alert">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending} withArrow>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
