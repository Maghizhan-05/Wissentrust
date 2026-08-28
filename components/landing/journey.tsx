import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Compass, ClipboardList, QrCode, ShieldCheck, PartyPopper } from "lucide-react";

const STEPS = [
  { icon: Compass, title: "Discover", body: "Browse the programme and open any event." },
  { icon: ClipboardList, title: "Register", body: "Create an account, get your participant ID, pick events." },
  { icon: QrCode, title: "Pay", body: "Scan the UPI QR and upload your payment screenshot." },
  { icon: ShieldCheck, title: "Verify", body: "We read the UTR, check for duplicates, and an organizer confirms." },
  { icon: PartyPopper, title: "Participate", body: "Show up, present, compete — you're on the list." },
];

export function Journey() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            index="05"
            eyebrow="The Experience"
            title="From curious to confirmed, in five steps."
          />
        </Reveal>

        <ol className="mt-14 grid gap-4 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07} as="li">
              <div className="relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                <span className="font-mono text-xs text-brand">
                  0{i + 1}
                </span>
                <s.icon className="mt-3 size-7 text-brand" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{s.body}</p>
                {i < STEPS.length - 1 && (
                  <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-brand/40 md:block">
                    →
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
