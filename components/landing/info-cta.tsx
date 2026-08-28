import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, Mail, GraduationCap } from "lucide-react";

const INFO = [
  { icon: CalendarDays, label: "Dates", value: "February 12–14, 2027" },
  { icon: MapPin, label: "Venue", value: "Medical College Campus" },
  { icon: Clock, label: "Registration deadline", value: "February 8, 2027" },
  { icon: GraduationCap, label: "Eligibility", value: "Under- & post-graduate students" },
  { icon: Mail, label: "Contact", value: "hello@wissendrust.example" },
];

export function ImportantInfo() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            index="06"
            eyebrow="Important Information"
            title="The essentials, in one place."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INFO.map((item, i) => (
            <Reveal key={item.label} delay={(i % 3) * 0.05}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6">
                <item.icon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-surface px-6 py-16 text-center md:py-24">
            <div className="brand-glow pointer-events-none absolute inset-0" />
            <div className="medical-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
                Ready to be part of Wissendrust&rsquo;27?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-muted">
                Create your account, claim your participant ID, and register in
                minutes.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/signup" size="lg" withArrow>
                  Register Now
                </ButtonLink>
                <ButtonLink href="/events" size="lg" variant="outline" withArrow>
                  Explore Events
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
