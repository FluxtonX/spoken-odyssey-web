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
import FeedCard from "@/components/ui/FeedCard";
import MemoryDetailModal from "@/components/ui/MemoryDetailModal";
import { FolderHeart } from "lucide-react";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

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
  const [selectedMemoryDetail, setSelectedMemoryDetail] = useState(null);

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

  const [showCreateMenu, setShowCreateMenu] = useState(false);

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
    ? "/profile"
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
    <>
      <div className="w-full pb-24 animate-fade-in relative text-left">
      {/* Header Cover Image */}
      <header className="relative h-[340px] md:h-[420px] -mx-4 -mt-6 sm:-mx-6 md:-mx-8 md:-mt-10 mb-6 overflow-hidden">
        <img 
            src={album.coverImageUrl || album.coverImageKey || album.cover} 
            alt={album.title} 
            className="w-full h-full object-cover" 
          />
          {/* Gradient fade to background color */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/20 to-transparent" />
          
          {/* Top Bar Navigation */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4f37ff] text-white shadow-md transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <div className="rounded-lg bg-[#4f37ff] px-3 py-1 text-xs font-black text-white shadow-md">
              {albumMemories.length} entries
            </div>
          </div>
        </header>

        {/* Album Info */}
        <div className="px-5 -mt-6 relative z-20">
          <h1 className="text-2xl md:text-4xl font-black text-stone-900 dark:text-white drop-shadow-sm">
            {album.title}
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-600 dark:text-stone-300">
            {album.subtitle || album.description}
          </p>
        </div>

        {/* Memories Feed */}
        <div className="mt-6 px-4 space-y-4">
          {albumMemories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
              <FolderHeart size={64} className="text-[#4f37ff] mb-4 opacity-50" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-stone-850 dark:text-white mb-2">No entries yet</h3>
              <p className="text-sm text-stone-500 max-w-sm mb-6">Use the + button below to add memories to this album</p>
              
              <button 
                onClick={() => setShowCreateMenu(true)}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4f37ff] text-white shadow-lg hover:bg-[#3b23e0] transition-colors hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            albumMemories.map((memory) => (
              <FeedCard
                key={memory.id}
                memory={memory}
                isProfileView={true}
                onClickDetail={setSelectedMemoryDetail}
              />
            ))
          )}
        </div>
      </div>

      {selectedMemoryDetail && (
        <MemoryDetailModal
          memory={selectedMemoryDetail}
          onClose={() => setSelectedMemoryDetail(null)}
        />
      )}

      {/* Global Wavy Glassmorphic Overlay Menu */}
      {showCreateMenu && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in"
          onClick={() => setShowCreateMenu(false)}
        >
          <div 
            className="relative grid grid-cols-2 gap-5 max-w-sm sm:max-w-md w-full p-6 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button on bottom center */}
            <button
              onClick={() => setShowCreateMenu(false)}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-[#5e4eff] dark:bg-[#6366f1] text-white shadow-xl shadow-[#5e4eff]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <X size={28} strokeWidth={2.5} />
            </button>

            {/* 4 Cards */}
            {[
              { 
                title: "Spoken", 
                subtitle: "Record your voice", 
                icon: "voice", 
                color: "bg-[#5e4eff] dark:bg-[#6366f1]",
                href: `/record?mode=Spoken&albumId=${album.id}` 
              },
              { 
                title: "Visual", 
                subtitle: "Upload photos/videos", 
                icon: "photo", 
                color: "bg-[#5e4eff] dark:bg-[#6366f1]",
                href: `/record?mode=Visual&albumId=${album.id}` 
              },
              { 
                title: "Written", 
                subtitle: "Write your story", 
                icon: "text", 
                color: "bg-[#5e4eff] dark:bg-[#6366f1]",
                href: `/record?mode=Written&albumId=${album.id}` 
              },
              { 
                title: "Milestone", 
                subtitle: "Mark an achievement", 
                icon: "milestone", 
                color: "bg-[#5e4eff] dark:bg-[#6366f1]",
                href: `/record?mode=Milestone&albumId=${album.id}` 
              }
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setShowCreateMenu(false)}
                className="flex flex-col items-center justify-center bg-white dark:bg-stone-900 border border-stone-150/40 dark:border-stone-800/40 rounded-3xl p-6 shadow-xl hover:scale-102 hover:shadow-2xl transition-all duration-300 group cursor-pointer text-center min-h-[170px]"
              >
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-white shadow-md shadow-black/10 transition group-hover:scale-105`}>
                  {resolveGlass3DIcon(item.icon)}
                </div>
                <h3 className="text-base font-black text-stone-850 dark:text-white mb-0.5">{item.title}</h3>
                <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 leading-tight">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
