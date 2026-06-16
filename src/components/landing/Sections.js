"use client";
import { motion } from "framer-motion";
import { PROBLEM_CARDS, SOLUTION_CARDS, FEATURES, HOW_IT_WORKS, USE_CASES, SECURITY_ITEMS, FAQS } from "@/data/landing";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Lock, Users, UserCheck, Globe, Star, ShieldAlert, Award, Compass, Play, Pause, Camera, Mic, FileText, CheckCircle2 } from "lucide-react";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay } }
});

const SectionBadge = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200/60 text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-4 shadow-sm">
    {children}
  </span>
);

/* ─── 1. PROBLEM SECTION ─── */
export function ProblemSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-100/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-5 text-center relative z-10">
        <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>⚠️ The Problem</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Your memories are scattered everywhere.
          </h2>
          <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
            Photos stay in phone galleries, voice notes get lost in chat histories, and important family stories disappear across different apps. Sharing everything publicly is not always safe, and private sharing often feels complicated.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEM_CARDS.map((c, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.08)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-gradient-to-br from-stone-50 to-amber-50/20 border border-stone-200/80 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/5 rounded-full blur-2xl group-hover:bg-amber-200/10 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-amber-700">
                {resolveGlass3DIcon(c.title)}
              </div>
              <h3 className="font-extrabold text-base text-stone-800 mb-2">{c.title}</h3>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 2. SOLUTION SECTION ─── */
export function SolutionSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-br from-amber-50/40 via-stone-50/30 to-amber-50/20 border-y border-stone-200/40 relative">
      <div className="max-w-6xl mx-auto px-5 text-center relative z-10">
        <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>✨ The Solution</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            One beautiful space for your life memories.
          </h2>
          <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
            Create albums, save personal records, post updates, and control exactly who can see each memory. Whether it is public, private, or family-only — you stay in control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTION_CARDS.map((c, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.06)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="group p-8 rounded-[2rem] bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-400/60 transition-all duration-300 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="w-16 h-16 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm text-amber-700">
                {resolveGlass3DIcon(c.title)}
              </div>
              <h3 className="font-extrabold text-lg text-stone-850 mb-2">{c.title}</h3>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 3. CORE FEATURES SECTION ─── */
export function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <motion.div className="text-center mb-16" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>🌟 Features Grid</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Everything you need to save, organize, and share memories.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.06)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="group flex gap-5 p-6 rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white to-stone-50/50 hover:border-amber-400/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50/50 to-stone-100/50 border border-amber-200/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm text-amber-700">
                {resolveGlass3DIcon(f.title)}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-850 mb-1.5">{f.title}</h3>
                <p className="text-sm text-stone-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. PRIVACY SECTION ─── */
export function PrivacySection() {
  const [active, setActive] = useState("family");
  
  const opts = [
    { id: "private", icon: <Lock className="w-6 h-6" />, label: "Private", desc: "Only you can view this memory. Completely invisible to everyone else.", color: "border-purple-300 bg-purple-50", badge: "bg-purple-100 text-purple-700", iconBg: "bg-purple-100 text-purple-700" },
    { id: "family", icon: <Users className="w-6 h-6" />, label: "Family Only", desc: "Visible only to family members you have added. Safe from public eyes.", color: "border-amber-300 bg-amber-50", badge: "bg-amber-100 text-amber-800", iconBg: "bg-amber-100 text-amber-700" },
    { id: "selected", icon: <UserCheck className="w-6 h-6" />, label: "Selected Members", desc: "Share with specific individuals. Handpick exactly who has permission.", color: "border-blue-300 bg-blue-50", badge: "bg-blue-100 text-blue-700", iconBg: "bg-blue-100 text-blue-700" },
    { id: "public", icon: <Globe className="w-6 h-6" />, label: "Public", desc: "Post memories to your public profile and the global community feed.", color: "border-emerald-300 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", iconBg: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <section id="privacy" className="py-24 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.1),_transparent_60%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <motion.div className="text-center mb-16" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>🔒 Privacy Controls</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            You decide what stays private and what gets shared.
          </h2>
          <p className="text-lg text-stone-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Every memory can have its own visibility setting. Keep personal records private, share selected albums with family, or post public moments to your feed.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-white/5 border border-white/10 p-1.5 gap-1.5 flex-wrap justify-center shadow-lg backdrop-blur-md">
            {opts.map(o => (
              <button 
                key={o.id} 
                onClick={() => setActive(o.id)} 
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${active === o.id ? "bg-amber-500 text-stone-950 shadow-md scale-105" : "text-stone-300/80 hover:text-white"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Privacy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {opts.map((o, i) => (
            <motion.div 
              key={o.id} 
              variants={fadeUp(i * 0.08)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              onClick={() => setActive(o.id)}
              className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative ${active === o.id ? o.color + " scale-105 shadow-2xl" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-inner ${active === o.id ? o.iconBg : "bg-white/10 text-white"}`}>
                {o.icon}
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold mb-3 shadow-sm ${active === o.id ? o.badge : "bg-white/10 text-white/70"}`}>
                {o.label}
              </span>
              <p className={`text-sm font-semibold leading-relaxed mt-1 ${active === o.id ? "text-stone-700" : "text-stone-300"}`}>
                {o.desc}
              </p>
              {active === o.id && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black shadow-md">
                  ✓
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p 
          variants={fadeUp(0.25)} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }}
          className="text-center text-amber-500/80 text-sm font-extrabold mt-12 max-w-xl mx-auto"
        >
          "Designed for meaningful memories — not random noise, ads, or uncontrolled sharing."
        </motion.p>
      </div>
    </section>
  );
}

/* ─── 5. HOW IT WORKS SECTION ─── */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-5 relative z-10">
        <motion.div className="text-center mb-16" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>🧭 Complete Guide</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Start saving memories in minutes.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((s, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.1)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-3xl border border-stone-150 bg-gradient-to-b from-white to-stone-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center font-black text-amber-900 text-lg mb-5 shadow-inner">
                {s.step}
              </div>
              <h3 className="font-extrabold text-base text-stone-800 mb-2">{s.title}</h3>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. USE CASES SECTION ─── */
export function UseCasesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50/30 to-stone-50/50 border-t border-stone-200/40">
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <motion.div className="text-center mb-16" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>🎒 Use Cases</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Made for personal moments, family stories, and lasting memories.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((c, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.06)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="group p-8 rounded-[2rem] bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-400/60 transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm text-amber-700">
                {resolveGlass3DIcon(c.title)}
              </div>
              <h3 className="font-extrabold text-lg text-stone-850 mb-2">{c.title}</h3>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. PRODUCT PREVIEW SECTION ─── */
export function ProductPreviewSection() {
  const [tab, setTab] = useState("feed");

  const tabs = [
    { id: "feed", label: "📱 Smart Feed" },
    { id: "albums", label: "📚 Custom Albums" },
    { id: "family", label: "👨‍👩‍👧‍👦 Family Space" },
    { id: "privacy", label: "🔒 Visibility Control" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-5 relative z-10 text-center">
        <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
          <SectionBadge>👀 Product Live Preview</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            A familiar feed. A smarter memory system.
          </h2>
        </motion.div>

        {/* Tab Controls */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)} 
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all ${tab === t.id ? "bg-stone-900 text-white shadow-md scale-105" : "bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-500"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dynamic Display Panels */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-[2.5rem] p-6 md:p-8 min-h-[300px] shadow-inner text-left max-w-3xl mx-auto">
          {tab === "feed" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-stone-700">Dada Jaan</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">👨‍👩‍👧‍👦 Family Circle</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed font-semibold mb-3">
                  "This is a voice note recording of Dada Jaan telling the story of how our family moved from our native village to the city in 1968. Play it to hear his raw emotion."
                </p>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <button className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">🎙️</button>
                  <div className="flex-1 h-8 flex items-center gap-0.5">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="flex-1 bg-amber-400 rounded-full" style={{ height: `${20 + (i % 4) * 20}%` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-400">0:52</span>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "albums" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "🌻 Childhood Days", count: "48 Memories", privacy: "🔒 Private", color: "from-amber-400 to-amber-600" },
                { title: "✈️ Travel Diaries 2024", count: "124 Memories", privacy: "🌍 Public", color: "from-rose-400 to-rose-600" },
                { title: "🎂 Family Birthdays", count: "32 Memories", privacy: "👨‍👩‍👧‍👦 Family Only", color: "from-emerald-400 to-emerald-600" },
                { title: "📝 Legacy Storybook", count: "18 Records", privacy: "🔒 Private", color: "from-stone-500 to-stone-700" },
              ].map((album, i) => (
                <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${album.color} text-white flex flex-col justify-between h-36 shadow-lg`}>
                  <span className="text-xs font-bold bg-white/20 border border-white/10 px-2 py-0.5 rounded-full w-max">{album.privacy}</span>
                  <div>
                    <h4 className="font-extrabold text-base leading-tight mb-1">{album.title}</h4>
                    <p className="text-xs font-medium opacity-90">{album.count}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "family" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-sm font-extrabold text-stone-700">Invite a Family Member</span>
                <button className="px-4 py-2 bg-amber-500 text-stone-950 text-xs font-black rounded-xl shadow-md hover:bg-amber-400">
                  + Add Member
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Mom (Sarah)", relation: "Parent", status: "Approved" },
                  { name: "Sister (Emily)", relation: "Sibling", status: "Approved" },
                  { name: "Grandpa (James)", relation: "Grandparent", status: "Pending Invite" },
                ].map((member, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl border border-stone-200">
                    <div>
                      <h4 className="text-sm font-bold text-stone-850">{member.name}</h4>
                      <p className="text-[10px] text-stone-400 font-semibold">{member.relation}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${member.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "privacy" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="text-xs font-bold text-stone-400 uppercase mb-2">Toggle Memory Visibility Settings</p>
              {opts.map((opt, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-850">{opt.label}</h4>
                      <p className="text-[10px] text-stone-400 font-semibold">Visibility mode for this post</p>
                    </div>
                  </div>
                  <input type="radio" checked={i === 1} className="w-4 h-4 accent-amber-500" readOnly />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── 8. DYNAMIC MOBILE APP SECTION (WITH FULL REALISTIC SMARTPHONE MOCKUP) ─── */
export function MobileAppSection() {
  return (
    <section id="mobile" className="py-24 bg-stone-50 border-t border-stone-200/40 relative">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column (Details) */}
        <motion.div className="space-y-7 text-left" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>📱 Mobile & Web App</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Capture memories from your phone. Organize them beautifully on web.
          </h2>
          <p className="text-lg text-stone-500 font-medium leading-relaxed">
            Use the mobile app to instantly upload photos, record voice memories, and share moments. Use the web platform to browse, manage albums, and experience your memories on a larger screen.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-stone-900 text-white hover:scale-105 active:scale-95 transition-all shadow-md">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <div className="text-[9px] opacity-70 font-semibold">Download on the</div>
                <div className="text-sm font-extrabold">App Store</div>
              </div>
            </button>
            <button className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-stone-900 text-white hover:scale-105 active:scale-95 transition-all shadow-md">
              <span className="text-2xl">▶️</span>
              <div className="text-left">
                <div className="text-[9px] opacity-70 font-semibold">Get it on</div>
                <div className="text-sm font-extrabold">Google Play</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Right Column (FULL REALISTIC SMARTPHONE MOCKUP) */}
        <div className="flex justify-center relative">
          
          {/* Glowing amber halo background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* REALISTIC PHONE CONTAINER WITH NOTCH, BEZEL, SCREEN, STATUS BAR & HARDWARE DETAILED CSS */}
          <div className="relative w-[290px] h-[580px] bg-stone-900 rounded-[3rem] p-3 shadow-2xl border-4 border-stone-800 shadow-stone-400/30 flex flex-col justify-between overflow-hidden">
            
            {/* Speaker Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-b-2xl z-30 flex items-center justify-center gap-2">
              <div className="w-10 h-1 bg-stone-800 rounded-full" />
              <div className="w-2.5 h-2.5 bg-stone-800 rounded-full" />
            </div>

            {/* Screen Content Wrapper */}
            <div className="w-full h-full bg-[#fdfcfa] rounded-[2.3rem] overflow-hidden flex flex-col relative z-10 border border-stone-800">
              
              {/* Internal Screen Header / Status Bar */}
              <div className="bg-gradient-to-tr from-amber-500 to-amber-700 px-6 pt-7 pb-5 text-white flex flex-col justify-between shadow-md">
                <div className="flex justify-between items-center text-[10px] font-black opacity-80 mb-2">
                  <span>9:41 AM</span>
                  <span className="flex items-center gap-1">📶 🔋</span>
                </div>
                <div className="text-left mt-2">
                  <p className="text-[9px] font-extrabold opacity-80 mb-0.5">Spoken Odyssey</p>
                  <h3 className="text-base font-extrabold tracking-tight">Your Memory Vault</h3>
                </div>
              </div>

              {/* Screen Body */}
              <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
                <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider text-left pl-0.5">Instant Capture Controls</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-rose-100/50">
                    <Camera className="w-5 h-5 text-rose-600 mb-1.5" />
                    <span className="text-[10px] font-extrabold text-rose-800">Camera</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-amber-100/50">
                    <Mic className="w-5 h-5 text-amber-600 mb-1.5" />
                    <span className="text-[10px] font-extrabold text-amber-800">Audio Record</span>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-indigo-100/50">
                    <FileText className="w-5 h-5 text-indigo-600 mb-1.5" />
                    <span className="text-[10px] font-extrabold text-indigo-800">Text Journal</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-emerald-100/50">
                    <Users className="w-5 h-5 text-emerald-600 mb-1.5" />
                    <span className="text-[10px] font-extrabold text-emerald-800">Invite Family</span>
                  </div>
                </div>

                {/* Album Preview list inside phone screen */}
                <div className="p-3 bg-white border border-stone-200/80 rounded-2xl shadow-sm text-left">
                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block mb-1">Quick album</span>
                  <h4 className="text-xs font-black text-stone-800 mb-1">🌲 Camping Trip 2024</h4>
                  <p className="text-[9px] text-stone-500 font-semibold">14 items • Protected Family Only</p>
                </div>
              </div>

              {/* Home Indicator line */}
              <div className="w-24 h-1 bg-stone-300 rounded-full mx-auto mb-2" />

            </div>
          </div>
          
          {/* Floating realistic widget badge outside phone */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -right-8 top-1/4 bg-white border border-amber-100 rounded-2xl shadow-xl px-4 py-3 text-xs font-extrabold text-amber-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Uploaded to Vault!</span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ─── 9. TRUST & SECURITY SECTION ─── */
export function SecuritySection() {
  return (
    <section className="py-24 bg-white border-t border-stone-200/40 relative">
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <motion.div className="text-center mb-16" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>🛡️ Trust & Security</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
            Your personal memories deserve serious protection.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_ITEMS.map((s, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.08)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="flex gap-4 p-6 rounded-3xl border border-stone-250/80 bg-gradient-to-br from-white to-stone-50/50 hover:shadow-md hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center shrink-0 group hover:scale-105 transition-transform text-amber-700">
                {resolveGlass3DIcon("privacy")}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-850 mb-1">{s.title}</h3>
                <p className="text-xs text-stone-500 font-semibold leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 10. FAQ SECTION ─── */
export function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-24 bg-gradient-to-br from-[#fdfcfa] via-amber-50/20 to-stone-50 border-t border-stone-200/40 relative">
      <div className="max-w-3xl mx-auto px-5 relative z-10">
        <motion.div className="text-center mb-12" variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionBadge>❔ FAQ</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-3">
            Questions before you start?
          </h2>
          <p className="text-stone-500 font-medium">Everything you need to know before creating your memory space.</p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp(i * 0.05)} 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true }}
              className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => setOpen(open === i ? null : i)} 
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-stone-800 hover:bg-stone-50 transition-colors text-sm md:text-base"
              >
                <span>{f.q}</span>
                <ChevronDown size={18} className={`text-stone-400 transition-transform duration-300 shrink-0 ml-4 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-stone-500 leading-relaxed font-semibold border-t border-stone-100 pt-4">
                  {f.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 11. FINAL CTA SECTION ─── */
export function FinalCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-500 via-amber-600 to-rose-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),_transparent_70%)] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-5 text-center text-white relative z-10 space-y-6">
        <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Start building your private memory space today.
          </h2>
          <p className="text-lg text-white/90 font-semibold mt-4 leading-relaxed">
            Save your photos, voice notes, stories, and family moments in one beautiful place — with full control over who can see them.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-amber-700 font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all text-base"
            >
              Create Your Memory Space
            </Link>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border-2 border-white/30 text-white font-extrabold hover:bg-white/20 active:scale-95 transition-all text-base">
              📱 Download App
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
