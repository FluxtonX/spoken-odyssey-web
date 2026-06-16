"use client";

import Link from "next/link";
import { Sparkles, Heart, Mic } from "lucide-react";

export default function AuthLayout({ children }) {
  const features = [
    {
      icon: <Sparkles size={14} className="text-indigo-400" />,
      title: "Generational Vault",
      desc: "Preserve your family voice and stories forever."
    },
    {
      icon: <Heart size={14} className="text-indigo-400" />,
      title: "Social Posting",
      desc: "Private sharing with your closed family circle."
    },
    {
      icon: <Mic size={14} className="text-indigo-400" />,
      title: "Voice Oral History",
      desc: "Record real audio with progress-responsive waveforms."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row w-full text-slate-800 dark:text-slate-100 antialiased overflow-x-hidden">
      
      {/* Left Column - Onboarding & Artwork (Visible only on md+) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white relative flex-col justify-between p-12 overflow-hidden border-r border-indigo-900/40">
        
        {/* Decorative background glow circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/odyssey.png" alt="Spoken Odyssey" className="h-8 w-auto object-contain" />
            <span className="text-lg font-black tracking-tight text-white">
              Spoken <span className="text-indigo-400">Odyssey</span>
            </span>
          </Link>
        </div>

        {/* Central Graphic with Arch Mask & Light Beam Spotlight */}
        <div className="relative flex flex-col items-center justify-center py-6 z-10">
          
          {/* Light Beam (spotlight shining down) */}
          <div 
            className="absolute top-0 w-80 h-[420px] bg-gradient-to-b from-indigo-500/35 via-indigo-500/5 to-transparent pointer-events-none"
            style={{
              clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
            }}
          />

          {/* Mirror / Arch Shaped Image Container */}
          <div className="relative rounded-t-full border-4 border-indigo-400/40 bg-indigo-950/40 p-2 shadow-2xl backdrop-blur-md max-w-[260px] w-full aspect-[2/3] overflow-hidden transition-all duration-700 hover:border-indigo-400/60">
            <div className="w-full h-full rounded-t-full overflow-hidden relative">
              <img 
                src="/authentication.png" 
                alt="Preserve Memories" 
                className="w-full h-full object-cover object-center scale-[1.01] hover:scale-105 transition-transform duration-[4000ms] ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/70 via-transparent to-transparent" />
            </div>
          </div>

          {/* Light shining down text under image */}
          <div className="mt-8 text-center max-w-sm px-4">
            <h2 className="text-2xl font-black tracking-tight text-white mb-2">Capture life as it unfolds.</h2>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              Voice recordings that reflect your truth — not performance.
            </p>
          </div>
        </div>

        {/* Feature List (Professional Details) */}
        <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 mt-4">
          {features.map((feat, index) => (
            <div key={index} className="text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded bg-indigo-500/10 shrink-0">
                  {feat.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">{feat.title}</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 leading-normal">{feat.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Right Column - Children (Login / Sign Up Forms) */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20 relative bg-white dark:bg-[#0f172a]">
        {children}
      </div>

    </div>
  );
}
