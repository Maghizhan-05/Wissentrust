import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { EcgDivider } from "@/components/ui/misc";

export function Intro() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              index="01"
              eyebrow="Introduction"
              title={<>A symposium for the clinically curious.</>}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Wissendrust&rsquo;27 gathers students across medicine and the
                allied sciences for three days of hands-on learning, sharp
                argument, and original research. It exists to give curiosity a
                stage — and a scoreboard.
              </p>
              <p>
                Whether you suture at a skills station, defend a bioethics
                motion, or present a case that changed how you think, this is
                where the work gets seen. Open to under- and post-graduate
                students from any institution.
              </p>
            </div>
          </Reveal>
        </div>
        <EcgDivider className="mt-16" />
      </Container>
    </section>
  );
}
