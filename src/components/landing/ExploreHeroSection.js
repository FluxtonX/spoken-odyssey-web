"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const CATEGORIES = [
  "All",
  "Adventure",
  "Innovation",
  "Arts & Culture",
  "Humanity",
  "Business",
];

const STORIES = [
  {
    id: "adventure",
    category: "Adventure",
    badge: "ADVENTURE",
    title: "Breaking limits, finding freedom.",
    excerpt:
      "From corporate life to the world's highest peaks — a journey of courage, resilience and self-discovery.",
    image: "/explore/card-adventure.jpg",
    author: "By Alex H.",
    avatar: "/explore/avatars/avatar_alex.jpg",
    likes: "124",
    comments: "32",
    views: "4.2K",
  },
  {
    id: "innovation",
    category: "Innovation",
    badge: "INNOVATION",
    title: "Building the future from the ground up.",
    excerpt:
      "Inside the mind of an entrepreneur turning bold ideas into real-world impact.",
    image: "/explore/card-innovation.jpg",
    author: "By Sarah K.",
    avatar: "/explore/avatars/avatar_sarah.jpg",
    likes: "86",
    comments: "21",
    views: "3.1K",
  },
  {
    id: "arts-culture",
    category: "Arts & Culture",
    badge: "ARTS & CULTURE",
    title: "Creating beauty that lasts.",
    excerpt:
      "How music, culture and community can bring people closer together.",
    image: "/explore/card-arts.jpg",
    author: "By Marcus L.",
    avatar: "/explore/avatars/avatar_marcus.jpg",
    likes: "98",
    comments: "18",
    views: "2.7K",
  },
  {
    id: "humanity",
    category: "Humanity",
    badge: "HUMANITY",
    title: "Changing lives, one act at a time.",
    excerpt:
      "Stories of people making a difference in their communities around the world.",
    image: "/explore/card-humanity.jpg",
    author: "By Priya M.",
    avatar: "/explore/avatars/avatar_priya.jpg",
    likes: "210",
    comments: "45",
    views: "5.8K",
  },
  {
    id: "sports",
    category: "Sports",
    badge: "SPORTS",
    title: "Discipline today, victory tomorrow.",
    excerpt:
      "The mindset, routines and sacrifices behind a life in elite sport.",
    image: "/explore/card-sports.jpg",
    author: "By Jordan B.",
    avatar: "/explore/avatars/avatar_jordan.jpg",
    likes: "176",
    comments: "28",
    views: "4.9K",
  },
  {
    id: "business",
    category: "Business",
    badge: "BUSINESS",
    title: "From idea to impact.",
    excerpt:
      "How vision, people and perseverance can build something meaningful.",
    image: "/explore/card-business.jpg",
    author: "By David T.",
    avatar: "/explore/avatars/avatar_david.jpg",
    likes: "132",
    comments: "26",
    views: "3.6K",
  },
];

export default function ExploreHeroSection({
  backgroundImage = "/explore.png",
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = STORIES.filter((story) => {
    const matchesCategory =
      activeCategory === "All" ||
      story.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-10 sm:pb-14 bg-no-repeat bg-cover bg-[center_top]"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10 xl:gap-12 w-full">
          {/* ── LEFT HERO CONTENT ── */}
          <motion.div
            className="space-y-4 lg:w-[320px] xl:w-[350px] flex-shrink-0 pt-2 lg:pt-6 text-left"
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold italic text-[#2563eb] tracking-wide">
              <span>It&apos;s your journey</span>
              <span className="not-italic text-sm sm:text-base text-[#2563eb]">
                ♡
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.08] tracking-tight">
              <span className="text-slate-950 block">Explore</span>
              <span className="bg-gradient-to-r from-[#0062ff] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent block">
                extraordinary
              </span>
              <span className="text-slate-950 block">lives.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
              Real stories. Different perspectives.
              <br />
              A more connected world.
            </p>

            {/* Search Bar */}
            <div className="pt-2">
              <div className="flex items-center bg-white/95 rounded-full border border-slate-200/90 shadow-sm py-2 sm:py-2.5 pl-4 pr-1.5 max-w-[340px] transition-all focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100">
                <Search
                  size={16}
                  className="text-[#2563eb] mr-2.5 flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="Search stories, people or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0062ff] hover:bg-[#0052d9] flex items-center justify-center text-white flex-shrink-0 transition-transform active:scale-95 shadow-sm"
                >
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 max-w-[340px]">
                {CATEGORIES.map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#0062ff] text-white shadow-sm"
                          : "bg-white/90 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs hover:border-slate-300"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT 6-CARDS GRID (3 Columns × 2 Rows) ── */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredStories.map((story, idx) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.08 * (idx + 1),
                    ease,
                  }}
                  className="rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  {/* Top Image with Category Badge */}
                  <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-white bg-[#0062ff] shadow-sm">
                        {story.badge}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Text Content & Footer Stats */}
                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 text-left">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#0062ff] transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-normal leading-relaxed line-clamp-2 mt-1">
                        {story.excerpt}
                      </p>
                    </div>

                    {/* Author & Stats Row */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                      {/* Author */}
                      <div className="flex items-center gap-1.5">
                        <img
                          src={story.avatar}
                          alt={story.author}
                          className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700">
                          {story.author}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-0.5">
                          <Heart
                            size={11}
                            className="fill-red-500 text-red-500"
                          />
                          {story.likes}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageCircle size={11} className="text-slate-400" />
                          {story.comments}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Eye size={11} className="text-slate-400" />
                          {story.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
