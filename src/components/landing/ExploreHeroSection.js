"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const PROFILE_IMAGES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=85",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=85",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=85",
];

export default function ExploreHeroSection({
  backgroundImage = "/explore.png",
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Explore background"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay: strong on left, transparent on right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 30%, rgba(255,255,255,0.35) 55%, transparent 75%)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-28">

          {/* ── LEFT CONTENT ── */}
          <motion.div
            className="space-y-7 max-w-xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease }}
          >

            {/* 1. Eyebrow — italic blue */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="space-y-0.5"
            >
              <p
                className="italic font-semibold text-base md:text-lg"
                style={{ color: "#4f37ff" }}
              >
                Real lives.
              </p>
              <p
                className="italic font-semibold text-base md:text-lg flex items-center gap-1.5"
                style={{ color: "#4f37ff" }}
              >
                Real stories.{" "}
                <span
                  className="not-italic"
                  style={{ color: "#4f37ff" }}
                  aria-hidden="true"
                >
                  ♡
                </span>
              </p>
            </motion.div>

            {/* 2. Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              <h1
                className="font-extrabold leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
              >
                <span style={{ color: "#1a0a2e" }}>Explore</span>
                <br />
                <span style={{ color: "#4f37ff" }}>extraordinary</span>
                <br />
                <span style={{ color: "#1a0a2e" }}>journeys.</span>
              </h1>
            </motion.div>

            {/* 3. Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="text-base md:text-lg leading-relaxed max-w-sm"
              style={{ color: "#52496d" }}
            >
              Be inspired by stories from people who&rsquo;ve lived fully and
              left a legacy worth remembering.
            </motion.p>

            {/* 4. CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
            >
              <Link
                id="explore-start-btn"
                href="/discover"
                className="inline-flex items-center gap-2 rounded-full font-bold text-white text-sm px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #3521dc 0%, #4f37ff 100%)",
                  boxShadow:
                    "0 10px 28px -4px rgba(53,33,220,0.35), 0 4px 10px -2px rgba(79,55,255,0.22)",
                }}
              >
                Start exploring
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </motion.div>

            {/* 5. Bottom Social-Proof Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease }}
              className="mt-4"
            >
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl px-5 py-4"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(79,55,255,0.12)",
                  boxShadow:
                    "0 8px 30px -6px rgba(79,55,255,0.10), 0 2px 8px rgba(0,0,0,0.04)",
                  maxWidth: "480px",
                }}
              >
                {/* Left: Avatars + Text */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Overlapping avatars */}
                  <div className="flex items-center -space-x-3">
                    {PROFILE_IMAGES.map((src, i) => (
                      <motion.img
                        key={i}
                        src={src}
                        alt={`Story narrator ${i + 1}`}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                        style={{ zIndex: PROFILE_IMAGES.length - i }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.7 + i * 0.08,
                          ease,
                        }}
                      />
                    ))}
                    {/* +2k bubble */}
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-extrabold shadow-sm"
                      style={{
                        background: "#eef0ff",
                        color: "#4f37ff",
                        zIndex: 0,
                      }}
                    >
                      +2k
                    </div>
                  </div>

                  {/* Text */}
                  <div className="leading-snug">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "#1a0a2e" }}
                    >
                      Thousands of stories. Countless lessons.
                    </p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#4f37ff" }}
                    >
                      One shared humanity.
                    </p>
                  </div>
                </div>

                {/* Right: See all stories button */}
                <Link
                  id="explore-see-all-btn"
                  href="/discover"
                  className="inline-flex items-center gap-1.5 rounded-full border font-bold text-xs px-4 py-2 whitespace-nowrap transition-all duration-200 hover:bg-[#f5f3ff] hover:-translate-y-0.5 active:scale-95 flex-shrink-0"
                  style={{
                    borderColor: "rgba(79,55,255,0.3)",
                    color: "#1a0a2e",
                  }}
                >
                  See all stories
                  <ArrowUpRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT CONTENT (empty – background image fills it) ── */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
