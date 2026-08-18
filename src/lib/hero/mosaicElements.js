import { heroImages } from "./heroAssets";

export const mosaicElements = [
  {
    id: "img-dominant",
    type: "photo",
    zBase: 12,
    size: { width: 340, height: 250 },
    content: { src: heroImages.dominant, alt: "Family reunion emotional memory" },
    states: {
      mosaicA: { x: -310, y: -140, scale: 1, rotation: -2, opacity: 1, blur: 0, zIndex: 12 },
      mosaicB: { x: -60, y: 20, scale: 1.25, rotation: -1, opacity: 1, blur: 0, zIndex: 20 },
      mosaicC: { x: -460, y: -190, scale: 1.45, rotation: 0, opacity: 1, blur: 0, zIndex: 8 },
    },
    mobileStates: {
      mosaicA: { x: -120, y: -100, scale: 0.65, rotation: -2, opacity: 1, blur: 0, zIndex: 12 },
      mosaicB: { x: 0, y: 0, scale: 0.95, rotation: 0, opacity: 1, blur: 0, zIndex: 20 },
      mosaicC: { x: -180, y: -120, scale: 1.05, rotation: 0, opacity: 1, blur: 0, zIndex: 8 },
    },
  },
  {
    id: "img-portrait",
    type: "photo",
    zBase: 14,
    size: { width: 210, height: 290 },
    content: { src: heroImages.portrait, alt: "Vertical emotional portrait" },
    states: {
      mosaicA: { x: -160, y: 150, scale: 1, rotation: 3, opacity: 1, blur: 0, zIndex: 14 },
      mosaicB: { x: 120, y: -80, scale: 0.82, rotation: 6, opacity: 0.65, blur: 5, zIndex: 7 },
      mosaicC: { x: -460, y: 160, scale: 1.4, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
    mobileStates: {
      mosaicA: { x: 90, y: 100, scale: 0.6, rotation: 3, opacity: 1, blur: 0, zIndex: 14 },
      mosaicB: { x: 60, y: -60, scale: 0.55, rotation: 5, opacity: 0.6, blur: 4, zIndex: 7 },
      mosaicC: { x: -180, y: 110, scale: 1.0, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
  },
  {
    id: "img-family",
    type: "photo",
    zBase: 11,
    size: { width: 280, height: 210 },
    content: { src: heroImages.family, alt: "Outdoor family steps memory" },
    states: {
      mosaicA: { x: 180, y: 130, scale: 1, rotation: -1.5, opacity: 1, blur: 0, zIndex: 11 },
      mosaicB: { x: -160, y: -100, scale: 0.85, rotation: -4, opacity: 0.7, blur: 4, zIndex: 9 },
      mosaicC: { x: 460, y: -190, scale: 1.45, rotation: 0, opacity: 1, blur: 0, zIndex: 8 },
    },
    mobileStates: {
      mosaicA: { x: -90, y: 120, scale: 0.58, rotation: -2, opacity: 1, blur: 0, zIndex: 11 },
      mosaicB: { x: -70, y: -50, scale: 0.52, rotation: -3, opacity: 0.65, blur: 3, zIndex: 9 },
      mosaicC: { x: 180, y: -120, scale: 1.02, rotation: 0, opacity: 1, blur: 0, zIndex: 8 },
    },
  },
  {
    id: "img-travel",
    type: "photo",
    zBase: 13,
    size: { width: 220, height: 300 },
    content: { src: heroImages.travel, alt: "Hiking mountain adventure memory" },
    states: {
      mosaicA: { x: 340, y: -150, scale: 1, rotation: 2, opacity: 1, blur: 0, zIndex: 13 },
      mosaicB: { x: 170, y: 120, scale: 0.78, rotation: 4, opacity: 0.55, blur: 7, zIndex: 6 },
      mosaicC: { x: 460, y: 160, scale: 1.4, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
    mobileStates: {
      mosaicA: { x: 130, y: -110, scale: 0.58, rotation: 2, opacity: 1, blur: 0, zIndex: 13 },
      mosaicB: { x: 80, y: 70, scale: 0.5, rotation: 3, opacity: 0.5, blur: 5, zIndex: 6 },
      mosaicC: { x: 180, y: 110, scale: 1.0, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
  },
  {
    id: "img-fragment-small",
    type: "photo",
    zBase: 9,
    size: { width: 180, height: 140 },
    content: { src: heroImages.fragmentSmall, alt: "Friends night sky cozy memory" },
    states: {
      mosaicA: { x: -360, y: 190, scale: 0.95, rotation: -3, opacity: 0.9, blur: 0, zIndex: 9 },
      mosaicB: { x: 30, y: -130, scale: 0.7, rotation: -2, opacity: 0.45, blur: 8, zIndex: 5 },
      mosaicC: { x: 0, y: 220, scale: 1.5, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
    mobileStates: {
      mosaicA: { x: -130, y: 150, scale: 0.5, rotation: -3, opacity: 0.85, blur: 0, zIndex: 9 },
      mosaicB: { x: 20, y: -80, scale: 0.45, rotation: -2, opacity: 0.4, blur: 6, zIndex: 5 },
      mosaicC: { x: 0, y: 140, scale: 1.1, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
  },
  {
    id: "img-fragment-top",
    type: "photo",
    zBase: 8,
    size: { width: 190, height: 135 },
    content: { src: heroImages.fragmentTop, alt: "Distant mountain sunset fragment" },
    states: {
      mosaicA: { x: 40, y: -220, scale: 0.88, rotation: 1, opacity: 0.85, blur: 0, zIndex: 8 },
      mosaicB: { x: -180, y: 130, scale: 0.65, rotation: 2, opacity: 0.4, blur: 9, zIndex: 4 },
      mosaicC: { x: 0, y: -230, scale: 1.5, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
    mobileStates: {
      mosaicA: { x: 20, y: -150, scale: 0.5, rotation: 1, opacity: 0.8, blur: 0, zIndex: 8 },
      mosaicB: { x: -90, y: 80, scale: 0.42, rotation: 2, opacity: 0.35, blur: 6, zIndex: 4 },
      mosaicC: { x: 0, y: -140, scale: 1.05, rotation: 0, opacity: 1, blur: 0, zIndex: 7 },
    },
  },
];

export const glassesStates = {
  mosaicA: { x: 120, y: 30, scale: 1, rotation: -2, opacity: 1, zIndex: 25 },
  mosaicB: { x: 60, y: -10, scale: 1.15, rotation: 1, opacity: 1, zIndex: 25 },
  mosaicC: { x: 0, y: -30, scale: 1.1, rotation: 0, opacity: 1, zIndex: 25 },
};

export const glassesStatesMobile = {
  mosaicA: { x: 30, y: 20, scale: 0.75, rotation: -2, opacity: 1, zIndex: 25 },
  mosaicB: { x: 15, y: -5, scale: 0.82, rotation: 1, opacity: 1, zIndex: 25 },
  mosaicC: { x: 0, y: -15, scale: 0.8, rotation: 0, opacity: 1, zIndex: 25 },
};

export const headlineStates = {
  mosaicA: { x: -320, y: -70, scale: 1, opacity: 1, zIndex: 30 },
  mosaicB: { x: -340, y: -70, scale: 1, opacity: 1, zIndex: 30 },
  mosaicC: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 35 },
};

export const headlineStatesMobile = {
  mosaicA: { x: 0, y: -180, scale: 0.9, opacity: 1, zIndex: 30 },
  mosaicB: { x: 0, y: -180, scale: 0.9, opacity: 1, zIndex: 30 },
  mosaicC: { x: 0, y: 0, scale: 0.9, opacity: 1, zIndex: 35 },
};

export function getElementState(item, phase, isDesktop) {
  const bucket = isDesktop ? item.states : item.mobileStates ?? item.states;
  return bucket[phase];
}

export function getGlassesState(phase, isDesktop) {
  const bucket = isDesktop ? glassesStates : glassesStatesMobile;
  return bucket[phase];
}

export function getHeadlineState(phase, isDesktop) {
  const bucket = isDesktop ? headlineStates : headlineStatesMobile;
  return bucket[phase];
}
