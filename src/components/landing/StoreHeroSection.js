"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Camera,
  AudioLines,
  Feather,
  ShieldCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

export default function StoreHeroSection() {
  const storeUrl = "https://odyssey-store-ten.vercel.app";

  const products = [
    {
      id: "odyssey-one",
      name: "Odyssey One",
      image: "/store/card_odyssey_one_hd.png",
      tagline: "Classic. Timeless. Versatile.",
      subtext: "Designed for everyday life.",
      price: "CHF 349",
      colors: [
        { bg: "#111111", border: "border-transparent", name: "Classic Black" },
        { bg: "#2c3540", border: "border-transparent", name: "Deep Slate" },
        { bg: "#7c533e", border: "border-transparent", name: "Tortoise Brown" },
        { bg: "#ded8ce", border: "border-slate-300", name: "Cream Stone" },
      ],
      link: `${storeUrl}`,
    },
    {
      id: "odyssey-clear",
      name: "Odyssey Clear",
      image: "/store/card_odyssey_clear_hd.png",
      tagline: "Modern. Lightweight. Subtle.",
      subtext: "Technology that blends in.",
      price: "CHF 349",
      colors: [
        { bg: "#8c949e", border: "border-transparent", name: "Clear Gray" },
        { bg: "#a3afc2", border: "border-transparent", name: "Pale Lavender" },
        { bg: "#c4b8d8", border: "border-transparent", name: "Soft Lilac" },
      ],
      link: `${storeUrl}`,
    },
    {
      id: "odyssey-sport",
      name: "Odyssey Sport",
      image: "/store/card_odyssey_sport_hd.png",
      tagline: "Rugged. Active. Adventure ready.",
      subtext: "Capture life on the move.",
      price: "CHF 379",
      colors: [
        { bg: "#111111", border: "border-transparent", name: "Stealth Black" },
        { bg: "#0066cc", border: "border-transparent", name: "Polar Blue" },
        { bg: "#e02424", border: "border-transparent", name: "Racing Red" },
        { bg: "#ffffff", border: "border-slate-300", name: "Crisp White" },
      ],
      link: `${storeUrl}`,
    },
  ];

  const features = [
    {
      icon: Camera,
      title: "Ultra HD photo & video",
      description: "Capture what you see in stunning quality.",
    },
    {
      icon: AudioLines,
      title: "AI highlights",
      description: "Automatically find the meaningful moments.",
    },
    {
      icon: Feather,
      title: "Lightweight & comfortable",
      description: "All day wear, wherever life takes you.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy first",
      description: "You control what's captured and shared.",
    },
  ];

  return (
    <section
      className="relative min-h-screen lg:min-h-[1024px] flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-16 bg-no-repeat bg-cover bg-[position:center_bottom]"
      style={{ backgroundImage: "url('/store.png')" }}
    >
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* ── TOP HERO CONTENT (LEFT ALIGNED) ── */}
        <motion.div
          className="max-w-xl text-left pt-2 sm:pt-6 pb-8 sm:pb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold italic text-[#2563eb] tracking-wide mb-2 sm:mb-3">
            <span>It&apos;s your journey</span>
            <span className="not-italic text-sm sm:text-base text-[#2563eb]">♡</span>
          </div>

          {/* Heading (3 lines) */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.08] tracking-tight">
            <span className="text-slate-950 block">AI Glasses.</span>
            <span className="text-[#1d4ed8] block">See it. Capture it.</span>
            <span className="text-[#1d4ed8] block">Remember it.</span>
          </h1>

          {/* Description */}
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-slate-600 max-w-md">
            Live in the moment while your Odyssey captures the memories, conversations and experiences that matter.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 sm:pt-6">
            <a
              id="shop-ai-glasses-btn"
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full font-bold text-white text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 transition-all duration-300 bg-gradient-to-r from-[#0062ff] to-[#4f46e5] hover:from-[#0052d9] hover:to-[#4338ca] shadow-[0_6px_20px_rgba(0,98,255,0.35)] hover:-translate-y-0.5 active:scale-95"
            >
              Shop AI Glasses
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>

            <button
              type="button"
              className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900 group cursor-pointer"
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-blue-200 bg-white/90 shadow-sm flex items-center justify-center text-[#1d4ed8] transition-transform duration-300 group-hover:scale-110">
                <Play size={15} className="fill-[#1d4ed8] ml-0.5" />
              </span>
              <span>Watch video</span>
            </button>
          </div>
        </motion.div>

        {/* ── BOTTOM AREA: 4 CARDS + TIGHT FEATURE BAR (BROUGHT LOWER DOWN & MINIMIZED SIZES) ── */}
        <div className="w-full flex flex-col gap-2.5 sm:gap-3 mt-auto pt-6 sm:pt-10 lg:pt-14">
          {/* 4 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 items-stretch">
            {/* Product Cards 1, 2, 3 */}
            {products.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 1), ease }}
                className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/90 p-3 sm:p-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  {/* Glasses Image (Minimized) */}
                  <div className="w-full h-18 sm:h-20 flex items-center justify-center mb-1.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-[85%] object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Title & Subtitles */}
                  <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    {item.tagline}
                    <br />
                    {item.subtext}
                  </p>

                  {/* Color Swatches */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {item.colors.map((color, cIdx) => (
                      <span
                        key={cIdx}
                        title={color.name}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${color.border} shadow-inner cursor-pointer transition-transform hover:scale-125`}
                        style={{ backgroundColor: color.bg }}
                      />
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-3 pt-1 border-t border-slate-100">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-950">
                    {item.price}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-[#0a0f29] hover:bg-[#1a234e] text-white text-[10px] sm:text-[10.5px] font-semibold px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View details
                    <ArrowRight size={11} strokeWidth={2.5} />
                  </a>
                </div>
              </motion.div>
            ))}

            {/* Card 4: Lifestyle Hiker Card (Minimized) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              className="relative rounded-2xl overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-slate-200/90 group cursor-pointer min-h-[175px] sm:min-h-[190px] flex flex-col justify-end"
            >
              <img
                src="/store/card_lifestyle_hiker_hd.jpg"
                alt="See how it works in real life"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* ── DIRECTLY BELOW 4-FEATURE BAR (VERY LESS GAP) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease }}
            className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 px-3 sm:px-5 py-2 sm:py-2.5 shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-200/80">
              {features.map((feature, fIdx) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={fIdx}
                    className={`flex items-center gap-2.5 sm:gap-3 py-1.5 sm:py-1 ${
                      fIdx === 0
                        ? "lg:pr-3"
                        : fIdx === 3
                        ? "lg:pl-3"
                        : "lg:px-3"
                    }`}
                  >
                    <div className="flex-shrink-0 text-[#2563eb]">
                      <IconComponent size={22} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">
                        {feature.title}
                      </p>
                      <p className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
