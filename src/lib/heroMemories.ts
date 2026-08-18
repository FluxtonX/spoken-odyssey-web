// Hero orbital memory items — all visible at once, static (no carousel)
// Lightweight emotional images (~240px wide, q=60) for fast hero render

export type MemoryItemType = "photo" | "video" | "audio" | "text" | "badge" | "family";

export interface ResponsivePosition {
  desktop: { x: number; y: number };
  tablet: { x: number; y: number };
  mobile: { x: number; y: number };
}

export interface ResponsiveSize {
  desktop: { width: number; height: number };
  tablet: { width: number; height: number };
  mobile: { width: number; height: number };
}

export interface HeroMemoryItem {
  id: string;
  type: MemoryItemType;
  layer: "back" | "front";
  src?: string;
  alt?: string;
  label?: string;
  sublabel?: string;
  title?: string;
  date?: string;
  body?: string;
  duration?: string;
  avatars?: string[];
  memberCount?: number;
  position: ResponsivePosition;
  size?: ResponsiveSize;
  zIndex: number;
  floatDuration?: number;
  floatDelay?: number;
  parallaxDepth?: number;
  entranceDelay?: number;
  hiddenOnMobile?: boolean;
  priority?: boolean;
}

/** Small, fast-loading emotional images for the hero orbit */
const img = (id: string, w = 240) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=60`;

const avatar = (id: string) => img(id, 48);

/** Curated emotional Odyssey hero images — one per card, matched to mockup */
export const heroImages = {
  balloons: img("photo-1501785888041-af3ef285b470"),
  friendsVan: img("photo-1529156069898-49953e39b3ac"),
  mountainLake: img("photo-1506905925346-21bda4d32df4"),
  childAndDog: img("photo-1587300003388-59208cc962cb"),
  concert: img("photo-1470229722913-7c0e2dbbafd3"),
  familyReunion: img("photo-1511895426328-dc8714191300"),
  sunsetTrail: img("photo-1500530855697-b586d89ba3ee"),
  grandparents: img("photo-1517486808906-6ca8b3f04846"),
};

export const heroMemoryItems: HeroMemoryItem[] = [
  // ── BACK LAYER (behind glasses) ──
  {
    id: "photo-friends",
    type: "photo",
    layer: "back",
    src: heroImages.friendsVan,
    alt: "Friends on a road trip — laughter worth preserving",
    position: { desktop: { x: -46, y: -2 }, tablet: { x: -40, y: 0 }, mobile: { x: -38, y: -8 } },
    size: { desktop: { width: 130, height: 95 }, tablet: { width: 110, height: 80 }, mobile: { width: 90, height: 68 } },
    zIndex: 12,
    floatDuration: 6,
    floatDelay: 0.5,
    parallaxDepth: 0.04,
    entranceDelay: 0.6,
  },
  {
    id: "photo-mountain",
    type: "photo",
    layer: "back",
    src: heroImages.mountainLake,
    alt: "Mountain lake — a quiet moment on your odyssey",
    position: { desktop: { x: -8, y: 40 }, tablet: { x: -6, y: 36 }, mobile: { x: -10, y: 42 } },
    size: { desktop: { width: 150, height: 100 }, tablet: { width: 130, height: 88 }, mobile: { width: 100, height: 70 } },
    zIndex: 11,
    floatDuration: 7,
    floatDelay: 1.2,
    parallaxDepth: 0.03,
    entranceDelay: 0.8,
  },
  {
    id: "photo-dog",
    type: "photo",
    layer: "back",
    src: heroImages.childAndDog,
    alt: "Child hugging golden retriever — pure love captured",
    position: { desktop: { x: 36, y: 36 }, tablet: { x: 32, y: 32 }, mobile: { x: 30, y: 38 } },
    size: { desktop: { width: 120, height: 90 }, tablet: { width: 105, height: 78 }, mobile: { width: 85, height: 64 } },
    zIndex: 13,
    floatDuration: 5.5,
    floatDelay: 0.8,
    parallaxDepth: 0.04,
    entranceDelay: 0.7,
  },

  // ── FRONT LAYER (in front of glasses) ──
  {
    id: "photo-balloons",
    type: "photo",
    layer: "front",
    src: heroImages.balloons,
    alt: "Hot air balloons at dawn — adventure begins",
    priority: true,
    position: { desktop: { x: -36, y: -34 }, tablet: { x: -32, y: -30 }, mobile: { x: -34, y: -32 } },
    size: { desktop: { width: 145, height: 105 }, tablet: { width: 125, height: 90 }, mobile: { width: 100, height: 75 } },
    zIndex: 22,
    floatDuration: 5,
    floatDelay: 0,
    parallaxDepth: 0.06,
    entranceDelay: 0.5,
  },
  {
    id: "badge-captured",
    type: "badge",
    layer: "front",
    label: "Captured 10:42 AM",
    position: { desktop: { x: -30, y: -20 }, tablet: { x: -26, y: -18 }, mobile: { x: -28, y: -20 } },
    zIndex: 26,
    floatDuration: 4.5,
    floatDelay: 0.3,
    parallaxDepth: 0.07,
    entranceDelay: 0.65,
    hiddenOnMobile: true,
  },
  {
    id: "text-hike",
    type: "text",
    layer: "front",
    title: "First solo hike",
    date: "June 8, 2023",
    body: "A moment I'll never forget.",
    position: { desktop: { x: -40, y: 30 }, tablet: { x: -36, y: 28 }, mobile: { x: -38, y: 30 } },
    size: { desktop: { width: 155, height: 72 }, tablet: { width: 140, height: 68 }, mobile: { width: 120, height: 64 } },
    zIndex: 24,
    floatDuration: 6.5,
    floatDelay: 1.5,
    parallaxDepth: 0.06,
    entranceDelay: 0.75,
  },
  {
    id: "audio-voice",
    type: "audio",
    layer: "front",
    label: "Voice Memory",
    duration: "01:32",
    position: { desktop: { x: 8, y: 48 }, tablet: { x: 6, y: 44 }, mobile: { x: 4, y: 46 } },
    size: { desktop: { width: 140, height: 52 }, tablet: { width: 125, height: 48 }, mobile: { width: 110, height: 44 } },
    zIndex: 25,
    floatDuration: 5,
    floatDelay: 2,
    parallaxDepth: 0.07,
    entranceDelay: 0.85,
    hiddenOnMobile: true,
  },
  {
    id: "family-card",
    type: "family",
    layer: "front",
    label: "Family",
    memberCount: 12,
    avatars: [
      avatar("photo-1494790108377-be9c29b29330"),
      avatar("photo-1507003211169-0a1dd7228f2d"),
      avatar("photo-1544005313-94ddf0286df2"),
      avatar("photo-1472099645785-5658abf4ff4e"),
    ],
    position: { desktop: { x: 40, y: 48 }, tablet: { x: 36, y: 44 }, mobile: { x: 34, y: 46 } },
    size: { desktop: { width: 130, height: 44 }, tablet: { width: 120, height: 42 }, mobile: { width: 110, height: 40 } },
    zIndex: 26,
    floatDuration: 4.8,
    floatDelay: 1,
    parallaxDepth: 0.07,
    entranceDelay: 0.9,
    hiddenOnMobile: true,
  },
  {
    id: "audio-dad",
    type: "audio",
    layer: "front",
    label: "Dad's voice",
    duration: "02:18",
    position: { desktop: { x: 46, y: 2 }, tablet: { x: 40, y: 0 }, mobile: { x: 38, y: -4 } },
    size: { desktop: { width: 148, height: 56 }, tablet: { width: 130, height: 50 }, mobile: { width: 115, height: 46 } },
    zIndex: 27,
    floatDuration: 5.5,
    floatDelay: 0.6,
    parallaxDepth: 0.08,
    entranceDelay: 0.55,
  },
  {
    id: "video-concert",
    type: "video",
    layer: "front",
    src: heroImages.concert,
    alt: "Concert night — music that moves your soul",
    priority: true,
    position: { desktop: { x: 40, y: -30 }, tablet: { x: 36, y: -26 }, mobile: { x: 34, y: -28 } },
    size: { desktop: { width: 135, height: 95 }, tablet: { width: 115, height: 82 }, mobile: { width: 95, height: 68 } },
    zIndex: 23,
    floatDuration: 6,
    floatDelay: 1.8,
    parallaxDepth: 0.06,
    entranceDelay: 0.6,
  },
  {
    id: "badge-location",
    type: "badge",
    layer: "front",
    label: "Paris, France",
    sublabel: "May 12, 2024",
    position: { desktop: { x: 50, y: -42 }, tablet: { x: 44, y: -38 }, mobile: { x: 42, y: -40 } },
    zIndex: 28,
    floatDuration: 5.2,
    floatDelay: 2.2,
    parallaxDepth: 0.08,
    entranceDelay: 0.7,
    hiddenOnMobile: true,
  },
];

/** All hero image URLs — used for preload */
export const heroPreloadUrls = [
  ...Object.values(heroImages),
  "/glass.png",
];

export const animationConfig = {
  floatAmplitude: 8,
  parallaxDepth: {
    background: 0.02,
    deepMemories: 0.04,
    midMemories: 0.06,
    frontMemories: 0.08,
    glasses: 0.12,
  },
};
