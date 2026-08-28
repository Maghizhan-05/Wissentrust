import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/50">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold text-foreground">
            {SITE.name}
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            {SITE.tagline}. A medical symposium of workshops, debates, and
            research presentations — built for the clinically curious.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/events" className="text-foreground hover:text-brand">Events</Link></li>
            <li><Link href="/schedule" className="text-foreground hover:text-brand">Schedule</Link></li>
            <li><Link href="/about" className="text-foreground hover:text-brand">About</Link></li>
            <li><Link href="/signup" className="text-foreground hover:text-brand">Register</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Organizing Committee</li>
            <li><a href="mailto:hello@wissendrust.example" className="hover:text-brand">hello@wissendrust.example</a></li>
            <li>Feb 12–14, 2027</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Built for the clinically curious.</p>
        </Container>
      </div>
    </footer>
  );
}
