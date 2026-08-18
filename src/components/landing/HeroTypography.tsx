"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface HeroTypographyProps {
  mousePosition: { x: number; y: number };
  isDesktop: boolean;
}

export default function HeroTypography({ mousePosition, isDesktop }: HeroTypographyProps) {
  // Subtle parallax for text (very slow, premium feel)
  const textParallaxX = isDesktop ? mousePosition.x * 4 : 0;

  return (
    <motion.div
      className="space-y-6 md:space-y-8 relative z-10"
      style={{
        x: textParallaxX,
      }}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      {/* Eyebrow label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#6d5cff]/30 text-xs font-extrabold text-[#4f37ff] uppercase tracking-wider shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-[#4f37ff] animate-pulse" />
        Life Storytelling, Simplified
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-extrabold tracking-tight text-[#211934] leading-[1.1]"
      >
        Your life.{" "}
        <br />
        Every moment.{" "}
        <span className="text-[#4f37ff]">
          Forever preserved.
        </span>
      </motion.h1>

      {/* Supporting Text */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="text-lg md:text-xl text-[#645b78] font-medium leading-relaxed max-w-lg"
      >
        Odyssey Glasses capture life as it happens. Relive your stories through voice, images, and memories that matter most.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="flex flex-col sm:flex-row gap-3 pt-2 items-start sm:items-center"
      >
        {/* Primary CTA - Solid purple button */}
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#4f37ff] text-white font-bold shadow-md shadow-[#4f37ff]/30 hover:bg-[#3521dc] active:scale-95 transition-all text-sm whitespace-nowrap"
        >
          Begin Your Journey
          <ArrowRight size={16} />
        </Link>

        {/* Secondary CTA - Text only with play icon */}
        <a
          href="#steps"
          className="inline-flex items-center gap-2 text-[#4f37ff] font-bold hover:opacity-70 transition-opacity text-sm"
        >
          <Play size={14} fill="currentColor" />
          See How It Works
        </a>
      </motion.div>

      {/* Trust indicator */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-xs text-[#6f6985] font-semibold flex items-center gap-2.5 pt-4"
      >
        <span className="w-2 h-2 rounded-full bg-[#4f37ff] inline-block shadow-sm" />
        Trusted by thousands of families • Private sharing • Voice, photo & memories
      </motion.p>
    </motion.div>
  );
}
