"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { Sparkles, Mic, Clock, PenLine, Award, Calendar, TrendingUp, RotateCcw, Star, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeInScale } from "@/lib/animations";
import { useAuth } from "@/context/AuthProvider";
import { getUserInsightsFromBackend, getMemoriesFromBackend } from "@/services/backend";
import { computeUserInsights } from "@/lib/insightsEngine";

export default function InsightsPage() {
  const { firebaseUser, isAuthenticated, getToken } = useAuth();
  const [insightsData, setInsightsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      setIsLoading(true);
      try {
        let fetchedData = null;

        if (isAuthenticated && firebaseUser) {
          try {
            const token = await getToken();
            fetchedData = await getUserInsightsFromBackend(token).catch(() => null);
          } catch (err) {
            console.warn("Backend insights fetch failed, falling back to memories API:", err);
          }
        }

        // If backend insights route didn't return data, fetch memories and compute client-side
        if (!fetchedData) {
          let userMemories = [];
          const token = (await getToken()) || (typeof window !== "undefined" ? localStorage.getItem("spokenOdysseyToken") : null);
          if (token) {
            try {
              const backendMemories = await getMemoriesFromBackend(token);
              if (Array.isArray(backendMemories)) userMemories = backendMemories;
            } catch (_) {}
          }

          if (userMemories.length === 0) {
            try {
              const userKey = firebaseUser?.uid ? `spokenOdysseyLocalMemories_${firebaseUser.uid}` : "spokenOdysseyLocalMemories";
              const saved = localStorage.getItem(userKey) || localStorage.getItem("spokenOdysseyLocalMemories");
              if (saved) userMemories = JSON.parse(saved);
            } catch (_) {}
          }

          fetchedData = computeUserInsights(userMemories);

          // If peopleInArchive is empty, fetch connected family members to display them in Archive
          if (token && (!fetchedData.peopleInArchive || fetchedData.peopleInArchive.length === 0)) {
            try {
              const { getFamilyFromBackend } = await import("@/services/backend");
              const familyList = await getFamilyFromBackend(token);
              const validFamily = Array.isArray(familyList) ? familyList : (familyList?.data && Array.isArray(familyList.data) ? familyList.data : []);
              if (validFamily.length > 0) {
                const bgs = ["bg-purple-600", "bg-indigo-600", "bg-blue-600", "bg-emerald-600", "bg-amber-600"];
                fetchedData.peopleInArchive = validFamily.map((fam, idx) => ({
                  name: fam.displayName || fam.name || fam.email?.split("@")[0] || "Family Connection",
                  avatar: fam.photoURL || fam.avatar || "",
                  count: fam.relationship ? `Family (${fam.relationship})` : "Connected Family",
                  bg: bgs[idx % bgs.length],
                }));
              }
            } catch (_) {}
          }
        }

        setInsightsData(fetchedData);
      } catch (error) {
        console.error("Error loading insights:", error);
        setInsightsData(computeUserInsights([]));
      } finally {
        setIsLoading(false);
      }
    }

    loadInsights();
  }, [isAuthenticated, firebaseUser]);

  // SVG Donut Math
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const card3DStyle = "figma-card";

  if (isLoading || !insightsData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[#4A3AFF] mb-3" size={36} />
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Generating live archive insights...</span>
      </div>
    );
  }

  const {
    stats,
    legacyScore,
    lifeSummary,
    lifeThemes,
    emotionalLandscape,
    wordCloud,
    peopleInArchive,
    insights,
  } = insightsData;

  const statsList = [
    { label: "Total Memories", value: String(stats.totalMemories), icon: Mic },
    { label: "Voice Hours", value: stats.voiceHours, icon: Clock },
    { label: "Words Written", value: stats.wordsWritten, icon: PenLine },
    { label: "Milestones", value: String(stats.milestones), icon: Award },
    { label: "Years Covered", value: String(stats.yearsCovered), icon: Calendar },
  ];

  // Emotional Landscape SVG path generation helper
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxVal = Math.max(
    1,
    ...emotionalLandscape.joy,
    ...emotionalLandscape.reflection,
    ...emotionalLandscape.gratitude,
    ...emotionalLandscape.melancholy
  );

  const getLinePath = (dataArr) => {
    return dataArr
      .map((val, idx) => {
        const x = 50 + idx * 38;
        const y = 180 - (val / maxVal) * 130;
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const joyPath = getLinePath(emotionalLandscape.joy);
  const reflectionPath = getLinePath(emotionalLandscape.reflection);
  const gratitudePath = getLinePath(emotionalLandscape.gratitude);
  const melancholyPath = getLinePath(emotionalLandscape.melancholy);

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
                <h1 className="text-[32px] md:text-[36px] font-bold text-stone-900 tracking-tight leading-tight">Archive Insights</h1>
              </div>
              <p className="text-stone-600 font-medium text-[16px] pl-10">
                Patterns, themes, and reflections drawn from {stats.totalMemories} memories
              </p>
            </div>

            {/* Legacy Score Card */}
            <motion.div variants={fadeInScale} className="bg-gradient-to-br from-[#7B61FF] to-[#5A3FF0] rounded-[24px] px-8 py-5 text-white shadow-[0_16px_40px_rgba(90,63,240,0.4)] transform transition-transform hover:scale-105 flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-1">Legacy Score</span>
              <span className="text-[42px] font-black leading-none mb-1">{legacyScore}</span>
              <span className="text-[12px] font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Archive Health ↑</span>
            </motion.div>
          </motion.div>

          {/* Life Summary Card */}
          <motion.div variants={fadeInUp} className="relative overflow-hidden bg-gradient-to-br from-[#8C76FF] via-[#7050FF] to-[#5B3EE8] rounded-[24px] p-8 md:p-10 shadow-[0_16px_50px_rgba(91,62,232,0.3)] mb-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-white/80" />
                <span className="text-[12px] font-bold tracking-widest text-white/80 uppercase">Personal Archive Reflection</span>
              </div>
              <p className="text-[19px] md:text-[22px] font-medium text-white leading-relaxed italic mb-8 max-w-4xl">
                "{lifeSummary}"
              </p>
              <div className="flex flex-wrap gap-3">
                {lifeThemes.slice(0, 5).map((theme) => (
                  <span key={theme.name} className="bg-white/95 text-[#5B3EE8] px-4 py-1.5 rounded-full text-[14px] font-bold shadow-sm">
                    {theme.name} ({theme.value}%)
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
                    {lifeThemes.map((theme, i) => {
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
                    <span className="text-[28px] font-black text-stone-900 leading-none">{stats.totalMemories}</span>
                    <span className="text-[12px] font-bold text-stone-500">memories</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="w-full md:w-auto flex-1 space-y-3">
                  {lifeThemes.map((theme, i) => (
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
                <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[40, 110, 180].map((y) => (
                    <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                  ))}
                  {/* Y Axis Labels */}
                  <text x="30" y="45" fill="#6B7280" fontSize="12" fontWeight="500" textAnchor="end">{maxVal}</text>
                  <text x="30" y="115" fill="#6B7280" fontSize="12" fontWeight="500" textAnchor="end">{Math.round(maxVal / 2)}</text>
                  <text x="30" y="185" fill="#6B7280" fontSize="12" fontWeight="500" textAnchor="end">0</text>

                  {/* Lines */}
                  <path d={joyPath} fill="none" stroke="#10B981" strokeWidth="3" />
                  <path d={reflectionPath} fill="none" stroke="#4A3AFF" strokeWidth="3" />
                  <path d={gratitudePath} fill="none" stroke="#F59E0B" strokeWidth="3" />
                  <path d={melancholyPath} fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6 6" />

                  {/* X Axis Labels */}
                  {months.map((m, i) => (
                    <text key={m} x={50 + i * 38} y="210" fill="#6B7280" fontSize="11" fontWeight="500" textAnchor="middle">{m}</text>
                  ))}
                </svg>

                {/* Line Chart Legend */}
                <div className="flex items-center gap-6 mt-4 ml-8">
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
            {statsList.map((stat, i) => (
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
            {insights.map((item, i) => {
              const IconComp = item.icon === "RotateCcw" ? RotateCcw : item.icon === "Star" ? Star : TrendingUp;
              return (
                <motion.div variants={fadeInUp} key={i} className={`${card3DStyle} p-6`}>
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mb-4 border border-stone-200 shadow-sm">
                    <IconComp size={18} strokeWidth={2.5} className={item.iconColor} />
                  </div>
                  <h3 className="font-bold text-[16px] text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-[14px] font-medium text-stone-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Most Common Themes (Word Cloud) */}
          <motion.div variants={fadeInUp} className={`${card3DStyle} p-8 mb-8`}>
            <h2 className="font-bold text-[18px] text-stone-900 mb-6">Most Common Themes</h2>
            {wordCloud.length > 0 ? (
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
                {wordCloud.map((item, i) => {
                  const tagColors = [
                    "text-[#4A3AFF]",
                    "text-[#D97706]",
                    "text-[#65A30D]",
                    "text-[#7C3AED]",
                    "text-[#84CC16]",
                    "text-[#8B5CF6]",
                    "text-[#059669]",
                    "text-[#6D28D9]",
                  ];
                  const color = tagColors[i % tagColors.length];
                  return (
                    <span key={item.text} style={{ fontSize: `${item.weight}px` }} className={`font-black ${color}`}>
                      #{item.text}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-stone-400 font-medium">Add tags to your memories to generate your personal theme cloud.</p>
            )}
          </motion.div>

          {/* People in your archive */}
          <motion.div variants={fadeInUp} className={`${card3DStyle} p-8`}>
            <div className="flex items-center gap-2 mb-6">
              <Heart size={18} className="text-[#EF4444]" />
              <h2 className="font-bold text-[18px] text-stone-900">People in your archive</h2>
            </div>

            {peopleInArchive.length > 0 ? (
              <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8 hide-scrollbar">
                {peopleInArchive.map((person, i) => (
                  <div key={i} className="flex flex-col items-center shrink-0 min-w-[100px] bg-white p-4 rounded-[20px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-full ${person.bg} text-white flex items-center justify-center text-[20px] font-bold mb-3 shadow-md overflow-hidden`}>
                      {person.avatar ? (
                        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        person.name.charAt(0)
                      )}
                    </div>
                    <span className="font-bold text-[15px] text-stone-900 mb-0.5">{person.name}</span>
                    <span className="text-[12px] font-medium text-stone-500">{person.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 font-medium">Tag family members in your memories to see their connections here.</p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </WavesBackground>
  );
}
