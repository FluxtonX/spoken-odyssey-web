"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { getMemoriesFromBackend, normalizeMediaUrl } from "@/services/backend";
import { useAuth } from "@/context/AuthProvider";
import { Filter, Mic, Image as ImageIcon, FileText, Star, Loader2, Film, Play, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import VoicePlayer from "@/components/ui/VoicePlayer";

const isVideoLike = (url, mimeType = "", type = "") => {
  const cleanUrl = typeof url === "string" ? url.split("?")[0] : "";
  const normType = String(type || "").toLowerCase();
  const normMime = String(mimeType || "").toLowerCase();

  if (normMime.startsWith("audio/") || normType === "voice" || normType === "audio") {
    return false;
  }

  return (
    normMime.startsWith("video/") ||
    normType === "video" ||
    cleanUrl.startsWith("data:video/") ||
    /\.(mp4|mov|avi|m4v)$/i.test(cleanUrl) ||
    (/\.webm$/i.test(cleanUrl) && !normMime.startsWith("audio/"))
  );
};

const getMemoryMediaSources = (memory) => {
  const items = [];
  const addItem = (url, type = "image", mimeType = "") => {
    if (!url || typeof url !== "string") return;
    items.push({ url, type: isVideoLike(url, mimeType, type) ? "video" : "image" });
  };

  if (Array.isArray(memory.mediaList)) memory.mediaList.forEach((item) => addItem(item?.mediaUrl || item?.url, item?.type, item?.mediaMimeType));
  if (Array.isArray(memory.media)) {
    memory.media.forEach((item) => {
      if (typeof item === "string") addItem(item);
      else addItem(item?.url || item?.mediaUrl, item?.type, item?.mediaMimeType || item?.mimeType);
    });
  } else if (memory.media) {
    addItem(typeof memory.media === "string" ? memory.media : (memory.media.url || memory.media.mediaUrl), memory.media.type, memory.media.mediaMimeType);
  }
  if (Array.isArray(memory.images)) memory.images.forEach((img) => addItem(typeof img === "string" ? img : img?.url, "image"));
  if (Array.isArray(memory.videos)) memory.videos.forEach((vid) => addItem(typeof vid === "string" ? vid : vid?.url, "video"));

  addItem(memory.videoUrl, "video");
  addItem(memory.mediaUrl, undefined, memory.mediaMimeType);
  if (isVideoLike(memory.audioUrl)) addItem(memory.audioUrl, "video");
  if (isVideoLike(memory.audio)) addItem(memory.audio, "video");
  addItem(memory.image, "image");
  addItem(memory.cover, "image");
  addItem(memory.imageUrl, "image");
  addItem(memory.coverImageUrl, "image");

  return { video: items.find((item) => item.type === "video")?.url, image: items.find((item) => item.type === "image")?.url };
};

const getMemoryDuplicateKey = (memory) => {
  const title = String(memory?.title || "").trim().toLowerCase();
  if (!title) return memory?.id || memory?._id || "";
  const rawDate = memory?.createdAt || memory?.occurredAt || memory?.date || "";
  const parsedDate = new Date(rawDate);
  const day = Number.isNaN(parsedDate.getTime()) ? String(rawDate).slice(0, 10) : parsedDate.toISOString().slice(0, 10);
  return title + "_" + day;
};

const dedupeMemories = (list = []) => {
  const seen = new Set();
  return list.filter((memory) => {
    const key = getMemoryDuplicateKey(memory);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

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
      
      const userKey = firebaseUser?.uid ? `spokenOdysseyLocalMemories_${firebaseUser.uid}` : "spokenOdysseyLocalMemories";
      let localData = [];
      try {
        const saved = localStorage.getItem(userKey) || localStorage.getItem("spokenOdysseyLocalMemories");
        if (saved) localData = JSON.parse(saved);
      } catch {}

      if (localData.length > 0) {
        setMemories(dedupeMemories(localData).sort((a, b) => new Date(b.date || b.createdAt || b.occurredAt) - new Date(a.date || a.createdAt || a.occurredAt)));
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      try {
        const token = await getToken();
        const data = await getMemoriesFromBackend(token);

        const sourceMemories = Array.isArray(data) && data.length > 0 ? data : localData;
        const sorted = dedupeMemories(sourceMemories).sort((a, b) => new Date(b.date || b.createdAt || b.occurredAt) - new Date(a.date || a.createdAt || a.occurredAt));

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
      const sources = getMemoryMediaSources(m);
      if (activeType === "Voice") return !sources.video && (type === "voice" || type === "audio");
      if (activeType === "Photo") return !sources.video && (type === "photo" || type === "image" || type === "visual");
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

  // Date Formatter Helper for Timeline Cards
  const formatTimelineDate = (rawDate) => {
    if (!rawDate) return "Recent";
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return String(rawDate);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

        <div className="w-full mt-2 md:mt-6 px-3 sm:px-6 md:px-8">
          
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-6 md:mb-8">
            <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-black text-stone-900 tracking-tight leading-tight mb-1 md:mb-2">My Timeline</h1>
            <p className="text-stone-500 font-medium text-[14px] sm:text-[15px]">
              {totalEntries} entries across {yearsActive} {yearsActive === 1 ? 'year' : 'years'}
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12">
            
            {/* Left: Type Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar w-full lg:w-auto">
              <div className="flex items-center gap-1.5 text-[#4A3AFF] mr-1 shrink-0">
                <Filter size={16} strokeWidth={2.5} />
                <span className="text-[13px] font-bold">Filter:</span>
              </div>
              
              {["All", "Voice", "Photo", "Written", "Milestone"].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-bold transition-all shadow-xs border shrink-0 ${
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
            <div className="flex items-center gap-1 sm:gap-2 bg-[#EAEBFF]/50 backdrop-blur-sm p-1 rounded-full border border-[#C7D2FE]/50 shadow-xs self-start lg:self-auto shrink-0">
              {["Year", "Month", "Week", "Today"].map(group => (
                <button
                  key={group}
                  onClick={() => setGroupBy(group)}
                  className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all ${
                    groupBy === group
                      ? "bg-white text-[#4A3AFF] shadow-xs border border-[#C7D2FE]"
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
            <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center py-20 border border-dashed border-[#C7D2FE] bg-white/40 rounded-[24px] p-6 text-center">
              <Filter size={44} className="text-[#C7D2FE] mb-4" />
              <h3 className="text-lg font-bold text-stone-800 mb-1">No entries found</h3>
              <p className="text-sm text-stone-500 max-w-sm">Try adjusting your type or group filters to see more memories.</p>
            </motion.div>
          ) : (
            <div className="relative pl-3 sm:pl-8 md:pl-24 max-w-6xl mx-auto">
              <div className="absolute left-[16px] sm:left-[29px] md:left-[101px] top-4 bottom-0 w-[2px] bg-[#C7D2FE]" />

              {groupedMemories.map(({ key, items }) => {
                const nodeColor = items[0]?.type === "voice" || items[0]?.type === "milestone" ? "#f59e0b" : items[0]?.type === "star" ? "#4A3AFF" : "#4A3AFF";
                return (
                  <div key={key} className="relative mb-12 sm:mb-16 md:mb-20">
                    <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-[#EEF2FF] rounded-full border-[3px] sm:border-[4px] -left-[8px] sm:-left-[11px] top-[10px] sm:top-[14px]" style={{ borderColor: nodeColor }} />
                    <motion.h2 variants={fadeInUp} className="text-[22px] sm:text-[26px] md:text-[28px] font-black text-stone-900 tracking-tight ml-5 sm:ml-8 mb-4 sm:mb-6 pt-1 sm:pt-2">
                      {key}
                    </motion.h2>
                    <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 ml-2 sm:ml-6 md:ml-10">
                      {items.map((memory) => {
                        const dateStr = formatTimelineDate(memory.date || memory.createdAt || memory.occurredAt);
                        const normType = (memory.type || "").toLowerCase();
                        const mediaSources = getMemoryMediaSources(memory);
                        const coverImg = normalizeMediaUrl(mediaSources.image);
                        const coverVid = normalizeMediaUrl(mediaSources.video);

                        const isVideo = normType === "video" || normType === "visual" || !!coverVid;
                        const isVoice = !isVideo && (normType === "voice" || normType === "audio" || (!!memory.audioUrl && !coverVid) || (!!memory.audio && !coverVid));
                        const hasVisualMedia = !isVoice && (!!coverImg || !!coverVid);

                        const openView = () => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: dateStr } }));

                        if (isVoice) {
                          return (
                            <motion.div 
                              variants={fadeInUp} 
                              key={memory.id || memory._id} 
                              onClick={openView}
                              className="figma-card flex flex-col justify-between group cursor-pointer h-full overflow-hidden bg-white border border-[#C7D2FE] p-5 sm:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-[20px] sm:rounded-[24px]"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-1.5 text-[#f59e0b]">
                                    <Mic size={15} strokeWidth={2.5} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">VOICE</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {(memory.privacy === "Private" || memory.visibility === "Private") && <Lock size={12} className="text-stone-500" />}
                                    <span className="text-[12px] font-bold text-stone-500">{dateStr}</span>
                                  </div>
                                </div>
                                <h3 className="text-[16px] sm:text-[18px] font-black text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#4A3AFF] transition-colors">{memory.title}</h3>
                                <p className="text-[13px] sm:text-[14px] text-stone-500 font-medium leading-relaxed line-clamp-2 mb-4">
                                  {memory.description || "No transcript available for this voice memory."}
                                </p>
                              </div>

                              <div className="w-full mt-auto" onClick={(e) => e.stopPropagation()}>
                                <VoicePlayer memory={memory} />
                              </div>
                            </motion.div>
                          );
                        }

                        return (
                          <motion.div 
                            variants={fadeInUp} 
                            key={memory.id || memory._id} 
                            onClick={openView}
                            className="figma-card flex flex-col group cursor-pointer h-full overflow-hidden bg-white border border-[#C7D2FE] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-[20px] sm:rounded-[24px]"
                          >
                            {hasVisualMedia && (
                              <div className="bg-stone-900 relative overflow-hidden h-40 sm:h-44 w-full shrink-0">
                                {coverVid ? (
                                  <div className="relative w-full h-full">
                                    <video src={coverVid} className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
                                        <Play size={20} fill="currentColor" className="ml-0.5" />
                                      </div>
                                    </div>
                                  </div>
                                ) : coverImg ? (
                                  <img 
                                    src={coverImg} 
                                    alt={memory.title || "Memory cover"} 
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                  />
                                ) : null}
                              </div>
                            )}
                            <div className="p-5 sm:p-6 flex flex-col grow justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    {coverVid ? <Film size={15} strokeWidth={2.5} className="text-[#ec4899]" /> : getTypeIcon(memory.type)}
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600">
                                      {coverVid ? "VIDEO" : coverImg ? "PHOTO" : (memory.type || "MEMORY").toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {(memory.privacy === "Private" || memory.visibility === "Private") && <Lock size={12} className="text-stone-500" />}
                                    <span className="text-[12px] font-bold text-stone-500">{dateStr}</span>
                                  </div>
                                </div>
                                <h3 className="text-[16px] sm:text-[18px] font-black text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#4A3AFF] transition-colors">{memory.title}</h3>
                                <p className="text-[13px] sm:text-[14px] text-stone-500 font-medium leading-relaxed line-clamp-3">
                                  {memory.description || "Captured moment in time. Continuing the journey."}
                                </p>
                              </div>
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
