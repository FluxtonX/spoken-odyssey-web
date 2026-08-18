"use client";

import { heroImages } from "@/lib/hero/heroAssets";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";
import HeroGlasses from "../HeroGlasses";
import LayoutItem from "../LayoutItem";
import { PhotoCard } from "../cards/MemoryCards";

const WALL_TILE = { width: 96, height: 96 };

const wallTiles = [
  { src: heroImages.balloon, alt: "Balloon sunrise", x: -168, y: -120 },
  { src: heroImages.van, alt: "Road trip friends", x: -56, y: -120 },
  { src: heroImages.mountain, alt: "Mountain lake", x: 56, y: -120 },
  { src: heroImages.concert, alt: "Concert night", x: 168, y: -120 },
  { src: heroImages.childDog, alt: "Child with dog", x: -168, y: -8 },
  { src: heroImages.family, alt: "Family dinner", x: -56, y: -8 },
  { src: heroImages.hiking, alt: "Trail hike", x: 56, y: -8 },
  { src: heroImages.city, alt: "City walk", x: 168, y: -8 },
  { src: heroImages.sunset, alt: "Beach sunset", x: -168, y: 104 },
  { src: heroImages.grandparents, alt: "Generations", x: -56, y: 104 },
  { src: heroImages.mountain, alt: "Alpine view", x: 56, y: 104 },
  { src: heroImages.van, alt: "Weekend escape", x: 168, y: 104 },
];

/** Mosaic C — Immersive Photo Wall: dense grid with glasses floating in front */
export default function MosaicLayoutC({ isDesktop }) {
  const glassesSize = isDesktop ? mosaicConfig.glasses.desktop : mosaicConfig.glasses.tablet;
  const visibleTiles = isDesktop ? wallTiles : wallTiles.filter((_, i) => i % 2 === 0);

  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[88%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-[#4f37ff]/8 bg-white/20 shadow-[inset_0_0_60px_rgba(79,55,255,0.06)]"
        aria-hidden="true"
      />

      {visibleTiles.map((tile, index) => (
        <LayoutItem key={`${tile.alt}-${index}`} x={tile.x} y={tile.y} zIndex={5 + (index % 4)}>
          <PhotoCard src={tile.src} alt={tile.alt} size={WALL_TILE} />
        </LayoutItem>
      ))}

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[radial-gradient(ellipse,rgba(244,240,255,0.92)_0%,rgba(244,240,255,0.55)_45%,transparent_72%)]"
        aria-hidden="true"
      />

      <LayoutItem x={0} y={0} scale={1.05} zIndex={25}>
        <HeroGlasses size={glassesSize} positioned={false} />
      </LayoutItem>
    </>
  );
}
