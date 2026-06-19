"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Lock,
  Mic,
  MoreHorizontal,
  Play,
  Plus,
  Type,
  Users,
  Video,
  Globe,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { getAlbumMemories } from "@/data/mockApp";
import { getStoredAlbums, saveStoredAlbums } from "@/data/userProfile";
import { useAuth } from "@/context/AuthProvider";
import { getAlbumDetailsFromBackend, updateAlbumOnBackend, getBackendErrorMessage } from "@/services/backend";
import {
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
} from "@/data/postBackgrounds";
import { getFontFamily } from "@/data/postFonts";

const COVER_PRESETS = [
  { name: "Ocean", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Mountain", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
  { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" },
  { name: "Library", url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80" },
  { name: "Retro", url: "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=800&q=80" }
];

const typeIcons = {
  Voice: Mic,
  Text: Type,
  Photo: ImagePlus,
  Video,
};

export default function AlbumDetailPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = pathname.split("/").filter(Boolean).at(-1);

  const { firebaseUser, isAuthenticated } = useAuth();
  const [album, setAlbum] = useState(null);
  const [albumMemories, setAlbumMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Album Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editPrivacy, setEditPrivacy] = useState("Private");
  const [editCover, setEditCover] = useState("");
  const [editCustomCoverUrl, setEditCustomCoverUrl] = useState("");
  const [editCoverMode, setEditCoverMode] = useState("preset");
  const [editUploadedCoverName, setEditUploadedCoverName] = useState("");
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const slideshowImages = useMemo(() => {
    const images = [];
    if (album?.cover) {
      images.push(album.cover);
    }
    albumMemories.forEach(m => {
      if (m.type === "Photo") {
        if (m.mediaList && m.mediaList.length > 0) {
          m.mediaList.forEach(item => {
            const url = item.mediaUrl || item.thumbnailUrl;
            if (url && !images.includes(url)) {
              images.push(url);
            }
          });
        } else if (m.image && !images.includes(m.image)) {
          images.push(m.image);
        }
      }
    });
    return images;
  }, [album?.cover, albumMemories]);

  useEffect(() => {
    if (slideshowImages.length < 2) return;
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const loadAlbumData = async () => {
    setIsLoading(true);
    if (isAuthenticated && firebaseUser && id && !id.startsWith("album-")) {
      try {
        const token = await firebaseUser.getIdToken();
        const backendAlbum = await getAlbumDetailsFromBackend(token, id);
        
        const mappedAlbum = {
          id: backendAlbum.id,
          title: backendAlbum.title,
          subtitle: backendAlbum.subtitle,
          privacy: backendAlbum.privacy || "Private",
          cover: backendAlbum.coverImageUrl || backendAlbum.coverImageKey || COVER_PRESETS[0].url,
          created: new Date(backendAlbum.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        };
        setAlbum(mappedAlbum);

        const mappedMemories = (backendAlbum.memories || []).map(m => ({
          id: m.id,
          title: m.title,
          type: m.type,
          description: m.description,
          date: new Date(m.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          privacy: m.privacy || "Private",
          image: m.thumbnailUrl || m.mediaUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
          backgroundId: m.backgroundId || "none",
          fontId: m.fontId || "default",
          mediaList: m.mediaList || [],
          mediaUrl: m.mediaUrl || "",
          mediaMimeType: m.mediaMimeType || "",
          ownerFirebaseUid: m.ownerFirebaseUid || backendAlbum.ownerFirebaseUid || "",
          ownerDisplayName: m.ownerDisplayName || backendAlbum.ownerDisplayName || "",
          ownerEmail: m.ownerEmail || backendAlbum.ownerEmail || "",
          ownerProfession: m.ownerProfession || "",
          ownerAvatarUrl: m.ownerAvatarUrl || "",
          albumTitle: m.albumTitle || backendAlbum.title || "",
          albumId: backendAlbum.id || "",
        }));
        localStorage.setItem(`cached_album_memories_${id}`, JSON.stringify(mappedMemories));
        setAlbumMemories(mappedMemories);
        setIsLoading(false);
        return;
      } catch (error) {
        console.warn("Failed to load album details from backend, falling back to local storage:", getBackendErrorMessage(error));
      }
    }

    // Local Storage Fallback
    const storedAlbums = getStoredAlbums();
    const foundAlbum = storedAlbums.find((a) => a.id === id) || storedAlbums[0];
    setAlbum(foundAlbum);

    const saved = localStorage.getItem("spokenOdysseyLocalMemories");
    if (saved) {
      try {
        const allMemories = JSON.parse(saved);
        const filtered = allMemories.filter((m) => m.albums && m.albums.includes(foundAlbum.id));
        const filteredLegacy = allMemories.filter((m) => m.albumId === foundAlbum.id);
        const merged = [...filtered, ...filteredLegacy.filter(mLegacy => !filtered.some(f => f.id === mLegacy.id))];
        setAlbumMemories(merged);
      } catch {
        setAlbumMemories(getAlbumMemories(foundAlbum.id));
      }
    } else {
      setAlbumMemories(getAlbumMemories(foundAlbum.id));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAlbumData();
  }, [id, isAuthenticated, firebaseUser]);

  const openEditModal = () => {
    if (!album) return;
    setEditTitle(album.title);
    setEditSubtitle(album.subtitle || "");
    setEditPrivacy(album.privacy || "Private");
    setEditCover(album.cover);
    setEditCustomCoverUrl(album.cover.startsWith("http") && !album.cover.includes("unsplash") && !album.cover.includes("amazonaws") ? album.cover : "");
    setEditCoverMode(album.cover.startsWith("http") && !album.cover.includes("unsplash") && !album.cover.includes("amazonaws") ? "custom" : "preset");
    setEditUploadedCoverName("");
    setEditCoverFile(null);
    setIsEditModalOpen(true);
    setShowOptions(false);
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setIsUpdating(true);

    const coverUrl = editCoverMode === "custom" && editCustomCoverUrl.trim() ? editCustomCoverUrl.trim() : editCover;

    if (isAuthenticated && firebaseUser && id && !id.startsWith("album-")) {
      try {
        const token = await firebaseUser.getIdToken();
        const formData = new FormData();
        formData.append("title", editTitle.trim());
        formData.append("subtitle", editSubtitle.trim());
        formData.append("privacy", editPrivacy);

        if (editCoverMode === "upload" && editCoverFile) {
          formData.append("coverImage", editCoverFile);
        } else {
          formData.append("coverUrl", coverUrl);
        }

        const updated = await updateAlbumOnBackend(token, id, formData);
        
        setAlbum({
          id: updated.id,
          title: updated.title,
          subtitle: updated.subtitle,
          privacy: updated.privacy || "Private",
          cover: updated.coverImageUrl || updated.coverImageKey || COVER_PRESETS[0].url,
          created: new Date(updated.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        });

        setIsEditModalOpen(false);
        setIsUpdating(false);
        return;
      } catch (error) {
        console.error("Failed to update album on backend:", error);
        alert(`Failed to save changes to backend: ${getBackendErrorMessage(error)}`);
      }
    }

    // Local Storage Fallback
    const storedAlbums = getStoredAlbums();
    const updatedAlbums = storedAlbums.map((a) => {
      if (a.id === album.id) {
        return {
          ...a,
          title: editTitle.trim(),
          subtitle: editSubtitle.trim(),
          privacy: editPrivacy,
          cover: coverUrl,
        };
      }
      return a;
    });
    saveStoredAlbums(updatedAlbums);

    setAlbum({
      ...album,
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
      privacy: editPrivacy,
      cover: coverUrl,
    });

    setIsEditModalOpen(false);
    setIsUpdating(false);
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEditCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditCover(reader.result);
        setEditUploadedCoverName(file.name);
        setEditCoverMode("upload");
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading || !album) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[var(--brand)] mb-2" size={32} />
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Loading album...</span>
      </div>
    );
  }

  const from = searchParams.get("from");
  const backHref = from === "home"
    ? "/home"
    : from === "profile"
      ? "/profile"
      : from === "search"
        ? "/search"
        : "/albums";

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  return (
    <div className="w-full pb-24 animation-fade-in relative text-left">
      <header className="relative -mx-4 -mt-6 overflow-hidden sm:-mx-6 md:-mx-8 md:-mt-10">
        <div className="h-[340px] md:h-[420px] relative bg-black">
          {slideshowImages.length >= 2 ? (
            slideshowImages.map((imgUrl, idx) => {
              const isActive = idx === slideshowIndex;
              return (
                <img
                  key={imgUrl}
                  src={imgUrl}
                  alt={album.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                    isActive ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-105 translate-x-4 pointer-events-none"
                  }`}
                />
              );
            })
          ) : (
            <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/35 to-black/10" />
        </div>

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 md:left-8 md:right-8 z-30">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/85 text-[var(--ink)] shadow-sm backdrop-blur-md transition active:scale-95 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/85 text-[var(--ink)] shadow-sm backdrop-blur-md transition active:scale-95 cursor-pointer"
              aria-label="Album Options"
            >
              <MoreHorizontal size={18} />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#162033] border border-stone-200 dark:border-stone-850 p-2 shadow-xl z-50">
                <button
                  onClick={openEditModal}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  ✏️ Edit Album
                </button>
                <button
                  onClick={() => setShowOptions(false)}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-stone-400 hover:bg-stone-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-6 md:px-8">
          <div className="max-w-4xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/25 bg-white/85 px-3 py-1 text-xs font-black text-[var(--ink)] backdrop-blur-md">
                {album.privacy}
              </span>
              <span className="rounded-full border border-white/25 bg-white/85 px-3 py-1 text-xs font-black text-[var(--ink)] backdrop-blur-md">
                Cloud synced
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm md:text-6xl">
              {album.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/90 md:text-base">
              {album.subtitle}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatTile label="Memories" value={albumMemories.length} />
        <StatTile label="Created" value={album.created} />
        <StatTile label="Privacy" value={album.privacy} />
      </section>

      <section className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">Gallery Wall</h2>
            <p className="mt-1 text-sm font-bold text-stone-500">
              Chronological memory cards from this album.
            </p>
          </div>
          <Link 
            href={`/record?albumId=${album.id}`}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white shadow-sm transition active:scale-[0.98]"
          >
            <Plus size={17} />
            Add Memory
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albumMemories.length === 0 ? (
            <div className="col-span-full py-12 text-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)]">
              <p className="text-sm font-bold text-stone-500">No memories added to this album yet.</p>
              <Link 
                href={`/record?albumId=${album.id}`}
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--brand)]/10 px-3 text-xs font-black text-[var(--brand)]"
              >
                Create your first memory
              </Link>
            </div>
          ) : (
            albumMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} albumId={album.id} />
            ))
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="text-lg font-black">Album Notes</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-stone-600 dark:text-stone-300">
            This space preserves introduction notes and reflections for this album. Update settings using the edit menu to revise titles, covers, and privacy scopes.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="text-lg font-black">Quick Add</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Voice", Mic],
              ["Text", Type],
              ["Photo", ImagePlus],
              ["Video", Video],
            ].map(([label, Icon]) => (
              <Link
                key={label}
                href={`/record?mode=${label}&albumId=${album.id}`}
                className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-black transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Album Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-[#162033] border border-stone-200/80 dark:border-stone-850 rounded-[2.5rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-stone-850 dark:text-white mb-6">Edit Album Details</h2>

            <form onSubmit={handleUpdateAlbum} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 pl-1 mb-2">Album Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Summer Trip 2026"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] outline-none font-semibold text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 pl-1 mb-2">Description / Subtitle</label>
                <textarea 
                  placeholder="e.g., Capturing family stories and beach road trip voice notes."
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
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
                    const isSelected = editPrivacy === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setEditPrivacy(option.id)}
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
                    onClick={() => setEditCoverMode("preset")}
                    className={`pb-1 border-b-2 transition-colors cursor-pointer ${editCoverMode === "preset" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-stone-500"}`}
                  >
                    Presets
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditCoverMode("upload")}
                    className={`pb-1 border-b-2 transition-colors cursor-pointer ${editCoverMode === "upload" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-stone-500"}`}
                  >
                    Upload
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditCoverMode("custom")}
                    className={`pb-1 border-b-2 transition-colors cursor-pointer ${editCoverMode === "custom" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-stone-500"}`}
                  >
                    Custom URL
                  </button>
                </div>

                {/* Presets Grid */}
                {editCoverMode === "preset" ? (
                  <div className="grid grid-cols-5 gap-2">
                    {COVER_PRESETS.map((preset) => {
                      const isSelected = editCover === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setEditCover(preset.url);
                            setEditUploadedCoverName("");
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
                ) : editCoverMode === "upload" ? (
                  <div className="space-y-3">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-slate-50 p-5 text-center transition hover:border-[var(--brand)] hover:bg-indigo-50/40 dark:border-stone-700 dark:bg-slate-800">
                      <Upload size={22} className="mb-2 text-[var(--brand)]" />
                      <span className="text-sm font-black text-[var(--ink)] dark:text-white">Upload cover image</span>
                      <span className="mt-1 text-xs font-semibold text-stone-500">Choose from device files</span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="sr-only" />
                    </label>
                    {editUploadedCoverName && (
                      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-slate-800">
                        <img src={editCover} alt="Uploaded cover preview" className="h-32 w-full object-cover" />
                        <p className="truncate px-3 py-2 text-xs font-bold text-stone-500">{editUploadedCoverName}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    value={editCustomCoverUrl}
                    onChange={(e) => setEditCustomCoverUrl(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] outline-none font-semibold text-sm transition-all"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-700 dark:text-stone-300 font-extrabold text-sm hover:bg-stone-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-4 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black rounded-2xl text-sm shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <p className="text-xl font-black text-[var(--ink)] dark:text-white">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  );
}

function MemoryCard({ memory, albumId: currentAlbumId }) {
  const Icon = typeIcons[memory.type] ?? Type;
  const albumId = currentAlbumId || memory.albumId;

  const isTextPreset = memory.type === "Text" && memory.backgroundId && memory.backgroundId !== "none";

  const renderCardFace = () => {
    if (memory.type === "Text") {
      if (isTextPreset) {
        return (
          <div
            className="relative aspect-[4/3] w-full overflow-hidden p-5 flex items-center justify-center text-center shadow-inner"
            style={getBackgroundStyles(memory.backgroundId)}
          >
            {getBackgroundOverlay(memory.backgroundId)}
            <p
              className="text-xs sm:text-sm font-black italic z-10 line-clamp-4 leading-relaxed"
              style={{
                ...getBackgroundTextStyles(memory.backgroundId),
                fontFamily: getFontFamily(memory.fontId),
              }}
            >
              "{memory.description}"
            </p>
          </div>
        );
      }
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-b border-[var(--border)]">
          <span className="text-stone-300 dark:text-stone-700 text-3xl font-black select-none">“</span>
          <p className="text-xs sm:text-sm font-extrabold text-stone-700 dark:text-stone-250 italic line-clamp-4 leading-relaxed px-2">
            {memory.description || memory.title}
          </p>
          <span className="text-stone-300 dark:text-stone-700 text-3xl font-black select-none self-end">”</span>
        </div>
      );
    }

    if (memory.type === "Voice") {
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden p-5 flex flex-col justify-between bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white shadow-md">
              <Mic size={16} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 bg-white/5 px-2 py-0.5 rounded-full">
              Voice Note
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 my-2 justify-center px-4">
            {[35, 60, 45, 80, 50, 95, 70, 40, 85, 60, 30, 75, 50, 85, 40].map((h, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-[var(--brand)] opacity-80"
                style={{ 
                  height: `${h * 0.4}px`, 
                  animation: `pulse 1.2s infinite`,
                  animationDelay: `${i * 0.08}s` 
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 mt-1">
            <span>0:00</span>
            <div className="flex-1 mx-3 h-1 bg-stone-700 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[var(--brand)] rounded-full" />
            </div>
            <span>Play Clip</span>
          </div>
        </div>
      );
    }

    if (memory.type === "Video") {
      return (
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-900 flex items-center justify-center">
          <img src={memory.image} alt={memory.title} className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <span className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-lg transition duration-300 group-hover:scale-110">
            <Play fill="currentColor" size={16} className="ml-0.5" />
          </span>
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-[2px]">
            Video
          </div>
        </div>
      );
    }

    // Default Photo / Others
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-150">
        <img src={memory.image} alt={memory.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {memory.mediaList && memory.mediaList.length > 1 && (
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-[2px]">
            +{memory.mediaList.length - 1} Photos
          </div>
        )}
      </div>
    );
  };

  return (
    <Link
      href={`/memories/${memory.id}?from=album&albumId=${albumId}`}
      className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[var(--brand)] animate-fade-in"
    >
      {renderCardFace()}
      <div className="p-4 text-left">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-stone-400">
            <Icon size={11} className="text-[var(--brand)]" />
            {memory.type}
          </span>
        </div>
        <h3 className="line-clamp-1 text-base font-black leading-tight text-[var(--ink)] dark:text-white group-hover:text-[var(--brand)] transition-colors">{memory.title}</h3>
        {!isTextPreset && memory.type !== "Text" && (
          <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-stone-500 mt-1">
            {memory.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-black text-stone-400 border-t border-stone-100 dark:border-stone-800/40 pt-2.5">
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {memory.date}
          </span>
          <span className="flex items-center gap-1">
            {memory.privacy === "Private" ? <Lock size={12} /> : <Users size={12} />}
            {memory.privacy}
          </span>
        </div>
      </div>
    </Link>
  );
}
