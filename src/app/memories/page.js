"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Mic, FileText, Image as ImageIcon, Play, Pause, Plus, Search, Filter, LayoutGrid, List, Lock, Lightbulb, ArrowLeft, Film } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthProvider";
import { getMemoriesFromBackend, normalizeMediaUrl } from "@/services/backend";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";

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

  // Card Audio Player State
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioPlayerRef = useRef(null);
  const [cardAudioDurations, setCardAudioDurations] = useState({});
  const [cardAudioCurrentTime, setCardAudioCurrentTime] = useState(0);

  const formatSecs = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatDateSafely = (dateVal) => {
    if (!dateVal) return "Recent";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isVideoLike = (url, mimeType = "", type = "") => {
    const cleanUrl = typeof url === "string" ? url.split("?")[0] : "";
    return (
      String(mimeType || "").toLowerCase().startsWith("video/") ||
      String(type || "").toLowerCase() === "video" ||
      cleanUrl.startsWith("data:video/") ||
      /\.(mp4|webm|mov|avi|m4v)$/i.test(cleanUrl)
    );
  };

  const getMemoryMediaSources = (memory) => {
    const items = [];
    const addItem = (url, type = "image", mimeType = "") => {
      if (!url || typeof url !== "string") return;
      const mediaType = isVideoLike(url, mimeType, type) ? "video" : "image";
      const normUrl = normalizeMediaUrl(url);
      if (normUrl && !items.some(i => i.url === normUrl)) {
        items.push({ url: normUrl, type: mediaType });
      }
    };

    if (Array.isArray(memory.mediaList)) {
      memory.mediaList.forEach((item) => addItem(item?.mediaUrl || item?.url, item?.type, item?.mediaMimeType));
    }
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
    addItem(memory.image, "image");
    addItem(memory.cover, "image");
    addItem(memory.imageUrl, "image");
    addItem(memory.coverImageUrl, "image");

    const firstVideo = items.find((item) => item.type === "video")?.url;
    const firstImage = items.find((item) => item.type === "image")?.url;
    return { items, video: firstVideo, image: firstImage };
  };

  const getMemoryId = (memory) => memory?.id || memory?._id;

  const getMemoryDuplicateKey = (memory) => {
    const title = String(memory?.title || "").trim().toLowerCase();
    if (!title) return "";
    const rawDate = memory?.createdAt || memory?.occurredAt || memory?.date || "";
    const parsedDate = new Date(rawDate);
    const day = Number.isNaN(parsedDate.getTime()) ? String(rawDate).slice(0, 10) : parsedDate.toISOString().slice(0, 10);
    return `${title}_${day}`;
  };

  const mergeUniqueMemories = (primary, secondary = []) => {
    const byId = new Map();
    const duplicateKeys = new Set();

    [...primary, ...secondary].forEach((memory) => {
      if (!memory) return;
      const id = getMemoryId(memory);
      const duplicateKey = getMemoryDuplicateKey(memory);
      if (id && byId.has(id)) return;
      if (duplicateKey && duplicateKeys.has(duplicateKey)) return;
      const key = id || duplicateKey || `memory-${byId.size}`;
      byId.set(key, memory);
      if (duplicateKey) duplicateKeys.add(duplicateKey);
    });

    return Array.from(byId.values());
  };

  const loadMemories = async () => {
    setIsLoadingMemories(true);
    
    let localMems = [];
    try {
      const userKey = firebaseUser?.uid ? `spokenOdysseyLocalMemories_${firebaseUser.uid}` : "spokenOdysseyLocalMemories";
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) localMems = parsed;
      }
    } catch (e) {
      console.warn("Could not read local memories:", e);
    }

    let backendMems = [];
    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        const mems = await getMemoriesFromBackend(token);
        if (Array.isArray(mems)) backendMems = mems;
      } catch (error) {
        console.warn("Could not load backend memories:", error.message);
      }
    }

    // Authenticated users should see backend-owned memories only when backend data exists.
    // Local cache is a fallback for offline/failed backend loads, so stale memories from another session do not leak in.
    setUserMemories(backendMems.length > 0 ? mergeUniqueMemories(backendMems) : mergeUniqueMemories(localMems));
    setIsLoadingMemories(false);
  };

  useEffect(() => {
    loadMemories();

    const handleMemoryPublished = (e) => {
      const newMemory = e?.detail?.memory;
      if (newMemory) {
        setUserMemories((prev) => mergeUniqueMemories([newMemory], prev));
      } else {
        loadMemories();
      }
    };

    const handleMemoryDeleted = (e) => {
      const deletedId = e?.detail?.id;
      if (deletedId) {
        setUserMemories((prev) => prev.filter((m) => (m.id || m._id) !== deletedId));
      } else {
        loadMemories();
      }
    };

    const handleMemoryUpdated = () => {
      loadMemories();
    };

    window.addEventListener("memoryPublished", handleMemoryPublished);
    window.addEventListener("memoryDeleted", handleMemoryDeleted);
    window.addEventListener("memoryUpdated", handleMemoryUpdated);

    return () => {
      window.removeEventListener("memoryPublished", handleMemoryPublished);
      window.removeEventListener("memoryDeleted", handleMemoryDeleted);
      window.removeEventListener("memoryUpdated", handleMemoryUpdated);
    };
  }, [isAuthenticated, firebaseUser, getToken]);

  // Play/pause card audio directly with dynamic time tracking
  const handleToggleCardAudio = (e, memory) => {
    e.stopPropagation();
    const memId = memory._id || memory.id;
    const rawAudio = 
      memory.audioUrl || 
      memory.audio || 
      memory.mediaUrl || 
      memory.url || 
      memory.fileUrl || 
      memory.mediaList?.[0]?.mediaUrl || 
      memory.mediaList?.[0]?.url || 
      memory.path;
    const audioSrc = normalizeMediaUrl(rawAudio);

    if (!audioSrc) return;

    if (playingAudioId === memId) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(audioSrc);
      audioPlayerRef.current = audio;

      audio.onloadedmetadata = () => {
        setCardAudioDurations((prev) => ({ ...prev, [memId]: audio.duration }));
      };
      audio.ontimeupdate = () => {
        setCardAudioCurrentTime(audio.currentTime);
      };
      audio.onended = () => setPlayingAudioId(null);

      audio.play().catch(console.error);
      setPlayingAudioId(memId);
    }
  };

  // Filter and sort memories dynamically
  const filteredMemories = useMemo(() => {
    let result = [...userMemories];

    // Filter by type
    if (activeType !== "All") {
      result = result.filter((m) => {
        const t = (m.type || "").toLowerCase();
        if (activeType === "Voice") {
          const sources = getMemoryMediaSources(m);
          return !sources.video && (t === "voice" || t === "audio" || !!m.audioUrl || !!m.audio);
        }
        if (activeType === "Photos") return t === "photo" || t === "photos" || t === "visual" || t === "image" || !!m.image || !!m.cover || (Array.isArray(m.media) && m.media.length > 0);
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

  const getIconForType = (typeStr) => {
    const type = (typeStr || "").toLowerCase();
    if (type === "voice" || type === "audio") return <Mic size={16} strokeWidth={2.5} className="text-[#f59e0b]" />;
    if (type === "text" || type === "written") return <FileText size={16} strokeWidth={2.5} className="text-[#10b981]" />;
    if (type === "thought") return <Lightbulb size={16} strokeWidth={2.5} className="text-[#8b5cf6]" />;
    if (type === "photo" || type === "visual" || type === "image") return <ImageIcon size={16} strokeWidth={2.5} className="text-[#3b82f6]" />;
    return <FileText size={16} strokeWidth={2.5} className="text-stone-400" />;
  };

  const getTypeLabel = (typeStr) => {
    const type = (typeStr || "").toLowerCase();
    if (type === "voice" || type === "audio") return "VOICE";
    if (type === "text" || type === "written") return "WRITTEN";
    if (type === "thought") return "THOUGHT";
    if (type === "photo" || type === "visual" || type === "image") return "PHOTO";
    return "MEMORY";
  };

  const getTypeColorClass = (typeStr) => {
    const type = (typeStr || "").toLowerCase();
    if (type === "voice" || type === "audio") return "text-[#f59e0b]";
    if (type === "text" || type === "written") return "text-[#10b981]";
    if (type === "thought") return "text-[#8b5cf6]";
    if (type === "photo" || type === "visual" || type === "image") return "text-[#3b82f6]";
    return "text-stone-500";
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
              const normType = (memory.type || "").toLowerCase();
              const isVoice = normType === "voice" || normType === "audio" || !!memory.audioUrl || !!memory.audio;
              
              const mediaSources = isVoice ? { items: [], video: null, image: null } : getMemoryMediaSources(memory);
              const coverImg = normalizeMediaUrl(mediaSources.image);
              const coverVid = normalizeMediaUrl(mediaSources.video);

              const isVideo = !isVoice && (normType === "video" || !!coverVid);
              const isWritten = !isVideo && !isVoice && (normType === "written" || normType === "text" || normType === "thought" || normType === "milestone");

              const hasMedia = !isVoice && (mediaSources.items?.length > 0 || !!coverImg || !!coverVid);
              const dateStr = formatDateSafely(memory.date || memory.createdAt || memory.occurredAt);

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
                        isWritten ? "bg-[#d1fae5]" : 
                        isVoice ? "bg-[#fef3c7]" : 
                        isVideo ? "bg-[#fce7f3]" :
                        "bg-[#e0e7ff]"
                      )}>
                        {isWritten ? <FileText size={22} strokeWidth={2.5} className="text-[#10b981]" /> :
                         isVoice ? <Mic size={22} strokeWidth={2.5} className="text-[#f59e0b]" /> :
                         isVideo ? <Film size={22} strokeWidth={2.5} className="text-[#ec4899]" /> :
                         <ImageIcon size={22} strokeWidth={2.5} className="text-[#3b82f6]" />}
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          {(memory.privacy === "Private" || memory.visibility === "Private") && <Lock size={14} className="text-stone-400" />}
                          <h3 className="text-[16px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors">{memory.title}</h3>
                        </div>
                        <span className="text-[13px] font-medium text-stone-500">{dateStr}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isVideo || hasMedia) {
                return (
                  <motion.div 
                    variants={fadeInUp}
                    key={memory._id || memory.id} 
                    onClick={openView}
                    className="figma-card overflow-hidden group break-inside-avoid cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-6"
                  >
                    {mediaSources.items.length > 0 && (
                      <CardMediaSlider mediaItems={mediaSources.items} title={memory.title} />
                    )}
                    <div className="p-6 md:p-8 flex flex-col justify-between grow">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            {isVideo ? (
                              <>
                                <Film size={16} strokeWidth={2.5} className="text-[#ec4899]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#ec4899]">VIDEO</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon size={16} strokeWidth={2.5} className="text-[#3b82f6]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#3b82f6]">PHOTO MEMORY</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {(memory.privacy === "Private" || memory.visibility === "Private") && <Lock size={12} className="text-stone-500" />}
                            <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
                          </div>
                        </div>
                        <h3 className="text-[22px] font-bold mb-3 text-stone-900 group-hover:text-[#4A3AFF] transition-colors tracking-tight">{memory.title}</h3>
                        {memory.description && <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">{memory.description}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {(memory.tags && memory.tags.length > 0 ? memory.tags : ['memory']).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-stone-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isVoice) {
                return (
                  <motion.div 
                    variants={fadeInUp}
                    key={memory._id || memory.id} 
                    onClick={openView}
                    className="figma-card p-6 md:p-8 flex flex-col justify-between break-inside-avoid cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-6"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-[#f59e0b]">
                          <Mic size={16} strokeWidth={2.5} />
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">VOICE</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {(memory.privacy === "Private" || memory.visibility === "Private") && <Lock size={12} className="text-stone-500" />}
                          <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
                        </div>
                      </div>
                      <h3 className="text-[22px] font-bold mb-3 text-stone-900 group-hover:text-[#4A3AFF] transition-colors tracking-tight">{memory.title}</h3>
                      <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">
                        {memory.description || "No transcript available for this voice memory."}
                      </p>
                    </div>

                    <div className="mb-6 w-full" onClick={(e) => e.stopPropagation()}>
                      <VoicePlayer memory={memory} />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(memory.tags && memory.tags.length > 0 ? memory.tags : ['memory']).map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-stone-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  variants={fadeInUp}
                  key={memory._id || memory.id} 
                  onClick={openView}
                  className="figma-card overflow-hidden group break-inside-avoid cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-6"
                >
                  {hasMedia && (
                    <div className="bg-stone-900 relative overflow-hidden h-56 w-full shrink-0">
                      {coverImg ? (
                        <img 
                          src={coverImg} 
                          alt={memory.title || "Memory cover"} 
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : coverVid ? (
                        <div className="relative w-full h-full">
                          <video src={coverVid} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
                              <Play size={22} fill="currentColor" className="ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                  
                  <div className="p-6 md:p-7 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          {getIconForType(memory.type)}
                          <span className={clsx("text-[12px] font-bold tracking-wide", getTypeColorClass(memory.type))}>
                            {getTypeLabel(memory.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {(memory.privacy === "Private" || memory.visibility === "Private") && <Lock size={12} className="text-stone-500" />}
                          <span className="text-[13px] font-bold text-stone-700">{dateStr}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-stone-900 group-hover:text-[#4A3AFF] transition-colors tracking-tight">{memory.title}</h3>
                      <p className="text-stone-500 mb-6 text-[15px] leading-relaxed line-clamp-3">
                        {memory.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(memory.tags && memory.tags.length > 0 ? memory.tags : ['memory']).map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-stone-500">
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
