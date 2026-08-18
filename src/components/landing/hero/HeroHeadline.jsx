"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Mic, ShieldCheck, Heart } from "lucide-react";

const HeroHeadline = forwardRef(function HeroHeadline(props, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 max-w-xl text-left pointer-events-auto mt-2 lg:mt-4"
    >
      {/* Floating Badge — Spoken Odyssey Voice Memory */}
      <div className="inline-flex items-center gap-2 rounded-full bg-[#4f37ff]/10 border border-[#4f37ff]/20 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#4f37ff] mb-3.5 shadow-xs">
        <Mic size={13} className="text-[#4f37ff] animate-pulse" />
        Spoken Odyssey • Memory Vault
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black leading-[0.98] tracking-[-0.025em] text-[#211934] drop-shadow-xs">
        Your life is a story.<br />
        <span className="bg-gradient-to-r from-[#4f37ff] via-[#6a54ff] to-[#8c7aff] bg-clip-text text-transparent">
          Preserve every chapter.
        </span>
      </h1>

      {/* Minimal Subtitle */}
      <p className="mt-4 text-base sm:text-lg font-semibold leading-relaxed text-[#645b78] max-w-md drop-shadow-xs">
        Capture your reflections, audio stories, and photo memories directly into a permanent family archive.
      </p>

      {/* Floating CTAs */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2.5 rounded-full bg-[#4f37ff] px-8 py-4 text-sm font-black text-white shadow-[0_16px_36px_rgba(79,55,255,0.32)] transition hover:-translate-y-0.5 hover:bg-[#3b25e3] active:scale-95 group"
        >
          Begin Your Journey
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href="#steps"
          className="inline-flex items-center gap-2.5 rounded-full border border-stone-200 bg-white/90 backdrop-blur-md px-7 py-4 text-sm font-extrabold text-[#4d426b] transition hover:bg-white hover:border-[#4f37ff]/40 shadow-xs"
        >
          <Play size={14} fill="#4f37ff" className="text-[#4f37ff]" />
          See How It Works
        </a>
      </div>

      {/* Feature Micro-Badges */}
      <div className="mt-7 flex flex-wrap items-center gap-5 text-xs font-bold text-[#8c829e]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" />
          Private Vault
        </span>
        <span className="flex items-center gap-1.5">
          <Heart size={14} className="text-rose-500" />
          Family Heritage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4f37ff]" />
          Smart Glasses Sync
        </span>
      </div>
    </motion.div>
  );
});

export default HeroHeadline;
