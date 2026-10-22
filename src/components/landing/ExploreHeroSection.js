"use client";

import { useState } from "react";
import Link from "next/link";
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

// ─────────────────────────────────────────────────────────────
// DATASETS
// ─────────────────────────────────────────────────────────────

const DISCOVER_SLIDES = [
  {
    id: "elena-italy",
    quote: "“Travel has taught me that home isn't a place, it's a feeling.”",
    author: "Elena R.",
    location: "Italy",
    avatar: "/about/team/founder-elena.jpg",
    image: "/explore/discover-italy.jpg",
  },
  {
    id: "marcus-japan",
    quote: "“Walking quiet streets taught me how much peace exists in everyday stillness.”",
    author: "Marcus L.",
    location: "Japan",
    avatar: "/explore/avatars/avatar_marcus.jpg",
    image: "/explore/discover-kyoto.jpg",
  },
  {
    id: "sarah-alps",
    quote: "“Standing atop the ridge, I realized the biggest mountains are in our minds.”",
    author: "Sarah K.",
    location: "Switzerland",
    avatar: "/explore/avatars/avatar_sarah.jpg",
    image: "/explore/discover-alps.jpg",
  },
  {
    id: "alex-norway",
    quote: "“The open water reminded me that freedom is a choice we make every morning.”",
    author: "Alex H.",
    location: "Norway",
    avatar: "/explore/avatars/avatar_alex.jpg",
    image: "/explore/card-boat.jpg",
  },
];

const VIDEO_STORIES = [
  {
    id: "mountains",
    title: "Finding clarity in the mountains",
    subtitle: "How a solo trip helped me find confidence and a new direction.",
    duration: "3 min",
    image: "/explore/card-mountains.jpg",
    likes: "124",
    comments: "28",
    author: "Sarah M.",
    avatar: "/explore/avatars/avatar_sarah.jpg",
    videoUrl: "https://www.youtube.com/embed/Bey4XXJAqS8?autoplay=1",
  },
  {
    id: "fatherhood",
    title: "Lessons from fatherhood",
    subtitle: "The moments that changed how I see the world.",
    duration: "4 min",
    image: "/explore/card-fatherhood.jpg",
    likes: "342",
    comments: "56",
    author: "James T.",
    avatar: "/explore/avatars/avatar_david.jpg",
    videoUrl: "https://www.youtube.com/embed/y6Sxv-sUYtM?autoplay=1",
  },
  {
    id: "music",
    title: "Music that brings us together",
    subtitle: "How music created friendships across cultures.",
    duration: "4 min",
    image: "/explore/card-concert.jpg",
    likes: "289",
    comments: "41",
    author: "Daniel K.",
    avatar: "/explore/avatars/avatar_marcus.jpg",
    videoUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1",
  },
  {
    id: "unknown",
    title: "Finding freedom in the unknown",
    subtitle: "How nature helped me reset and focus on what really matters.",
    duration: "5 min",
    image: "/explore/card-boat.jpg",
    likes: "417",
    comments: "73",
    author: "Alex R.",
    avatar: "/explore/avatars/avatar_alex.jpg",
    videoUrl: "https://www.youtube.com/embed/1la44YsMCb8?autoplay=1",
  },
];

const FEATURED_SLIDES = [
  {
    id: "new-chapter",
    badge: "FEATURED",
    title: "A new chapter",
    subtitle: "How a chance meeting changed everything.",
    duration: "5 min",
    image: "/explore/featured-wedding.jpg",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1",
  },
  {
    id: "under-stars",
    badge: "FEATURED",
    title: "Under the same stars",
    subtitle: "A journey of lifelong friendship across oceans.",
    duration: "4 min",
    image: "/friends night sky.jpg",
    videoUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1",
  },
  {
    id: "generations",
    badge: "FEATURED",
    title: "Generations connected",
    subtitle: "Preserving stories before they are lost to time.",
    duration: "6 min",
    image: "/family steps.jpg",
    videoUrl: "https://www.youtube.com/embed/y6Sxv-sUYtM?autoplay=1",
  },
  {
    id: "alps-journey",
    badge: "FEATURED",
    title: "Peaks of resilience",
    subtitle: "Finding strength through the hardest climb.",
    duration: "5 min",
    image: "/mountain.jpg",
    videoUrl: "https://www.youtube.com/embed/Bey4XXJAqS8?autoplay=1",
  },
];

export default function ExploreHeroSection({
  backgroundImage = "/explore.png",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  // Discover Slider state
  const [discoverIndex, setDiscoverIndex] = useState(0);

  // Featured Story Slider state
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Discover slider navigation
  const prevDiscover = () => {
    setDiscoverIndex((prev) =>
      prev === 0 ? DISCOVER_SLIDES.length - 1 : prev - 1
    );
  };
  const nextDiscover = () => {
    setDiscoverIndex((prev) =>
      prev === DISCOVER_SLIDES.length - 1 ? 0 : prev + 1
    );
  };

  // Featured slider navigation
  const prevFeatured = () => {
    setFeaturedIndex((prev) =>
      prev === 0 ? FEATURED_SLIDES.length - 1 : prev - 1
    );
  };
  const nextFeatured = () => {
    setFeaturedIndex((prev) =>
      prev === FEATURED_SLIDES.length - 1 ? 0 : prev + 1
    );
  };

  const activeFeaturedStory = FEATURED_SLIDES[featuredIndex];
  const activeDiscoverStory = DISCOVER_SLIDES[discoverIndex];

  return (
    <div className="w-full bg-white text-[#0B0E23]">
      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION
          - Left-side brightness softened to reveal Earth and cosmic glow
          - Retains sharp legibility for dark typography and search pill
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
            Refined gradient wash:
            Replaces the harsh solid white block with a smooth, translucent atmosphere
            so the Earth curvature and starry glow naturally emerge on the left side
          */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 via-[42%] to-transparent pointer-events-none" />
        </div>

        {/* Hero Left Content */}
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
              <p>Real people. Real stories. Different perspectives.</p>
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
                  className="w-8 h-8 rounded-full bg-[#0066FF] hover:bg-[#0052CC] flex items-center justify-center text-white shrink-0 transition-transform active:scale-95 shadow-xs cursor-pointer"
                >
                  <ArrowRight size={14} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. DISCOVER SECTION (SLIDING STORY CARD + SIDE HEADING)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-10 sm:py-14 lg:py-16 bg-white border-t border-slate-100/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Interactive Story Slider Card */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-[26px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] bg-slate-900 select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDiscoverStory.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={activeDiscoverStory.image}
                      alt={activeDiscoverStory.author}
                      className="w-full h-full object-cover"
                    />
                    {/* Shadow overlay gradient for quote & profile contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-[40%] to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col justify-end z-10">
                  <div className="flex items-end justify-between gap-4">
                    {/* Left: Quote + Author info */}
                    <div className="space-y-3 max-w-[70%] sm:max-w-[75%]">
                      <p className="text-white text-base sm:text-lg lg:text-[20px] font-semibold leading-snug tracking-tight drop-shadow-md">
                        {activeDiscoverStory.quote}
                      </p>

                      <div className="flex items-center gap-2.5 pt-0.5">
                        <img
                          src={activeDiscoverStory.avatar}
                          alt={activeDiscoverStory.author}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white/80 shadow-xs"
                        />
                        <div className="text-xs sm:text-[13px] leading-tight">
                          <p className="font-bold text-white">
                            {activeDiscoverStory.author}
                          </p>
                          <p className="text-white/80 flex items-center gap-1 font-medium text-[11px] sm:text-xs">
                            {activeDiscoverStory.location}
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Pagination Dots + Navigation Arrows */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Dots */}
                      <div className="hidden sm:flex items-center gap-1.5 mr-1">
                        {DISCOVER_SLIDES.map((slide, idx) => (
                          <button
                            key={slide.id}
                            type="button"
                            onClick={() => setDiscoverIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              idx === discoverIndex
                                ? "w-5 bg-white"
                                : "w-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Arrow Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={prevDiscover}
                          aria-label="Previous slide"
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={nextDiscover}
                          aria-label="Next slide"
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Discover Texts & CTA */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#0066FF]">
                DISCOVER
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black leading-[1.08] tracking-tight text-[#0B0E23]">
                See the world{" "}
                <span className="text-[#0066FF] block">
                  differently.
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#64748B] font-normal">
                Explore real stories from people with different backgrounds, cultures and experiences. Gain new perspectives, learn from others and see life through a different lens.
              </p>

              {/* Start Discovering Button */}
              <div className="pt-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#2563EB] hover:from-[#0052CC] hover:to-[#1D4ED8] text-white px-7 py-3.5 text-xs sm:text-sm font-bold shadow-[0_8px_25px_rgba(0,102,255,0.28)] transition-all active:scale-95 cursor-pointer group"
                >
                  <span>Start Discovering</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. BE INSPIRED SECTION (REAL PEOPLE. REAL STORIES.)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-12 sm:py-16 bg-[#FBFCFE] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[#0066FF]">
                REAL PEOPLE. REAL STORIES.
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight text-[#0B0E23]">
                Be <span className="text-[#0066FF]">inspired.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed pt-1">
                Explore a handpicked selection of stories from our community.
                <br className="hidden sm:inline" />
                Real moments, real challenges and real lessons from people just like you.
              </p>
            </div>

            {/* View All Stories Button */}
            <div className="shrink-0">
              <button
                type="button"
                className="rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-2 transition-all shadow-2xs cursor-pointer group hover:border-[#0066FF] hover:text-[#0066FF]"
              >
                <span>View All Stories</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
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
          4. FEATURED STORY SECTION (SLIDING CAROUSEL ON RIGHT)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 bg-white overflow-hidden border-t border-slate-100/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headings & CTA */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#0066FF]">
                FEATURED STORY
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black leading-[1.08] tracking-tight text-[#0B0E23]">
                From real moments{" "}
                <span className="text-[#0066FF] block">
                  to lasting inspiration.
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#64748B] font-normal max-w-lg">
                Every story has a perspective. Discover how real experiences can inspire someone else.
              </p>

              {/* Watch Story CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo({
                      title: activeFeaturedStory.title,
                      videoUrl: activeFeaturedStory.videoUrl,
                    })
                  }
                  className="inline-flex items-center gap-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-[0_8px_25px_rgba(0,102,255,0.28)] transition-all active:scale-95 cursor-pointer group"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0066FF] shadow-xs group-hover:scale-105 transition-transform">
                    <Play size={12} className="fill-[#0066FF] ml-0.5" />
                  </span>
                  <span>Watch a Real Story ({activeFeaturedStory.duration})</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sliding Carousel Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative aspect-[16/10] w-full max-w-[560px] rounded-[26px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.14)] bg-slate-900 group select-none">
                
                {/* Slide Image with Smooth Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeaturedStory.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() =>
                      setActiveVideo({
                        title: activeFeaturedStory.title,
                        videoUrl: activeFeaturedStory.videoUrl,
                      })
                    }
                  >
                    <img
                      src={activeFeaturedStory.image}
                      alt={activeFeaturedStory.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-[45%] to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Overlay Text Content (Bottom Left) */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col justify-end z-10 pointer-events-none">
                  <div className="space-y-1 mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                      {activeFeaturedStory.badge}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                      {activeFeaturedStory.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 font-normal">
                      {activeFeaturedStory.subtitle}
                    </p>
                  </div>

                  {/* Bottom Controls Bar: Play Pill + Dots + Arrows */}
                  <div className="flex items-center justify-between pt-1 pointer-events-auto">
                    {/* Play pill button */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveVideo({
                          title: activeFeaturedStory.title,
                          videoUrl: activeFeaturedStory.videoUrl,
                        })
                      }
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold cursor-pointer transition active:scale-95"
                    >
                      <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                        <Play size={8} className="fill-black ml-0.5" />
                      </span>
                      <span>{activeFeaturedStory.duration}</span>
                    </button>

                    {/* Pagination Dots + Arrows */}
                    <div className="flex items-center gap-3">
                      {/* Dots */}
                      <div className="flex items-center gap-1.5 mr-1">
                        {FEATURED_SLIDES.map((slide, idx) => (
                          <button
                            key={slide.id}
                            type="button"
                            onClick={() => setFeaturedIndex(idx)}
                            aria-label={`Go to featured slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              idx === featuredIndex
                                ? "w-5 bg-white"
                                : "w-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Circular Arrows */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={prevFeatured}
                          aria-label="Previous featured story"
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={nextFeatured}
                          aria-label="Next featured story"
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. VIDEO POPUP MODAL (Plays YouTube in iframe)
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
                  title={activeVideo.title || "Video"}
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
