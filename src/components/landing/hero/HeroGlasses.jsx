"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";

const HeroGlasses = forwardRef(function HeroGlasses(
  { parallaxOffset = { x: 0, y: 0 }, className = "" },
  ref
) {
  const { src, glowColor } = mosaicConfig.glasses;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className={`absolute will-change-transform pointer-events-none ${className}`}
      style={{
        zIndex: 25,
        transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
        transition: "transform 0.18s ease-out",
      }}
    >
      <div className="relative w-full h-full">
        {/* Soft ambient lighting aura */}
        <div
          className="absolute inset-[12%] rounded-full blur-3xl pointer-events-none"
          style={{ background: glowColor }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-8%] left-1/2 h-[22px] w-[68%] -translate-x-1/2 rounded-full bg-[#4f37ff]/18 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Pure Transparent Smart Glasses Asset */}
        <img
          src={src}
          alt="Spoken Odyssey Smart Recording Glasses"
          className="relative z-10 h-full w-full object-contain filter drop-shadow-[0_24px_45px_rgba(79,55,255,0.28)]"
          draggable={false}
        />
      </div>
    </motion.div>
  );
});

export default HeroGlasses;
