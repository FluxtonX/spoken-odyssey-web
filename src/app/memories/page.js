"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Mic, FileText, Image as ImageIcon, Play, Plus, Search, Filter, LayoutGrid, List, Lock, Lightbulb, ArrowLeft } from "lucide-react";
import { memories } from "@/data/mockApp";
import clsx from "clsx";
import { useAuth } from "@/context/AuthProvider";
import { getMemoriesFromBackend } from "@/services/backend";
import { useRouter } from "next/navigation";

export default function MyArchive() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  const types = ["All", "Voice", "Photos", "Written"];
  const years = ["All", "2026", "2025", "2024", "2023", "2022"];
  
  const { isAuthenticated, firebaseUser } = useAuth();
  const [backendMemories, setBackendMemories] = useState([]);

  useEffect(() => {
    const loadMemories = async () => {
      if (isAuthenticated && firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const mems = await getMemoriesFromBackend(token);
          setBackendMemories(mems || []);
        } catch (error) {
          console.error("Failed to load backend memories", error);
        }
      }
    };
    loadMemories();
    window.addEventListener("memoryPublished", loadMemories);
    return () => window.removeEventListener("memoryPublished", loadMemories);
  }, [isAuthenticated, firebaseUser]);

  // Filter and sort the memories locally
  const filteredMemories = useMemo(() => {
    let result = backendMemories.length > 0 ? [...backendMemories] : [...memories];

    // Filter by type
    if (activeType !== "All") {
      const typeMap = {
        Voice: "Voice",
        Photos: "Photo",
        Written: "Text",
      };
      result = result.filter((m) => m.type === typeMap[activeType]);
    }

    // Filter by year
    if (activeYear !== "All") {
      result = result.filter((m) => m.date.includes(activeYear));
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      // In a real app, parse the date properly. For now, simple string compare or assume mock data order.
      // Mock data dates like "April 18, 2026". We can parse it.
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return result;
  }, [searchQuery, activeType, activeYear, sortOrder]);

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
    <div className="w-full pb-24 animate-fade-in">
      <DashboardHeader onSearchChange={setSearchQuery} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-fade-in-up stagger-1">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 font-bold text-[13px] mb-4 transition-colors w-max">
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </button>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">My Archive</h1>
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
      </div>

      {/* Filters & Toggles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 animate-fade-in-up stagger-2 w-full">
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
      </div>

      {/* Grid / List Results */}
      {filteredMemories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white/50 backdrop-blur-md rounded-3xl border border-stone-200 border-dashed animate-fade-in-up stagger-3">
          <div className="w-16 h-16 bg-[#F4F5FF] rounded-full flex items-center justify-center text-[#4A3AFF] mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">No memories found</h3>
          <p className="text-stone-500 text-center max-w-sm mb-6">
            We couldn&apos;t find any memories matching your current filters. Try adjusting your search or add a new memory.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveType("All");
              setActiveYear("All");
            }}
            className="text-[#4A3AFF] font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div 
          className={clsx(
            "space-y-4 animate-fade-in-up stagger-3",
            viewMode === "grid" 
              ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6" 
              : "flex flex-col w-full"
          )}
        >
          {filteredMemories.map((memory) => {
            const dateStr = memory.date || new Date(memory.createdAt).toLocaleDateString() || "Unknown Date";
            const openView = () => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: dateStr } }));
            
            if (viewMode === "list") {
              return (
                <div 
                  key={memory._id || memory.id} 
                  onClick={openView}
                  className="w-full flex items-center p-5 bg-[#EEF2FF]/60 backdrop-blur-md rounded-2xl border border-[#C7D2FE]/80 hover:bg-white transition-all cursor-pointer group shadow-[0_4px_12px_-4px_rgba(74,58,255,0.08)]"
                >
                  <div className="flex items-center gap-5">
                    {/* Icon container */}
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
                    
                    {/* Title and Date */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Optionally show a lock if privacy is Private - we'll simulate randomly for demo if missing, or use memory.privacy */}
                        {memory.privacy === "Private" && <Lock size={14} className="text-stone-400" />}
                        <h3 className="text-[16px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors">{memory.title}</h3>
                      </div>
                      <span className="text-[13px] font-medium text-stone-500">{memory.date}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={memory._id || memory.id} 
                onClick={openView}
                className="figma-card overflow-hidden group break-inside-avoid cursor-pointer"
              >
                {memory.type === "Photo" && (memory.image || memory.cover) && (
                  <div className="bg-stone-200 relative overflow-hidden h-48">
                    <img 
                      src={memory.image || memory.cover} 
                      alt={memory.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}
                
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {getIconForType(memory.type)}
                        <span className={clsx("text-[11px] font-bold tracking-widest uppercase", getTypeColorClass(memory.type))}>
                          {getTypeLabel(memory.type)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
                    </div>
                    <h3 className="text-[22px] font-bold mb-3 text-stone-900 group-hover:text-[#4A3AFF] transition-colors">{memory.title}</h3>
                    <p className="text-stone-500 mb-6 line-clamp-3 text-[15px] leading-relaxed">
                      {memory.description}
                    </p>
                  </div>
                  
                  {memory.type === "Voice" && (
                    <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full p-1.5 pr-6 mb-6 w-full max-w-full">
                      <button className="h-10 w-10 shrink-0 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center hover:bg-[#3b2dd1] transition-colors">
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      </button>
                      <div className="flex-1 flex items-center overflow-hidden">
                        <div className="w-full border-t-4 border-dotted border-[#A5B4FC] opacity-60" />
                      </div>
                      <span className="text-xs font-bold text-stone-500">{memory.duration || "2:45"}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {memory.tags?.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#F4F5FF] text-[#4A3AFF] rounded-full text-[11px] font-bold border border-[#C7D2FE]/50">
                        {tag}
                      </span>
                    ))}
                    {!memory.tags && ['memory', 'archive'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#F4F5FF] text-[#4A3AFF] rounded-full text-[11px] font-bold border border-[#C7D2FE]/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
