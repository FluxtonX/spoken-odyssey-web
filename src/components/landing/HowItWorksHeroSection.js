"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Edit3,
  Heart,
  Lock,
  ArrowUpRight,
  Play,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const PROFILE_IMAGES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=85",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=85",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=85",
];

const STEPS = [
  {
    num: 1,
    title: "Capture",
    desc: "Record voice, take photos, video or write your memories.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    alt: "Camera for capturing memories",
  },
  {
    num: 2,
    title: "Reflect",
    desc: "Add thoughts, feelings and moments that shape your story.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80",
    alt: "Laptop displaying digital memories",
  },
  {
    num: 3,
    title: "Relive",
    desc: "Rediscover your journey anytime, anywhere.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80",
    alt: "Smartphone showing story app",
  },
  {
    num: 4,
    title: "Share & Inspire",
    desc: "Choose who can see your story and inspire future generations.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&q=80",
    alt: "Tablet displaying family photos",
  },
];

export default function HowItWorksHeroSection({
  backgroundImage = "/howitworks.png",
}) {
  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Background Image - Clean full opacity hero artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="How Spoken Odyssey works background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-6 md:px-12 py-20 lg:py-24">
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="space-y-1"
            >
              <p
                className="italic font-semibold text-base md:text-lg flex items-center gap-1.5"
                style={{ color: "#4f37ff" }}
              >
                Every story begins with a single moment.{" "}
                <span className="not-italic text-sm" aria-hidden="true">♡</span>
              </p>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1a0a2e] leading-[1.1]">
                How <br />
                <span style={{ color: "#4f37ff" }}>Spoken Odyssey</span> <br />
                works.
              </h1>
            </motion.div>

            {/* 3 Bullet Points with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="space-y-4 pt-1"
            >
              {/* Bullet 1 */}
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    background: "rgba(79, 55, 255, 0.08)",
                    border: "1px solid rgba(79, 55, 255, 0.15)",
                  }}
                >
                  <Camera size={18} style={{ color: "#4f37ff" }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    Capture what matters.
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                    Hold on to what truly counts.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    background: "rgba(79, 55, 255, 0.08)",
                    border: "1px solid rgba(79, 55, 255, 0.15)",
                  }}
                >
                  <Edit3 size={18} style={{ color: "#4f37ff" }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    Give your story meaning.
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                    Turn moments into milestones.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    background: "rgba(79, 55, 255, 0.08)",
                    border: "1px solid rgba(79, 55, 255, 0.15)",
                  }}
                >
                  <Heart size={18} style={{ color: "#4f37ff" }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    Leave a legacy that lives.
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
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
              <div
                className="inline-flex items-center gap-3.5 rounded-2xl px-4 py-3 bg-white/95 border border-indigo-100 shadow-md backdrop-blur-sm"
              >
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
                    Real people. <span style={{ color: "#4f37ff" }}>Real impact.</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── BOTTOM SECURITY BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="mt-20 lg:mt-28"
        >
          <div
            className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl p-5 sm:px-8 sm:py-5 bg-white/95 border border-indigo-100/90 shadow-md backdrop-blur-sm"
          >
            {/* Left Info */}
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{
                  background: "rgba(79, 55, 255, 0.08)",
                  border: "1px solid rgba(79, 55, 255, 0.2)",
                }}
              >
                <Lock size={18} style={{ color: "#4f37ff" }} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Your story. Your rules. Your legacy.
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                  Enterprise-grade security to protect what matters most.
                </p>
              </div>
            </div>

            {/* Right Button */}
            <Link
              id="howitworks-see-all-features-btn"
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 text-gray-900 bg-white hover:bg-slate-50 font-bold text-xs sm:text-sm px-6 py-2.5 transition-all duration-200 shadow-sm hover:scale-105 flex-shrink-0"
            >
              See all features
              <ArrowUpRight size={14} style={{ color: "#4f37ff" }} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
