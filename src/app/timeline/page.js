"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { getMemoriesFromBackend } from "@/services/backend";
import { useAuth } from "@/context/AuthProvider";
import { Filter, Mic, Image as ImageIcon, FileText, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function TimelinePage() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [activeType, setActiveType] = useState("All"); // All, Voice, Photo, Written, Milestone
  const [groupBy, setGroupBy] = useState("Year"); // Year, Month, Week, Today

  const { firebaseUser, isAuthenticated, getToken} = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated || !firebaseUser) return;
      try {
        setIsLoading(true);
        const token = await getToken();
        const data = await getMemoriesFromBackend(token);
        // Sort memories chronologically (newest first)
        let sorted = [...data].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        
        // Inject Figma static fallback data if no entries found
        if (sorted.length === 0) {
          const figmaFallbackMemories = [
            { id: 1, date: "2023-03-14", type: "milestone", title: "The day I knew I'd found home", description: "Standing on the roof at dusk, watching the city lights." },
            { id: 2, date: "2023-03-14", type: "milestone", title: "The day I knew I'd found home", description: "Standing on the roof at dusk, watching the city lights." },
            { id: 3, date: "2023-03-14", type: "milestone", title: "The day I knew I'd found home", description: "Standing on the roof at dusk, watching the city lights." },
            { id: 4, date: "2021-06-07", type: "photo", title: "Grandma's 80th birthday", description: "42 people in one backyard. Life, continuing.", mediaUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop" },
            { id: 5, date: "2021-06-07", type: "photo", title: "Grandma's 80th birthday", description: "42 people in one backyard. Life, continuing.", mediaUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop" },
            { id: 6, date: "2021-06-07", type: "photo", title: "Grandma's 80th birthday", description: "42 people in one backyard. Life, continuing.", mediaUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop" },
            { id: 7, date: "2020-11-01", type: "star", title: "Lost my mother", description: "Mary Catherine O'Brien. November 1st, 2020. She is not gone — she is everywhere." },
            { id: 8, date: "2020-11-01", type: "star", title: "Lost my mother", description: "Mary Catherine O'Brien. November 1st, 2020. She is not gone — she is everywhere." },
            { id: 9, date: "2020-11-01", type: "star", title: "Lost my mother", description: "Mary Catherine O'Brien. November 1st, 2020. She is not gone — she is everywhere." },
            { id: 10, date: "2019-09-03", type: "milestone", title: "Sunday mornings in Cork", description: "The last time I visited before the diagnosis." },
            { id: 11, date: "2019-09-03", type: "milestone", title: "Sunday mornings in Cork", description: "The last time I visited before the diagnosis." },
            { id: 12, date: "2019-09-03", type: "milestone", title: "Sunday mornings in Cork", description: "The last time I visited before the diagnosis." },
            { id: 13, date: "2016-03-22", type: "star", title: "Cianán was born", description: "3:47am. The world stopped, then restarted, and nothing was the same." },
            { id: 14, date: "2016-03-22", type: "star", title: "Cianán was born", description: "3:47am. The world stopped, then restarted, and nothing was the same." },
            { id: 15, date: "2016-03-22", type: "star", title: "Cianán was born", description: "3:47am. The world stopped, then restarted, and nothing was the same." },
            { id: 16, date: "2015-07-14", type: "photo", title: "Married", description: "St. Patrick's Cathedral. 89 people. Mum danced until midnight.", mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" },
            { id: 17, date: "2015-07-14", type: "photo", title: "Married", description: "St. Patrick's Cathedral. 89 people. Mum danced until midnight.", mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" },
            { id: 18, date: "2015-07-14", type: "photo", title: "Married", description: "St. Patrick's Cathedral. 89 people. Mum danced until midnight.", mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" },
            { id: 19, date: "2012-07-04", type: "star", title: "Met Sarah", description: "A friend's birthday party in Brixton. She was wearing a yellow dress." },
            { id: 20, date: "2012-07-04", type: "star", title: "Met Sarah", description: "A friend's birthday party in Brixton. She was wearing a yellow dress." },
            { id: 21, date: "2012-07-04", type: "star", title: "Met Sarah", description: "A friend's birthday party in Brixton. She was wearing a yellow dress." },
            { id: 22, date: "2010-03-15", type: "star", title: "Started career in design", description: "Junior designer at a small studio in Shoreditch. Made coffee and learned everything." },
            { id: 23, date: "2010-03-15", type: "star", title: "Started career in design", description: "Junior designer at a small studio in Shoreditch. Made coffee and learned everything." },
            { id: 24, date: "2010-03-15", type: "star", title: "Started career in design", description: "Junior designer at a small studio in Shoreditch. Made coffee and learned everything." },
            { id: 25, date: "2008-10-01", type: "star", title: "Moved to London", description: "Two bags, €300, and no plan. The best decision of my life." },
            { id: 26, date: "2008-10-01", type: "star", title: "Moved to London", description: "Two bags, €300, and no plan. The best decision of my life." },
            { id: 27, date: "2008-10-01", type: "star", title: "Moved to London", description: "Two bags, €300, and no plan. The best decision of my life." },
            { id: 28, date: "2005-06-18", type: "star", title: "Leaving Certificate — top of the class", description: "585 points. My mother framed the results slip. It's still on her wall." },
            { id: 29, date: "2005-06-18", type: "star", title: "Leaving Certificate — top of the class", description: "585 points. My mother framed the results slip. It's still on her wall." },
            { id: 30, date: "2005-06-18", type: "star", title: "Leaving Certificate — top of the class", description: "585 points. My mother framed the results slip. It's still on her wall." },
            { id: 31, date: "1993-09-01", type: "star", title: "First day of school", description: "St. Finbarr's National School. I cried, but only a little." },
            { id: 32, date: "1993-09-01", type: "star", title: "First day of school", description: "St. Finbarr's National School. I cried, but only a little." },
            { id: 33, date: "1993-09-01", type: "star", title: "First day of school", description: "St. Finbarr's National School. I cried, but only a little." },
            { id: 34, date: "1987-04-03", type: "star", title: "Born in Cork, Ireland", description: "Mercy University Hospital, Cork City." },
            { id: 35, date: "1987-04-03", type: "star", title: "Born in Cork, Ireland", description: "Mercy University Hospital, Cork City." },
            { id: 36, date: "1987-04-03", type: "star", title: "Born in Cork, Ireland", description: "Mercy University Hospital, Cork City." }
          ];
          sorted = figmaFallbackMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        setMemories(sorted);
      } catch (err) {
        console.error("Failed to load timeline data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [firebaseUser, isAuthenticated]);

  // Filter Memories
  const filteredMemories = useMemo(() => {
    if (activeType === "All") return memories;
    return memories.filter((m) => {
      const type = (m.type || "").toLowerCase();
      if (activeType === "Voice") return type === "voice";
      if (activeType === "Photo") return type === "photo" || type === "image";
      if (activeType === "Written") return type === "text" || type === "written";
      if (activeType === "Milestone") return type === "milestone" || m.isMilestone;
      return true;
    });
  }, [memories, activeType]);

  // Group Memories dynamically using O(n) partitioning
  const groupedMemories = useMemo(() => {
    const groups = {};

    filteredMemories.forEach((memory) => {
      const date = new Date(memory.date || memory.createdAt);
      let groupKey = "";

      if (groupBy === "Year") {
        groupKey = date.getFullYear().toString();
      } else if (groupBy === "Month") {
        groupKey = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      } else if (groupBy === "Week") {
        // Simple week grouping
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((date.getDay() + 1 + days) / 7);
        groupKey = `Week ${weekNumber}, ${date.getFullYear()}`;
      } else if (groupBy === "Today") {
        const today = new Date().toLocaleDateString();
        const memDate = date.toLocaleDateString();
        groupKey = memDate === today ? "Today" : date.toLocaleDateString();
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(memory);
    });

    // Return as array of { key, items } sorted correctly
    return Object.entries(groups).map(([key, items]) => ({ key, items }));
  }, [filteredMemories, groupBy]);

  // Derived stats
  const totalEntries = filteredMemories.length;
  const yearsActive = useMemo(() => {
    if (memories.length === 0) return 0;
    const years = memories.map(m => new Date(m.date || m.createdAt).getFullYear());
    const min = Math.min(...years);
    const max = Math.max(...years);
    return Math.max(1, max - min + 1);
  }, [memories]);

  // UI Helpers
  const getTypeIcon = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "voice") return <Mic size={14} className="text-[#f59e0b]" />;
    if (t === "photo" || t === "image") return <ImageIcon size={14} className="text-[#0ea5e9]" />;
    if (t === "milestone" || t === "star") return <Star size={14} className="text-[#8b5cf6]" />;
    return <FileText size={14} className="text-[#10b981]" />;
  };

  return (
    <WavesBackground>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full relative pb-24 min-h-screen"
      >
        <DashboardHeader />

        <div className="w-full mt-2 md:mt-6 px-4 md:px-8">
          
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-[32px] md:text-[40px] font-black text-stone-900 tracking-tight leading-tight mb-2">My Timeline</h1>
            <p className="text-stone-500 font-medium text-[15px]">
              {totalEntries} entries across {yearsActive} {yearsActive === 1 ? 'year' : 'years'}
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            
            {/* Left: Type Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[#4A3AFF] mr-2">
                <Filter size={18} strokeWidth={2.5} />
                <span className="text-[14px] font-bold">Filter:</span>
              </div>
              
              {["All", "Voice", "Photo", "Written", "Milestone"].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm border ${
                    activeType === type 
                      ? "bg-white border-[#C7D2FE] text-[#4A3AFF]" 
                      : "bg-transparent border-transparent text-stone-500 hover:bg-[#EEF2FF] hover:text-stone-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Right: Group By Filters */}
            <div className="flex items-center gap-2 bg-[#EAEBFF]/50 backdrop-blur-sm p-1.5 rounded-full border border-[#C7D2FE]/50 shadow-sm">
              {["Year", "Month", "Week", "Today"].map(group => (
                <button
                  key={group}
                  onClick={() => setGroupBy(group)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                    groupBy === group
                      ? "bg-white text-[#4A3AFF] shadow-sm border border-[#C7D2FE]"
                      : "text-stone-500 hover:text-stone-800 border border-transparent"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#4A3AFF] mb-4" />
              <p className="text-stone-500 font-bold tracking-wide uppercase text-[12px]">Loading Timeline...</p>
            </div>
          ) : groupedMemories.length === 0 ? (
            <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center py-20 border border-dashed border-[#C7D2FE] bg-white/40 rounded-[24px]">
              <Filter size={48} className="text-[#C7D2FE] mb-4" />
              <h3 className="text-lg font-bold text-stone-800 mb-2">No entries found</h3>
              <p className="text-sm text-stone-500 text-center">Try adjusting your filters to see more memories.</p>
            </motion.div>
          ) : (
            <div className="relative pl-6 md:pl-24 max-w-6xl mx-auto">
              <div className="absolute left-[29px] md:left-[101px] top-4 bottom-0 w-[2px] bg-[#C7D2FE]" />

              {groupedMemories.map(({ key, items }) => {
                const nodeColor = items[0]?.type === "voice" || items[0]?.type === "milestone" ? "#f59e0b" : items[0]?.type === "star" ? "#4A3AFF" : "#4A3AFF";
                return (
                  <div key={key} className="relative mb-20">
                    <div className="absolute w-5 h-5 bg-[#EEF2FF] rounded-full border-[4px] -left-[11px] top-[14px]" style={{ borderColor: nodeColor }} />
                    <motion.h2 variants={fadeInUp} className="text-[28px] font-black text-stone-900 tracking-tight ml-8 mb-6 pt-2">
                      {key}
                    </motion.h2>
                    <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ml-4 md:ml-10">
                      {items.map((memory) => {
                        const dateStr = memory.date || new Date(memory.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                        return (
                          <motion.div variants={fadeInUp} key={memory.id || memory._id} className="figma-card flex flex-col group cursor-pointer h-full overflow-hidden bg-white border border-[#C7D2FE]">
                            {memory.mediaUrl && (
                              <div className="w-full h-32 overflow-hidden shrink-0">
                                <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              </div>
                            )}
                            <div className="p-6 flex flex-col grow">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#F4F5FF] border border-[#D1D9FF] flex items-center justify-center shrink-0">
                                  {getTypeIcon(memory.type)}
                                </div>
                                <span className="text-[12px] font-bold text-stone-500">{dateStr}</span>
                              </div>
                              <h3 className="text-[18px] font-black text-stone-900 leading-tight mb-3 line-clamp-2">{memory.title}</h3>
                              <p className="text-[14px] text-stone-500 font-medium leading-relaxed line-clamp-3">
                                {memory.description || "Captured moment in time. Continuing the journey."}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </WavesBackground>
  );
}
