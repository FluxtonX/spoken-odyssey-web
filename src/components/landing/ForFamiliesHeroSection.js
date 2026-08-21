"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  ShieldCheck,
  Users,
  Heart,
  Trees,
  Cloud,
  BookOpen,
  Mic,
  Mail,
  Share2,
  Layers,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

/* ── 5 Feature items below hero ── */
const FEATURES = [
  {
    Icon: Users,
    title: "Private & Secure",
    line1: "Your family, your stories.",
    line2: "Only invite who you trust.",
  },
  {
    Icon: Heart,
    title: "Build Together",
    line1: "Everyone can add, share",
    line2: "and celebrate memories.",
  },
  {
    Icon: Trees,
    title: "Organized for Generations",
    line1: "Timelines, collections and",
    line2: "memories that grow with you.",
  },
  {
    Icon: ShieldCheck,
    title: "Always Yours",
    line1: "You control your legacy.",
    line2: "We keep it safe.",
  },
  {
    Icon: Cloud,
    title: "Access Anywhere",
    line1: "Anytime, anywhere,",
    line2: "on any device.",
  },
];

/* ── "What families are creating" 5 Cards using local images ── */
const CREATING_CARDS = [
  {
    image: "/family_timelines.jpg",
    Icon: BookOpen,
    title: "Family Timelines",
    desc: "Capture life moments in beautiful chronological timelines.",
  },
  {
    image: "/story_collections.jpg",
    Icon: Layers,
    title: "Story Collections",
    desc: "Organize memories by themes, events or special people.",
  },
  {
    image: "/legacy_letters.jpg",
    Icon: Mail,
    title: "Legacy Letters",
    desc: "Write letters for your loved ones. For today or for the future.",
  },
  {
    image: "/voice_video.jpg",
    Icon: Mic,
    title: "Voice & Video Stories",
    desc: "Hear the voices. See the moments. Keep the memories alive.",
  },
  {
    image: "/pass_it_on.jpg",
    Icon: Share2,
    title: "Pass it On",
    desc: "Choose what's shared and when. Your legacy, their future.",
  },
];

export default function ForFamiliesHeroSection({
  backgroundImage = "/family.png",
}) {
  return (
    <div className="bg-[#fcfbfe] text-slate-900 font-sans selection:bg-[#4f37ff]/10">
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24 min-h-[85vh] lg:min-h-[92vh] flex items-center">
        {/* Unblurred background image extending fully to the top of the viewport */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt="For Families background"
            className="w-full h-full object-cover object-top"
          />
          {/* Subtle minimal tint on left edge for crisp text readability without hiding/blurring sky */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)",
            }}
          />
        </div>

        {/* Hero content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="max-w-xl py-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
              className="space-y-5"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="space-y-0.5"
              >
                <p className="italic font-semibold text-sm sm:text-base text-[#4f37ff]">
                  Every family has a story.
                </p>
                <p className="italic font-semibold text-sm sm:text-base text-[#4f37ff]">
                  Leave a legacy of love.{" "}
                  <span className="not-italic text-sm" aria-hidden="true">
                    ♡
                  </span>
                </p>
              </motion.div>

              {/* Main Minimized Heading */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] tracking-tight">
                  <span className="text-[#1a0a2e] block">For families.</span>
                  <span className="text-[#4f37ff] block">For generations.</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="space-y-0.5 text-xs sm:text-sm font-medium text-[#52496d]"
              >
                <p>Capture the moments that matter.</p>
                <p>Cherish your memories together.</p>
                <p>Pass them on forever.</p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                {/* Primary Pill Button */}
                <Link
                  id="families-create-btn"
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full font-bold text-white text-xs sm:text-sm px-6 sm:px-7 py-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-[0_8px_24px_rgba(79,55,255,0.32)]"
                  style={{
                    background: "linear-gradient(135deg, #3521dc 0%, #4f37ff 100%)",
                  }}
                >
                  Create your family space
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </Link>

                {/* Secondary Glass Pill Button */}
                <Link
                  id="families-howitworks-btn"
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-full font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border border-[#4f37ff]/25 text-[#1a0a2e] bg-white/80 backdrop-blur-md hover:bg-white shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#4f37ff]/10 flex items-center justify-center text-[#4f37ff]">
                    <Play size={10} className="fill-[#4f37ff] ml-0.5" />
                  </div>
                  See how it works
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2ND SECTION: 5 FEATURES STRIP (SINGLE HORIZONTAL ROW, NO OVERLAP)
      ════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto relative z-20 -mt-6 sm:-mt-10 mb-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.04)] border border-purple-100/80 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3">
            {FEATURES.map(({ Icon, title, line1, line2 }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-3 p-1 min-w-0"
              >
                {/* Left aligned icon badge */}
                <div className="w-10 h-10 rounded-xl bg-[#f0edff] flex items-center justify-center flex-shrink-0 text-[#4f37ff]">
                  <Icon size={18} strokeWidth={2} />
                </div>
                {/* Right aligned text without overlap */}
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#1a0a2e] leading-snug break-words">
                    {title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-tight mt-0.5">
                    <span className="block">{line1}</span>
                    <span className="block">{line2}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3RD SECTION: WHAT FAMILIES ARE CREATING (5 CARDS WITH LOCAL ASSETS)
      ════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a0a2e]">
            What families are creating
          </h2>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#4f37ff] hover:underline transition-all"
          >
            Explore all features
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* 5 Cards Row - Compact height with wide landscape aspect ratio and local assets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CREATING_CARDS.map(({ image, Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Exact wide landscape photo cropped from screenshot */}
              <div className="relative aspect-[1.96/1] w-full overflow-hidden bg-slate-100">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Info with Icon on left */}
              <div className="p-3 sm:p-3.5 flex items-start gap-2.5 bg-white flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#f0edff] flex items-center justify-center flex-shrink-0 text-[#4f37ff] mt-0.5">
                  <Icon size={14} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-[13px] font-extrabold text-[#1a0a2e] leading-snug">
                    {title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-1">
                    {desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4TH SECTION: SECURITY CARD BANNER
      ════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16">
        <div className="bg-[#f3efff] border border-[#e4daff] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:px-8 lg:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          {/* Left badge & text */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-[#4f37ff]/20 flex items-center justify-center text-[#4f37ff] shadow-sm flex-shrink-0">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#1a0a2e] leading-snug">
                Your family. Your legacy. Protected for generations.
              </h3>
              <p className="text-xs sm:text-sm text-[#52496d] mt-0.5 leading-relaxed max-w-2xl">
                Enterprise-grade security to keep your stories safe, private, and always accessible to your loved ones.
              </p>
            </div>
          </div>

          {/* Right button */}
          <Link
            id="families-security-btn"
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#4f37ff]/40 text-[#4f37ff] bg-white font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2.5 hover:bg-[#4f37ff]/5 transition-all shadow-sm whitespace-nowrap flex-shrink-0"
          >
            Learn about security
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
