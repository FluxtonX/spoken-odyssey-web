"use client";

import HeroAtmosphere from "./HeroAtmosphere";
import MosaicComposition from "./MosaicComposition";

export default function MosaicHero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] bg-gradient-to-b from-[#fdfcfa] via-[#f8f6ff]/70 to-white overflow-hidden pt-20 md:pt-24 pb-10"
    >
      <HeroAtmosphere />

      <div className="relative z-10 w-full">
        <MosaicComposition />
      </div>
    </section>
  );
}
