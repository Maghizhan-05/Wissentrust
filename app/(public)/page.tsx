import { Hero } from "@/components/landing/hero";
import { Intro } from "@/components/landing/intro";
import { Categories } from "@/components/landing/categories";
import { Featured } from "@/components/landing/featured";
import { WhyParticipate } from "@/components/landing/why-participate";
import { Journey } from "@/components/landing/journey";
import { ImportantInfo, FinalCta } from "@/components/landing/info-cta";
import { getFeaturedEvents } from "@/lib/data/events";
import { getMyRegisteredEventIds } from "@/lib/data/registrations";

export default async function LandingPage() {
  const [featured, registeredIds] = await Promise.all([
    getFeaturedEvents(4),
    getMyRegisteredEventIds(),
  ]);

  return (
    <>
      <Hero />
      <Intro />
      <Categories />
      <Featured events={featured} registeredIds={registeredIds} />
      <WhyParticipate />
      <Journey />
      <ImportantInfo />
      <FinalCta />
    </>
  );
}
