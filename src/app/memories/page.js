"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Mic, FileText, Image as ImageIcon, Play, Plus, Search, Filter, LayoutGrid, List, Lock, Lightbulb, ArrowLeft } from "lucide-react";
import { memories } from "@/data/mockApp";
import clsx from "clsx";
import { useAuth } from "@/context/AuthProvider";
import { getMemoriesFromBackend } from "@/services/backend";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function MyArchive() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  const types = ["All", "Voice", "Photos", "Written"];
  const years = ["All", "2026", "2025", "2024", "2023", "2022"];
  
  const { isAuthenticated, firebaseUser, getToken } = useAuth();
  const [userMemories, setUserMemories] = useState([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(true);

  useEffect(() => {
    const loadMemories = async () => {
      setIsLoadingMemories(true);
      let fetched = null;

      if (isAuthenticated && firebaseUser) {
        try {
          const token = await getToken();
          const mems = await getMemoriesFromBackend(token);
          if (Array.isArray(mems) && mems.length > 0) {
            fetched = mems;
          }
        } catch (error) {
          console.warn("Could not load backend memories, checking local storage:", error.message);
        }
      }

      if (!fetched) {
        try {
          const saved = localStorage.getItem("spokenOdysseyLocalMemories");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              fetched = parsed;
            }
          }
        } catch (e) {
          console.warn("Could not read local memories:", e);
        }
      }

      // If neither database nor local user memories exist, use static memories
      setUserMemories(fetched && fetched.length > 0 ? fetched : memories);
      setIsLoadingMemories(false);
    };

    loadMemories();
    window.addEventListener("memoryPublished", loadMemories);
    return () => window.removeEventListener("memoryPublished", loadMemories);
  }, [isAuthenticated, firebaseUser, getToken]);

  // Filter and sort memories dynamically
  const filteredMemories = useMemo(() => {
    let result = [...userMemories];

    // Filter by type
    if (activeType !== "All") {
      result = result.filter((m) => {
        const t = (m.type || "").toLowerCase();
        if (activeType === "Voice") return t === "voice" || t === "audio" || !!m.audioUrl || !!m.audio;
        if (activeType === "Photos") return t === "photo" || t === "image" || !!m.image || !!m.cover;
        if (activeType === "Written") return t === "text" || t === "written" || t === "milestone" || t === "thought";
        return true;
      });
    }

    // Filter by year
    if (activeYear !== "All") {
      result = result.filter((m) => {
        const dateStr = (m.date || m.occurredAt || m.createdAt || "").toString();
        if (!dateStr) return false;
        return dateStr.includes(activeYear) || new Date(dateStr).getFullYear().toString() === activeYear;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => {
        const titleMatch = (m.title || "").toLowerCase().includes(q);
        const descMatch = (m.description || "").toLowerCase().includes(q);
        const tagMatch = (m.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || tagMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || a.occurredAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || b.occurredAt || 0).getTime();
      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return result;
  }, [userMemories, searchQuery, activeType, activeYear, sortOrder]);

  const openPublishModal = () => {
    window.dispatchEvent(new Event("openPublishModal"));
  };

  const getIconForType = (type) => {
    switch (type) {
      case "Voice":
        return <Mic size={16} strokeWidth={2.5} className="text-[#f59e0b]" />;
      case "Text":
      case "Written":
        return <FileText size={16} strokeWidth={2.5} className="text-[#10b981]" />;
      case "Thought":
        return <Lightbulb size={16} strokeWidth={2.5} className="text-[#8b5cf6]" />;
      case "Photo":
        return <ImageIcon size={16} strokeWidth={2.5} className="text-[#3b82f6]" />;
      default:
        return <FileText size={16} strokeWidth={2.5} className="text-stone-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "Voice": return "VOICE";
      case "Text":
      case "Written": return "WRITTEN";
      case "Thought": return "THOUGHT";
      case "Photo": return "PHOTO";
      default: return "MEMORY";
    }
  };

  const getTypeColorClass = (type) => {
    switch (type) {
      case "Voice": return "text-[#f59e0b]";
      case "Text":
      case "Written": return "text-[#10b981]";
      case "Thought": return "text-[#8b5cf6]";
      case "Photo": return "text-[#3b82f6]";
      default: return "text-stone-500";
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      <DashboardHeader onSearchChange={setSearchQuery} />
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full pb-24"
      >
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 font-bold text-[13px] mb-4 transition-colors w-max">
              <ArrowLeft size={16} strokeWidth={2.5} /> Back
            </button>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">My Odyssey</h1>
            <p className="text-stone-500 font-medium">
              You have <span className="font-bold text-[var(--brand)]">{filteredMemories.length} memories</span> matching your criteria.
            </p>
          </div>
          <button
            onClick={openPublishModal}
            className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add memory</span>
          </button>
        </motion.div>

        {/* Filters & Toggles */}
        <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 w-full">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={clsx(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border",
                  activeType === type
                    ? "bg-white border-[#4A3AFF] text-stone-900 shadow-sm"
                    : "bg-transparent border-[#4A3AFF]/30 text-stone-600 hover:bg-white/40"
                )}
              >
                {type}
              </button>
            ))}
            
            <div className="h-6 w-px bg-[#C7D2FE] mx-2 hidden sm:block"></div>

            {years.map((year) => {
              if (year === "All") return null;
              return (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={clsx(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border",
                    activeYear === year
                      ? "bg-white border-[#4A3AFF] text-stone-900 shadow-sm"
                      : "bg-transparent border-[#4A3AFF]/30 text-stone-600 hover:bg-white/40"
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {/* View & Sort Toggles */}
          <div className="flex items-center gap-3 self-end lg:self-center w-full lg:w-auto justify-end">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-[#C7D2FE] text-stone-600 text-[14px] font-semibold rounded-[14px] px-4 py-2 focus:outline-none focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] transition-all cursor-pointer appearance-none pr-10 relative shadow-sm"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="emotion">By Emotion</option>
              <option value="tag">By tag</option>
            </select>

            <div className="flex bg-[#4A3AFF] rounded-[14px] p-1 shadow-inner">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  viewMode === "grid" ? "bg-white text-[#4A3AFF] shadow-sm" : "text-white/70 hover:text-white"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  viewMode === "list" ? "bg-white text-[#4A3AFF] shadow-sm" : "text-white/70 hover:text-white"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid / List Results */}
        {filteredMemories.length === 0 ? (
          <motion.div variants={fadeInUp} className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-[#C7D2FE]/50 rounded-[24px] bg-white/40">
            <div className="w-16 h-16 bg-[#F4F5FF] rounded-full flex items-center justify-center text-[#4A3AFF] mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">No memories found</h3>
            <p className="text-stone-500 text-center max-w-sm">Try adjusting your filters or search query, or publish a new memory.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveType("All");
                setActiveYear("All");
              }}
              className="mt-6 text-[#4A3AFF] font-bold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            className={clsx(
              viewMode === "grid" 
                ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 w-full block" 
                : "flex flex-col w-full space-y-4"
            )}
          >
            {filteredMemories.map((memory) => {
              const dateStr = memory.date || new Date(memory.createdAt).toLocaleDateString() || "Unknown Date";
              const openView = () => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: dateStr } }));
              
              if (viewMode === "list") {
                return (
                  <motion.div 
                    variants={fadeInUp}
                    key={memory._id || memory.id} 
                    onClick={openView}
                    className="w-full flex items-center p-5 bg-[#EEF2FF]/60 backdrop-blur-md rounded-2xl border border-[#818CF8]/60 hover:bg-white transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className={clsx(
                        "w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 border border-white/50 shadow-sm",
                        (memory.type === "Written" || memory.type === "Text") ? "bg-[#d1fae5]" : 
                        memory.type === "Voice" ? "bg-[#fef3c7]" : 
                        memory.type === "Thought" ? "bg-[#ede9fe]" : 
                        "bg-[#e0e7ff]"
                      )}>
                        {(memory.type === "Written" || memory.type === "Text") ? <FileText size={22} strokeWidth={2.5} className="text-[#10b981]" /> :
                         memory.type === "Voice" ? <Mic size={22} strokeWidth={2.5} className="text-[#f59e0b]" /> :
                         memory.type === "Thought" ? <Lightbulb size={22} strokeWidth={2.5} className="text-[#8b5cf6]" /> :
                         <ImageIcon size={22} strokeWidth={2.5} className="text-[#3b82f6]" />}
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          {memory.privacy === "Private" && <Lock size={14} className="text-stone-400" />}
                          <h3 className="text-[16px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors">{memory.title}</h3>
                        </div>
                        <span className="text-[13px] font-medium text-stone-500">{memory.date}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  variants={fadeInUp}
                  key={memory._id || memory.id} 
                  onClick={openView}
                  className="bg-[#EEF2FF] border-2 border-[#A5B4FC] rounded-3xl overflow-hidden group break-inside-avoid cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-6"
                >
                  {memory.type === "Photo" && (memory.image || memory.cover) && (
                    <div className="bg-stone-200 relative overflow-hidden h-56 w-full shrink-0">
                      <img 
                        src={memory.image || memory.cover} 
                        alt={memory.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-7 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          {memory.type === "Written" || memory.type === "Text" ? <FileText size={16} strokeWidth={3} className="text-[#10b981]" /> :
                           memory.type === "Voice" ? <Mic size={16} strokeWidth={3} className="text-[#f59e0b]" /> :
                           memory.type === "Photo" ? <ImageIcon size={16} strokeWidth={3} className="text-[#3b82f6]" /> :
                           <FileText size={16} strokeWidth={3} className="text-[#10b981]" />}
                          <span className={clsx("text-[12px] font-bold tracking-wide", getTypeColorClass(memory.type))}>
                            {memory.type === "Text" ? "Written" : memory.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {memory.privacy === "Private" && <Lock size={12} className="text-stone-500" />}
                          <span className="text-[13px] font-bold text-stone-700">{dateStr}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-stone-900 group-hover:text-[#4A3AFF] transition-colors tracking-tight">{memory.title}</h3>
                      <p className="text-stone-500 mb-6 text-[15px] leading-relaxed line-clamp-3">
                        {memory.description}
                      </p>
                    </div>
                    
                    {memory.type === "Voice" && (
                      <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full p-2 pr-5 mb-6 w-full shadow-sm">
                        <button className="h-10 w-10 shrink-0 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center hover:bg-[#3b2dd1] transition-colors shadow-sm">
                          <Play size={18} fill="currentColor" className="ml-0.5" />
                        </button>
                        <div className="flex-1 flex items-center overflow-hidden h-8 relative">
                          {/* Synthetic Waveform that resembles Figma */}
                          <div className="w-full flex items-center gap-0.5 opacity-60">
                            {[...Array(20)].map((_, i) => (
                              <div key={i} className="w-1 bg-[#4A3AFF] rounded-full" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
                            ))}
                          </div>
                        </div>
                        <span className="text-[13px] font-bold text-stone-500 ml-2 shrink-0">{memory.duration || "4:32"}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {memory.tags?.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-[#6366f1] text-white rounded-md text-[11px] font-bold shadow-sm">
                          {tag}
                        </span>
                      ))}
                      {(!memory.tags || memory.tags.length === 0) && ['memory', 'archive'].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-[#6366f1] text-white rounded-md text-[11px] font-bold shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
