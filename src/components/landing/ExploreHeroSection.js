"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageCircle,
  Play,
  X,
  MoreHorizontal,
} from "lucide-react";

const VIDEO_STORIES = [
  {
    id: "solo-trip",
    title: "A new perspective",
    subtitle: "How a solo trip helped me find confidence and clarity in life.",
    duration: "3 min",
    image: "/explore/card-boat.jpg",
    likes: "1.2K",
    comments: "86",
    author: "By Alex H.",
    avatar: "/explore/avatars/avatar_alex.jpg",
    videoUrl: "https://www.youtube.com/embed/1la44YsMCb8?autoplay=1",
  },
  {
    id: "fatherhood",
    title: "Lessons from fatherhood",
    subtitle: "The moments that changed how I see the world.",
    duration: "4 min",
    image: "/explore/card-fatherhood.jpg",
    likes: "980",
    comments: "64",
    author: "By Sarah K.",
    avatar: "/explore/avatars/avatar_sarah.jpg",
    videoUrl: "https://www.youtube.com/embed/y6Sxv-sUYtM?autoplay=1",
  },
  {
    id: "music",
    title: "Music that brings us together",
    subtitle: "How music created friendships across borders.",
    duration: "4 min",
    image: "/explore/card-concert.jpg",
    likes: "2.4K",
    comments: "112",
    author: "By Marcus L.",
    avatar: "/explore/avatars/avatar_marcus.jpg",
    videoUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1",
  },
  {
    id: "mountains",
    title: "Finding freedom in the mountains",
    subtitle: "How nature helped me reset and focus on what really matters.",
    duration: "5 min",
    image: "/explore/card-mountains.jpg",
    likes: "1.8K",
    comments: "95",
    author: "By Elena R.",
    avatar: "/explore/avatars/avatar_priya.jpg",
    videoUrl: "https://www.youtube.com/embed/Bey4XXJAqS8?autoplay=1",
  },
];

const FEATURED_STORY = {
  titlePrimary: "From real, moments",
  titleHighlight: "to lasting inspiration.",
  description:
    "Discover how everyday people are capturing their biggest moments, different perspectives and creating a richer, more connected life.",
  duration: "5 min",
  image: "/explore/featured-wedding.jpg",
  videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1",
};

export default function ExploreHeroSection({
  backgroundImage = "/explore.png",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="w-full bg-white text-[#0B0E23]">
      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION
          - Minimized height for all laptop screens (no heavy zoom)
          - Solid white background over the left content so text is 100% visible
          - Earth and astronaut artwork cleanly displayed on the right
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden w-full bg-white flex items-center min-h-[420px] sm:min-h-[460px] lg:min-h-[500px] pt-24 sm:pt-28 pb-10 sm:pb-14">
        {/* Artwork layer: explore.png placed on the right side */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src={backgroundImage}
            alt="Explore Spoken Odyssey"
            className="w-full h-full object-cover object-[82%_center] lg:object-[86%_center]"
            loading="eager"
          />
          {/* 
            White gradient overlay:
            Ensures left side is pure white where text sits, blending smoothly into space/earth
          */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white via-[48%] sm:via-[44%] lg:via-[42%] to-transparent pointer-events-none" />
        </div>

        {/* Hero Left Content sitting on crisp white */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <motion.div
            className="max-w-xl space-y-3.5 sm:space-y-4 text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Eyebrow */}
            <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#0066FF]">
              EXPLORE
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black leading-[1.06] tracking-tight text-[#0B0E23]">
              Extraordinary{" "}
              <span className="text-[#0066FF]">
                lives.
              </span>
            </h1>

            {/* Subtitle */}
            <div className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-md">
              <p>Real stories. Different perspectives.</p>
              <p>A more connected world.</p>
            </div>

            {/* Search Pill Input */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center bg-white rounded-full border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-1.5 pl-4 pr-1.5 transition-all focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100">
                <Search size={18} className="text-[#0066FF] mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search stories, people or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#0B0E23] placeholder-slate-400 outline-none"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="w-8 h-8 rounded-full bg-[#0066FF] hover:bg-[#0052CC] flex items-center justify-center text-white shrink-0 transition-transform active:scale-95 shadow-xs"
                >
                  <ArrowRight size={14} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. BE INSPIRED SECTION (REAL PEOPLE. REAL STORIES.)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-12 sm:py-16 bg-[#FBFCFE] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[#0066FF]">
                REAL PEOPLE. REAL STORIES.
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight text-[#0B0E23]">
                Be <span className="text-[#0066FF]">inspired.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed pt-1">
                Discover stories from around the world. Different journeys, experiences and perspectives that make life unique.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:border-[#0066FF] hover:text-[#0066FF] transition shadow-2xs cursor-pointer"
                aria-label="Previous"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:border-[#0066FF] hover:text-[#0066FF] transition shadow-2xs cursor-pointer"
                aria-label="Next"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 4 Video Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {VIDEO_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveVideo(story)}
                className="group cursor-pointer rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* 3 dots icon at top-right */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                    <MoreHorizontal size={14} />
                  </div>

                  {/* Duration Pill at bottom-left */}
                  <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-black">
                      <Play size={8} className="fill-black ml-0.5" />
                    </span>
                    <span>{story.duration}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0B0E23] leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-1">
                      {story.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#64748B] font-normal leading-relaxed line-clamp-2">
                      {story.subtitle}
                    </p>
                  </div>

                  {/* Footer: Stats + Author */}
                  <div className="pt-2 border-t border-slate-100/80 space-y-2">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Heart size={14} className="fill-[#EF4444] text-[#EF4444]" />
                        {story.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} className="text-slate-400" />
                        {story.comments}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src={story.avatar}
                        alt={story.author}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">
                        {story.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. FEATURED STORY SECTION ("From real, moments to lasting inspiration.")
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#0066FF]">
                FEATURED STORY
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-black leading-[1.1] tracking-tight text-[#0B0E23]">
                {FEATURED_STORY.titlePrimary}{" "}
                <span className="text-[#0066FF] block">
                  {FEATURED_STORY.titleHighlight}
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#64748B] font-normal max-w-lg">
                {FEATURED_STORY.description}
              </p>

              {/* Watch Story CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo({
                      title: "Featured Story",
                      videoUrl: FEATURED_STORY.videoUrl,
                    })
                  }
                  className="inline-flex items-center gap-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-[0_8px_25px_rgba(0,102,255,0.3)] transition-all active:scale-95 cursor-pointer group"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0066FF] shadow-xs group-hover:scale-105 transition-transform">
                    <Play size={12} className="fill-[#0066FF] ml-0.5" />
                  </span>
                  <span>Watch a Real Story ({FEATURED_STORY.duration})</span>
                </button>
              </div>
            </div>

            {/* Right Card with perspective/tilt */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div
                onClick={() =>
                  setActiveVideo({
                    title: "Featured Story",
                    videoUrl: FEATURED_STORY.videoUrl,
                  })
                }
                className="cursor-pointer relative w-full max-w-[540px] transform lg:rotate-[2.5deg] hover:rotate-0 transition-transform duration-500 rounded-[28px] p-2 bg-gradient-to-tr from-white to-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-[5px] border-white group"
              >
                <div className="relative aspect-[16/10] w-full rounded-[22px] overflow-hidden">
                  <img
                    src={FEATURED_STORY.image}
                    alt="Featured Story"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle hover play overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play size={22} className="fill-white ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. VIDEO POPUP MODAL (Plays YouTube / Google Video in iframe)
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 cursor-pointer"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={activeVideo.videoUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
