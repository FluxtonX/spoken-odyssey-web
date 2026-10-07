"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  EyeOff,
  Lock,
  Users,
  Mic,
  Star,
  Compass,
  Play,
  X,
} from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function AboutPage() {
  const [activeVideoModal, setActiveVideoModal] = useState(false);

  return (
    <main className="min-h-screen bg-white text-[#0B0E23]">
      {/* ══════════════════════════════════════════════════════════════
          0. NAVIGATION (LandingNav)
      ══════════════════════════════════════════════════════════════ */}
      <LandingNav />

      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION
          - Full natural about.png background (NO white overlay)
          - Left: Title & Subtitle exactly matching screenshot
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden w-full flex items-center min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] pt-28 sm:pt-32 pb-14 sm:pb-16">
        {/* Background Artwork - about.png with NO white overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/about.png"
            alt="About Spoken Odyssey"
            className="w-full h-full object-cover object-[85%_center] lg:object-right"
            loading="eager"
          />
        </div>

        {/* Hero Left Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <motion.div
            className="max-w-xl space-y-3.5 text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Eyebrow */}
            <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#475569]">
              ABOUT SPOKEN ODYSSEY
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black leading-[1.08] tracking-tight text-[#0B0E23]">
              Real lives.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#6366F1]">
                Lasting impact.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-md pt-1">
              We&apos;re building a world where every story is captured, understood and never forgotten.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. WHY WE EXIST SECTION
          - Left: Philosophy copy
          - Right: 5-Card Collage matching exact screenshot layout
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#475569]">
                WHY WE EXIST
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.12] tracking-tight text-[#0B0E23]">
                Life is made of moments.{" "}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#6366F1]">
                  They deserve more.
                </span>
              </h2>

              <p className="text-sm sm:text-[15px] text-[#475569] font-normal leading-relaxed">
                We all have moments that shape us &mdash; the big milestones and the quiet, everyday moments. But too often they&apos;re lost in phone galleries, different apps or fade with time.
              </p>

              <p className="text-sm sm:text-[15px] font-bold text-[#0B0E23] leading-relaxed pt-1">
                We created Spoken Odyssey to change that.
              </p>
            </div>

            {/* Right: 5-Image Collage (exact from screenshot) */}
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-3 sm:gap-4">
                
                {/* Top Row: Graduation (Left) & Coastal Traveler (Right) */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end">
                  {/* Graduation */}
                  <div className="col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-2 border-white group">
                    <img
                      src="/landing/chapters/chapter-achievements.jpg"
                      alt="Graduation milestone"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Traveler overlook */}
                  <div className="col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-2 border-white group">
                    <img
                      src="/landing/chapters/chapter-travel.jpg"
                      alt="Travel exploration"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Bottom Row: Concert (Left), Father & Baby (Center), Dog (Right) */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4 items-start">
                  {/* Concert crowd */}
                  <div className="col-span-3 relative aspect-square rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-2 border-white group">
                    <img
                      src="/landing/chapters/chapter-concerts.jpg"
                      alt="Concert celebration"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Father & Baby */}
                  <div className="col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-2 border-white group">
                    <img
                      src="/about/moments-father.jpg"
                      alt="Father and baby sunset"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Dog */}
                  <div className="col-span-3 relative aspect-square rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-2 border-white group">
                    <img
                      src="/landing/chapters/chapter-pets.jpg"
                      alt="Pet companion"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. MORE THAN SOCIAL MEDIA SECTION
          - Left: Woman overlooking historic city at sunset
          - Right: "This isn't about likes. It's about what really matters." + 3 Pillars
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#FBFCFE] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Large Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.08)] aspect-[16/11] border-2 border-white group">
                <img
                  src="/about/social-reflection.jpg"
                  alt="Meaning over social media"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#475569]">
                MORE THAN SOCIAL MEDIA
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.12] tracking-tight text-[#0B0E23]">
                This isn&apos;t about likes.{" "}
                <span className="block text-[#0066FF]">
                  It&apos;s about what really matters.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed pt-1">
                Social media is designed for attention. Spoken Odyssey is designed for meaning. Here, the focus isn&apos;t on followers or fame &mdash; it&apos;s on your real story, captured in your own words, in a secure and personal space, for the people who matter most.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-slate-200/80">
                {/* Pillar 1 */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center">
                    <EyeOff size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-[#0B0E23]">
                      No followers.
                    </p>
                    <p className="text-xs text-[#64748B]">
                      No pressure.
                    </p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center">
                    <Lock size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-[#0B0E23]">
                      Private, personal
                    </p>
                    <p className="text-xs text-[#64748B]">
                      and in your control.
                    </p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center">
                    <Users size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-[#0B0E23]">
                      Built for you and
                    </p>
                    <p className="text-xs text-[#64748B]">
                      the people who matter.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. WHAT WE'RE BUILDING SECTION
          - Left: Headline & "See How It Works ->" CTA
          - Right: 4 Feature Cards (Capture, AI Historian, Family Space, Explore)
            (high-resolution genuine imagery)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#475569]">
                WHAT WE&apos;RE BUILDING
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.12] tracking-tight text-[#0B0E23]">
                A global home for{" "}
                <span className="block text-[#0066FF]">
                  life&apos;s journeys.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed pt-1">
                A place to capture, explore and share the moments that make life extraordinary &mdash; for individuals, families and businesses. For today, and for generations to come.
              </p>

              {/* See How It Works CTA */}
              <div className="pt-3">
                <Link
                  href="/howitworks"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#4F46E5] hover:from-[#0052CC] hover:to-[#4338CA] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all active:scale-95 group"
                >
                  <span>See How It Works</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Feature Cards */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                
                {/* Card 1: Capture */}
                <div className="relative aspect-[9/15] rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-end p-3.5 text-white group cursor-pointer">
                  <img
                    src="/about/build-capture.jpg"
                    alt="Capture moments"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-2">
                      <Mic size={13} />
                    </div>
                    <h3 className="text-sm font-bold leading-tight">Capture</h3>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Voice, photos, video and written moments.
                    </p>
                  </div>
                </div>

                {/* Card 2: AI Historian */}
                <div className="relative aspect-[9/15] rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-end p-3.5 text-white group cursor-pointer">
                  <img
                    src="/about/build-historian.jpg"
                    alt="AI Historian"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-2">
                      <Star size={13} />
                    </div>
                    <h3 className="text-sm font-bold leading-tight">AI Historian</h3>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Find meaning, see your journey, get insights.
                    </p>
                  </div>
                </div>

                {/* Card 3: Family Space */}
                <div className="relative aspect-[9/15] rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-end p-3.5 text-white group cursor-pointer">
                  <img
                    src="/about/build-family.jpg"
                    alt="Family Space"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-2">
                      <Users size={13} />
                    </div>
                    <h3 className="text-sm font-bold leading-tight">Family Space</h3>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Bring generations together.
                    </p>
                  </div>
                </div>

                {/* Card 4: Explore */}
                <div className="relative aspect-[9/15] rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-end p-3.5 text-white group cursor-pointer">
                  <img
                    src="/about/build-explore.jpg"
                    alt="Explore lives"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-2">
                      <Compass size={13} />
                    </div>
                    <h3 className="text-sm font-bold leading-tight">Explore</h3>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Discover extraordinary lives and be inspired.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. OUR BELIEF SECTION
          - Left: Genuine high-definition mountain sunset panorama
          - Code-rendered interactive circular Play button
          - Right: "Stories connect us. They outlive us."
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#FBFCFE] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Landscape Card with Code-rendered Play Button */}
            <div className="lg:col-span-7">
              <div
                onClick={() => setActiveVideoModal(true)}
                className="cursor-pointer relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.1)] border-2 border-white group"
              >
                <img
                  src="https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&fit=crop&q=85&w=1600"
                  alt="Our Belief Mountain Panorama"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Code-rendered Play Button Overlay */}
                <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/45 backdrop-blur-md border-2 border-white flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0066FF]">
                    <Play size={22} className="fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#475569]">
                OUR BELIEF
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.12] tracking-tight text-[#0B0E23]">
                Stories connect us.{" "}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#6366F1]">
                  They outlive us.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed pt-1">
                Everyone has a story worth remembering. By capturing life&apos;s moments today, we help ensure your Odyssey lives on &mdash; inspiring those around you and the generations that follow.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. OUR COMPANY VALUES SECTION (from screenshot - Top 3D Look)
          - Left: Values copy & CTA
          - Right: 3D Pop-out Image artwork with decorative accents
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="space-y-2">
                <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#475569]">
                  WHAT DRIVES OUR TEAM
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-[1.12] tracking-tight text-[#0B0E23]">
                  Our Company{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#6366F1]">
                    Values
                  </span>
                </h2>
              </div>

              <div className="space-y-4 pt-1 text-sm sm:text-[15px] leading-relaxed text-[#334155]">
                <p>
                  <strong className="text-[#0B0E23] font-bold">Learn & Listen:</strong>{" "}
                  To excel in preserving human journeys we always need to be listening deeply. Our team constantly innovates to understand genuine human stories and the emotional nuances behind every voice.
                </p>
                <p>
                  <strong className="text-[#0B0E23] font-bold">Educate & Enlighten:</strong>{" "}
                  Preserving life stories includes not only archiving, but empowering families. Spoken Odyssey practices a philosophy of turning raw memories into lasting generational wisdom.
                </p>
                <p>
                  <strong className="text-[#0B0E23] font-bold">Communicate & Protect:</strong>{" "}
                  Great relationships and lasting legacies are built on uncompromising trust. We build for privacy, security, and lifelong permanence at the highest standard.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0066FF] via-[#4F46E5] to-[#7C3AED] hover:from-[#0052CC] hover:to-[#6D28D9] text-white px-7 py-3.5 text-sm font-bold shadow-[0_8px_25px_rgba(0,102,255,0.28)] transition-all active:scale-95 group"
                >
                  <span>Start Your Odyssey</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: 3D Pop-Out Image (exact look from screenshot) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative max-w-lg w-full">
                {/* Decorative Background Tint Box */}
                <div className="absolute -bottom-4 -right-4 w-4/5 h-4/5 bg-gradient-to-br from-blue-100/60 via-indigo-50/50 to-purple-100/60 rounded-3xl -z-10 blur-[1px]" />
                
                {/* Decorative Organic Loop Vector Accent (blue/cyan stroke like screenshot) */}
                <svg
                  className="absolute -inset-8 w-[116%] h-[116%] pointer-events-none -z-5 overflow-visible"
                  viewBox="0 0 500 400"
                  fill="none"
                >
                  <path
                    d="M 50,300 C 10,180 80,100 220,120 C 380,140 480,80 470,220 C 460,330 360,380 200,340 C 60,310 30,220 70,160"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </svg>

                {/* 3D Pop-out Image Frame */}
                <div className="relative rounded-2xl overflow-visible transition-transform duration-500 hover:scale-[1.02]">
                  <img
                    src="/about/team-values-3d.png"
                    alt="Spoken Odyssey Team Collaboration"
                    className="w-full h-auto object-contain drop-shadow-[0_12px_30px_rgba(0,102,255,0.12)]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. MEET OUR TEAM SECTION
          - Clean, Compact 3-Card Grid
          - Balanced card proportions with compact image height
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-[#FBFCFE] border-t border-slate-100 overflow-hidden">
        {/* Soft Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-100/40 via-indigo-100/30 to-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 w-full">
          
          {/* Section Header */}
          <div className="text-left mb-8 sm:mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0066FF] mb-1.5">
              OUR TEAM
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-[#0B0E23]">
              Meet Our Team
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] font-normal leading-relaxed pt-1.5 max-w-lg">
              The passionate storytellers, historians, and AI engineers dedicated to ensuring every human journey lasts forever.
            </p>
          </div>

          {/* 3 Compact Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6 items-stretch w-full pb-3">
            
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.08)] hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100">
                <img
                  src="/about/team/founder-elena.jpg"
                  alt="Jessica Droneburg"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-[#0066FF] text-slate-700 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105"
                  aria-label="Jessica Droneburg LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.5a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63A1.63 1.63 0 0 0 7.86 6.5Z" />
                  </svg>
                </a>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B0E23] tracking-tight group-hover:text-[#0066FF] transition-colors">
                    Jessica Droneburg
                  </h3>
                  <p className="text-xs font-semibold text-[#0066FF] mt-0.5">
                    Operations Manager
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed mt-2.5 pt-2.5 border-t border-slate-100 line-clamp-2">
                    Overseeing archival systems and ensuring customer journeys are preserved with care.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.08)] hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                  alt="David Sterling"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-[#0066FF] text-slate-700 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105"
                  aria-label="David Sterling LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.5a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63A1.63 1.63 0 0 0 7.86 6.5Z" />
                  </svg>
                </a>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B0E23] tracking-tight group-hover:text-[#0066FF] transition-colors">
                    David Sterling
                  </h3>
                  <p className="text-xs font-semibold text-[#0066FF] mt-0.5">
                    Lead AI Architect
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed mt-2.5 pt-2.5 border-t border-slate-100 line-clamp-2">
                    Developing privacy-first semantic models that connect stories across generations.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.08)] hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600"
                  alt="Wendy Roberts"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-[#0066FF] text-slate-700 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105"
                  aria-label="Wendy Roberts LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.5a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63A1.63 1.63 0 0 0 7.86 6.5Z" />
                  </svg>
                </a>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B0E23] tracking-tight group-hover:text-[#0066FF] transition-colors">
                    Wendy Roberts
                  </h3>
                  <p className="text-xs font-semibold text-[#0066FF] mt-0.5">
                    Archival Stewardship
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed mt-2.5 pt-2.5 border-t border-slate-100 line-clamp-2">
                    Guiding families and organizations to seamlessly preserve and cherish legacy recordings.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 3 Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <span className="w-5 h-1.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#6366F1]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. VIDEO MODAL PLAYER
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setActiveVideoModal(false)}
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
                onClick={() => setActiveVideoModal(false)}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 cursor-pointer"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/Bey4XXJAqS8?autoplay=1"
                  title="Our Belief Story"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          7. GLOBAL FOOTER (LandingFooter)
      ══════════════════════════════════════════════════════════════ */}
      <LandingFooter />
    </main>
  );
}
