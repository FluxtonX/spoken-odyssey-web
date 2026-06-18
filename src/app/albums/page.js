"use client";

import { Plus, Search, ChevronRight, X, Lock, Users, Globe, Upload } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredAlbums, saveStoredAlbums } from "@/data/userProfile";

const COVER_PRESETS = [
  { name: "Ocean", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Mountain", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
  { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" },
  { name: "Library", url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80" },
  { name: "Retro", url: "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=800&q=80" }
];

export default function AlbumsGallery() {
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
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setAlbumsList(getStoredAlbums());
  }, []);

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    const coverUrl = coverMode === "custom" && customCoverUrl.trim() ? customCoverUrl.trim() : newAlbumCover;
    
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
    setIsCreateModalOpen(false);

    // Show Success Toast
    setToastMessage("Album successfully created!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    <div className="w-full animation-fade-in pb-24">
      {/* Header Area */}
      <header className="sticky top-0 z-20 glass px-4 py-4 md:py-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Albums</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Create new album"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
          <input 
            type="text" 
            placeholder="Search albums..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors text-sm font-medium"
          />
        </div>
      </header>

      {/* Grid Layout */}
      <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Create New Album Card */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="relative w-full aspect-square rounded-[2rem] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center hover:bg-[var(--surface-hover)] hover:border-[var(--brand)]/50 transition-all cursor-pointer group active:scale-95 text-left"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <h3 className="font-bold text-base text-[var(--ink)] dark:text-white">New Album</h3>
          <p className="text-xs opacity-60 mt-1">Organize new memories</p>
        </button>

        {filteredAlbums.map((album) => (
          <Link href={`/albums/${album.id}`} key={album.id} className="group cursor-pointer">
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
              
              <img 
                src={album.cover} 
                alt={album.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
              <div className="absolute inset-0 bg-[var(--brand)] mix-blend-multiply opacity-25 group-hover:opacity-10 transition-opacity duration-500" />

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wide uppercase">
                {album.privacy}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold opacity-80 mb-0.5">{album.created}</p>
                <h3 className="font-bold text-base md:text-lg leading-tight filter drop-shadow-md group-hover:text-white transition-colors line-clamp-2">
                  {album.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

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
                  className="flex-1 py-4 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black rounded-2xl text-sm shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                >
                  Create Album
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
