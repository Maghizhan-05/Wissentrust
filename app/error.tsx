"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, forward to your observability tool here.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-muted">
        An unexpected error occurred. Please try again — if it keeps happening,
        contact the organizers.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
