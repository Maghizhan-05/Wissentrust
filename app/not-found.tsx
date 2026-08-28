import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <div className="brand-glow pointer-events-none absolute inset-x-0 top-0 h-96" />
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" withArrow>
          Back home
        </ButtonLink>
        <ButtonLink href="/events" variant="outline" withArrow>
          Explore events
        </ButtonLink>
      </div>
      <Link href="/dashboard" className="mt-6 text-sm text-muted hover:text-foreground">
        Go to dashboard
      </Link>
    </div>
  );
}
