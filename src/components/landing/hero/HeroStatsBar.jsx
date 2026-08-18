"use client";

import { motion } from "framer-motion";
import { MapPin, Mic2, Sparkles, Users } from "lucide-react";
import { heroStats } from "@/lib/hero/mosaicElements";

const iconMap = {
  sparkles: Sparkles,
  "map-pin": MapPin,
  mic: Mic2,
  users: Users,
};

function StatCard({ value, label, icon }) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-[0_10px_28px_rgba(79,55,255,0.08)] backdrop-blur-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#4f37ff]">
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-black leading-none text-[#211934] sm:text-xl">{value.toLocaleString()}</p>
        <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wide text-[#7d748e]">{label}</p>
      </div>
    </motion.div>
  );
}

export default function HeroStatsBar() {
  return (
    <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-5 lg:grid-cols-4 lg:px-8">
      {heroStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
