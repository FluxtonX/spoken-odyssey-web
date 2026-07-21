"use client";

import { Plus, Search, ChevronRight, X, Lock, Users, Globe, Upload, Loader2, FolderHeart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredAlbums, saveStoredAlbums, COVER_PRESETS } from "@/data/userProfile";
import { useAuth } from "@/context/AuthProvider";
import { getAlbumsFromBackend, createAlbumOnBackend, getBackendErrorMessage } from "@/services/backend";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const getAlbumTags = (album) => {
  if (album.tags && album.tags.length > 0) return album.tags;
  const words = (album.title + " " + (album.subtitle || "")).toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !["with", "from", "that", "this", "your", "their", "album", "odyssey", "spoken"].includes(w));
  return words.length > 0 ? Array.from(new Set(words)).slice(0, 2) : ["album"];
};

function AlbumCard({ album }) {
  const [imgSrc, setImgSrc] = useState(album.cover);
  const [hasError, setHasError] = useState(false);

  return (
    <Link href={`/albums/${album.id}`} className="group cursor-pointer h-full block">
      <div className="relative w-full overflow-hidden figma-card flex flex-col h-full cursor-pointer">
        
        {/* Image Top Half */}
        <div className="relative w-full aspect-[4/2.4] sm:aspect-[4/2.2] overflow-hidden bg-stone-200 dark:bg-slate-700 shrink-0">
          <img 
            src={hasError ? COVER_PRESETS[0].url : imgSrc} 
            alt="" 
            onError={() => {
              setHasError(true);
              setImgSrc(COVER_PRESETS[0].url);
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          {/* Gradient Overlay for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-95" />
          
          {/* Title */}
          <div className="absolute bottom-3 left-4 right-4 text-white z-10">
            <h3 className="font-bold text-[15px] sm:text-[17px] md:text-[18px] leading-snug filter drop-shadow-md tracking-tight">
              {album.title}
            </h3>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-[#E8E9FF]/90 dark:bg-slate-800/90">
          <p className="text-stone-700 dark:text-stone-300 text-[13px] sm:text-[14px] leading-relaxed font-medium line-clamp-2 pr-1 mb-4">
            {album.subtitle || "No description provided."}
          </p>
          
          {/* Footer row: Tags and Memory Count */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap items-center gap-1.5">
              {getAlbumTags(album).map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#5C5CFC] text-white rounded-[8px] text-[11px] sm:text-[12px] font-semibold lowercase tracking-wide shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">
              {album.memoryCount || 0} memories
            </span>
          </div>
        </div>
        
      </div>
    </Link>
  );
}

export default function AlbumsGallery() {
  const { firebaseUser, isAuthenticated, getToken} = useAuth();
  const [albumsList, setAlbumsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumSubtitle, setNewAlbumSubtitle] = useState("");
  const [newAlbumPrivacy, setNewAlbumPrivacy] = useState("Private");
  const [newAlbumCover, setNewAlbumCover] = useState(COVER_PRESETS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [coverMode, setCoverMode] = useState("preset");
  const [uploadedCoverName, setUploadedCoverName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadAlbums = async () => {
    setIsLoading(true);
    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        const backendAlbums = await getAlbumsFromBackend(token);
        const mapped = backendAlbums.map(album => ({
          id: album.id,
          title: album.title,
          subtitle: album.subtitle,
          privacy: album.privacy || "Private",
          cover: album.coverImageUrl || album.coverImageKey || COVER_PRESETS[0].url,
          created: new Date(album.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          tags: album.tags,
          memoryCount: album.memoryCount
        }));
        
        if (mapped.length > 0) {
          setAlbumsList(mapped);
        } else {
          setAlbumsList(getStoredAlbums());
        }
      } catch (error) {
        console.warn("Failed to load albums from backend, using local fallback:", getBackendErrorMessage(error));
        setAlbumsList(getStoredAlbums());
      }
    } else {
      setAlbumsList(getStoredAlbums());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAlbums();
  }, [isAuthenticated, firebaseUser]);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    setIsSaving(true);

    const coverUrl = coverMode === "custom" && customCoverUrl.trim() ? customCoverUrl.trim() : newAlbumCover;

    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        const formData = new FormData();
        formData.append("title", newAlbumTitle.trim());
        formData.append("subtitle", newAlbumSubtitle.trim());
        formData.append("privacy", newAlbumPrivacy);

        if (coverMode === "upload" && coverFile) {
          formData.append("coverImage", coverFile);
        } else {
          formData.append("coverUrl", coverUrl);
        }

        await createAlbumOnBackend(token, formData);
        setToastMessage("Album successfully created on server!");
        setTimeout(() => setToastMessage(""), 3000);
        
        // Reset Form
        setNewAlbumTitle("");
        setNewAlbumSubtitle("");
        setNewAlbumPrivacy("Private");
        setNewAlbumCover(COVER_PRESETS[0].url);
        setCustomCoverUrl("");
        setCoverMode("preset");
        setUploadedCoverName("");
        setCoverFile(null);
        setIsCreateModalOpen(false);
        
        // Refresh albums
        await loadAlbums();
        setIsSaving(false);
        return;
      } catch (error) {
        console.error("Failed to create album on backend:", error);
        setToastMessage(`Backend error: ${getBackendErrorMessage(error)}. Creating locally instead.`);
        setTimeout(() => setToastMessage(""), 4000);
      }
    }

    // Local Storage Fallback
    const newAlbum = {
      id: `album-${Date.now()}`,
      title: newAlbumTitle.trim(),
      subtitle: newAlbumSubtitle.trim(),
      privacy: newAlbumPrivacy,
      cover: coverUrl,
      created: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    };

    const updatedList = [newAlbum, ...albumsList];
    setAlbumsList(updatedList);
    saveStoredAlbums(updatedList);

    // Reset Form
    setNewAlbumTitle("");
    setNewAlbumSubtitle("");
    setNewAlbumPrivacy("Private");
    setNewAlbumCover(COVER_PRESETS[0].url);
    setCustomCoverUrl("");
    setCoverMode("preset");
    setUploadedCoverName("");
    setCoverFile(null);
    setIsCreateModalOpen(false);
    setIsSaving(false);

    setToastMessage("Album saved locally!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewAlbumCover(reader.result);
        setUploadedCoverName(file.name);
        setCoverMode("upload");
      }
    };
    reader.readAsDataURL(file);
  };

  // Search Filter
  const filteredAlbums = albumsList.filter((album) => 
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (album.subtitle && album.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full relative min-h-screen">
      {/* If WavesBackground causes layout issues, it can be added around this div. Based on screenshot, background is plain with slight purple shapes, which LayoutShell handles. */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto pb-24"
      >
        
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="flex justify-between items-center mb-8 pt-8">
          <div>
            <h1 className="text-[36px] font-bold text-stone-900 tracking-tight mb-1">Albums</h1>
            <p className="text-stone-500 font-medium text-[15px]">
              {albumsList.length} albums · {albumsList.reduce((acc, a) => acc + (a.memoryCount || 0), 0)} memories
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-[12px] font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-[14px]">New Album</span>
          </button>
        </motion.div>

        {/* Filter Tags Row */}
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 w-full mask-edges [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative min-w-[260px] shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search albums..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#C7D2FE] outline-none focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] transition-all text-[14px] font-semibold text-stone-700 placeholder-stone-400 shadow-sm"
            />
          </div>
          
          {["childhood", "ireland", "nostalgia", "london", "career", "growth", "family", "parenthood"].map(tag => (
            <button key={tag} className="px-4 py-1.5 rounded-full border border-[#C7D2FE] text-stone-700 text-[12px] sm:text-[13px] font-bold bg-white hover:bg-[#EEF2FF] transition-colors whitespace-nowrap shadow-sm shrink-0 cursor-pointer">
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Albums Grid */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
          
          {/* Create New Album Card */}
          <motion.div 
            variants={fadeInUp}
            onClick={() => setIsCreateModalOpen(true)}
            className="relative w-full figma-card flex flex-col items-center justify-center cursor-pointer group active:scale-95 text-left h-full min-h-[260px] p-6"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#C7D2FE]/50 text-[#4A3AFF] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#4A3AFF] group-hover:text-white transition-all duration-300 shadow-sm">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-stone-850 dark:text-white">New Album</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">Organize new memories</p>
          </motion.div>

          {isLoading ? (
            <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[var(--brand)] mb-3" />
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Loading your albums...</p>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 border border-dashed border-[#C7D2FE] bg-white/40 rounded-[24px] px-4">
              <FolderHeart size={64} className="text-[#C7D2FE] mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-stone-800 mb-2">No albums yet</h3>
              <p className="text-sm text-stone-500 max-w-sm text-center">Create your first album to start organizing your memories.</p>
            </div>
          ) : (
            filteredAlbums.map((album) => (
              <motion.div variants={fadeInUp} key={album.id} className="h-full">
                <AlbumCard album={album} />
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* Album Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-[#162033] border border-stone-200/80 dark:border-stone-850 rounded-[2.5rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-stone-850 dark:text-white mb-6">Create New Album</h2>

            <form onSubmit={handleCreateAlbum} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 pl-1 mb-2">Album Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Summer Trip 2026"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] outline-none font-semibold text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 pl-1 mb-2">Description / Subtitle</label>
                <textarea 
                  placeholder="e.g., Capturing family stories and beach road trip voice notes."
                  value={newAlbumSubtitle}
                  onChange={(e) => setNewAlbumSubtitle(e.target.value)}
                  rows={2}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] outline-none font-semibold text-sm transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 pl-1 mb-2">Privacy & Visibility</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "Private", label: "Private", desc: "Only Me", icon: Lock },
                    { id: "Family", label: "Family", desc: "Family Circle", icon: Users },
                    { id: "Public", label: "Public", desc: "Everyone", icon: Globe }
                  ].map((option) => {
                    const Icon = option.icon;
                    const isSelected = newAlbumPrivacy === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setNewAlbumPrivacy(option.id)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          isSelected 
                            ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)] font-bold shadow-sm" 
                            : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        <Icon size={16} className="mb-1.5" />
                        <span className="text-xs font-extrabold">{option.label}</span>
                        <span className="text-[9px] opacity-70 mt-0.5">{option.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 pl-1 mb-2">Cover Image</label>
                
                {/* Mode Select */}
                <div className="flex gap-4 mb-3 text-xs font-bold">
                  <button 
                    type="button"
                    onClick={() => setCoverMode("preset")}
                    className={`pb-1 border-b-2 transition-colors cursor-pointer ${coverMode === "preset" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-stone-500"}`}
                  >
                    Presets
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCoverMode("upload")}
                    className={`pb-1 border-b-2 transition-colors cursor-pointer ${coverMode === "upload" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-stone-500"}`}
                  >
                    Upload
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCoverMode("custom")}
                    className={`pb-1 border-b-2 transition-colors cursor-pointer ${coverMode === "custom" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-stone-500"}`}
                  >
                    Custom URL
                  </button>
                </div>

                {/* Presets Grid */}
                {coverMode === "preset" ? (
                  <div className="grid grid-cols-5 gap-2">
                    {COVER_PRESETS.map((preset) => {
                      const isSelected = newAlbumCover === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setNewAlbumCover(preset.url);
                            setUploadedCoverName("");
                          }}
                          className={`aspect-video rounded-xl overflow-hidden relative border-2 transition-all cursor-pointer ${
                            isSelected ? "border-[var(--brand)] scale-[1.03]" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/10" />
                          <span className="absolute bottom-1 left-1 right-1 text-[8px] font-black text-white bg-black/40 rounded px-1 text-center truncate uppercase">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : coverMode === "upload" ? (
                  <div className="space-y-3">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-slate-50 p-5 text-center transition hover:border-[var(--brand)] hover:bg-indigo-50/40 dark:border-stone-700 dark:bg-slate-800">
                      <Upload size={22} className="mb-2 text-[var(--brand)]" />
                      <span className="text-sm font-black text-[var(--ink)] dark:text-white">Upload cover image</span>
                      <span className="mt-1 text-xs font-semibold text-stone-500">Choose from desktop, phone, or tablet</span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="sr-only" />
                    </label>
                    {uploadedCoverName && (
                      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-slate-800">
                        <img src={newAlbumCover} alt="Uploaded cover preview" className="h-32 w-full object-cover" />
                        <p className="truncate px-3 py-2 text-xs font-bold text-stone-500">{uploadedCoverName}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] outline-none font-semibold text-sm transition-all"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-4 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-700 dark:text-stone-300 font-extrabold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black rounded-2xl text-sm shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Album"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400 p-4 text-xs font-bold shadow-lg animate-fade-in">
          <span className="shrink-0 text-base">✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
