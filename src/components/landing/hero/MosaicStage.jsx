"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";
import { useReducedMotion } from "./hooks/useReducedMotion";
import MosaicLayoutA from "./layouts/MosaicLayoutA";
import MosaicLayoutB from "./layouts/MosaicLayoutB";
import MosaicLayoutC from "./layouts/MosaicLayoutC";

const LAYOUTS = [
  { id: "a", label: "Editorial Scatter", Component: MosaicLayoutA },
  { id: "b", label: "Cinematic Stack", Component: MosaicLayoutB },
  { id: "c", label: "Photo Wall", Component: MosaicLayoutC },
];

const ease = [0.22, 1, 0.36, 1];

export default function MosaicStage({ isDesktop }) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const holdMs = mosaicConfig.timings.layoutHoldDuration * 1000;

  useEffect(() => {
    if (reducedMotion) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LAYOUTS.length);
    }, holdMs);

    return () => clearInterval(timer);
  }, [holdMs, reducedMotion]);

  const { Component } = LAYOUTS[activeIndex];
  const composition = isDesktop
    ? mosaicConfig.composition.desktop
    : mosaicConfig.composition.tablet;

  return (
    <div className="relative mx-auto flex w-full justify-center lg:justify-end">
      <div
        className="relative"
        style={{ width: composition.width, height: composition.height, maxWidth: "100%" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={LAYOUTS[activeIndex].id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: reducedMotion ? 0 : 0.85, ease }}
            className="absolute inset-0"
          >
            <Component isDesktop={isDesktop} />
          </motion.div>
        </AnimatePresence>

        {/* Layout indicator */}
        <div className="absolute -bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {LAYOUTS.map((layout, index) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "h-2 w-7 bg-[#4f37ff]"
                  : "h-2 w-2 bg-[#b5a9ff] hover:bg-[#4f37ff]"
              }`}
              aria-label={`Show ${layout.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
