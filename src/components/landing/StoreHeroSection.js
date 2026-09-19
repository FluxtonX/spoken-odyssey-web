"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Lock,
  Globe,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

export default function StoreHeroSection() {
  const storeUrl = "https://odyssey-store-ten.vercel.app";

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 bg-gradient-to-b from-[#f3f7fd] via-[#f8fafc] to-[#eef4fb]">
      {/* Subtle cloud aura background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 w-full my-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12 xl:gap-16 w-full">

          {/* ── LEFT HERO CONTENT ── */}
          <motion.div
            className="space-y-4 sm:space-y-6 lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-2 lg:pt-8 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            >
              <p className="italic font-medium text-sm sm:text-base text-[#2563eb] flex items-center gap-1.5">
                It&apos;s your journey{" "}
                <span className="not-italic text-[#2563eb]" aria-hidden="true">
                  ♡
                </span>
              </p>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold leading-[1.08] tracking-tight text-slate-900">
                Spoken Odyssey
                <br />
                <span className="text-[#2563eb]">Store.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="text-xs sm:text-sm leading-relaxed text-slate-600 max-w-xs sm:max-w-sm"
            >
              Tools designed to help you capture life as it happens. Anywhere. Anytime.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="pt-2"
            >
              <a
                id="visit-store-btn"
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full font-bold text-white text-xs sm:text-sm px-6 py-3 transition-all duration-300 bg-[#2563eb] hover:bg-[#1d4ed8] shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:scale-95"
              >
                Visit the store
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </a>
            </motion.div>
          </motion.div>

          {/* ── RIGHT STORE CARDS SECTION ── */}
          <div className="flex-1 w-full flex flex-col gap-4 sm:gap-5">

            {/* 1. Top Featured Card (AI Glasses) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left info */}
                <div className="text-left max-w-sm w-full">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-white bg-[#2563eb] shadow-sm">
                    NEW
                  </span>
                  <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mt-3">
                    AI GLASSES
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mt-1">
                    Capture life
                    <br />
                    hands-free.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5 max-w-xs">
                    Record, listen and relive your moments with AI-powered glasses.
                  </p>
                </div>

                {/* Right Glasses Trio Image */}
                <div className="flex-1 flex justify-center items-center w-full">
                  <img
                    src="/store/glasses-trio.png"
                    alt="AI Glasses collection"
                    className="w-full max-w-[440px] h-auto object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-4 sm:mt-6">
                <span className="w-5 h-1.5 rounded-full bg-[#2563eb]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
            </motion.div>

            {/* 2. Bottom 3 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

              {/* Card 1: Features & Odyssey Token */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease }}
                className="rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[260px] sm:min-h-[290px] text-left"
              >
                <div className="space-y-2.5">
                  {[
                    "HD Recording",
                    "Open-ear audio",
                    "AI highlights",
                    "Seamless sync",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800"
                    >
                      <span className="text-[#2563eb] text-sm leading-none">
                        ◈
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-2 flex justify-center items-center">
                  <img
                    src="/store/odyssey-token.png"
                    alt="Odyssey Token"
                    className="max-h-24 sm:max-h-28 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Card 2: Keep Sake Box */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45, ease }}
                className="rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[260px] sm:min-h-[290px] text-left"
              >
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    KEEP SAKE BOX
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1">
                    Your stories.
                    <br />
                    Beautifully
                    <br />
                    preserved.
                  </h3>
                </div>

                <div className="mt-4 pt-2 flex justify-center items-center">
                  <img
                    src="/store/keepsake-box.png"
                    alt="Keep Sake Box"
                    className="max-h-24 sm:max-h-28 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Card 3: Accessories */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.55, ease }}
                className="rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[260px] sm:min-h-[290px] text-left"
              >
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    ACCESSORIES
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1">
                    Everything you
                    <br />
                    need for your
                    <br />
                    journey.
                  </h3>
                </div>

                <div className="mt-4 pt-2 flex justify-center items-center">
                  <img
                    src="/store/accessories-case.png"
                    alt="Accessories Case"
                    className="max-h-24 sm:max-h-28 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* ── BOTTOM TRUST BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease }}
          className="mt-8 sm:mt-10 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center justify-center gap-2.5 md:border-r md:border-slate-200/80 py-1">
              <Lock size={16} className="text-slate-900 stroke-[2.2]" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 md:border-r md:border-slate-200/80 py-1">
              <Globe size={16} className="text-slate-900 stroke-[2.2]" />
              <span>Worldwide shipping</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 md:border-r md:border-slate-200/80 py-1">
              <RotateCcw size={16} className="text-slate-900 stroke-[2.2]" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-1">
              <ShieldCheck size={17} className="text-slate-900 stroke-[2.2]" />
              <span>2-year warranty</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
