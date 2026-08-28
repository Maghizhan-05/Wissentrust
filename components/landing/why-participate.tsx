import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import {
  Microscope,
  Trophy,
  Presentation,
  Users,
  Handshake,
  BadgeCheck,
} from "lucide-react";

const POINTS = [
  { icon: Microscope, title: "Learn", body: "Hands-on stations and sessions taught by clinicians and researchers." },
  { icon: Trophy, title: "Compete", body: "Timed challenges that reward clear thinking under pressure." },
  { icon: Presentation, title: "Present", body: "Put original work in front of a panel that actually reads it." },
  { icon: Users, title: "Network", body: "Meet peers and faculty across institutions and specialties." },
  { icon: Handshake, title: "Collaborate", body: "Find the people your next project has been missing." },
  { icon: BadgeCheck, title: "Build a record", body: "Certificates and results you can point to, verified by organizers." },
];

export function WhyParticipate() {
  return (
    <section className="border-y border-border bg-surface/40 py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Why Participate"
            title="Six reasons this is worth your three days."
            align="center"
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.05}>
              <div className="h-full bg-surface p-7">
                <p.icon className="size-7 text-brand" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
