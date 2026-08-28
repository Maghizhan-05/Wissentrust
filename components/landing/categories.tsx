import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { CATEGORY_ICON } from "@/components/events/category-visual";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS } from "@/lib/constants";
import type { LandingContent } from "@/lib/content/landing";

const BLURB: Partial<Record<(typeof EVENT_CATEGORIES)[number], string>> = {
  workshop: "Skills stations with real feedback.",
  debate: "Structured argument on live dilemmas.",
  poster: "Your research on one striking board.",
  paper: "Eight minutes to make your case.",
  competition: "Clinical reasoning, against the clock.",
  academic: "Sessions that sharpen how you work.",
};

export function Categories({
  categories,
}: {
  categories: LandingContent["categories"];
}) {
  const shown = EVENT_CATEGORIES.filter((c) => c !== "other");
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            index={categories.index}
            eyebrow={categories.eyebrow}
            title={categories.title}
            description={categories.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((cat, i) => {
            const Icon = CATEGORY_ICON[cat];
            return (
              <Reveal key={cat} delay={i * 0.05}>
                <Link
                  href={`/events?category=${cat}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-contrast">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {EVENT_CATEGORY_LABELS[cat]}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{BLURB[cat]}</p>
                  <span className="mt-4 text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Browse →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
