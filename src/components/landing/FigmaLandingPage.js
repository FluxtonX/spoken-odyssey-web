"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BookmarkCheck,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Globe,
  Heart,
  Image,
  Lock,
  Menu,
  Mic2,
  Play,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const ease = [0.22, 1, 0.36, 1];
const softCurveCard = "[border-radius:8px_8px_64px_8px] border border-[#8f83ff] bg-white shadow-[8px_10px_18px_rgba(94,78,255,0.2)]";
const smallStatCard =
  "relative flex h-[103px] w-[170px] flex-none flex-col items-center justify-center overflow-hidden [border-radius:62px_14px_62px_14px] border border-[#5544ff] bg-[radial-gradient(ellipse_96px_96px_at_-12px_50%,rgba(183,176,255,0.92)_0%,rgba(218,214,255,0.75)_33%,rgba(255,255,255,0)_64%),radial-gradient(ellipse_96px_78px_at_72%_0%,#ffffff_0%,#ffffff_43%,rgba(255,255,255,0)_74%),linear-gradient(112deg,#eeeaff_0%,#ffffff_42%,#ffffff_100%)] px-3 text-center shadow-[inset_18px_0_26px_rgba(145,137,255,0.5)]";

const peopleImages = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=85",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&q=85",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=700&q=85",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&q=85",
];

const processImages = [
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=700&q=85",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=85",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=700&q=85",
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, light = false }) {
  return (
    <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${light ? "text-violet-300" : "text-[#5a42ff]"}`}>
      {children}
    </p>
  );
}

function CTAButton({ children, dark = false, href = "/signup" }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-extrabold transition duration-300 active:scale-95 ${
        dark
          ? "bg-[#111111] text-white hover:bg-[#2f2a5a]"
          : "bg-[#4f37ff] text-white shadow-[0_16px_34px_rgba(79,55,255,0.28)] hover:-translate-y-0.5 hover:bg-[#3521dc]"
      }`}
    >
      {children}
    </Link>
  );
}

function LandingNav() {
  const [open, setOpen] = useState(false);
  const links = ["About", "Features", "Stories", "Pricing"];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#dad2ff]/70 bg-white/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/odyssey.png" alt="Spoken Odyssey" className="h-8 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-xs font-semibold text-[#6f6985] transition hover:text-[#4f37ff]">
              {link}
            </a>
          ))}
          <a 
            href="https://odyssey-store-ten.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-black uppercase tracking-wider text-white bg-[#4f37ff] hover:bg-[#3521dc] transition-all px-4 py-2 rounded-full flex items-center gap-1.5 shadow-[0_6px_16px_rgba(79,55,255,0.2)] hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Store
          </a>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/auth" className="text-xs font-bold text-[#6f6985] transition hover:text-[#19142b]">
            Sign in
          </Link>
          <CTAButton>Begin Your Journey</CTAButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd5ff] text-[#281a77] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e5ddff] bg-white px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)} className="text-sm font-bold text-[#52496d]">
                {link}
              </a>
            ))}
            <a 
              href="https://odyssey-store-ten.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-[#4f37ff]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Store
            </a>
            <Link href="/auth" className="text-sm font-bold text-[#52496d]">
              Sign in
            </Link>
            <CTAButton>Begin Your Journey</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}

function Waveform({ active = false }) {
  const bars = [20, 42, 30, 62, 36, 80, 46, 24, 58, 70, 34, 50, 82, 42, 64, 30, 56, 74, 38, 52];
  return (
    <div className="flex h-16 items-end gap-1">
      {bars.map((height, index) => (
        <motion.span
          key={index}
          animate={active ? { height: [`${height}%`, `${Math.max(18, 92 - height)}%`, `${height}%`] } : { height: `${height}%` }}
          transition={{ repeat: active ? Infinity : 0, duration: 1.2, delay: index * 0.03 }}
          className="w-1.5 rounded-full bg-[#5a42ff]"
        />
      ))}
    </div>
  );
}

function HeroMockup() {
  const [playing, setPlaying] = useState(true);
  const waveform = [28, 56, 38, 74, 34, 30, 86, 58, 26, 34, 30, 24, 50, 64, 42, 70, 26, 36, 30, 24, 34, 64, 38, 84, 30, 48, 26, 58, 70, 42, 54];
  const memories = [
    ["voice", "First day in Paris", "Voice Memory - Jul 2019", Mic2, "bg-[#f0efff] text-[#5144ff]"],
    ["photo", "Wedding morning", "Photo - Sep 2021", Image, "bg-[#fff4ea] text-[#ff7a32]"],
    ["reflection", "What fatherhood taught me", "Reflection - Feb 2023", BookOpen, "bg-[#ecfff3] text-[#20c45a]"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 38, rotate: 1.5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.2 }}
      className="relative mx-auto w-full max-w-[540px] pb-12 pt-6"
    >
      {/* Floating Top-Right Stat Badge */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute right-[-10px] top-[2px] z-30 w-[205px] rounded-[18px] border border-[#5544ff]/40 bg-white/90 backdrop-blur-xl px-5 py-4 shadow-[0_18px_45px_rgba(72,61,210,0.18)] sm:right-[-35px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#2563EB]">
            <Sparkles size={17} />
          </div>
          <div>
            <p className="font-serif text-[18px] font-bold leading-none text-[#19131f]">2,847</p>
            <p className="mt-1 text-xs font-medium leading-none text-[#67616d]">Memories preserved</p>
          </div>
        </div>
      </motion.div>

      {/* Signature Figma Notch Card Outline */}
      <div className="relative pt-[32px]">
        <svg
          viewBox="0 0 520 440"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-[32px] h-[calc(100%-32px)] w-full overflow-visible drop-shadow-[0_24px_50px_rgba(75,61,225,0.16)]"
          aria-hidden="true"
        >
          <path
            d="M20 1 H337 C353 1 349 31 370 31 H500 C511 31 519 39 519 51 V418 C519 430 509 439 496 439 H20 C9 439 1 430 1 418 V21 C1 10 10 1 20 1 Z"
            fill="rgba(255, 255, 255, 0.45)"
            stroke="#5544ff"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Mockup Inner Content */}
        <div className="relative z-10 overflow-hidden backdrop-blur-xl rounded-t-[20px] rounded-b-[20px]">
          
          {/* Header */}
          <div className="flex h-[72px] items-center justify-between border-b border-[#6d5cff]/20 bg-white/40 px-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#2f2b42,#827791)] text-[13px] font-black text-white shadow-inner">
                SO
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#716880]">Your Archive</p>
                <p className="font-serif text-sm font-bold leading-tight text-[#161019]">Life Stories</p>
              </div>
            </div>
            <span className="flex items-center gap-2 text-xs font-bold text-[#ff2424] bg-red-50 px-3 py-1 rounded-full border border-red-200">
              <span className="h-2 w-2 rounded-full bg-[#ff4242] animate-ping" />
              Live Recording
            </span>
          </div>

          {/* Voice Player */}
          <div className="px-6 pb-5 pt-6 bg-white/20">
            <div className="flex items-end justify-between gap-5">
              <div className="flex h-[58px] flex-1 items-end gap-[5px]">
                {waveform.map((height, index) => (
                  <motion.span
                    key={index}
                    animate={playing ? { height: [`${height}%`, `${Math.max(18, 92 - height)}%`, `${height}%`] } : { height: `${height}%` }}
                    transition={{ repeat: playing ? Infinity : 0, duration: 1.35, delay: index * 0.025 }}
                    className="w-[4px] rounded-full bg-[#4f37ff]"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#4f37ff] text-white shadow-[0_10px_24px_rgba(79,55,255,0.3)] transition active:scale-95 hover:bg-[#3b25e6]"
                aria-label={playing ? "Pause memory" : "Play memory"}
              >
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#645e6e]">Voice Memory &bull; June 12, 2024</p>
          </div>

          {/* Recent Memories */}
          <div className="border-t border-[#6d5cff]/15 px-6 pb-6 pt-5 bg-white/30">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#5d5661]">Recent Memories</p>
            <div className="space-y-4">
              {memories.map(([key, title, meta, Icon, color]) => (
                <div key={key} className="grid grid-cols-[40px_1fr_8px] items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition">
                  <div className={`grid h-8 w-8 place-items-center rounded-full ${color}`}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold leading-tight text-[#19131f]">{title}</p>
                    <p className="mt-0.5 text-xs font-medium text-[#66606a]">{meta}</p>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4f37ff]/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Footer */}
          <div className="grid h-[60px] grid-cols-[1fr_70px_70px_70px] items-center border-t border-[#6d5cff]/20 px-6 bg-white/40">
            <p className="text-left text-[11px] font-bold uppercase tracking-[0.22em] text-[#201923]">Timeline</p>
            {[
              ["2021", "bg-[#786dff]"],
              ["2023", "bg-[#786dff]"],
              ["2024", "bg-[#24bd60]"],
            ].map(([year, color]) => (
              <div key={year} className="flex flex-col items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-[10px] font-bold text-[#5c5662]">{year}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Floating Bottom-Left AI Badge */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.4 }}
        className="absolute bottom-2 left-[-10px] z-30 w-[242px] rounded-[18px] border border-[#5544ff]/40 bg-white/90 backdrop-blur-xl px-5 py-4 shadow-[0_18px_45px_rgba(33,25,52,0.18)] sm:left-[-45px]"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#4f37ff] text-white">
            <Mic2 size={16} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-[#17111d]">AI Summary ready</p>
            <p className="mt-1 text-xs font-medium text-[#6f6874]">Your Year in Review - 2024</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedCountUpStat({ targetValue, label, suffix = "", decimalPlaces = 0, hasStar = false, icon: Icon }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime;
    const duration = 1800; // 1.8s count up duration
    const pauseTime = 1200; // 1.2s pause at target (total 3000ms cycle = 3s)

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const cycleTime = elapsed % (duration + pauseTime);

      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        const current = progress * targetValue;
        setDisplayValue(current);
      } else {
        setDisplayValue(targetValue);
      }

      frameId = requestAnimationFrame(animateCount);
    };

    frameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue]);

  const formatted = decimalPlaces > 0 ? displayValue.toFixed(decimalPlaces) : Math.floor(displayValue);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-[20px] bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_10px_28px_rgba(79,55,255,0.07)] hover:bg-white/85 hover:border-[#7B61FF]/60 hover:shadow-[0_16px_36px_rgba(79,55,255,0.16)] transition-all duration-300 overflow-hidden"
    >
      {/* Shimmer Light Purple Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Value & Icon Badge */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <p className="text-2xl sm:text-[28px] font-black text-[#4b3cff] leading-none group-hover:scale-105 transition-transform flex items-center gap-1 font-serif">
          <span>{formatted}{suffix}</span>
          {hasStar && <Star className="inline fill-[#4b3cff] text-[#4b3cff] mb-0.5" size={16} />}
        </p>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-[#4f37ff]/10 border border-[#4f37ff]/20 text-[#4f37ff] flex items-center justify-center group-hover:bg-[#4f37ff] group-hover:text-white transition-all shadow-xs">
            <Icon size={14} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {/* Bottom Label */}
      <p className="text-[11px] sm:text-[12px] font-bold text-[#5c5668] uppercase tracking-wider relative z-10 group-hover:text-[#211934] transition-colors">
        {label}
      </p>
    </motion.div>
  );
}

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    { url: "/Hiking.jpg", alt: "Mountain adventure and hiking memories" },
    { url: "/lion.jpg", alt: "Wildlife safari and wildlife moments" },
    { url: "/newYork%20Street.jpg", alt: "City life and urban memories" },
    { url: "/mountain.jpg", alt: "Scenic landscapes and travel reflections" },
    { url: "/friends%20night%20sky.jpg", alt: "Stargazing and friendship moments" },
    { url: "/herofourth.jpg", alt: "Personal journey and reflections" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section id="about" className="relative overflow-hidden bg-[linear-gradient(135deg,#f4f0ff_0%,#eef2ff_50%,#e9e4ff_100%)] pt-16 md:pt-20 pb-10 sm:pb-12 min-h-[640px] md:min-h-[700px] flex flex-col justify-between">
      
      {/* Animated Sliding Background Images (Sharp & Rich Contrast) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.url}
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: activeSlide === index ? 1 : 0,
              scale: activeSlide === index ? 1.06 : 1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover object-center" />
          </motion.div>
        ))}

        {/* Faded Light Purple-Bluish Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f0ff]/70 via-[#eef2ff]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#e9e4ff]/60 via-transparent to-[#f4f0ff]/30" />
      </div>

      {/* Hero Main Content (2 Columns: Left Text, Right Mockup) */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 lg:px-8 w-full pt-1 md:pt-3 grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-8 md:gap-10 items-center">
        
        {/* Left Column Text */}
        <div className="max-w-xl text-left">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            
            <motion.div variants={fadeUp} transition={{ duration: 0.58, ease }}>
              <SectionLabel>Life Storytelling, Simplified</SectionLabel>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.68, ease, delay: 0.06 }}
              className="mt-4 text-[42px] sm:text-[56px] lg:text-[66px] font-black leading-[0.98] tracking-[-0.02em] text-[#211934]"
            >
              Your life is a story.<br />
              <span className="text-[#4f37ff]">Preserve every chapter.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.62, ease, delay: 0.12 }}
              className="mt-6 max-w-xl text-base sm:text-lg font-semibold leading-relaxed text-[#645b78]"
            >
              Spoken Odyssey helps you capture your memories, reflections, and experiences through voice, images, and stories, creating a timeless archive for the people who matter most.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.62, ease, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <CTAButton>Begin Your Journey</CTAButton>
              <a
                href="#steps"
                className="inline-flex items-center gap-2.5 rounded-full border border-[#ddd5ff] bg-white px-6 py-3.5 text-xs sm:text-sm font-extrabold text-[#4d426b] transition hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
              >
                <Play size={14} fill="currentColor" /> Explore How It Works
              </a>
            </motion.div>

            {/* Slide Navigation Dots */}
            <div className="flex items-center gap-2 mt-8">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === i ? "w-8 bg-[#4f37ff]" : "w-2 bg-[#b5a9ff] hover:bg-[#4f37ff]"
                  }`}
                  aria-label={`Jump to slide ${i + 1}`}
                />
              ))}
            </div>

          </motion.div>
        </div>

        {/* Right Column: Hero Mockup */}
        <div className="relative w-full flex justify-center lg:justify-end">
          <HeroMockup />
        </div>

      </div>

      {/* Bottom 3 Stat Cards: Compact & Left-Aligned */}
      <div className="relative z-10 mx-auto max-w-6xl w-full px-5 mt-8 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl text-left">
          <AnimatedCountUpStat targetValue={2.3} label="Memories preserved" suffix="M+" decimalPlaces={1} icon={Sparkles} />
          <AnimatedCountUpStat targetValue={76} label="Countries" suffix="" decimalPlaces={0} icon={Globe} />
          <AnimatedCountUpStat targetValue={4.3} label="Rated" suffix="" decimalPlaces={1} hasStar={true} icon={Star} />
        </div>
      </div>

    </section>
  );
}

function BeliefSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="absolute -right-28 top-20 h-96 w-96 rounded-full bg-[#eeeaff]" />
      <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[#eeeaff]" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>Our Purpose</SectionLabel>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
            Because every life deserves to be remembered.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="border-l-4 border-[#4f37ff] pl-6">
            <p className="text-3xl font-black italic leading-tight text-[#211934]">
              &quot;Most moments disappear. Most voices are never preserved.&quot;
            </p>
            <div className="mt-10 grid justify-center gap-y-5 sm:grid-cols-[repeat(3,170px)] sm:gap-x-[22px]">
              {["73%", "95%", "\u221e"].map((value, index) => (
                <div key={value} className={smallStatCard}>
                  <p className="text-[34px] font-medium leading-none text-[#4b3cff]">{value}</p>
                  <p className="mx-auto mt-2 max-w-[140px] text-[11px] font-medium leading-[1.18] text-[#282331]">
                    {index === 0 ? "of family stories are lost within 2 generations" : index === 1 ? "of people wish they had recorded loved ones" : "value of hearing a voice you once knew"}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5 text-sm font-semibold leading-7 text-[#645b78]">
            <p>
              Years pass. Stories fade. Context is lost. The details of who someone truly was, their laughter, the cadence of their voice, the lessons they learned, become quietly too distant.
            </p>
            <p>
              Spoken Odyssey protects the moments that define who we are, preserving experiences in your own words, in your own voice, for the people who will one day want to know you.
            </p>
            <p>
              It is not a social platform. It is an heirloom, the most personal gift you will ever leave behind.
            </p>
            <a href="#steps" className="inline-flex items-center gap-1 text-xs font-black text-[#4f37ff]">
              Learn our story <ChevronRight size={14} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  const steps = [
    {
      number: "1",
      title: "Record & Journal",
      description: "Capture audio reflections, written journals, and photo memories directly from any device.",
      Icon: Mic2,
    },
    {
      number: "2",
      title: "Tag Family Connections",
      description: "Tag family members, friends, and loved ones to map generational connections automatically.",
      Icon: Users,
    },
    {
      number: "3",
      title: "Organize in Vaults",
      description: "Group your life milestones, voice notes, and photo albums into encrypted digital archives.",
      Icon: Database,
    },
    {
      number: "4",
      title: "AI Insights & Legacy",
      description: "Generate personal theme clouds, emotional landscape charts, and generational legacy scores.",
      Icon: Sparkles,
    },
  ];

  return (
    <section id="steps" className="relative overflow-hidden w-full py-12 md:py-16 min-h-[580px] md:min-h-[640px] flex flex-col justify-between">
      {/* Background Image Spanning 100% Full-Bleed Width & Height */}
      <img
        src="/family%20steps.jpg"
        alt="Family journey steps"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Purple Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#140C38]/95 via-[#2A1B60]/60 to-black/50 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(123,97,255,0.35),transparent_70%)]" />

      {/* Top Header & CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-4 text-left">
        <Reveal>
          <SectionLabel light>How It Works</SectionLabel>
          <h2 className="text-[32px] sm:text-[44px] md:text-[50px] font-bold text-white tracking-tight leading-[1.08] mt-2 mb-3 font-serif">
            Simple steps to<br />start preserving memories.
          </h2>
          <p className="text-white/85 text-[14px] sm:text-[16px] font-medium leading-relaxed mb-5 max-w-xl">
            Preserving family history should not feel complicated. Spoken Odyssey makes it easy to record, organize, tag connections, and build your digital heritage with confidence.
          </p>
          <div className="pt-1">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/95 text-[#140C38] font-bold text-[14px] shadow-lg hover:bg-white hover:scale-[1.03] hover:shadow-[#7B61FF]/40 transition-all duration-300 group"
            >
              <span>Begin Your Journey</span>
              <span className="w-7 h-7 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Bottom 4 Glass Cards Grid (Exact Screenshot Layout) */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pb-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-8 md:mt-10"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[24px] bg-white/12 backdrop-blur-xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-[#4A3AFF]/35 hover:border-[#7B61FF]/80 hover:shadow-[0_25px_60px_rgba(74,58,255,0.45)] transition-all duration-300 overflow-hidden"
            >
              {/* Shimmer Light Purple Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Number Top Left */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[36px] sm:text-[42px] font-light text-white/90 leading-none group-hover:text-white group-hover:scale-105 transition-all">
                  {step.number}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-[#4A3AFF] group-hover:border-transparent transition-all">
                  <step.Icon size={16} strokeWidth={2} />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-[19px] sm:text-[20px] font-bold text-white leading-snug mb-2.5 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/75 font-medium leading-relaxed group-hover:text-white/90 transition-colors">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}

function FeatureCards() {
  const features = [
    {
      kicker: "Voice capture",
      title: "Your voice captures your truth.",
      text: "Record your memories, stories, and voice exactly as they live in your mind.",
      Icon: Mic2,
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
    },
    {
      kicker: "Moments",
      title: "Preserve moments through images and video.",
      text: "Attach photographs and clips to stories, giving future generations a vivid sense of the moments that mattered.",
      Icon: BookOpen,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    },
    {
      kicker: "Reflections",
      title: "Write reflections that matter.",
      text: "Put into words the lessons, regrets, joys, and ideas that have shaped who you are.",
      Icon: Heart,
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    },
    {
      kicker: "Highlights",
      title: "Highlight the moments that changed your journey.",
      text: "Mark the stories that define chapters of your life and make them easy to rediscover.",
      Icon: BookmarkCheck,
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <section id="features" className="relative isolate overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -left-72 bottom-[-220px] z-0 h-[520px] w-[520px] rounded-full bg-[#eeeaff]" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <SectionLabel>From Story To Memory</SectionLabel>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
              Every kind of memory, perfectly preserved.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-right text-xs font-bold leading-5 text-[#7d748e] md:text-sm">
              Choose the medium that feels natural. Use all four. There is no wrong way to remember.
            </p>
          </Reveal>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#DBEAFE] bg-white p-6 shadow-[0_10px_30px_rgba(37,99,235,0.08)] hover:border-[#2563EB] hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)] transition-all duration-300 min-h-[380px]"
            >
              {/* Crisp, Sharp Themed Background Image (Zero Blur) */}
              <img
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-108 opacity-90"
              />

              {/* Crisp Gradient Vignette (100% Sharp Image at Top, Readable Light Base at Bottom) */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-[#EFF6FF]/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Top Header with Light Blue Kicker Badge & Icon */}
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB] border border-[#BFDBFE] shadow-xs">
                    {feature.kicker}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[#2563EB] border border-[#BFDBFE] group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-xs">
                    <feature.Icon size={16} strokeWidth={2.2} />
                  </div>
                </div>
                <h3 className="text-lg font-black leading-snug text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-xs font-semibold leading-5 text-[#475569]">
                  {feature.text}
                </p>
              </div>

              {/* Interactive Widget Previews */}
              <div className="relative z-10 mt-5 pt-3 border-t border-[#E2E8F0]">
                {index === 0 && <Waveform active={true} />}
                {index === 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {processImages.slice(0, 3).map((src) => (
                      <img key={src} src={src} alt="" className="h-14 w-full rounded-xl object-cover border border-[#BFDBFE] shadow-xs" />
                    ))}
                  </div>
                )}
                {index === 2 && (
                  <div className="rounded-xl border border-[#BFDBFE] bg-[#F0F9FF] p-3 text-[11px] font-bold text-[#0369A1] shadow-xs">
                    &ldquo;What did this moment teach you?&rdquo;
                  </div>
                )}
                {index === 3 && (
                  <div className="flex flex-wrap gap-1.5">
                    {["First big move", "Lesson learned", "Forever changed"].map((item) => (
                      <span key={item} className="rounded-full bg-[#EEF2FF] border border-[#BFDBFE] px-2.5 py-1 text-[10px] font-black text-[#2563EB] shadow-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const left = ["Designed for followers and likes", "Content disappears or is forgotten", "Curated performance, not truth", "Algorithms decide who sees your story", "Built around fleeting attention", "Value measured in engagement metrics", "Optimized for distraction"];
  const right = ["Designed for your family and legacy", "Every memory preserved permanently", "Authentic, unfiltered personal truth", "You control exactly who receives your story", "Built around depth and meaning", "Value measured in love and connection", "Optimized for reflection"];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-4xl text-center">
          <SectionLabel>A Different Kind Of Platform</SectionLabel>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
            Not social media. Something far more important.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal className={`${softCurveCard} p-7`}>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9c94ac]">Modern Social Media</p>
            <h3 className="mt-4 text-2xl font-black text-[#7a7288]">Temporary. Performative.</h3>
            <div className="mt-8 space-y-4">
              {left.map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm font-bold text-[#8a819a]">
                  <X className="text-[#ff7c7c]" size={15} /> {item}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08} className={`overflow-hidden ${softCurveCard}`}>
            <div className="bg-[#4f37ff] p-7 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#dcd6ff]">Spoken Odyssey</p>
              <h3 className="mt-4 text-2xl font-black">Permanent. Authentic.</h3>
            </div>
            <div className="space-y-4 p-7">
              {right.map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm font-bold text-[#5d536f]">
                  <Check className="text-[#5a42ff]" size={15} /> {item}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm font-bold italic text-[#746b85]">
            &quot;One day, your family won&apos;t only remember what you achieved, they will understand who you were.&quot;
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function HardwareSection() {
  return (
    <section className="bg-white py-20 border-t border-[#f2efff]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>Capture The Moment</SectionLabel>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
            Wanna Buy Recording Glasses?
          </h2>
          <p className="mt-6 text-lg font-semibold leading-relaxed text-[#645b78]">
            Don't pull out your phone and miss the moment. Our flagship 4K Smart Glasses record exactly what you see and seamlessly sync to your Spoken Odyssey vault. 
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 relative overflow-hidden rounded-[2rem] bg-[#4f37ff]/85 backdrop-blur-2xl shadow-[0_22px_55px_rgba(79,55,255,0.25)] border border-white/10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          
          <div className="relative p-10 md:p-16 flex flex-col items-center text-center">
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white border border-white/30 backdrop-blur-sm mb-6">
              Hardware Available Now
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
              Odyssey Pro Titanium 4K
            </h3>
            <p className="text-[#dcd6ff] font-medium max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
              Hands-free 4K video recording, spatial 3D audio capture, and one-tap sync directly to your family memory vault. Leave your phone in your pocket.
            </p>
            <a 
              href="https://odyssey-store-ten.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-[#4f37ff] shadow-xl transition-all hover:scale-105 hover:bg-[#f2efff] active:scale-95"
            >
              Shop Smart Glasses
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LegacySection() {
  return (
    <section className="bg-[#eeeaff] py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <Reveal>
          <div className="relative">
            <span className="absolute -left-5 -top-5 h-14 w-14 rounded-full bg-[#4f37ff]" />
            <img
              src="https://images.unsplash.com/photo-1652217627250-0dd21428e0f3?auto=format&fit=crop&fm=jpg&q=85&w=1200"
              alt="Grandmother holding a baby"
              className="relative h-[460px] w-full rounded-lg object-cover shadow-[0_22px_55px_rgba(52,37,144,0.2)]"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-md bg-white px-5 py-4 text-sm font-bold italic text-[#5d536f] shadow-xl">
              &quot;Grandpa, tell me about the war.&quot;
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionLabel>Family Legacy</SectionLabel>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
            Your story becomes a gift for generations.
          </h2>
          <p className="mt-7 text-sm font-semibold leading-7 text-[#645b78]">
            One day, your children won&apos;t only remember your accomplishments. They will want to hear your voice explaining what you believed in, what you feared, what you hoped for, and what you learned too late.
          </p>
          <div className="mt-7 space-y-4">
            {["Private family diary", "Curated conversations", "Connected generations"].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#4f37ff]">
                  <Check size={13} />
                </span>
                <div>
                  <p className="text-sm font-black text-[#211934]">{item}</p>
                  <p className="text-xs font-semibold text-[#7d748e]">Beautifully structured for the people who love you.</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CTAButton dark>Begin Your Legacy</CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LivesSection() {
  return (
    <section id="stories" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <SectionLabel>Extraordinary Lives</SectionLabel>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
              Every life has wisdom worth sharing.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-right text-xs font-bold leading-5 text-[#7d748e] md:text-sm">
              Real people. Unfiltered stories. Lessons carried through a life fully lived.
            </p>
          </Reveal>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Mason Chen", "Dr. Ava Noel", "Khalil Mendes", "Jonas Wheeler"].map((name, index) => (
            <motion.article key={name} variants={fadeUp} whileHover={{ y: -6 }} className="group">
              <div className={`relative h-72 overflow-hidden ${softCurveCard} bg-[#191919]`}>
                <img src={peopleImages[index]} alt={name} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#211934]">Life story</span>
                <span className="absolute right-4 top-4 rounded-full bg-[#4f37ff] px-3 py-1 text-[9px] font-black text-white">4.9</span>
                <p className="absolute bottom-5 left-4 right-4 text-sm font-bold italic leading-5 text-white">
                  &quot;{index === 0 ? "My father taught me that silence is a language." : index === 1 ? "Nothing ever taught me to listen like loss." : index === 2 ? "Every place I lived became an unfinished chapter." : "At seventy, I finally understood what ambition cost."}&quot;
                </p>
              </div>
              <h3 className="mt-4 text-sm font-black text-[#211934]">{name}</h3>
              <p className="mt-1 text-[11px] font-semibold text-[#8a819a]">{index === 0 ? "Former Olympic athlete" : index === 1 ? "Neurosurgeon" : index === 2 ? "Refugee educator" : "Civil rights attorney"} - {index + 21} stories</p>
            </motion.article>
          ))}
        </motion.div>

        <Reveal className="mt-12 text-center">
          <p className="text-sm font-black text-[#211934]">Join thousands of people preserving their extraordinary lives.</p>
          <a href="#pricing" className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#4f37ff]">
            Explore public stories <ChevronRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function IntelligenceSection() {
  return (
    <section className="bg-[#151515] py-20 text-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <SectionLabel light>A Memory Intelligence</SectionLabel>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Your memories, intelligently understood.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-right text-xs font-bold leading-5 text-[#bcb8c8] md:text-sm">
              AI that reads your archive the way a wise friend would, finding meaning, not just patterns.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_0.8fr]">
          <Reveal className="rounded-lg border border-white/18 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black">Memory Activity</p>
                <p className="text-xs font-semibold text-[#908c9a]">Your story arc across years</p>
              </div>
              <span className="text-xs font-black text-[#6956ff]">+ 12 stories</span>
            </div>
            <div className="mt-10 h-40">
              <svg viewBox="0 0 620 160" className="h-full w-full">
                <path d="M5 110 C 55 80, 82 140, 130 96 S 205 90, 250 72 S 320 110, 370 62 S 455 100, 515 58 S 575 80, 615 44" fill="none" stroke="#6956ff" strokeWidth="5" strokeLinecap="round" />
                <path d="M5 110 C 55 80, 82 140, 130 96 S 205 90, 250 72 S 320 110, 370 62 S 455 100, 515 58 S 575 80, 615 44 L615 160 L5 160 Z" fill="url(#fill)" opacity="0.35" />
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#6956ff" />
                    <stop offset="1" stopColor="#151515" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Childhood", "Family", "Career", "Love", "Grief", "Change", "Legacy", "Purpose"].map((item) => (
                <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold text-[#bcb8c8]">{item}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-4">
            {[
              [Search, "Tone in Review", "Your past reflections tend to emphasize resilience."],
              [Clock3, "Themes & Patterns", "Stories about entrepreneurship, mentors, and values rise often."],
              [BarChart3, "Forgotten Memories", "Some old records show themes your archive has been revisiting."],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-lg border border-white/16 bg-white/[0.04] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f37ff]">
                    <Icon size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">{title}</h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#bcb8c8]">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const cards = [
    [Shield, "Private by design", "Your story is visible to exactly who you choose."],
    [Lock, "You control sharing", "Set permissions for every story, album, and memory."],
    [Database, "Secure storage", "Built to protect your private archive over time."],
    [Users, "Family permissions", "Invite loved ones while keeping sensitive stories private."],
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <Reveal>
          <SectionLabel>Security & Trust</SectionLabel>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
            Your memories are yours alone.
          </h2>
          <p className="mt-7 text-sm font-semibold leading-7 text-[#645b78]">
            We understand that what you are preserving is irreplaceable. Every decision we make starts with trust, privacy, and control.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-[#b9aaff] bg-white px-5 py-4 shadow-[8px_10px_0_#eeeaff]">
            <Check className="text-[#4f37ff]" size={18} />
            <div>
              <p className="text-xs font-black text-[#211934]">SOC 2 Type II Compliant</p>
              <p className="text-[10px] font-bold text-[#8a819a]">Independently audited security practices</p>
            </div>
          </div>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 sm:grid-cols-2">
          {cards.map(([Icon, title, text], index) => (
            <motion.article key={title} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-[22px] border border-[#dad2ff] bg-[#f8f6ff] p-6 shadow-[10px_12px_0_#eeeaff]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#4f37ff]">
                <Icon size={18} />
              </div>
              <h3 className="mt-6 text-lg font-black text-[#211934]">{title}</h3>
              <p className="mt-3 text-xs font-semibold leading-5 text-[#756b88]">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="pricing" className="bg-[#4f37ff] py-20 text-white">
      <Reveal className="mx-auto max-w-4xl px-5 text-center">
        <div className="mx-auto mb-7 w-32">
          <Waveform active />
        </div>
        <SectionLabel light>Begin Today</SectionLabel>
        <h2 className="mt-4 text-5xl font-black leading-none tracking-tight md:text-7xl">
          Your voice deserves to continue.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-sm font-semibold leading-7 text-[#ddd7ff]">
          Start preserving your story today. Every memory you capture now is a gift to the people who will one day search for you in their hearts.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black text-[#3f2be8] transition hover:-translate-y-0.5">
            Start Your Journey <ArrowRight size={14} />
          </Link>
          <Link href="/auth" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-xs font-black text-white transition hover:bg-white/10">
            Login
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            aria-label="Download Spoken Odyssey on the App Store"
            className="inline-flex transition hover:-translate-y-0.5"
          >
            <img src="/app-store-badge.svg" alt="Download on the App Store" className="h-[52px] w-[175px] object-contain" />
          </a>
          <a
            href="#"
            aria-label="Get Spoken Odyssey on Google Play"
            className="inline-flex transition hover:-translate-y-0.5"
          >
            <img src="/play-store-badge.svg" alt="Get it on Play Store" className="h-[52px] w-[175px] object-contain" />
          </a>
        </div>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 border-t border-white/25 px-5 pt-8 text-center text-[10px] font-bold text-[#d8d1ff]">
        <span>Free account</span>
        <span>Private by default</span>
        <span>Cancel anytime</span>
      </div>
    </section>
  );
}

function LandingFooter() {
  const groups = [
    ["Product", "Features", "Voice & Video", "Stories", "AI Insights", "Pricing"],
    ["Company", "About", "Values", "Careers", "Contact"],
    ["Legal", "Privacy Policy", "Terms of Service", "Security", "Accessibility", "Cookie Settings"],
  ];

  return (
    <footer className="bg-[#111111] py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <img src="/odyssey.png" alt="Spoken Odyssey" className="h-9 w-auto brightness-0 invert" />
          <p className="mt-5 max-w-xs text-sm font-semibold leading-6 text-[#aaa6b5]">
            Your life story. Preserved for the people who matter most.
          </p>
          <p className="mt-5 text-xs font-bold text-[#aaa6b5]">&quot;Tell them your voice mattered beyond your lifetime.&quot;</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map(([title, ...items]) => (
            <div key={title}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white">{title}</h3>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <a key={item} href="#" className="block text-xs font-semibold text-[#aaa6b5] transition hover:text-white">
                    {item}
                  </a>
                ))}
                {title === "Product" && (
                  <a href="https://odyssey-store-ten.vercel.app" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20">
                    Buy Glasses <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-white/12 px-5 pt-6 text-xs font-semibold text-[#8b8794] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© 2026 Spoken Odyssey. All rights reserved.</p>
        <div className="flex gap-5">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}

export default function FigmaLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#211934]">
      <LandingNav />
      <HeroSection />
      <BeliefSection />
      <StepsSection />
      <FeatureCards />
      <ComparisonSection />
      <HardwareSection />
      <LegacySection />
      <LivesSection />
      <IntelligenceSection />
      <SecuritySection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
