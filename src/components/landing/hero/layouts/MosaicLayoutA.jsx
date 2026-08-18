"use client";

import { heroImages } from "@/lib/hero/heroAssets";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";
import HeroGlasses from "../HeroGlasses";
import LayoutItem from "../LayoutItem";
import {
  AudioCard,
  FamilyBadge,
  LocationBadge,
  PhotoCard,
  TextMemoryCard,
  TimestampBadge,
  VideoCard,
} from "../cards/MemoryCards";

/** Mosaic A — Editorial Scatter: orbiting memory cards around glasses */
export default function MosaicLayoutA({ isDesktop }) {
  const glassesSize = isDesktop ? mosaicConfig.glasses.desktop : mosaicConfig.glasses.tablet;

  return (
    <>
      <div
        className="pointer-events-none absolute left-[58%] top-[46%] h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4f37ff]/10"
        aria-hidden="true"
      >
        <div className="absolute inset-3 rounded-full border border-[#4f37ff]/10" />
        <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(79,55,255,0.08)_0%,transparent_70%)]" />
      </div>

      <LayoutItem x={-188} y={-138} rotation={-8} zIndex={14}>
        <PhotoCard src={heroImages.balloon} alt="Woman watching hot air balloons" size={{ width: 108, height: 108 }} />
      </LayoutItem>

      <LayoutItem x={-98} y={-182} rotation={-4} zIndex={16}>
        <TimestampBadge label="Captured" time="10:42 AM" size={{ width: 118, height: 36 }} />
      </LayoutItem>

      <LayoutItem x={-228} y={18} rotation={-5} zIndex={10}>
        <PhotoCard src={heroImages.van} alt="Friends on a road trip" size={{ width: 128, height: 96 }} />
      </LayoutItem>

      <LayoutItem x={-178} y={118} rotation={-2} zIndex={15}>
        <TextMemoryCard
          title="First solo hike"
          date="June 8, 2023"
          body="The air was thin, my legs burned, and for the first time I felt completely alone and completely alive."
          size={{ width: 148, height: 92 }}
        />
      </LayoutItem>

      <LayoutItem x={168} y={-128} rotation={6} zIndex={13}>
        <PhotoCard src={heroImages.mountain} alt="Mountain lake landscape" size={{ width: 118, height: 96 }} />
      </LayoutItem>

      <LayoutItem x={208} y={8} rotation={5} zIndex={16}>
        <VideoCard src={heroImages.concert} alt="Concert memory video" size={{ width: 132, height: 98 }} />
      </LayoutItem>

      <LayoutItem x={176} y={128} rotation={3} zIndex={17}>
        <AudioCard label="Dad's voice" duration="02:18" size={{ width: 138, height: 58 }} />
      </LayoutItem>

      <LayoutItem x={24} y={162} rotation={-3} zIndex={17}>
        <AudioCard label="Voice Memory" duration="01:32" size={{ width: 138, height: 58 }} />
      </LayoutItem>

      <LayoutItem x={-28} y={178} rotation={-2} zIndex={18}>
        <LocationBadge place="Paris, France" date="May 12, 2024" size={{ width: 132, height: 52 }} />
      </LayoutItem>

      {isDesktop && (
        <LayoutItem x={-248} y={82} rotation={-4} zIndex={12}>
          <FamilyBadge label="Family" count={12} size={{ width: 118, height: 52 }} />
        </LayoutItem>
      )}

      <HeroGlasses size={glassesSize} />
    </>
  );
}
