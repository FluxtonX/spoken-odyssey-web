"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { 
  ArrowLeft, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Play, 
  Plus, 
  Grid, 
  List, 
  Edit3, 
  Share2, 
  Trash2, 
  BookOpen, 
  Check, 
  Loader2,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { getStoredAlbums } from "@/data/userProfile";
import { getAlbumDetailsFromBackend, normalizeMediaUrl } from "@/services/backend";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

import { ALBUM_MEMORIES_MAP } from "@/data/mockApp";

function MemoryCardItem({ memory, onCardClick }) {
  const type = (memory.type || "Voice").toLowerCase();

  const handleCardClick = () => {
    window.dispatchEvent(new CustomEvent("openMemoryView", { detail: memory }));
    onCardClick?.(memory);
  };

  const rawImg = 
    (typeof memory.image === 'string' && memory.image) || 
    (typeof memory.cover === 'string' && memory.cover) || 
    (typeof memory.media === 'string' && memory.media) ||
    (memory.media?.url && typeof memory.media.url === 'string' && memory.media.url) ||
    (Array.isArray(memory.media) && memory.media.length > 0 && (typeof memory.media[0] === 'string' ? memory.media[0] : memory.media[0]?.url)) ||
    (Array.isArray(memory.images) && memory.images.length > 0 && (typeof memory.images[0] === 'string' ? memory.images[0] : memory.images[0]?.url)) ||
    (typeof memory.imageUrl === 'string' && memory.imageUrl) ||
    (typeof memory.coverImageUrl === 'string' && memory.coverImageUrl);

  const coverImg = normalizeMediaUrl(rawImg);

  if (type === "photo" || type === "visual" || coverImg) {
    return (
      <div 
        onClick={handleCardClick}
        className="figma-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col h-full"
      >
        {coverImg && (
          <div className="relative aspect-[4/2.5] bg-stone-200 dark:bg-slate-700 overflow-hidden">
            <img 
              src={coverImg} 
              alt={memory.title || "Memory cover"} 
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        )}
        <div className="p-5 flex flex-col justify-between flex-1 bg-white/90 dark:bg-slate-900/90">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A3AFF] dark:text-indigo-400 flex items-center gap-1">
                <ImageIcon size={12} /> Photo
              </span>
              <span className="text-xs font-semibold text-stone-400">{memory.date}</span>
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-[#4A3AFF] transition-colors">
              {memory.title}
            </h3>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
              {memory.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {(memory.tags || []).map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "written") {
    return (
      <div 
        onClick={handleCardClick}
        className="figma-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col justify-between h-full bg-white/90 dark:bg-slate-900/90"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <FileText size={12} /> Written
            </span>
            <span className="text-xs font-semibold text-stone-400">{memory.date}</span>
          </div>
          <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-[#4A3AFF] transition-colors">
            {memory.title}
          </h3>
          <p className="text-xs font-medium text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed mb-6">
            {memory.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {(memory.tags || []).map(tag => (
            <span key={tag} className="px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Default: Voice memory card
  return (
    <div 
      onClick={handleCardClick}
      className="figma-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col justify-between h-full bg-white/90 dark:bg-slate-900/90"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1">
            <Mic size={12} /> Voice
          </span>
          <span className="text-xs font-semibold text-stone-400">{memory.date}</span>
        </div>
        <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-[#4A3AFF] transition-colors">
          {memory.title}
        </h3>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
          {memory.description}
        </p>

        {/* Audio Waveform Bar */}
        <div className="flex items-center gap-3 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-full p-1.5 pr-4 mb-4 w-full">
          <button className="h-8 w-8 shrink-0 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-xs">
            <Play size={14} fill="currentColor" className="ml-0.5" />
          </button>
          <div className="flex-1 flex items-center overflow-hidden">
            <div className="w-full border-t-2 border-dotted border-[#4A3AFF]/60 opacity-80" />
          </div>
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">{memory.duration || "4:32"}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {(memory.tags || []).map(tag => (
          <span key={tag} className="px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold border border-[#D1D9FF] dark:border-indigo-800/40">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AlbumDetailPage() {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/").filter(Boolean).at(-1);

  const { firebaseUser, isAuthenticated, getToken } = useAuth();
  const [album, setAlbum] = useState(null);
  const [memoriesList, setMemoriesList] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list" | "story"
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function loadAlbumDetails() {
      setIsLoading(true);

      // Check stored albums
      const stored = getStoredAlbums();
      const found = stored.find(a => a.id === id) || {
        id: id || "career-craft",
        title: "Career & Craft",
        subtitle: "The work that mattered. The work that didn't.",
        privacy: "Private",
        cover: "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=1200&q=80",
        created: "March 2026",
        tags: ["career", "work", "craft"]
      };

      if (isAuthenticated && firebaseUser && id && !id.startsWith("album-")) {
        try {
          const token = await getToken();
          const backendData = await getAlbumDetailsFromBackend(token, id).catch(() => null);
          if (backendData) {
            setAlbum({
              id: backendData.id,
              title: backendData.title || found.title,
              subtitle: backendData.subtitle || found.subtitle,
              privacy: backendData.privacy || found.privacy,
              cover: backendData.coverImageUrl || backendData.coverImageKey || found.cover
            });
            if (Array.isArray(backendData.memories) && backendData.memories.length > 0) {
              setMemoriesList(backendData.memories);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn("Could not load backend album details:", err);
        }
      }

      setAlbum(found);

      const baseMemories = ALBUM_MEMORIES_MAP[found.id] || ALBUM_MEMORIES_MAP["career-craft"] || [];

      // Load local memories for album
      try {
        const saved = localStorage.getItem("spokenOdysseyLocalMemories");
        if (saved) {
          const allMem = JSON.parse(saved);
          const filtered = allMem.filter(m => m.albumId === found.id || (m.albums && m.albums.includes(found.id)));
          if (filtered.length > 0) {
            const merged = [...filtered, ...baseMemories.filter(s => !filtered.some(f => f.id === s.id))];
            setMemoriesList(merged);
            setIsLoading(false);
            return;
          }
        }
      } catch {}

      setMemoriesList(baseMemories);
      setIsLoading(false);
    }

    loadAlbumDetails();

    const handleMemoryPublished = (e) => {
      const newMemory = e?.detail?.memory;
      setToastMessage("New memory successfully created!");
      setTimeout(() => setToastMessage(""), 4000);

      if (newMemory) {
        setMemoriesList(prev => [newMemory, ...prev]);
      } else {
        loadAlbumDetails();
      }
    };

    window.addEventListener("memoryPublished", handleMemoryPublished);
    return () => window.removeEventListener("memoryPublished", handleMemoryPublished);
  }, [id, isAuthenticated, firebaseUser]);

  const handleShareAlbum = () => {
    const link = `${window.location.origin}/albums/${id}`;
    navigator.clipboard.writeText(link);
    setToastMessage("Album link copied to clipboard!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddMemory = () => {
    window.dispatchEvent(new Event("openPublishModal"));
  };

  // Calculate memory counts by type
  const photosCount = useMemo(() => memoriesList.filter(m => (m.type || "").toLowerCase() === "photo" || m.image).length, [memoriesList]);
  const voiceCount = useMemo(() => memoriesList.filter(m => (m.type || "").toLowerCase() === "voice" && !m.image).length, [memoriesList]);
  const writtenCount = useMemo(() => memoriesList.filter(m => (m.type || "").toLowerCase() === "written").length, [memoriesList]);
  const totalMemoriesCount = memoriesList.length;

  if (isLoading || !album) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[#4A3AFF] mb-2" size={32} />
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Loading album...</span>
      </div>
    );
  }

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
          
          {/* Back Navigation Link */}
          <motion.div variants={fadeInUp} className="mb-6">
            <Link 
              href="/albums" 
              className="text-stone-500 dark:text-stone-400 hover:text-[#4A3AFF] dark:hover:text-white font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Albums</span>
            </Link>
          </motion.div>

          {/* Top Dark Hero Cover Card (Exact Figma Match) */}
          <motion.div 
            variants={fadeInUp} 
            className="relative w-full rounded-[24px] overflow-hidden min-h-[220px] md:min-h-[260px] bg-stone-900 text-white p-8 md:p-10 flex flex-col justify-end shadow-xl mb-8 group"
          >
            {/* Background Cover Image */}
            <img 
              src={album.cover || "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=1200&q=80"} 
              alt={album.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Top Right Action Control Buttons */}
            <div className="absolute top-5 right-5 flex items-center gap-2.5 z-20">
              <button 
                onClick={() => setToastMessage("Album editing active")}
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer shadow-xs active:scale-95"
                title="Edit Album"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={handleShareAlbum}
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer shadow-xs active:scale-95"
                title="Share Album"
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to delete this album?")) {
                    router.push("/albums");
                  }
                }}
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer shadow-xs active:scale-95"
                title="Delete Album"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Bottom Left Album Title & Details */}
            <div className="relative z-10 max-w-3xl">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-300 mb-1.5 block">
                ALBUM
              </span>
              <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-bold text-white tracking-tight leading-tight mb-2">
                {album.title}
              </h1>
              <p className="text-stone-300 text-sm md:text-[15px] font-medium leading-relaxed">
                {album.subtitle || "The work that mattered. The work that didn't."}
              </p>
            </div>
          </motion.div>

          {/* 4 Stat Box Cards Row (Exact Figma Match) */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {/* Stat 1: Memories */}
            <div className="figma-card p-5 text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-2 shadow-xs">
                <BookOpen size={18} />
              </div>
              <span className="text-2xl font-bold text-stone-900 dark:text-white leading-none mb-1">
                {totalMemoriesCount}
              </span>
              <span className="text-xs font-semibold text-stone-400">Memories</span>
            </div>

            {/* Stat 2: Photos */}
            <div className="figma-card p-5 text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-xs">
                <ImageIcon size={18} />
              </div>
              <span className="text-2xl font-bold text-stone-900 dark:text-white leading-none mb-1">
                {photosCount}
              </span>
              <span className="text-xs font-semibold text-stone-400">Photos</span>
            </div>

            {/* Stat 3: Voice */}
            <div className="figma-card p-5 text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                <Mic size={18} />
              </div>
              <span className="text-2xl font-bold text-stone-900 dark:text-white leading-none mb-1">
                {voiceCount}
              </span>
              <span className="text-xs font-semibold text-stone-400">Voice</span>
            </div>

            {/* Stat 4: Written */}
            <div className="figma-card p-5 text-center flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 shadow-xs">
                <FileText size={18} />
              </div>
              <span className="text-2xl font-bold text-stone-900 dark:text-white leading-none mb-1">
                {writtenCount}
              </span>
              <span className="text-xs font-semibold text-stone-400">Written</span>
            </div>
          </motion.div>

          {/* AI Album Summary Card (Exact Figma Match) */}
          <motion.div 
            variants={fadeInUp} 
            className="bg-[#F4F5FF] dark:bg-slate-800/80 border border-[#E0E4FF] dark:border-slate-700/80 p-5 rounded-2xl mb-8 flex items-start gap-3.5 shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 text-[#4A3AFF] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#4A3AFF] dark:text-indigo-400 mb-1 uppercase tracking-wider">
                AI Album Summary
              </h3>
              <p className="text-xs md:text-[13px] text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                This album captures themes of belonging and memory across career, work, craft. The emotional thread is one of quiet joy and deep connection — the kind only family can provide.
              </p>
            </div>
          </motion.div>

          {/* View Filter Switcher & Add Memory Button Bar (Exact Figma Match) */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Left: View Filter Tabs (Grid / List / Story) */}
            <div className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 p-1.5 rounded-[18px] inline-flex items-center gap-1 shadow-xs">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "grid" 
                    ? "bg-[#4A3AFF] text-white shadow-md" 
                    : "text-stone-600 dark:text-stone-300 hover:bg-[#EEF2FF]"
                }`}
              >
                <Grid size={14} />
                <span>Grid</span>
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "list" 
                    ? "bg-[#4A3AFF] text-white shadow-md" 
                    : "text-stone-600 dark:text-stone-300 hover:bg-[#EEF2FF]"
                }`}
              >
                <List size={14} />
                <span>List</span>
              </button>
              <button 
                onClick={() => setViewMode("story")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "story" 
                    ? "bg-[#4A3AFF] text-white shadow-md" 
                    : "text-stone-600 dark:text-stone-300 hover:bg-[#EEF2FF]"
                }`}
              >
                <BookOpen size={14} />
                <span>Story</span>
              </button>
            </div>

            {/* Right: + Add Memory Button */}
            <button 
              onClick={handleAddMemory}
              className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 max-w-max"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Memory</span>
            </button>
          </motion.div>

          {/* VIEW MODE 1: GRID (Multi-column responsive grid) */}
          {viewMode === "grid" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {memoriesList.map((memory) => (
                  <motion.div key={memory.id} variants={fadeInUp}>
                    <MemoryCardItem memory={memory} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VIEW MODE 2: LIST (Clean vertical table/row view) */}
          {viewMode === "list" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
              {memoriesList.map((memory) => {
                const type = (memory.type || "Voice").toLowerCase();
                const isPhoto = type === "photo" || memory.image;

                return (
                  <motion.div 
                    key={memory.id}
                    variants={fadeInUp}
                    onClick={() => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: memory }))}
                    className="figma-card p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-2xl ${
                        isPhoto ? "bg-emerald-50 text-emerald-600" : type === "written" ? "bg-purple-50 text-purple-600" : "bg-[#EEF2FF] text-[#4A3AFF]"
                      } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                        {isPhoto ? <ImageIcon size={18} /> : type === "written" ? <FileText size={18} /> : <Mic size={18} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-stone-900 dark:text-white truncate group-hover:text-[#4A3AFF] transition-colors">
                            {memory.title}
                          </h3>
                          <span className="text-xs text-stone-400 font-semibold shrink-0">• {memory.date}</span>
                        </div>
                        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {memory.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {(memory.tags || []).slice(0, 2).map(tag => (
                        <span key={tag} className="hidden sm:inline-block px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold">
                          {tag}
                        </span>
                      ))}
                      <ChevronRight size={16} className="text-stone-400 group-hover:text-[#4A3AFF] transition" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* VIEW MODE 3: STORY (Exact Figma Screenshot Match - Timeline Stem with Circular Type Nodes & Full Media Banners) */}
          {viewMode === "story" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="py-4">
              <div className="relative pl-6 sm:pl-10 space-y-10 max-w-4xl">
                
                {/* Continuous Vertical Timeline Connecting Line */}
                <div className="absolute left-[17px] sm:left-[23px] top-6 bottom-6 w-[2px] bg-[#C7D2FE]/70 dark:bg-slate-700/70" />

                {memoriesList.map((memory) => {
                  const type = (memory.type || "Voice").toLowerCase();
                  const isPhoto = type === "photo" || memory.image;

                  return (
                    <motion.div 
                      key={memory.id}
                      variants={fadeInUp}
                      onClick={() => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: memory }))}
                      className="relative flex items-start gap-4 sm:gap-6 group cursor-pointer"
                    >
                      {/* Circular Type Icon Node (Exact Figma Match) */}
                      <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#4A3AFF] text-white flex items-center justify-center shrink-0 z-10 shadow-md ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                        {isPhoto ? <ImageIcon size={18} /> : type === "written" ? <FileText size={18} /> : <Mic size={18} />}
                      </div>

                      {/* Timeline Story Content Block */}
                      <div className="flex-1 pt-0.5">
                        {/* Date Header */}
                        <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 mb-1">
                          {memory.date || "Tuesday, 14 March"}
                        </p>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-[#4A3AFF] transition-colors">
                          {memory.title}
                        </h3>

                        {/* Story Text Snippet */}
                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed max-w-3xl mb-3">
                          {memory.description || "No story text available."}
                        </p>

                        {/* Wide Hero Photo Banner if Photo Memory (Exact Figma Match) */}
                        {isPhoto && (
                          <div className="w-full max-w-3xl h-48 sm:h-56 md:h-64 rounded-[20px] overflow-hidden bg-stone-200 dark:bg-slate-700 shadow-md my-4 border border-[#C7D2FE]/50">
                            <img 
                              src={memory.image || "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"} 
                              alt={memory.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 text-white p-4 text-xs font-bold shadow-xl animate-fade-in">
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </WavesBackground>
  );
}
