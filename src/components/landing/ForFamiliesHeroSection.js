"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  Shield,
  Users,
  Heart,
  Layers,
  Cloud,
  BookOpen,
  Video,
  Send,
  Lock,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];


/* ── Feature strip ── */
const FEATURES = [
  {
    Icon: Lock,
    title: "Private & Secure",
    desc: "Your family, your stories. Only invite who you trust.",
  },
  {
    Icon: Heart,
    title: "Build Together",
    desc: "Everyone can add, share and celebrate memories.",
  },
  {
    Icon: Layers,
    title: "Organized for Generations",
    desc: "Timelines, collections and memories that grow with you.",
  },
  {
    Icon: Shield,
    title: "Always Yours",
    desc: "You control your legacy. We keep it safe.",
  },
  {
    Icon: Cloud,
    title: "Access Anywhere",
    desc: "Anytime, anywhere, on any device.",
  },
];

/* ── "What families are creating" cards ── */
const CREATING_CARDS = [
  {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    Icon: Layers,
    title: "Family Timelines",
    desc: "Capture life moments in beautiful chronological timelines.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80",
    Icon: BookOpen,
    title: "Story Collections",
    desc: "Organize memories by themes, events or special people.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
    Icon: Send,
    title: "Legacy Letters",
    desc: "Write letters for your loved ones. For today or for the future.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    Icon: Video,
    title: "Voice & Video Stories",
    desc: "Hear the voices. See the moments. Keep the memories alive.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=600&q=80",
    Icon: Heart,
    title: "Pass it On",
    desc: "Choose what's shared and when. Your legacy, their future.",
  },
];

export default function ForFamiliesHeroSection({
  backgroundImage = "/family.png",
}) {
  return (
    <div>
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* Background image + left-white gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt="For Families background"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.45) 52%, transparent 70%)",
            }}
          />
        </div>


        {/* Left-side text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex items-center min-h-screen">
          <div className="w-full py-28">
            <motion.div
              className="space-y-6 max-w-lg"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              {/* Eyebrow */}
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
                  Every family has a story.
                </p>
                <p
                  className="italic font-semibold text-base md:text-lg"
                  style={{ color: "#4f37ff" }}
                >
                  Leave a legacy of love.{" "}
                  <span className="not-italic" aria-hidden="true">♡</span>
                </p>
              </motion.div>

              {/* Main heading */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              >
                <h1
                  className="font-extrabold leading-[1.05] tracking-tight"
                  style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
                >
                  <span style={{ color: "#1a0a2e" }}>For families.</span>
                  <br />
                  <span style={{ color: "#4f37ff" }}>For generations.</span>
                </h1>
              </motion.div>

              {/* Description lines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="space-y-1"
              >
                {[
                  "Capture the moments that matter.",
                  "Cherish your memories together.",
                  "Pass them on forever.",
                ].map((line, i) => (
                  <p
                    key={i}
                    className="text-base md:text-lg font-medium"
                    style={{ color: "#52496d" }}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease }}
                className="flex flex-wrap items-center gap-4 pt-1"
              >
                {/* Primary */}
                <Link
                  id="families-create-btn"
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full font-bold text-white text-sm px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #3521dc 0%, #4f37ff 100%)",
                    boxShadow:
                      "0 10px 28px -4px rgba(79,55,255,0.38), 0 4px 10px -2px rgba(79,55,255,0.22)",
                  }}
                >
                  Create your family space
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </Link>

                {/* Secondary */}
                <Link
                  id="families-howitworks-btn"
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-full font-bold text-sm px-6 py-3.5 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border"
                  style={{
                    borderColor: "rgba(79,55,255,0.25)",
                    color: "#1a0a2e",
                    background: "rgba(255,255,255,0.80)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Play
                    size={13}
                    style={{ fill: "#4f37ff", color: "#4f37ff" }}
                  />
                  See how it works
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES STRIP
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col gap-2"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(79,55,255,0.08)" }}
                >
                  <Icon size={16} style={{ color: "#4f37ff" }} />
                </div>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          WHAT FAMILIES ARE CREATING
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              What families are creating
            </h2>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ color: "#4f37ff" }}
            >
              Explore all features
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* 5 portrait image cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CREATING_CARDS.map(({ image, Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.09 }}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="rounded-2xl overflow-hidden mb-3 relative"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                {/* Card label */}
                <div className="flex items-start gap-2 px-1">
                  <div
                    className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(79,55,255,0.09)" }}
                  >
                    <Icon size={12} style={{ color: "#4f37ff" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECURITY BANNER
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(79,55,255,0.08)" }}
            >
              <Shield size={18} style={{ color: "#4f37ff" }} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm md:text-base">
                Your family. Your legacy. Protected for generations.
              </p>
              <p className="text-xs text-gray-500 mt-0.5 max-w-lg">
                Enterprise-grade security to keep your stories safe, private,
                and always accessible to your loved ones.
              </p>
            </div>
          </div>

          {/* Right */}
          <Link
            id="families-security-btn"
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 rounded-full border font-bold text-sm px-5 py-2.5 whitespace-nowrap transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5 flex-shrink-0"
            style={{
              borderColor: "rgba(79,55,255,0.28)",
              color: "#1a0a2e",
            }}
          >
            Learn about security
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
