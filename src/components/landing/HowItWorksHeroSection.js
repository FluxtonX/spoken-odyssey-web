"use client";

import { motion } from "framer-motion";
import {
  Mic,
  CloudUpload,
  Sparkles,
  Users,
  Infinity as InfinityIcon,
  Lock,
  ArrowRight,
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

const FEATURE_CARDS = [
  {
    id: "capture",
    icon: Mic,
    title: "Capture effortlessly",
    description:
      "Record daily moments, big milestones or simple thoughts — whenever inspiration strikes.",
    image: "/howitworks/card_capture.jpg?v=3",
  },
  {
    id: "upload",
    icon: CloudUpload,
    title: "Everything in one place",
    description:
      "Your memories are securely stored in the cloud, organized and easy to find.",
    image: "/howitworks/card_upload.jpg?v=3",
  },
  {
    id: "enhance",
    icon: Sparkles,
    title: "AI brings it to life",
    description:
      "Automatic highlights, transcriptions and smart organization help you rediscover what matters most.",
    image: "/howitworks/card_enhance.jpg?v=3",
  },
  {
    id: "share",
    icon: Users,
    title: "Share and connect",
    description:
      "Invite family, choose who can see what, and keep your stories private and secure.",
    image: "/howitworks/card_share.jpg?v=3",
  },
];

export default function HowItWorksHeroSection({
  backgroundImage = "/howitworks.png",
}) {
  return (
    <section
      className="relative overflow-hidden min-h-screen lg:min-h-[1024px] flex flex-col justify-between pt-20 sm:pt-24 pb-12 sm:pb-16 bg-no-repeat bg-cover bg-[position:center_bottom]"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col justify-between gap-4 sm:gap-6">
        
        {/* ── TOP SECTION: LEFT HEADING & RIGHT 5-STEPS ── */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8 w-full">
          {/* Left Heading (Elevated higher) */}
          <motion.div
            className="space-y-1.5 max-w-xs sm:max-w-sm text-left flex-shrink-0 pt-0 sm:-mt-6 lg:-mt-10 xl:-mt-12"
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold italic text-[#1d4ed8] tracking-wide">
              <span>It&apos;s your journey</span>
              <span className="not-italic text-sm sm:text-base text-[#1d4ed8]">
                ♡
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold leading-[1.08] tracking-tight text-slate-950">
              How it{" "}
              <span className="text-[#1d4ed8]">works.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium pt-0.5">
              Simple steps to capture what matters
              <br />
              and keep it forever.
            </p>
          </motion.div>

          {/* Right 5 Steps Flow - Positioned below heading end level, pure black text */}
          <div className="lg:w-[74%] xl:w-[76%] lg:ml-auto w-full relative pt-2 sm:pt-4 lg:pt-14 xl:pt-16">
            {/* Crisp Connecting Line Across Steps */}
            <div className="hidden sm:block absolute top-[26px] sm:top-[32px] lg:top-[74px] xl:top-[82px] left-[10%] right-[10%] z-0 pointer-events-none">
              <svg
                className="w-full h-4 overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Solid clean white connecting line */}
                <line
                  x1="0%"
                  y1="8"
                  x2="100%"
                  y2="8"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2.5"
                />
                {/* Luminous center dots between each step */}
                <circle cx="12.5%" cy="8" r="3.5" fill="#ffffff" />
                <circle cx="37.5%" cy="8" r="3.5" fill="#ffffff" />
                <circle cx="62.5%" cy="8" r="3.5" fill="#ffffff" />
                <circle cx="87.5%" cy="8" r="3.5" fill="#ffffff" />
              </svg>
            </div>

            {/* Steps Nodes */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 relative z-10 items-start">
              {STEPS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + idx * 0.07,
                      ease,
                    }}
                    className="flex flex-col items-center text-center group cursor-default"
                  >
                    {/* Circle Node */}
                    <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] border-2 border-white flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1d4ed8] stroke-[2.2]" />
                    </div>

                    {/* Step Labels - Pure Black (pavour black) with drop shadow */}
                    <div className="mt-1.5 sm:mt-2 flex flex-col items-center">
                      <p className="text-[11px] sm:text-xs font-black text-[#1d4ed8]">
                        {item.step}
                      </p>
                      <h3 className="text-xs sm:text-sm font-black text-black mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                        {item.title}
                      </h3>
                      <p className="text-[9.5px] sm:text-[10.5px] font-bold text-black leading-tight mt-0.5 max-w-[110px] sm:max-w-[125px] mx-auto drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: 4 COMPACT CARDS & PRIVACY LABEL ALIGNED UNDER STEPS ── */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8 w-full mt-5 sm:mt-8 lg:mt-10">
          {/* Left Spacer to preserve astronaut artwork visibility */}
          <div className="hidden lg:block max-w-xs sm:max-w-sm w-full flex-shrink-0 pointer-events-none" />

          {/* Right Column: 4 Minimized Cards + Privacy Label */}
          <div className="lg:w-[74%] xl:w-[76%] lg:ml-auto w-full flex flex-col gap-3 sm:gap-3.5">
            {/* 4 Minimized Image Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 items-stretch">
              {FEATURE_CARDS.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.08 * (idx + 1),
                      ease,
                    }}
                    className="rounded-2xl bg-white border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] overflow-visible flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                  >
                    {/* Card Image Container (overflow-hidden with rounded top) */}
                    <div className="relative h-24 sm:h-26 md:h-28 w-full rounded-t-2xl overflow-hidden bg-slate-100">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Single Clean Floating Icon Badge sitting directly on boundary */}
                    <div className="relative w-full px-3 sm:px-3.5 h-0">
                      <div className="absolute -top-3.5 left-3 sm:left-3.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-md border-2 border-white transition-transform group-hover:scale-110">
                        <CardIcon size={14} className="stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="pt-4 sm:pt-4.5 pb-3 px-3 sm:px-3.5 flex flex-col justify-between flex-1 text-left">
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-[10.5px] text-slate-500 font-normal leading-relaxed mt-0.5">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Privacy Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.45, ease }}
              className="flex justify-center w-full mt-0.5 sm:mt-1"
            >
              <div className="inline-flex items-center justify-between gap-3 sm:gap-5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm px-4 sm:px-5 py-1.5 sm:py-2 max-w-lg w-full">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#0062ff] flex items-center justify-center text-white shadow-xs flex-shrink-0">
                    <Lock size={12} className="stroke-[2.4]" />
                  </div>
                  <p className="text-[10.5px] sm:text-xs font-bold text-slate-800 leading-tight">
                    Your story is private, secure and always yours.
                  </p>
                </div>
                <a
                  href="/privacy"
                  className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-semibold text-[#0062ff] hover:text-[#0052d9] transition-colors whitespace-nowrap"
                >
                  <span>Learn more about privacy</span>
                  <ArrowRight size={12} strokeWidth={2.5} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
