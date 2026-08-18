"use client";

import { useEffect, useState, useCallback } from "react";
import { heroImages } from "@/lib/hero/heroAssets";
import HeroGlasses from "./HeroGlasses";
import HeroHeadline from "./HeroHeadline";
import MosaicElement from "./MosaicElement";

// 7 Cards with 21 COMPLETELY UNIQUE IMAGES (0 repetitions across cards)
const GALLERY_ITEMS = [
  // 1. TOP RIGHT CARD: Marriage & Wedding
  {
    id: "card-marriage",
    images: [
      { src: heroImages.weddingEmbrace, alt: "Wedding embrace memory", tag: "Marriage" },
      { src: heroImages.weddingRings, alt: "Wedding ring exchange", tag: "Vows" },
      { src: heroImages.weddingWalk, alt: "Wedding day walk", tag: "Forever" },
    ],
    width: 250,
    height: 180,
    rotation: -2,
    zIndex: 12,
    depth: 14,
    desktopPos: "top-[4%] right-[22%]",
    tabletPos: "top-[4%] right-[16%]",
    mobilePos: "top-[50%] right-[4%]",
  },

  // 2. FAR RIGHT CARD: Old / Vintage & Generations
  {
    id: "card-vintage",
    images: [
      { src: heroImages.oldGrandparents, alt: "Vintage grandparents photo", tag: "Vintage" },
      { src: heroImages.grandparentsHands, alt: "Grandparents holding hands", tag: "Lifetime" },
      { src: heroImages.vintageJournal, alt: "Old family handwritten journal", tag: "Heirloom" },
    ],
    width: 220,
    height: 280,
    rotation: 3,
    zIndex: 14,
    depth: 18,
    desktopPos: "top-[18%] right-[3%]",
    tabletPos: "top-[16%] right-[2%]",
    mobilePos: "top-[64%] right-[42%]",
  },

  // 3. BOTTOM RIGHT CARD: Travel & Nature
  {
    id: "card-travel",
    images: [
      { src: heroImages.mountainSunset, alt: "Alpine mountain sunset", tag: "Outdoor" },
      { src: heroImages.oceanCoast, alt: "Golden hour ocean coast", tag: "Coastline" },
      { src: heroImages.hikingForest, alt: "Forest hiking trail", tag: "Adventure" },
    ],
    width: 230,
    height: 160,
    rotation: -2,
    zIndex: 10,
    depth: 8,
    desktopPos: "bottom-[5%] right-[22%]",
    tabletPos: "bottom-[4%] right-[16%]",
    mobilePos: "bottom-[4%] right-[4%]",
  },

  // 4. TOP CENTER-RIGHT CARD: Gifts & Emotional Heirloom
  {
    id: "card-gifts",
    images: [
      { src: heroImages.giftExchange, alt: "Heartfelt gift exchange", tag: "Gifts" },
      { src: heroImages.heirloomLetter, alt: "Handwritten keepsake letter", tag: "Keepsake" },
      { src: heroImages.emotionalEmbrace, alt: "Emotional family hug", tag: "Love" },
    ],
    width: 200,
    height: 230,
    rotation: 2.5,
    zIndex: 11,
    depth: 12,
    desktopPos: "top-[2%] right-[45%]",
    tabletPos: "top-[2%] right-[39%]",
    mobilePos: "hidden",
  },

  // 5. MID CENTER CARD: Family & Newborns
  {
    id: "card-family-kids",
    images: [
      { src: heroImages.familyReunion, alt: "Multi-generational family reunion", tag: "Family" },
      { src: heroImages.babyNewborn, alt: "Newborn baby first steps", tag: "Newborn" },
      { src: heroImages.kidsPlaying, alt: "Children playing outdoor", tag: "Joy" },
    ],
    width: 190,
    height: 150,
    rotation: -3,
    zIndex: 9,
    depth: 6,
    desktopPos: "top-[42%] right-[44%]",
    tabletPos: "top-[40%] right-[38%]",
    mobilePos: "hidden",
  },

  // 6. CARD BELOW GLASSES LEFT: Friends & Celebrations
  {
    id: "card-friends-celebration",
    images: [
      { src: heroImages.friendsCampfire, alt: "Friends around evening bonfire", tag: "Friends" },
      { src: heroImages.cityWalk, alt: "Sunset urban city walk", tag: "Journey" },
      { src: heroImages.sunsetToast, alt: "Celebration sunset toast", tag: "Milestones" },
    ],
    width: 220,
    height: 165,
    rotation: -2,
    zIndex: 15,
    depth: 14,
    desktopPos: "bottom-[6%] right-[46%]",
    tabletPos: "bottom-[5%] right-[40%]",
    mobilePos: "hidden",
  },

  // 7. CARD BELOW GLASSES RIGHT: Heritage & Home
  {
    id: "card-heritage-home",
    images: [
      { src: heroImages.grandparentStory, alt: "Grandparent telling life story", tag: "Stories" },
      { src: heroImages.familyDinnerTable, alt: "Family outdoor dinner table", tag: "Gathering" },
      { src: heroImages.cozyHomeMoment, alt: "Cozy home reflection", tag: "Home" },
    ],
    width: 210,
    height: 160,
    rotation: 2.5,
    zIndex: 13,
    depth: 10,
    desktopPos: "bottom-[6%] right-[3%]",
    tabletPos: "bottom-[5%] right-[2%]",
    mobilePos: "hidden",
  },
];

export default function MosaicComposition() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [globalSlideIndex, setGlobalSlideIndex] = useState(0);

  // Synchronized global timer: ALL 7 cards slide simultaneously to new unique photos every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalSlideIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 768) return;
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const getOffset = (depth) => ({
    x: mousePos.x * depth,
    y: mousePos.y * depth,
  });

  return (
    <div className="relative w-full max-w-7xl mx-auto min-h-[85svh] lg:min-h-[88svh] flex flex-col lg:flex-row items-start justify-between px-5 sm:px-8 lg:px-12 pt-6 lg:pt-10 pb-12">
      {/* Background Ambient Aura Orbs */}
      <div className="absolute top-[10%] right-[22%] w-[540px] h-[540px] bg-[#4f37ff]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[8%] left-[6%] w-[440px] h-[440px] bg-rose-200/15 rounded-full blur-[130px] pointer-events-none" />

      {/* LEFT: Pure Floating Typography */}
      <div className="w-full lg:w-[46%] pt-4 lg:pt-8 relative z-30">
        <HeroHeadline />
      </div>

      {/* RIGHT: Structured Floating Memory Gallery Canvas */}
      <div className="w-full lg:w-[54%] h-[520px] sm:h-[600px] lg:h-[660px] relative mt-8 lg:mt-0 z-20">
        {/* Render 7 spatial cards with 21 unique images */}
        {GALLERY_ITEMS.map((item) => {
          const offset = getOffset(item.depth);
          return (
            <MosaicElement
              key={item.id}
              item={item}
              globalSlideIndex={globalSlideIndex}
              parallaxOffset={offset}
              className={`${item.desktopPos}`}
            />
          );
        })}

        {/* Floating Transparent Smart Glasses — Shifted Further to the Left */}
        <HeroGlasses
          parallaxOffset={getOffset(22)}
          className="top-[25%] right-[28%] sm:right-[34%] lg:right-[38%] w-[280px] sm:w-[340px] lg:w-[380px] h-[170px] sm:h-[210px] lg:h-[235px]"
        />
      </div>
    </div>
  );
}
