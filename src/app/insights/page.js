"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { Sparkles, Mic, Clock, PenLine, Award, Calendar, TrendingUp, RotateCcw, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeInScale } from "@/lib/animations";

const LIFE_THEMES = [
  { name: "Family & Love", value: 34, color: "#4A3AFF" },
  { name: "Home & Belonging", value: 22, color: "#10B981" },
  { name: "Career & Craft", value: 18, color: "#F59E0B" },
  { name: "Loss & Grief", value: 12, color: "#EF4444" },
  { name: "Adventure", value: 9, color: "#06B6D4" },
  { name: "Faith & Purpose", value: 5, color: "#8B5CF6" },
];

const STATS = [
  { label: "Total Memories", value: "247", icon: Mic },
  { label: "Voice Hours", value: "18.4h", icon: Clock },
  { label: "Words Written", value: "142k", icon: PenLine },
  { label: "Milestones", value: "12", icon: Award },
  { label: "Years Covered", value: "24", icon: Calendar },
];

const INSIGHTS = [
  {
    title: "Growth Journey",
    desc: "You've mentioned resilience, courage, and pride 3x more in 2024 than 2020. A clear arc of growth.",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
  },
  {
    title: "Forgotten Memory",
    desc: "A voice recording from September 2019: 'Sunday mornings in Cork.' You haven't listened in 4 years.",
    icon: RotateCcw,
    iconColor: "text-blue-500",
  },
  {
    title: "Milestone Pattern",
    desc: "Your most transformative years: 2008, 2015, 2018, 2020. Major change arrives in waves.",
    icon: Star,
    iconColor: "text-orange-400",
  },
];

const PEOPLE = [
  { name: "Mum", count: "47 memories", bg: "bg-red-500" },
  { name: "Sarah", count: "38 memories", bg: "bg-emerald-500" },
  { name: "Ciarán", count: "24 memories", bg: "bg-cyan-600" },
  { name: "Dad", count: "19 memories", bg: "bg-orange-500" },
  { name: "Aoife", count: "12 memories", bg: "bg-purple-600" },
  { name: "Brigid", count: "8 memories", bg: "bg-blue-600" },
];

export default function InsightsPage() {
  // SVG Donut Math
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  // Perfect Figma 3D Card Style defined in globals.css
  const card3DStyle = "figma-card";

  return (
    <WavesBackground>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full relative pb-24 min-h-screen"
      >
        <DashboardHeader />

        <div className="w-full mt-2 md:mt-6">
          
          {/* Header Section */}
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-[#4A3AFF]" size={28} strokeWidth={2.5} />
                <h1 className="text-[32px] md:text-[36px] font-bold text-stone-900 tracking-tight leading-tight">AI Insights</h1>
              </div>
              <p className="text-stone-600 font-medium text-[16px] pl-10">Patterns, themes, and reflections drawn from 247 memories</p>
            </div>

            {/* Legacy Score Card */}
            <motion.div variants={fadeInScale} className="bg-gradient-to-br from-[#7B61FF] to-[#5A3FF0] rounded-[24px] px-8 py-5 text-white shadow-[0_16px_40px_rgba(90,63,240,0.4)] transform transition-transform hover:scale-105 flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-1">Legacy Score</span>
              <span className="text-[42px] font-black leading-none mb-1">84</span>
              <span className="text-[12px] font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">+3 this week ↑</span>
            </motion.div>
          </motion.div>

          {/* 2024 Life Summary */}
          <motion.div variants={fadeInUp} className="relative overflow-hidden bg-gradient-to-br from-[#8C76FF] via-[#7050FF] to-[#5B3EE8] rounded-[24px] p-8 md:p-10 shadow-[0_16px_50px_rgba(91,62,232,0.3)] mb-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-white/80" />
                <span className="text-[12px] font-bold tracking-widest text-white/80 uppercase">2024 Life Summary · AI Generated</span>
              </div>
              <p className="text-[20px] md:text-[24px] font-medium text-white leading-relaxed italic mb-8 max-w-4xl">
                "This was a year of quiet courage. You recorded 34 new memories — more than any previous year. The thread connecting them is unmistakable: you are building something permanent. Family, belonging, and home appear in 61% of your memories. You are not just archiving your life. You are understanding it."
              </p>
              <div className="flex flex-wrap gap-3">
                {["Family", "Belonging", "Courage", "Home", "Growth"].map(tag => (
                  <span key={tag} className="bg-white/95 text-[#5B3EE8] px-4 py-1.5 rounded-full text-[14px] font-bold shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Charts Row */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Life Themes Donut */}
            <motion.div variants={fadeInUp} className={`${card3DStyle} p-8 flex flex-col`}>
              <h2 className="font-bold text-[18px] text-stone-900 mb-1">Life Themes</h2>
              <p className="text-[14px] font-medium text-stone-500 mb-8">Distribution across your archive</p>
              
              <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Donut SVG */}
                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {LIFE_THEMES.map((theme, i) => {
                      const strokeDasharray = `${(theme.value / 100) * circumference} ${circumference}`;
                      const currentOffset = offset;
                      offset += (theme.value / 100) * circumference;
                      
                      return (
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={theme.color}
                          strokeWidth="24"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={-currentOffset}
                          className="transition-all duration-500 ease-in-out hover:opacity-80"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-[22px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)]">
                    <span className="text-[28px] font-black text-stone-900 leading-none">100</span>
                    <span className="text-[12px] font-bold text-stone-500">memories</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="w-full md:w-auto flex-1 space-y-3">
                  {LIFE_THEMES.map((theme, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: theme.color }}></span>
                        <span className="text-[14px] font-medium text-stone-700">{theme.name}</span>
                      </div>
                      <span className="text-[14px] font-bold text-stone-900">{theme.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Emotional Landscape Line Chart */}
            <motion.div variants={fadeInUp} className={`${card3DStyle} p-8 flex flex-col`}>
              <h2 className="font-bold text-[18px] text-stone-900 mb-1">Emotional Landscape</h2>
              <p className="text-[14px] font-medium text-stone-500 mb-6">Emotional texture of your memories, month by month</p>
              
              <div className="flex-1 w-full relative">
                {/* SVG Line Chart */}
                <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[40, 110, 180].map(y => (
                    <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                  ))}
                  {/* Y Axis Labels */}
                  <text x="30" y="45" fill="#6B7280" fontSize="12" fontWeight="500" textAnchor="end">80</text>
                  <text x="30" y="115" fill="#6B7280" fontSize="12" fontWeight="500" textAnchor="end">45</text>
                  <text x="30" y="185" fill="#6B7280" fontSize="12" fontWeight="500" textAnchor="end">10</text>

                  {/* Lines */}
                  {/* Joy (Green) */}
                  <path d="M 50 70 L 100 80 L 150 40 L 200 50 L 250 30 L 300 20 L 350 50 L 400 65 L 450 75 L 490 60" fill="none" stroke="#10B981" strokeWidth="3" />
                  {/* Reflection (Blue) */}
                  <path d="M 50 50 L 100 60 L 150 110 L 200 45 L 250 90 L 300 120 L 350 65 L 400 50 L 450 40 L 490 40" fill="none" stroke="#4A3AFF" strokeWidth="3" />
                  {/* Gratitude (Orange) */}
                  <path d="M 50 90 L 100 100 L 150 60 L 200 70 L 250 130 L 300 140 L 350 100 L 400 120 L 450 130 L 490 35" fill="none" stroke="#F59E0B" strokeWidth="3" />
                  {/* Melancholy (Red dashed) */}
                  <path d="M 50 160 L 100 140 L 150 170 L 200 165 L 250 175 L 300 180 L 350 150 L 400 135 L 450 130 L 490 180" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6 6" />

                  {/* X Axis Labels */}
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                    <text key={m} x={50 + (i * 40)} y="210" fill="#6B7280" fontSize="11" fontWeight="500" textAnchor="middle">{m}</text>
                  ))}
                </svg>

                {/* Line Chart Legend */}
                <div className="flex items-center gap-6 mt-4 ml-10">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#10B981]"></span>
                    <span className="text-[12px] font-medium text-stone-500">Joy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#4A3AFF]"></span>
                    <span className="text-[12px] font-medium text-stone-500">Reflection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#F59E0B]"></span>
                    <span className="text-[12px] font-medium text-stone-500">Gratitude</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 border-t-2 border-dashed border-[#EF4444]"></span>
                    <span className="text-[12px] font-medium text-stone-500">Melancholy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stat Icons Row */}
          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
            {STATS.map((stat, i) => (
              <motion.div variants={fadeInUp} key={i} className={`${card3DStyle} p-6 flex flex-col items-center justify-center text-center`}>
                <div className="w-14 h-14 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-sm border border-[#C7D2FE]/50">
                  <stat.icon size={24} strokeWidth={2} />
                </div>
                <span className="text-[28px] font-black text-stone-900 leading-none mb-1">{stat.value}</span>
                <span className="text-[12px] font-medium text-stone-500">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Insights Cards */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {INSIGHTS.map((insight, i) => (
              <motion.div variants={fadeInUp} key={i} className={`${card3DStyle} p-6`}>
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mb-4 border border-stone-200 shadow-sm">
                  <insight.icon size={18} strokeWidth={2.5} className={insight.iconColor} />
                </div>
                <h3 className="font-bold text-[16px] text-stone-900 mb-2">{insight.title}</h3>
                <p className="text-[14px] font-medium text-stone-500 leading-relaxed">{insight.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Most Common Themes (Word Cloud) */}
          <motion.div variants={fadeInUp} className={`${card3DStyle} p-8 mb-8`}>
            <h2 className="font-bold text-[18px] text-stone-900 mb-6">Most Common Themes</h2>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
              <span className="text-[32px] font-black text-[#4A3AFF]">Family</span>
              <span className="text-[24px] font-bold text-[#D97706]">Home</span>
              <span className="text-[20px] font-semibold text-[#65A30D]">Cork</span>
              <span className="text-[20px] font-semibold text-[#7C3AED]">Memory</span>
              <span className="text-[28px] font-black text-[#84CC16]">Children</span>
              <span className="text-[16px] font-medium text-[#8B5CF6]">Sunday</span>
              <span className="text-[20px] font-bold text-[#D97706]">Ireland</span>
              <span className="text-[32px] font-black text-[#D97706]">Nana</span>
              <span className="text-[16px] font-medium text-[#7C3AED]">Summer</span>
              <span className="text-[14px] font-medium text-[#059669]">Kitchen</span>
              <span className="text-[22px] font-bold text-[#059669]">Wedding</span>
              <span className="text-[18px] font-semibold text-[#6D28D9]">School</span>
              <span className="text-[14px] font-medium text-[#6D28D9]">Music</span>
              <span className="text-[16px] font-medium text-[#7C3AED]">Sea</span>
              <span className="text-[28px] font-black text-[#6D28D9]">Grandad</span>
            </div>
          </motion.div>

          {/* People in your archive */}
          <motion.div variants={fadeInUp} className={`${card3DStyle} p-8`}>
            <div className="flex items-center gap-2 mb-6">
              <Heart size={18} className="text-[#EF4444]" />
              <h2 className="font-bold text-[18px] text-stone-900">People in your archive</h2>
            </div>
            
            <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8 hide-scrollbar">
              {PEOPLE.map((person, i) => (
                <div key={i} className="flex flex-col items-center shrink-0 min-w-[100px] bg-white p-4 rounded-[20px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-full ${person.bg} text-white flex items-center justify-center text-[20px] font-bold mb-3 shadow-md`}>
                    {person.name.charAt(0)}
                  </div>
                  <span className="font-bold text-[15px] text-stone-900 mb-0.5">{person.name}</span>
                  <span className="text-[12px] font-medium text-stone-500">{person.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </WavesBackground>
  );
}
