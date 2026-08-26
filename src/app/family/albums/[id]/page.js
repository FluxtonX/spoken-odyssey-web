"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  ChevronRight,
  X,
  Users,
  FolderHeart,
  Film
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { getAlbumDetailsFromBackend, normalizeMediaUrl, deleteAlbumOnBackend } from "@/services/backend";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import EditAlbumModal from "@/components/ui/EditAlbumModal";
import ShareModal from "@/components/ui/ShareModal";
import TaggedMembersBadge from "@/components/ui/TaggedMembersBadge";
import LinkMemoryModal from "@/app/family/components/LinkMemoryModal";
import CardMediaSlider from "@/components/ui/CardMediaSlider";
import VoicePlayer from "@/components/ui/VoicePlayer";

function formatDateSafely(dateVal) {
  if (!dateVal) return "Recent";
  const strVal = String(dateVal).trim();
  const d = new Date(strVal);
  if (isNaN(d.getTime())) return strVal;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isVideoLike(url, mimeType = "", type = "") {
  const cleanUrl = typeof url === "string" ? url.split("?")[0] : "";
  return (
    String(mimeType || "").toLowerCase().startsWith("video/") ||
    String(type || "").toLowerCase() === "video" ||
    cleanUrl.startsWith("data:video/") ||
    /\.(mp4|webm|mov|avi|m4v)$/i.test(cleanUrl)
  );
}

function getMemoryMediaSources(memory) {
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

  return items;
}

export default function FamilyAlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const auth = useAuth();
  const { isAuthenticated, firebaseUser, profile: authProfile, getToken } = auth;

  const [album, setAlbum] = useState(null);
  const [memoriesList, setMemoriesList] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadFamilyAlbumDetails() {
      if (!id) return;
      setIsLoading(true);

      try {
        let token = null;
        if (getToken) {
          try { token = await getToken(); } catch (_) {}
        }
        if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
        if (token) setAuthToken(token);

        if (token && !id.startsWith("album-")) {
          const res = await getAlbumDetailsFromBackend(token, id);
          if (res?.data || res) {
            const albumObj = res.data || res;
            setAlbum(albumObj);
            setMemoriesList(albumObj.memories || []);
          }
        }
      } catch (err) {
        console.error("Failed to load family album details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFamilyAlbumDetails();

    const handleMemoryPublished = () => {
      loadFamilyAlbumDetails();
    };

    window.addEventListener("memoryPublished", handleMemoryPublished);
    return () => window.removeEventListener("memoryPublished", handleMemoryPublished);
  }, [id, getToken]);

  const handleOpenCreateModal = () => {
    window.dispatchEvent(new CustomEvent("openPublishModal", { 
      detail: { albumId: id, visibility: "Family" } 
    }));
  };

  const handleShareAlbum = () => {
    setIsShareModalOpen(true);
  };

  const handleEditAlbum = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteAlbum = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAlbum = async () => {
    if (!album?.id) return;
    
    setIsDeleting(true);
    try {
      const token = authToken || (getToken ? await getToken() : null) || localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      await deleteAlbumOnBackend(token, album.id);
      setToastMessage("Album deleted successfully!");
      setTimeout(() => {
        router.push("/family?tab=Family+Albums");
      }, 1500);
    } catch (err) {
      console.error("Failed to delete album:", err);
      setToastMessage("Failed to delete album.");
      setTimeout(() => setToastMessage(""), 3000);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <WavesBackground>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
          <DashboardHeader />
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#4A3AFF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">Loading Family Album memories...</p>
          </div>
        </div>
      </WavesBackground>
    );
  }

  return (
    <WavesBackground>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700/50 flex items-center gap-3 animate-bounce">
          <FolderHeart className="text-[#4A3AFF]" size={18} />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 z-10">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full relative pb-16">
          <DashboardHeader />

          <div className="w-full mt-2">
            {/* Back Navigation Link */}
            <motion.div variants={fadeInUp} className="mb-3">
              <Link 
                href="/family?tab=Family+Albums" 
                className="text-stone-500 dark:text-stone-400 hover:text-[#4A3AFF] dark:hover:text-white font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to Family Space</span>
              </Link>
            </motion.div>

            {/* Top Family Space Hero Card */}
            <motion.div 
              variants={fadeInUp} 
              className="relative w-full rounded-[28px] overflow-hidden mb-8 border border-[#C7D2FE]/70 dark:border-slate-800 shadow-xl bg-stone-900 min-h-[220px] flex flex-col justify-end p-6 md:p-8"
            >
              <img 
                src={album?.coverImageUrl || "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=1200&q=80"} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 w-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#4A3AFF] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      Family Space Album
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {memoriesList.length} {memoriesList.length === 1 ? 'Memory' : 'Memories'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleShareAlbum}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer"
                      title="Share Album"
                    >
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={handleEditAlbum}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer"
                      title="Edit Album"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={handleDeleteAlbum}
                      className="w-9 h-9 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                      title="Delete Album"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">
                  {album?.title || "Family Album"}
                </h1>
                <p className="text-stone-300 text-xs sm:text-sm font-medium line-clamp-2 max-w-2xl mb-4">
                  {album?.subtitle || "A collaborative memory collection shared across your connected family space."}
                </p>

                {/* Contributor Facepile Bar */}
                {album?.contributors && album.contributors.length > 0 && (
                  <div className="flex items-center gap-3 pt-3 border-t border-white/20">
                    <div className="flex -space-x-2 overflow-hidden">
                      {album.contributors.slice(0, 4).map((c, i) => (
                        c.avatar ? (
                          <img key={i} src={c.avatar} alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                        ) : (
                          <div key={i} className="h-7 w-7 rounded-full bg-[#4A3AFF] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                            {c.name ? c.name[0].toUpperCase() : "M"}
                          </div>
                        )
                      ))}
                    </div>
                    <span className="text-xs font-bold text-stone-200">
                      Contributed by {album.contributors.map(c => c.name || "Family Member").join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* View Switcher & Action Control Bar */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="bg-white/80 dark:bg-slate-900/80 border border-[#C7D2FE]/70 dark:border-slate-800 p-1.5 rounded-[18px] inline-flex items-center gap-1 shadow-xs">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "grid" ? "bg-[#4A3AFF] text-white shadow-md" : "text-stone-600 dark:text-stone-300 hover:bg-[#EEF2FF]"
                  }`}
                >
                  <Grid size={14} />
                  <span>Grid</span>
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "list" ? "bg-[#4A3AFF] text-white shadow-md" : "text-stone-600 dark:text-stone-300 hover:bg-[#EEF2FF]"
                  }`}
                >
                  <List size={14} />
                  <span>List</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsContributeModalOpen(true)}
                  className="bg-white hover:bg-stone-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#4A3AFF] dark:text-indigo-300 border border-[#4A3AFF]/30 dark:border-indigo-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FolderHeart size={16} strokeWidth={2.5} />
                  <span>Contribute Memory</span>
                </button>

                <button 
                  onClick={handleOpenCreateModal}
                  className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Create New Memory</span>
                </button>
              </div>
            </motion.div>

            {/* Empty Family Album View */}
            {memoriesList.length === 0 && (
              <motion.div variants={fadeInUp} className="figma-card p-12 flex flex-col items-center justify-center text-center my-6">
                <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 shadow-sm">
                  <FolderHeart size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No Family Memories In This Album Yet</h2>
                <p className="text-stone-500 dark:text-stone-400 max-w-md text-sm leading-relaxed mb-6">
                  This Family Space Album is currently empty. Connected family members can contribute voice stories, photo memories, and written notes to build this shared collection.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button 
                    onClick={handleOpenCreateModal}
                    className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Create New Memory</span>
                  </button>
                  <button 
                    onClick={() => setIsContributeModalOpen(true)}
                    className="bg-white border border-[#4A3AFF]/40 text-[#4A3AFF] hover:bg-stone-50 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <FolderHeart size={16} strokeWidth={2.5} />
                    <span>Contribute Existing Memory</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* GRID VIEW MODE — ODYSSEY PAGE PARITY CARD DESIGN */}
            {memoriesList.length > 0 && viewMode === "grid" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memoriesList.map((memory) => {
                    const normType = (memory.type || "").toLowerCase();
                    const isVoice = normType === "voice" || normType === "audio" || !!memory.audioUrl || !!memory.audio;
                    
                    const mediaItems = isVoice ? [] : getMemoryMediaSources(memory);
                    const isVideo = !isVoice && (normType === "video" || mediaItems.some(m => m.type === "video"));
                    const hasMedia = !isVoice && mediaItems.length > 0;
                    
                    const dateStr = formatDateSafely(memory.date || memory.createdAt || memory.occurredAt);

                    const ownerName = 
                      (memory.owner && (memory.owner.displayName || memory.owner.name)) || 
                      (memory.ownerDisplayName && memory.ownerDisplayName !== "Family Member" ? memory.ownerDisplayName : null) || 
                      memory.user?.displayName || 
                      memory.user?.name || 
                      (memory.ownerEmail ? memory.ownerEmail.split("@")[0] : null) || 
                      (authProfile ? (authProfile.displayName || authProfile.name) : "Family Member");

                    const ownerAvatar = 
                      (memory.owner && (memory.owner.photoURL || memory.owner.avatarUrl || memory.owner.avatar)) || 
                      (memory.ownerAvatarUrl && memory.ownerAvatarUrl.startsWith("http") ? memory.ownerAvatarUrl : null) || 
                      (authProfile?.photoURL ? authProfile.photoURL : null) || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=4A3AFF&color=fff`;

                    const openView = () => {
                      window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: dateStr, ownerDisplayName: ownerName, ownerAvatarUrl: ownerAvatar } }));
                    };

                    if (isVideo || hasMedia) {
                      return (
                        <motion.div 
                          variants={fadeInUp}
                          key={memory._id || memory.id} 
                          onClick={openView}
                          className="figma-card overflow-hidden group cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-2"
                        >
                          {mediaItems.length > 0 && (
                            <CardMediaSlider mediaItems={mediaItems} title={memory.title} />
                          )}
                          <div className="p-6 md:p-8 flex flex-col justify-between grow">
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={ownerAvatar} 
                                    alt={ownerName} 
                                    className="w-8 h-8 rounded-full object-cover border border-[#C7D2FE]"
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-bold text-[13px] text-stone-900 dark:text-white leading-tight">
                                      {ownerName}
                                    </span>
                                    <span className="text-[11px] text-stone-500 font-medium">{dateStr}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {isVideo ? (
                                    <>
                                      <Film size={16} strokeWidth={2.5} className="text-[#ec4899]" />
                                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#ec4899]">VIDEO</span>
                                    </>
                                  ) : (
                                    <>
                                      <ImageIcon size={16} strokeWidth={2.5} className="text-[#3b82f6]" />
                                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#3b82f6]">PHOTO</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <h3 className="text-[22px] font-bold text-stone-900 dark:text-white group-hover:text-[#4A3AFF] transition-colors tracking-tight leading-snug">{memory.title}</h3>
                                <TaggedMembersBadge memory={memory} />
                              </div>
                              {memory.description && <p className="text-stone-500 dark:text-stone-400 mb-6 line-clamp-2 text-[15px] leading-relaxed">{memory.description}</p>}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {(memory.tags && memory.tags.length > 0 ? memory.tags : ['family']).map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-full text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                                  #{tag}
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
                          className="figma-card p-6 md:p-8 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-2"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={ownerAvatar} 
                                  alt={ownerName} 
                                  className="w-8 h-8 rounded-full object-cover border border-[#C7D2FE]"
                                />
                                <div className="flex flex-col">
                                  <span className="font-bold text-[13px] text-stone-900 dark:text-white leading-tight">{ownerName}</span>
                                  <span className="text-[11px] text-stone-500 font-medium">{dateStr}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-[#f59e0b]">
                                <Mic size={16} strokeWidth={2.5} />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">VOICE</span>
                              </div>
                            </div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <h3 className="text-[22px] font-bold text-stone-900 dark:text-white group-hover:text-[#4A3AFF] transition-colors tracking-tight leading-snug">{memory.title}</h3>
                              <TaggedMembersBadge memory={memory} />
                            </div>
                            <p className="text-stone-500 dark:text-stone-400 mb-6 line-clamp-2 text-[15px] leading-relaxed">
                              {memory.description || "No transcript available for this voice memory."}
                            </p>
                          </div>

                          <div className="mb-6 w-full" onClick={(e) => e.stopPropagation()}>
                            <VoicePlayer memory={memory} />
                          </div>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {(memory.tags && memory.tags.length > 0 ? memory.tags : ['family']).map((tag) => (
                              <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-full text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    }

                    // Written Story (Default)
                    return (
                      <motion.div 
                        variants={fadeInUp}
                        key={memory._id || memory.id} 
                        onClick={openView}
                        className="figma-card p-6 md:p-8 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full mb-2"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={ownerAvatar} 
                                alt={ownerName} 
                                className="w-8 h-8 rounded-full object-cover border border-[#C7D2FE]"
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-[13px] text-stone-900 dark:text-white leading-tight">{ownerName}</span>
                                <span className="text-[11px] text-stone-500 font-medium">{dateStr}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[#10b981]">
                              <FileText size={16} strokeWidth={2.5} />
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#10b981]">WRITTEN</span>
                            </div>
                          </div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="text-[22px] font-bold text-stone-900 dark:text-white group-hover:text-[#4A3AFF] transition-colors tracking-tight leading-snug">{memory.title}</h3>
                            <TaggedMembersBadge memory={memory} />
                          </div>
                          <p className="text-stone-500 dark:text-stone-400 mb-6 text-[15px] leading-relaxed line-clamp-3">
                            {memory.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {(memory.tags && memory.tags.length > 0 ? memory.tags : ['family']).map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-full text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* LIST VIEW MODE */}
            {memoriesList.length > 0 && viewMode === "list" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 max-w-4xl mx-auto">
                {memoriesList.map((memory) => {
                  const type = (memory.type || "Voice").toLowerCase();
                  const isPhoto = type === "photo" || memory.image || memory.cover;
                  const formattedDate = formatDateSafely(memory.date || memory.createdAt || memory.occurredAt);

                  const ownerName = 
                    (memory.owner && (memory.owner.displayName || memory.owner.name)) || 
                    (memory.ownerDisplayName && memory.ownerDisplayName !== "Family Member" ? memory.ownerDisplayName : null) || 
                    memory.user?.displayName || 
                    memory.user?.name || 
                    (memory.ownerEmail ? memory.ownerEmail.split("@")[0] : null) || 
                    (authProfile ? (authProfile.displayName || authProfile.name) : "Family Member");

                  const ownerAvatar = 
                    (memory.owner && (memory.owner.photoURL || memory.owner.avatarUrl || memory.owner.avatar)) || 
                    (memory.ownerAvatarUrl && memory.ownerAvatarUrl.startsWith("http") ? memory.ownerAvatarUrl : null) || 
                    (authProfile?.photoURL ? authProfile.photoURL : null) || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=4A3AFF&color=fff`;

                  const openView = () => {
                    window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...memory, date: formattedDate, ownerDisplayName: ownerName, ownerAvatarUrl: ownerAvatar } }));
                  };

                  return (
                    <motion.div 
                      key={memory.id || memory._id}
                      variants={fadeInUp}
                      onClick={openView}
                      className="figma-card p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-2xl ${
                          isPhoto ? "bg-emerald-50 text-emerald-600" : type === "written" ? "bg-purple-50 text-purple-600" : "bg-[#EEF2FF] text-[#4A3AFF]"
                        } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                          {isPhoto ? <ImageIcon size={18} /> : type === "written" ? <FileText size={18} /> : <Mic size={18} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <h3 className="font-bold text-base text-stone-900 dark:text-white truncate group-hover:text-[#4A3AFF] transition-colors">
                                {memory.title}
                              </h3>
                              <span className="text-xs text-stone-400 font-semibold shrink-0">• {formattedDate}</span>
                            </div>
                            <TaggedMembersBadge memory={memory} />
                          </div>
                          <p className="text-xs font-medium text-stone-500 dark:text-stone-400 truncate mt-0.5">
                            {memory.description || memory.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {(memory.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="hidden sm:inline-block px-2.5 py-0.5 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4A3AFF] dark:text-indigo-300 rounded-full text-[10px] font-bold">
                            #{String(tag).replace(/^#/, "")}
                          </span>
                        ))}
                        <ChevronRight size={16} className="text-stone-400 group-hover:text-[#4A3AFF] transition" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Link Family Memory Modal */}
      <LinkMemoryModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        familyCircleId={album?.familyCircleId}
        albumId={album?.id}
        onLinkSuccess={() => {
          setToastMessage("Memory contributed to Family Space Album!");
          setTimeout(() => setToastMessage(""), 3500);
          setIsContributeModalOpen(false);
          window.location.reload();
        }}
      />

      {/* Edit Album Modal */}
      {isEditModalOpen && album && (
        <EditAlbumModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          album={album}
          onSuccess={() => {
            setToastMessage("Album updated successfully!");
            setTimeout(() => setToastMessage(""), 3000);
            setIsEditModalOpen(false);
            window.location.reload();
          }}
        />
      )}

      {/* Share Album Modal */}
      {isShareModalOpen && album && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={`Share ${album.title}`}
          url={typeof window !== "undefined" ? window.location.href : ""}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl animate-scale-up overflow-hidden relative border border-stone-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 p-5">
              <h3 className="text-lg font-black text-stone-900 dark:text-white">Delete Album</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-100 dark:border-red-900/40">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/60 flex items-center justify-center text-red-600 dark:text-red-300 shrink-0">
                  <Trash2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">Are you sure?</p>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                Deleting <span className="font-bold text-stone-900 dark:text-white">&quot;{album?.title}&quot;</span> will permanently remove this Family Space Album.
              </p>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-stone-200 dark:border-slate-700 py-3 text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteAlbum}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50"
                >
                  {isDeleting && <Loader2 size={16} className="animate-spin" />}
                  Delete Album
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WavesBackground>
  );
}
