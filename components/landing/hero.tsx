import { CalendarDays, MapPin } from "lucide-react";
import { HeroScene } from "@/components/three/hero-scene";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="brand-glow pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <Container className="relative grid min-h-[calc(100svh-4rem)] items-center gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-0">
        <div className="relative z-10">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-brand backdrop-blur">
              Medical Symposium · College Event
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl xl:text-8xl">
              Wissendrust
              <span className="text-brand">&rsquo;27</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 font-display text-2xl font-medium leading-tight text-foreground/90 sm:text-3xl md:text-4xl">
              Where medicine <br className="hidden sm:block" />
              meets curiosity.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Three days of workshops, debates, and research presentations —
              built for students who ask the next question.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-brand" /> Feb 12–14, 2027
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-brand" /> Medical College Campus
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/signup" size="lg" withArrow>
                Register Now
              </ButtonLink>
              <ButtonLink href="/events" size="lg" variant="outline" withArrow>
                Explore Events
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="relative h-[340px] w-full sm:h-[440px] lg:h-[560px]">
          <HeroScene className="absolute inset-0" />
        </div>
      </Container>
    </section>
  );
}
