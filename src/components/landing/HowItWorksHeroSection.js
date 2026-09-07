"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Edit3,
  Heart,
  Lock,
  ArrowUpRight,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const PROFILE_IMAGES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=85",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=85",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=85",
];

export default function HowItWorksHeroSection({
  backgroundImage = "/howitworks.png",
}) {
  return (
    <div className="bg-[#fcfbfe] text-slate-900 font-sans selection:bg-[#4f37ff]/10">
      {/* ════════════════════════════════════════════════════════
          HERO SECTION (EXACT 3:2 ASPECT RATIO - SHOWS FULL HOWITWORKS.PNG WITH MINIMIZED ZOOM)
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-14 pb-5 sm:pb-7 lg:pb-8 min-h-[560px] sm:min-h-[620px] lg:min-h-0 lg:aspect-[1536/1024] flex flex-col justify-between">
        {/* Background Image - Clean full opacity hero artwork */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt="How Spoken Odyssey works background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-[1360px] mx-auto px-6 md:px-12 w-full pt-1 sm:pt-2">
          <div className="max-w-xl">
            {/* ── LEFT COLUMN ── */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="space-y-0.5"
              >
                <p
                  className="italic font-semibold text-xs sm:text-sm flex items-center gap-1.5"
                  style={{ color: "#4f37ff" }}
                >
                  Every story begins with a single moment.{" "}
                  <span className="not-italic text-sm" aria-hidden="true">
                    ♡
                  </span>
                </p>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#1a0a2e] leading-[1.12] tracking-tight">
                  How <br />
                  <span style={{ color: "#4f37ff" }}>Spoken Odyssey</span> <br />
                  works.
                </h1>
              </motion.div>

              {/* 3 Bullet Points with Icons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="space-y-3 pt-0.5"
              >
                {/* Bullet 1 */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      background: "rgba(79, 55, 255, 0.08)",
                      border: "1px solid rgba(79, 55, 255, 0.15)",
                    }}
                  >
                    <Camera size={15} style={{ color: "#4f37ff" }} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      Capture what matters.
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed">
                      Hold on to what truly counts.
                    </p>
                  </div>
                </div>

                {/* Bullet 2 */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      background: "rgba(79, 55, 255, 0.08)",
                      border: "1px solid rgba(79, 55, 255, 0.15)",
                    }}
                  >
                    <Edit3 size={15} style={{ color: "#4f37ff" }} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      Give your story meaning.
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed">
                      Turn moments into milestones.
                    </p>
                  </div>
                </div>

                {/* Bullet 3 */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      background: "rgba(79, 55, 255, 0.08)",
                      border: "1px solid rgba(79, 55, 255, 0.15)",
                    }}
                  >
                    <Heart size={15} style={{ color: "#4f37ff" }} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      Leave a legacy that lives.
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed">
                      Inspire today. Echo tomorrow.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Social Proof Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease }}
                className="pt-2"
              >
                <div className="inline-flex items-center gap-3.5 rounded-2xl px-4 py-3 bg-white/95 border border-indigo-100 shadow-md backdrop-blur-sm">
                  {/* Avatars */}
                  <div className="flex items-center -space-x-2.5">
                    {PROFILE_IMAGES.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`User avatar ${idx + 1}`}
                        className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <div className="leading-snug">
                    <p className="text-xs font-semibold text-gray-800">
                      Real stories.
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      Real people.{" "}
                      <span style={{ color: "#4f37ff" }}>Real impact.</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── DOWNSIDE SECURITY CARD (NARROW & SLEEK ON BACKGROUND) ── */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 w-full mt-6 sm:mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 bg-white/90 border border-indigo-100/90 shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
              {/* Left Info */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    background: "rgba(79, 55, 255, 0.08)",
                    border: "1px solid rgba(79, 55, 255, 0.2)",
                  }}
                >
                  <Lock size={15} style={{ color: "#4f37ff" }} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug">
                    Your story. Your rules. Your legacy.
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-snug">
                    Enterprise-grade security to protect what matters most.
                  </p>
                </div>
              </div>

              {/* Right Button */}
              <Link
                id="howitworks-see-all-features-btn"
                href="/discover"
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 text-gray-900 bg-white hover:bg-slate-50 font-bold text-[11px] sm:text-xs px-4 py-1.5 transition-all duration-200 shadow-sm hover:scale-105 flex-shrink-0"
              >
                See all features
                <ArrowUpRight size={13} style={{ color: "#4f37ff" }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
