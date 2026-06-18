"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Database,
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
import { useState } from "react";

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
      className="relative mx-auto w-full max-w-[560px] pb-12 pt-7 sm:pb-14"
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute right-[-10px] top-0 z-30 w-[205px] rounded-[18px] border border-[#5544ff] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(72,61,210,0.14)] sm:right-[-50px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0efff] text-[#4f37ff]">
            <Sparkles size={17} />
          </div>
          <div>
            <p className="font-serif text-[18px] font-bold leading-none text-[#19131f]">2,847</p>
            <p className="mt-1 text-xs font-medium leading-none text-[#67616d]">Memories preserved</p>
          </div>
        </div>
      </motion.div>

      <div className="relative pt-[56px]">
        <svg
          viewBox="0 0 520 526"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-[56px] h-[526px] w-full overflow-visible drop-shadow-[0_30px_52px_rgba(75,61,225,0.12)]"
          aria-hidden="true"
        >
          <path
            d="M20 1 H337 C353 1 349 31 370 31 H500 C511 31 519 39 519 51 V502 C519 515 509 525 496 525 H178 C154 525 162 494 139 494 H20 C9 494 1 485 1 474 V21 C1 10 10 1 20 1 Z"
            fill="white"
            stroke="#5544ff"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative z-10 overflow-hidden">
        <div className="flex h-[72px] items-center justify-between border-b border-[#6d5cff] px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#2f2b42,#827791)] text-[13px] font-black text-white shadow-inner">
              SO
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b2aeb7]">Your Archive</p>
              <p className="font-serif text-sm font-bold leading-tight text-[#161019]">Life Stories</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-sm font-medium text-[#ff2424]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff4242]" />
            Recording
          </span>
        </div>

        <div className="px-6 pb-4 pt-7">
          <div className="flex items-end justify-between gap-5">
            <div className="flex h-[58px] flex-1 items-end gap-[5px]">
              {waveform.map((height, index) => (
                <motion.span
                  key={index}
                  animate={playing ? { height: [`${height}%`, `${Math.max(18, 92 - height)}%`, `${height}%`] } : { height: `${height}%` }}
                  transition={{ repeat: playing ? Infinity : 0, duration: 1.35, delay: index * 0.025 }}
                  className="w-[4px] rounded-full bg-[#5144ff]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#5144ff] text-white shadow-[0_10px_24px_rgba(81,68,255,0.24)] transition active:scale-95"
              aria-label={playing ? "Pause memory" : "Play memory"}
            >
              <Play size={13} fill="currentColor" className="ml-0.5" />
            </button>
          </div>
          <p className="mt-4 text-xs font-medium text-[#aaa5ad]">Voice Memory - June 12, 2024</p>
        </div>

        <div className="border-t border-[#efedf2] px-6 pb-8 pt-5">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-[#5d5661]">Recent Memories</p>
          <div className="space-y-7">
            {memories.map(([key, title, meta, Icon, color]) => (
              <div key={key} className="grid grid-cols-[44px_1fr_8px] items-center gap-3">
                <div className={`grid h-8 w-8 place-items-center rounded-full ${color}`}>
                  <Icon size={15} />
                </div>
                <div>
                  <p className="font-serif text-sm font-bold leading-tight text-[#19131f]">{title}</p>
                  <p className="mt-1 text-xs font-medium text-[#66606a]">{meta}</p>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-[#ebe8e5]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid h-[66px] grid-cols-[1fr_84px_84px_84px] items-center border-t border-[#6d5cff] px-6">
          <p className="text-right text-[12px] font-medium uppercase tracking-[0.22em] text-[#201923]">Timeline</p>
          {[
            ["2021", "bg-[#786dff]"],
            ["2023", "bg-[#786dff]"],
            ["2024", "bg-[#24bd60]"],
          ].map(([year, color]) => (
            <div key={year} className="flex flex-col items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <span className="text-[10px] font-medium text-[#5c5662]">{year}</span>
            </div>
          ))}
        </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.4 }}
        className="absolute bottom-0 left-[-6px] z-30 w-[242px] rounded-[18px] border border-[#5544ff] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(33,25,52,0.13)] sm:left-[-92px]"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#5144ff] text-white">
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

function HeroSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#e9e4ff] pt-28">
      <div className="absolute -bottom-36 -left-16 h-[360px] w-[360px] rounded-full bg-[#cbc3ff]" />
      <div className="absolute -bottom-40 right-[-140px] h-[520px] w-[520px] rounded-full bg-white" />
      <div className="absolute bottom-[-260px] left-[18%] h-[560px] w-[880px] rotate-[-9deg] rounded-[48%] bg-white" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
          <motion.div variants={fadeUp} transition={{ duration: 0.58, ease }}>
            <SectionLabel>Life Storytelling, Simplified</SectionLabel>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.68, ease, delay: 0.06 }}
            className="mt-4 text-[44px] font-black leading-[0.98] tracking-[-0.02em] text-[#211934] sm:text-6xl lg:text-[70px]"
          >
            Your life is a story. Preserve every chapter.
          </motion.h1>
          <motion.p variants={fadeUp} transition={{ duration: 0.62, ease, delay: 0.12 }} className="mt-7 max-w-lg text-base font-semibold leading-7 text-[#645b78]">
            Spoken Odyssey helps you capture your memories, reflections, and experiences through voice, images, and stories, creating a timeless archive for the people who matter most.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.62, ease, delay: 0.18 }} className="mt-8 flex flex-wrap gap-4">
            <CTAButton>Begin Your Journey</CTAButton>
            <a href="#steps" className="inline-flex items-center gap-2 rounded-full border border-[#ddd5ff] bg-white px-5 py-3 text-xs font-extrabold text-[#4d426b] transition hover:-translate-y-0.5">
              <Play size={14} /> Explore How It Works
            </a>
          </motion.div>
        </motion.div>

        <HeroMockup />
      </div>

      <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-4 px-5 pb-12 sm:grid-cols-3 lg:px-8">
        {[
          ["2.3M+", "Memories preserved"],
          ["87", "Countries"],
          ["4.9", "Rated"],
        ].map(([value, label]) => (
          <Reveal key={label} className={`${softCurveCard} px-5 py-4 text-center`}>
            <p className="text-3xl font-black leading-none text-[#5a42ff]">{value}{value === "4.9" ? <Star className="mb-1 ml-1 inline fill-[#5a42ff]" size={16} /> : null}</p>
            <p className="mt-2 text-[11px] font-bold leading-tight text-[#5c5668]">{label}</p>
          </Reveal>
        ))}
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
    ["Capture", "Record stories, images, voice reflections, and experiences as they happen, in your own words, with your own voice."],
    ["Preserve", "Spoken Odyssey organizes, enhances, and securely collects the full arc of a life story."],
    ["Reflect", "Private prompts, timelines, and meaningful moments bring a personal memory map to life."],
    ["Share", "Give your story to future family members, future generations, or the world when the time is right."],
  ];

  return (
    <section id="steps" className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -left-48 bottom-[-180px] h-[460px] w-[460px] rounded-full bg-[#d8d0ff]" />
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_0.7fr]">
          <Reveal>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#211934] md:text-5xl">
              A journey in four simple steps.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-right text-xs font-bold leading-5 text-[#7d748e] md:text-sm">
              From your first memory to a living legacy passed to the people you love.
            </p>
          </Reveal>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], index) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ y: -8, rotate: index % 2 ? 1 : -1 }}
              transition={{ duration: 0.35 }}
              className={`overflow-hidden ${softCurveCard}`}
            >
              <div className="relative h-48 overflow-hidden [border-radius:7px_7px_64px_0]">
                <img src={processImages[index]} alt={title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <p className="absolute left-4 top-4 text-3xl font-black text-[#5a42ff]">0{index + 1}</p>
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[#5a42ff] shadow-lg">
                  {index === 0 ? <Mic2 size={16} /> : index === 1 ? <Database size={16} /> : index === 2 ? <Sparkles size={16} /> : <Users size={16} />}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black text-[#211934]">{title}</h3>
                <p className="mt-3 min-h-20 text-xs font-semibold leading-5 text-[#756b88]">{text}</p>
                <div className="mt-5 border-t border-[#6d5cff] pt-3 text-[9px] font-black text-[#211934]">
                  {index === 0 ? "Voice recordings - Written notes - Photos & video" : index === 1 ? "Chapters - Milestones - Collections" : index === 2 ? "Year in Review - Themes - Patterns" : "Private - Family only - Public"}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const features = [
    ["Voice capture", "Your voice captures your truth.", "Record your memories, stories, and voice exactly as they live in your mind.", Mic2, "#f0ecff"],
    ["Moments", "Preserve moments through images and video.", "Attach photographs and clips to stories, giving future generations a vivid sense of the moments that mattered.", BookOpen, "#fff4e8"],
    ["Reflections", "Write reflections that matter.", "Put into words the lessons, regrets, joys, and ideas that have shaped who you are.", Heart, "#e9fff5"],
    ["Highlights", "Highlight the moments that changed your journey.", "Mark the stories that define chapters of your life and make them easy to rediscover.", Sparkles, "#f4edff"],
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
          {features.map(([kicker, title, text, Icon, color], index) => (
            <motion.article key={title} variants={fadeUp} whileHover={{ y: -7 }} className={`${softCurveCard} p-5`}>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: color }}>
                <Icon className="text-[#4f37ff]" size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7af8]">{kicker}</p>
              <h3 className="mt-3 text-lg font-black leading-tight text-[#211934]">{title}</h3>
              <p className="mt-4 text-xs font-semibold leading-5 text-[#756b88]">{text}</p>
              {index === 0 && <Waveform />}
              {index === 1 && (
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {processImages.slice(0, 3).map((src) => (
                    <img key={src} src={src} alt="" className="h-16 rounded-xl object-cover" />
                  ))}
                </div>
              )}
              {index === 2 && <div className="mt-5 rounded-xl border border-[#8de7b3] bg-[#dffdec] p-3 text-[10px] font-bold text-[#27734d]">What did this moment teach you?</div>}
              {index === 3 && (
                <div className="mt-5 space-y-2">
                  {["First big move", "A lesson learned", "Changed forever"].map((item) => (
                    <div key={item} className="rounded-full bg-[#f2efff] px-3 py-2 text-[10px] font-black text-[#6c5ad9]">{item}</div>
                  ))}
                </div>
              )}
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
      <LegacySection />
      <LivesSection />
      <IntelligenceSection />
      <SecuritySection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
