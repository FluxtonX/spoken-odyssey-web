"use client";

import { motion } from "framer-motion";
import {
  Mic,
  CloudUpload,
  Sparkles,
  Users,
  Infinity as InfinityIcon,
  Lock,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    step: "01",
    title: "Capture",
    description: "Record voice, video or text in the moment.",
    icon: Mic,
  },
  {
    step: "02",
    title: "Upload",
    description: "Securely upload and store your memories in the cloud.",
    icon: CloudUpload,
  },
  {
    step: "03",
    title: "Enhance",
    description: "AI helps highlight key moments and organize your story.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "Share",
    description: "Share privately with loved ones, on your terms.",
    icon: Users,
  },
  {
    step: "05",
    title: "Relive",
    description: "Revisit and relive your story anytime, anywhere.",
    icon: InfinityIcon,
  },
];

export default function HowItWorksHeroSection({
  backgroundImage = "/howitworks.png",
}) {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12">
      {/* Background Image - Clean full opacity hero artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="How Spoken Odyssey works background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 w-full my-auto flex flex-col justify-between gap-8 lg:gap-10">

        {/* ── TOP: LEFT CONTENT (HEADING & SUBTITLE) ── */}
        <div className="w-full pt-2 sm:pt-4">
          <motion.div
            className="space-y-2.5 max-w-sm text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            >
              <p className="italic font-semibold text-xs sm:text-sm text-[#1d4ed8] flex items-center gap-1">
                It&apos;s your journey{" "}
                <span className="not-italic text-[#1d4ed8]" aria-hidden="true">
                  ♡
                </span>
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.1] tracking-tight text-slate-950">
                How it{" "}
                <span className="text-[#1d4ed8]">works.</span>
              </h1>
            </motion.div>

            {/* Description - High contrast and visible */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium max-w-[270px] drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]"
            >
              Simple steps to capture what matters and keep it forever.
            </motion.p>
          </motion.div>
        </div>

        {/* ── MIDDLE: 5 STEPS (MINIMIZED GAPS, CENTER ALIGNED, HIGH CONTRAST) ── */}
        <div className="w-full flex justify-center items-center mt-1 sm:mt-2">
          {/* Constrained container so gaps are compact and centered */}
          <div className="relative w-full max-w-3xl lg:max-w-[820px] mx-auto px-2 sm:px-4">

            {/* Glowing SVG Connecting Line */}
            <div className="hidden sm:block absolute top-[28px] sm:top-[32px] left-2 sm:left-4 right-2 sm:right-4 z-0 pointer-events-none">
              <svg
                className="w-full h-6 overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="brightBeamGlow" x="-20%" y="-100%" width="140%" height="300%">
                    <feGaussianBlur stdDeviation="2.5" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Main bright glowing line spanning from first node center (10%) to last node center (90%) */}
                <line
                  x1="10%"
                  y1="12"
                  x2="90%"
                  y2="12"
                  stroke="url(#beamGrad)"
                  strokeWidth="2"
                  filter="url(#brightBeamGlow)"
                />

                {/* Glowing midway dots exactly centered between each pair of steps */}
                <circle cx="20%" cy="12" r="3" fill="#ffffff" filter="url(#brightBeamGlow)" />
                <circle cx="40%" cy="12" r="3" fill="#ffffff" filter="url(#brightBeamGlow)" />
                <circle cx="60%" cy="12" r="3" fill="#ffffff" filter="url(#brightBeamGlow)" />
                <circle cx="80%" cy="12" r="3" fill="#ffffff" filter="url(#brightBeamGlow)" />
              </svg>
            </div>

            {/* Steps Row - Compact Gaps, Center-Aligned */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 relative z-10 items-start">
              {STEPS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + idx * 0.08,
                      ease,
                    }}
                    className="flex flex-col items-center text-center group cursor-default"
                  >
                    {/* Compact Glowing Glass Node */}
                    <div className="relative flex items-center justify-center">
                      {/* Outer soft luminous aura */}
                      <div className="absolute inset-0 rounded-full bg-white/70 blur-md opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />

                      {/* Glass Circle */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-[0_0_22px_rgba(255,255,255,0.9),0_4px_16px_rgba(29,78,216,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,255,255,1),0_6px_22px_rgba(29,78,216,0.3)]">
                        <Icon
                          className="w-6 h-6 sm:w-7 sm:h-7 text-[#1d4ed8] stroke-[2] transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* High-Contrast Visible Step Text */}
                    <div className="mt-2.5 sm:mt-3 flex flex-col items-center">
                      {/* Number */}
                      <p className="text-xs sm:text-[13px] font-black text-[#1d4ed8] tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                        {item.step}
                      </p>

                      {/* Title */}
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                        {item.title}
                      </h3>

                      {/* Description - Darker, bold-medium, fully visible */}
                      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-800 leading-snug mt-1 max-w-[115px] sm:max-w-[130px] mx-auto drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ── BOTTOM: PRIVACY & SECURITY LABEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
          className="flex justify-center w-full pt-1 sm:pt-2"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 px-6 sm:px-8 py-2.5 sm:py-3 shadow-[0_8px_25px_rgba(0,0,0,0.06),0_0_25px_rgba(255,255,255,0.6)] transition-all duration-300 hover:bg-white">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1d4ed8] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Lock size={15} className="stroke-[2.4]" />
            </div>
            <p className="text-xs sm:text-sm md:text-[14.5px] font-bold text-slate-900 tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              Your story is private, secure and always yours.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
