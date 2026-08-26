"use client";

import { useState } from "react";
import { Sparkles, Trophy, Plus, CheckCircle2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const INITIAL_MISSIONS = [
  {
    id: "m-1",
    title: "Childhood Holiday Traditions",
    description: "Share a memory or audio story about how your family celebrated holidays when you were growing up.",
    category: "Heritage",
    type: "voice",
    contributorCount: 3,
    totalCircleMembers: 5,
    contributors: [
      { name: "Sarah Murphy", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
      { name: "Ciarán Murphy", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80" },
      { name: "Aoife Murphy", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" }
    ],
    isCompleted: false,
    rewardPoints: 100
  },
  {
    id: "m-2",
    title: "First Car or First Job Memory",
    description: "Upload a photo or write a short note about your very first car or your first earned paycheck.",
    category: "Childhood",
    type: "photo",
    contributorCount: 4,
    totalCircleMembers: 5,
    contributors: [
      { name: "Declan O'Brien", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80" },
      { name: "Sarah Murphy", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
      { name: "Brigid O'Brien", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80" },
      { name: "Aoife Murphy", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" }
    ],
    isCompleted: true,
    rewardPoints: 150
  },
  {
    id: "m-3",
    title: "Best Advice From Grandparents",
    description: "Record a 1-minute voice note sharing the wisest advice your parents or grandparents ever gave you.",
    category: "Wisdom",
    type: "voice",
    contributorCount: 2,
    totalCircleMembers: 5,
    contributors: [
      { name: "Declan O'Brien", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80" },
      { name: "Ciarán Murphy", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80" }
    ],
    isCompleted: false,
    rewardPoints: 120
  }
];

export default function FamilyMissionsWidget({ onContributeMission }) {
  const [missions] = useState(INITIAL_MISSIONS);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const handleContribute = (mission) => {
    // Smooth scroll directly to the Ask Question / Answer prompt form below
    const targetElement = document.getElementById("ask-family-composer");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      targetElement.classList.add("ring-2", "ring-[#4A3AFF]");
      setTimeout(() => {
        targetElement.classList.remove("ring-2", "ring-[#4A3AFF]");
      }, 2000);
    }
    if (onContributeMission) onContributeMission(mission);
  };

  const filteredMissions = activeFilter === "ALL" 
    ? missions 
    : missions.filter(m => m.category.toUpperCase() === activeFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4A3AFF] via-[#6366F1] to-[#818CF8] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Trophy size={14} className="text-amber-300" />
            <span>Family Missions & Challenges</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
            Preserve Memories Together
          </h2>
          <p className="text-sm text-white/90 font-medium leading-relaxed">
            Complete group storytelling challenges with your family circle to build your collaborative legacy archive.
          </p>
        </div>

        <Sparkles size={120} className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {["ALL", "HERITAGE", "CHILDHOOD", "WISDOM"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
                activeFilter === cat
                  ? "bg-[#4A3AFF] text-white shadow-xs"
                  : "bg-white/80 dark:bg-slate-900/80 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-slate-800 hover:bg-stone-100"
              }`}
            >
              {cat === "ALL" ? "All Missions" : cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 shrink-0">
          {filteredMissions.length} Active Challenge{filteredMissions.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMissions.map((mission) => {
          const progressPercent = Math.round((mission.contributorCount / mission.totalCircleMembers) * 100);

          return (
            <motion.div
              key={mission.id}
              whileHover={{ y: -3 }}
              className="figma-card p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[11px] font-extrabold border border-[#C7D2FE]/60">
                    {mission.category}
                  </span>

                  {mission.isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                      +{mission.rewardPoints} Legacy Points
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1 leading-tight">
                  {mission.title}
                </h3>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                  {mission.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-slate-800">
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-stone-500 dark:text-stone-400">Family Participation</span>
                    <span className="text-[#4A3AFF] dark:text-indigo-400">{mission.contributorCount} of {mission.totalCircleMembers} Members ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4A3AFF] to-[#6366F1] rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                </div>

                {/* Contributors Avatars & Answer Prompt Button */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center -space-x-2 shrink-0">
                    {mission.contributors.map((c, i) => (
                      <img
                        key={i}
                        src={c.avatar}
                        alt={c.name}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-2xs"
                        title={c.name}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleContribute(mission)}
                    className="px-4 py-2 bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    <MessageSquare size={14} />
                    <span>Answer Prompt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
