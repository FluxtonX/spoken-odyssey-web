"use client";

import { motion } from "framer-motion";

export default function HeroAtmosphere() {
  return (
    <>
      {/* Layer 1: Soft purple radial gradient orbs - creates depth */}
      <motion.div
        className="absolute top-10 right-0 w-[600px] h-[600px] bg-[#6d5cff]/12 rounded-full blur-[130px] pointer-events-none"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2: Purple accent orb */}
      <motion.div
        className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#5544ff]/8 rounded-full blur-[120px] pointer-events-none"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Layer 3: Central atmospheric bloom - subtle purple */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4f37ff]/15 rounded-full blur-[100px] pointer-events-none"
        animate={{ opacity: [0.5, 0.75, 0.5], scale: [1, 1.03, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Layer 4: Subtle vignette for depth */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-20" style={{
        backgroundImage: `radial-gradient(ellipse at center, transparent 0%, rgba(120, 113, 108, 0.1) 100%)`
      }} />

      {/* Layer 5: Soft top fade for premium feel */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
    </>
  );
}
