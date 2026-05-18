"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Pause, Lock, Users, Globe, UserCheck } from "lucide-react";
import { useState } from "react";

const FEED_CARDS = [
  { type: "photo", user: "Sarah M.", privacy: "Family Only", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80", caption: "Family Reunion at the Lake 🌊", privacyColor: "bg-amber-100 text-amber-700" },
  { type: "voice", user: "Ahmed K.", privacy: "Private", emoji: "🎙️", caption: "Grandpa's story about 1975", privacyColor: "bg-purple-100 text-purple-700" },
  { type: "text", user: "Maria L.", privacy: "Public", emoji: "✍️", caption: "\"Some memories are worth holding onto forever...\"", privacyColor: "bg-emerald-100 text-emerald-700" },
];

const PRIVACY_OPTS = [
  { id: "private", icon: Lock, label: "Private", active: "text-purple-700 bg-purple-50 border-purple-300" },
  { id: "family", icon: Users, label: "Family Only", active: "text-amber-700 bg-amber-50 border-amber-400" },
  { id: "selected", icon: UserCheck, label: "Selected", active: "text-stone-700 bg-stone-100 border-stone-300" },
  { id: "public", icon: Globe, label: "Public", active: "text-emerald-700 bg-emerald-50 border-emerald-300" },
];

export default function HeroSection() {
  const [playing, setPlaying] = useState(false);
  const [activePrivacy, setActivePrivacy] = useState("family");

  return (
    <section className="relative min-h-screen pt-24 pb-16 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-br from-[#fdfcfa] via-amber-50/40 to-stone-50">
      {/* Ambient background orbs */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-rose-200/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT */}
        <motion.div className="space-y-8" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut" }}>
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-xs font-extrabold text-amber-800 uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Private • Family • Public Memory Vault
          </motion.span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.07]">
            Your memories,{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent">
              beautifully saved
            </span>{" "}
            and privately shared.
          </h1>

          <p className="text-lg md:text-xl text-stone-500 font-medium leading-relaxed max-w-xl">
            Store photos, voice notes, text records, and life moments in organized albums. Share them publicly, privately, or only with selected family members — all from one secure memory space.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-extrabold shadow-xl shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.03] active:scale-95 transition-all group text-base">
              Create Your Memory Space <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-stone-200 bg-white text-stone-700 font-bold hover:border-amber-300 hover:bg-amber-50 active:scale-95 transition-all text-base shadow-sm group">
              <Play size={16} className="text-amber-500 group-hover:scale-110 transition-transform" /> See How It Works
            </a>
          </div>

          <p className="text-xs text-stone-400 font-semibold flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm" />
            Private albums • Family-only sharing • Voice, photo & text memories
          </p>
        </motion.div>

        {/* RIGHT — Premium Product Mockup */}
        <motion.div className="relative" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}>
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-stone-200/80 shadow-2xl shadow-amber-100 p-5 space-y-3.5">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-stone-700 flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-xs">S</div>
                Spoken Odyssey
              </span>
              <span className="text-[10px] font-bold text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full">My Feed</span>
            </div>

            {/* Privacy Selector */}
            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 shadow-inner">
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-2.5 pl-0.5">Memory Visibility</p>
              <div className="flex gap-1.5 flex-wrap">
                {PRIVACY_OPTS.map(({ id, icon: Icon, label, active }) => (
                  <button key={id} onClick={() => setActivePrivacy(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold border-2 transition-all duration-200 ${activePrivacy === id ? active + " shadow-sm scale-105" : "bg-white border-stone-200 text-stone-400 hover:border-stone-300"}`}>
                    <Icon size={11} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed Cards */}
            {FEED_CARDS.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
                className="rounded-2xl bg-gradient-to-r from-stone-50 to-amber-50/20 border border-stone-100 p-4 flex gap-3 items-start shadow-sm hover:shadow-md transition-shadow">
                {c.img ? (
                  <img src={c.img} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">{c.emoji}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-stone-700">{c.user}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${c.privacyColor} border-current/20`}>{c.privacy}</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed line-clamp-2">{c.caption}</p>
                  {c.type === "voice" && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <button onClick={() => setPlaying(!playing)} className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm hover:bg-amber-600 transition-colors">
                        {playing ? <Pause size={9} fill="white" /> : <Play size={9} fill="white" className="ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-end gap-0.5 h-5">
                        {[...Array(22)].map((_, j) => (
                          <div key={j} className={`flex-1 rounded-full transition-all duration-300 ${playing ? "bg-amber-400" : "bg-stone-200"}`}
                            style={{ height: `${Math.max(20, ((j % 6) + 1) * 15)}%`, transitionDelay: playing ? `${j * 30}ms` : "0ms" }} />
                        ))}
                      </div>
                      <span className="text-[9px] text-stone-400 font-semibold">0:42</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Album Strip */}
            <div className="flex gap-2 pt-0.5">
              {[
                { title: "Family Trip", color: "from-rose-400 to-pink-600", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=70" },
                { title: "Grandpa's Stories", color: "from-amber-400 to-amber-700" },
                { title: "Private Notes", color: "from-stone-500 to-stone-800" }
              ].map((a, i) => (
                <div key={i} className={`flex-1 h-16 rounded-2xl bg-gradient-to-br ${a.color} flex items-end p-2.5 shadow-md overflow-hidden relative group hover:scale-105 transition-transform cursor-pointer`}>
                  {a.img && <img src={a.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />}
                  <span className="text-[10px] font-extrabold text-white leading-tight drop-shadow-md relative z-10">{a.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Badges */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="absolute -top-5 -left-6 hidden md:flex bg-white border border-amber-100 rounded-2xl shadow-xl shadow-amber-100 px-4 py-3 text-xs font-extrabold text-amber-700 items-center gap-2">
            <span className="text-xl">🎙️</span> Voice memory saved!
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.6 }}
            className="absolute -bottom-5 -right-5 hidden md:flex bg-white border border-emerald-100 rounded-2xl shadow-xl shadow-emerald-50 px-4 py-3 text-xs font-extrabold text-emerald-700 items-center gap-2">
            <span className="text-xl">🔒</span> Family-only access
          </motion.div>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }}
            className="absolute top-1/2 -right-8 hidden lg:flex bg-white border border-rose-100 rounded-2xl shadow-xl px-4 py-3 text-xs font-extrabold text-rose-600 items-center gap-2">
            <span className="text-xl">🖼️</span> 3 new photos
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
