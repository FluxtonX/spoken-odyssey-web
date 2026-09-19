"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const STORIES = [
  {
    id: "adventure",
    badge: "ADVENTURE",
    title: "Breaking limits,\nfinding freedom.",
    author: "By Alex H.",
    image: "/explore/card-adventure.jpg",
    alt: "Mountaineer standing on mountain peak",
  },
  {
    id: "innovation",
    badge: "INNOVATION",
    title: "Building the future\nfrom the ground up.",
    author: "By Sarah K.",
    image: "/explore/card-innovation.jpg",
    alt: "Rocket launch with fiery exhaust",
  },
  {
    id: "arts-culture",
    badge: "ARTS & CULTURE",
    title: "Creating beauty\nthat lasts.",
    author: "By Marcus L.",
    image: "/explore/card-arts.jpg",
    alt: "Musician playing guitar on stage with warm bokeh lights",
  },
  {
    id: "humanity",
    badge: "HUMANITY",
    title: "Changing lives,\none act at a time.",
    author: "By Priya M.",
    image: "/explore/card-humanity.jpg",
    alt: "Diverse circle of hands joined together",
  },
  {
    id: "sports",
    badge: "SPORTS",
    title: "Discipline today,\nvictory tomorrow.",
    author: "By Jordan B.",
    image: "/explore/card-sports.jpg",
    alt: "Male runner running on coastal road",
  },
  {
    id: "business",
    badge: "BUSINESS",
    title: "From idea to impact.\nThe entrepreneur's journey.",
    author: "By David T.",
    image: "/explore/card-business.jpg",
    alt: "Modern city skyline at sunset",
  },
];

export default function ExploreHeroSection({
  backgroundImage = "/explore.png",
}) {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-12 sm:pb-16">
      {/* Background Image - Earth from space */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Explore background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 w-full my-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12 xl:gap-16 w-full">

          {/* ── LEFT HERO TEXT ── */}
          <motion.div
            className="space-y-4 sm:space-y-6 lg:w-[320px] xl:w-[360px] flex-shrink-0 pt-2 lg:pt-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* 1. Eyebrow */}
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

            {/* 2. Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold leading-[1.08] tracking-tight text-slate-900">
                Explore
                <br />
                extraordinary
                <br />
                <span className="text-[#2563eb]">lives.</span>
              </h1>
            </motion.div>

            {/* 3. Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="text-xs sm:text-sm leading-relaxed text-slate-600 max-w-xs sm:max-w-sm"
            >
              Discover real stories from remarkable people.
              <br />
              Be inspired. Learn from their journeys.
            </motion.p>

            {/* 4. CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="pt-2"
            >
              <Link
                id="explore-start-btn"
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full font-bold text-white text-xs sm:text-sm px-6 py-3 transition-all duration-300 bg-[#2563eb] hover:bg-[#1d4ed8] shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:scale-95"
              >
                Start exploring
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT CARDS GRID ── */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              {STORIES.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + i * 0.08,
                    ease,
                  }}
                  className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] bg-slate-900"
                >
                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-20">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-white bg-[#2563eb] shadow-sm">
                      {story.badge}
                    </span>
                  </div>

                  {/* Card Image with Hover Subtle Zoom */}
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Frosted Glass Bottom Overlay */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-3.5 sm:p-4 backdrop-blur-md bg-black/40 border-t border-white/20 text-left">
                    <h3 className="text-xs sm:text-[13.5px] font-semibold text-white leading-snug drop-shadow-sm whitespace-pre-line">
                      {story.title}
                    </h3>
                    <p className="text-[11px] text-white/80 font-normal mt-1">
                      {story.author}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Centered Caption */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease }}
              className="mt-6 sm:mt-8 text-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-[#1e40af]/85 tracking-wide flex items-center justify-center gap-2">
                <span>+</span>
                <span>More stories coming soon.</span>
                <span>+</span>
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
