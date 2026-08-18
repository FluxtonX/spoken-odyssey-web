export const mosaicConfig = {
  composition: {
    desktop: { height: 720 },
    tablet: { height: 620 },
    mobile: { height: 580 },
  },

  timings: {
    mosaicADuration: 3.5,
    mosaicBDuration: 3.5,
    mosaicCDuration: 3.5,
    morphDuration: 1.8,
    entranceDuration: 1.1,
    morphEase: "power2.inOut",
    idleFloatDuration: 4.5,
    loopPause: 1.5,
  },

  parallax: {
    enabled: true,
    maxOffset: 14,
    depths: {
      deep: 0.03,
      mid: 0.05,
      front: 0.08,
      glasses: 0.11,
    },
  },

  glasses: {
    src: "/glass.png",
    desktop: { width: 320, height: 200 },
    tablet: { width: 260, height: 162 },
    mobile: { width: 210, height: 130 },
    glowColor: "rgba(79, 55, 255, 0.28)",
  },
};

export const MOSAIC_PHASES = [
  { id: "mosaicA", label: "Editorial Scatter" },
  { id: "mosaicB", label: "Cinematic Depth Stack" },
  { id: "mosaicC", label: "Immersive Photo Wall" },
];
