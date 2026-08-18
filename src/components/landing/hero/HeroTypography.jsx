"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { heroAvatars } from "@/lib/hero/heroAssets";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroTypography() {
  return (
    <div className="relative z-20 max-w-xl text-left">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.55, ease }}
          className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5a42ff]"
        >
          Life Storytelling, Simplified
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.65, ease, delay: 0.04 }}
          className="mt-4 text-[38px] font-black leading-[0.98] tracking-[-0.02em] text-[#211934] sm:text-[52px] lg:text-[58px]"
        >
          Your life. Every moment.{" "}
          <span className="text-[#4f37ff]">Forever preserved.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          className="mt-5 max-w-lg text-sm font-semibold leading-relaxed text-[#645b78] sm:text-base"
        >
          Odyssey Glasses capture life as it happens. Relive your stories through voice, images, and memories that matter most.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="mt-7 flex flex-wrap items-center gap-3.5"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4f37ff] px-5 py-3 text-xs font-extrabold text-white shadow-[0_16px_34px_rgba(79,55,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#3521dc]"
          >
            Begin Your Journey
            <ArrowRight size={14} />
          </Link>
          <a
            href="#steps"
            className="inline-flex items-center gap-2 rounded-full border border-[#ddd5ff] bg-white px-5 py-3 text-xs font-extrabold text-[#4d426b] transition hover:-translate-y-0.5 hover:bg-[#eef2ff]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef2ff] text-[#4f37ff]">
              <Play size={12} fill="currentColor" />
            </span>
            See How It Works
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.16 }}
          className="mt-7"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9c94ac]">
            Trusted by thousands of families
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {heroAvatars.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
                  style={{ zIndex: heroAvatars.length - index }}
                />
              ))}
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#4f37ff] shadow-sm">
              +2K
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
