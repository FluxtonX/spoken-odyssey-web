"use client";

import { heroImages } from "@/lib/hero/heroAssets";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";
import HeroGlasses from "../HeroGlasses";
import LayoutItem from "../LayoutItem";
import { AudioCard, PhotoCard, TextMemoryCard } from "../cards/MemoryCards";

/** Mosaic B — Cinematic Stack: layered memory frames stacked behind glasses */
export default function MosaicLayoutB({ isDesktop }) {
  const glassesSize = isDesktop ? mosaicConfig.glasses.desktop : mosaicConfig.glasses.tablet;
  const stackW = isDesktop ? 200 : 160;
  const stackH = isDesktop ? 148 : 118;

  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-[radial-gradient(ellipse,rgba(79,55,255,0.12)_0%,transparent_72%)]"
        aria-hidden="true"
      />

      {/* Back layer */}
      <LayoutItem x={-72} y={-48} rotation={-6} scale={0.78} zIndex={6}>
        <PhotoCard src={heroImages.sunset} alt="Sunset memory" size={{ width: stackW, height: stackH }} />
      </LayoutItem>

      {/* Mid layer */}
      <LayoutItem x={-48} y={-24} rotation={-3} scale={0.88} zIndex={8}>
        <PhotoCard src={heroImages.family} alt="Family gathering" size={{ width: stackW, height: stackH }} />
      </LayoutItem>

      {/* Front stack frame */}
      <LayoutItem x={-24} y={0} rotation={-1} scale={0.96} zIndex={10}>
        <PhotoCard src={heroImages.grandparents} alt="Grandparents memory" size={{ width: stackW, height: stackH }} />
      </LayoutItem>

      {/* Side cards */}
      <LayoutItem x={148} y={-56} rotation={4} zIndex={14}>
        <TextMemoryCard
          title="Grandpa's story"
          date="March 14, 2022"
          body="He told us about the day he met grandma — we laughed until we cried."
          size={{ width: 152, height: 96 }}
        />
      </LayoutItem>

      <LayoutItem x={132} y={72} rotation={2} zIndex={15}>
        <AudioCard label="Voice Memory" duration="03:41" size={{ width: 142, height: 58 }} />
      </LayoutItem>

      {isDesktop && (
        <LayoutItem x={-200} y={64} rotation={-5} zIndex={12}>
          <PhotoCard src={heroImages.hiking} alt="Hiking adventure" size={{ width: 112, height: 88 }} />
        </LayoutItem>
      )}

      <LayoutItem x={18} y={-12} scale={1.08} rotation={2} zIndex={25}>
        <HeroGlasses size={glassesSize} positioned={false} />
      </LayoutItem>
    </>
  );
}
