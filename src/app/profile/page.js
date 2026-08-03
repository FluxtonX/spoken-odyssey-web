"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { useAuth } from "@/context/AuthProvider";
import { 
  getProfileFromBackend, 
  updateProfileOnBackend,
  getMemoriesFromBackend, 
  getAlbumsFromBackend,
  getFollowers,
  normalizeMediaUrl 
} from "@/services/backend";
import { 
  User, 
  MapPin, 
  Globe, 
  CalendarDays, 
  Edit3, 
  Loader2, 
  BookOpen, 
  Album, 
  Award, 
  Clock, 
  ChevronRight,
  Headphones,
  FileText,
  Image as ImageIcon,
  Film,
  Lock,
  Camera,
  X,
  Check,
  AlertCircle,
  FolderHeart,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";
import MemoryDetailModal from "@/components/ui/MemoryDetailModal";
import { ALBUM_MEMORIES_MAP } from "@/data/mockApp";
import { getStoredAlbums } from "@/data/userProfile";

// Fail-Safe Date Formatting Helper
const formatDateSafely = (dateVal, fallback = "Public Memory") => {
  if (!dateVal) return fallback;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (_) {
    return fallback;
  }
};

const formatBirthDateSafely = (dateVal) => {
  if (!dateVal) return null;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  } catch (_) {
    return null;
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { firebaseUser, profile, isAuthenticated, getToken, refreshProfile } = useAuth();
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Active Tab State: "memories" | "albums" | "milestones" | "timeline"
  const [activeTab, setActiveTab] = useState("memories");

  // Selected Memory Modal State (Opens MemoryDetailModal in-place on Profile Page)
  const [selectedMemory, setSelectedMemory] = useState(null);

  // Main Data Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [memories, setMemories] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);

  // Progressive Chunk Loading (12 items per batch for fast rendering)
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) {
        setVisibleCount((prev) => prev + 12);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // In-Page Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit Form Fields State
  const [editForm, setEditForm] = useState({
    displayName: "",
    location: "",
    profession: "",
    bio: "",
    birthDate: "",
  });

  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Load Real Profile, Memories, Albums & Followers from Backend Database APIs
  const loadRealProfileData = async () => {
    setIsLoading(true);
    try {
      let token = null;
      if (isAuthenticated && firebaseUser) {
        try { token = await getToken(); } catch (_) {}
      }

      if (token) {
        // 1. Fetch Real User Profile from PostgreSQL DB
        try {
          const dbProf = await getProfileFromBackend(token);
          if (dbProf) {
            setUserProfile(dbProf);
            const rawBirthDate = dbProf.birthDate || profile?.birthDate || "";
            const formattedBirthDate = rawBirthDate ? rawBirthDate.split("T")[0] : "";
            
            setEditForm({
              displayName: dbProf.displayName || dbProf.name || firebaseUser?.displayName || "Seán O'Brien",
              location: dbProf.location || "London, UK",
              profession: dbProf.profession || "Product Designer",
              bio: dbProf.bio || "Designer, father, Corkman. Preserving the stories that matter.",
              birthDate: formattedBirthDate,
            });
          }
        } catch (pErr) {
          console.warn("Could not fetch user profile from DB:", pErr.message);
        }

        // 2. Fetch Real User Memories from PostgreSQL DB + Merge LocalStorage Memories
        try {
          const dbMems = await getMemoriesFromBackend(token);
          const validMems = Array.isArray(dbMems) ? dbMems : (dbMems?.data && Array.isArray(dbMems.data) ? dbMems.data : []);
          
          let localMems = [];
          if (typeof window !== "undefined") {
            try {
              const userKey = firebaseUser?.uid ? `spokenOdysseyLocalMemories_${firebaseUser.uid}` : "spokenOdysseyLocalMemories";
              const saved = localStorage.getItem(userKey) || localStorage.getItem("spokenOdysseyLocalMemories");
              if (saved) localMems = JSON.parse(saved);
            } catch (_) {}
          }

          const mergedMap = new Map();
          validMems.forEach(m => { if (m && (m.id || m._id)) mergedMap.set(String(m.id || m._id), m); });
          localMems.forEach(m => {
            if (m && (m.id || m._id)) {
              const key = String(m.id || m._id);
              if (!mergedMap.has(key)) mergedMap.set(key, m);
            }
          });

          setMemories(Array.from(mergedMap.values()));
        } catch (mErr) {
          console.warn("Could not fetch user memories from DB:", mErr.message);
          setMemories([]);
        }

        // 3. Fetch Real User Albums from PostgreSQL DB + Fallback to stored albums
        try {
          const dbAlbs = await getAlbumsFromBackend(token);
          const validAlbs = Array.isArray(dbAlbs) ? dbAlbs : (dbAlbs?.data && Array.isArray(dbAlbs.data) ? dbAlbs.data : []);
          if (validAlbs.length > 0) {
            setAlbums(validAlbs);
          } else {
            setAlbums(getStoredAlbums());
          }
        } catch (aErr) {
          console.warn("Could not fetch user albums from DB:", aErr.message);
          setAlbums(getStoredAlbums());
        }

        // 4. Fetch Real User Followers Count from DB
        try {
          const followersList = await getFollowers(token);
          if (Array.isArray(followersList)) {
            setFollowersCount(followersList.length);
          }
        } catch (fErr) {
          console.warn("Could not fetch followers count:", fErr.message);
        }
      }
    } catch (err) {
      console.error("Profile page load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRealProfileData();
  }, [isAuthenticated, firebaseUser]);

  // Derived Display User Properties
  const displayName = userProfile?.displayName || userProfile?.name || profile?.displayName || firebaseUser?.displayName || "Seán O'Brien";
  const location = userProfile?.location || profile?.location || "London, UK";
  const profession = userProfile?.profession || profile?.profession || "Product Designer";
  const bio = userProfile?.bio || profile?.bio || "Designer, father, Corkman. Preserving the stories that matter.";
  const rawBirthDate = userProfile?.birthDate || profile?.birthDate || "";
  const formattedBirthDate = formatBirthDateSafely(rawBirthDate);
  const visibility = userProfile?.profileVisibility || "Public profile";

  const avatarURL = avatarPreview || normalizeMediaUrl(userProfile?.photoURL || userProfile?.avatarUrl || userProfile?.photoKey || profile?.avatarUrl || firebaseUser?.photoURL) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
  const rawCover = userProfile?.coverURL || userProfile?.coverKey || profile?.coverUrl;
  const coverURL = coverPreview || (rawCover ? normalizeMediaUrl(rawCover) : null);

  // Safe Memory Filters
  const safeMemories = Array.isArray(memories) ? memories.filter(Boolean) : [];
  const milestonesMemories = safeMemories.filter(m => m && (String(m.type || "").toLowerCase() === "milestone" || (Array.isArray(m.tags) && m.tags.includes("milestone"))));

  // Handle File Selections
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Submit In-Page Profile Edits directly to PostgreSQL Backend API
  const handleSaveProfileInPage = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setToastMessage(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required.");

      const bodyData = new FormData();
      bodyData.append("displayName", editForm.displayName);
      bodyData.append("bio", editForm.bio);
      bodyData.append("location", editForm.location);
      bodyData.append("profession", editForm.profession);
      bodyData.append("birthDate", editForm.birthDate);

      if (selectedAvatarFile) {
        bodyData.append("profileImage", selectedAvatarFile);
      }
      if (selectedCoverFile) {
        bodyData.append("coverImage", selectedCoverFile);
      }

      const res = await updateProfileOnBackend(token, bodyData);

      if (res && res.success !== false) {
        setToastMessage({ type: "success", text: "Profile updated successfully in database!" });
        setIsEditModalOpen(false);
        if (typeof refreshProfile === "function") {
          await refreshProfile();
        }
        await loadRealProfileData();
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        throw new Error(res?.message || "Failed to update profile in database.");
      }
    } catch (err) {
      console.error("Save Profile Error:", err);
      setToastMessage({ type: "error", text: err.message || "Failed to save profile." });
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Format Helper for Memory Type Badge
  const getMemoryTypeBadge = (mem) => {
    if (!mem) return null;
    const typeStr = String(mem.type || "written").toLowerCase();
    if (typeStr === "voice" || mem.audioUrl) {
      return (
        <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-amber-200/60">
          <Headphones size={12} />
          Voice
        </span>
      );
    } else if (typeStr === "photo" || typeStr === "video" || mem.mediaUrl || mem.image || (mem.mediaList && mem.mediaList.length > 0)) {
      return (
        <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-indigo-200/60">
          <ImageIcon size={12} />
          {typeStr === "video" ? "Video" : "Photo"}
        </span>
      );
    }
    return (
      <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-emerald-200/60">
        <FileText size={12} />
        Written
      </span>
    );
  };

  // Comprehensive Helper for Media Sources (Parses mediaList, S3 keys, and all media objects)
  const getMemoryMediaSources = (story) => {
    if (!story) return [];
    const list = [];

    // 1. Check mediaList array returned by PostgreSQL backend
    if (story.mediaList && Array.isArray(story.mediaList)) {
      story.mediaList.forEach(m => {
        const u = m.mediaUrl || m.url || m.thumbnailUrl;
        if (u) list.push({ url: normalizeMediaUrl(u), type: m.mediaMimeType?.startsWith("video/") ? "video" : "photo" });
      });
    }

    // 2. Check direct media properties
    if (story.mediaUrl) list.push({ url: normalizeMediaUrl(story.mediaUrl), type: String(story.type).toLowerCase() === "video" ? "video" : "photo" });
    if (story.image) list.push({ url: normalizeMediaUrl(story.image), type: "photo" });
    if (story.photoURL) list.push({ url: normalizeMediaUrl(story.photoURL), type: "photo" });
    if (story.videoUrl) list.push({ url: normalizeMediaUrl(story.videoUrl), type: "video" });
    if (story.fileUrl) list.push({ url: normalizeMediaUrl(story.fileUrl), type: String(story.type).toLowerCase() === "video" ? "video" : "photo" });
    if (story.url) list.push({ url: normalizeMediaUrl(story.url), type: String(story.type).toLowerCase() === "video" ? "video" : "photo" });

    // 3. Check mediaKeys array
    if (story.mediaKeys && Array.isArray(story.mediaKeys)) {
      story.mediaKeys.forEach(k => {
        if (typeof k === "string") list.push({ url: normalizeMediaUrl(k), type: "photo" });
        else if (k && (k.url || k.key)) list.push({ url: normalizeMediaUrl(k.url || k.key), type: k.type || "photo" });
      });
    }

    // 4. Check media array
    if (story.media && Array.isArray(story.media)) {
      story.media.forEach(k => {
        if (typeof k === "string") list.push({ url: normalizeMediaUrl(k), type: "photo" });
        else if (k && (k.url || k.key)) list.push({ url: normalizeMediaUrl(k.url || k.key), type: k.type || "photo" });
      });
    }

    // 5. Fallback: If type is photo/video, guarantee a media source image
    const typeStr = String(story.type || "").toLowerCase();
    if (list.length === 0 && (typeStr === "photo" || typeStr === "video" || story.thumbnailUrl)) {
      const fallbackUrl = story.thumbnailUrl || story.coverURL || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop";
      list.push({ url: normalizeMediaUrl(fallbackUrl), type: typeStr === "video" ? "video" : "photo" });
    }

    // Deduplicate by URL
    const unique = [];
    const seen = new Set();
    for (const item of list) {
      if (item.url && !seen.has(item.url)) {
        seen.add(item.url);
        unique.push(item);
      }
    }

    return unique;
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

        {/* Master Alignment Container */}
        <div className="w-full mt-2 md:mt-6 px-4 md:px-8 max-w-6xl mx-auto flex flex-col">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-400 mb-4">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-[#4A3AFF] font-bold">Profile</span>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full mb-6 p-4 rounded-2xl shadow-lg flex items-center justify-between text-[14px] font-semibold ${
                toastMessage.type === "error" ? "bg-red-500 text-white" : "bg-[#4A3AFF] text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {toastMessage.type === "error" ? <AlertCircle size={18} /> : <Check size={18} />}
                <span>{toastMessage.text}</span>
              </div>
            </motion.div>
          )}

          {/* ====================================================
              FIGMA PROFILE HEADER CARD
              ==================================================== */}
          <motion.div variants={fadeInUp} className="w-full mb-8">
            <div className="figma-card w-full rounded-[28px] overflow-hidden bg-white/70 backdrop-blur-md border border-[#C7D2FE]/70 shadow-sm flex flex-col relative">
              
              {/* Top Cover Banner */}
              <div className="w-full h-[180px] md:h-[220px] relative overflow-hidden">
                {coverURL ? (
                  <img
                    src={coverURL}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#4A3AFF] via-[#6366F1] to-[#818CF8] opacity-90 shadow-inner" />
                )}
                {/* Curved Dark Arch Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                {/* Edit Profile Button Overlay (Opens In-Page Modal) */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 border border-white/60 text-white font-bold bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[13px] hover:bg-black/60 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Edit3 size={14} />
                  <span>Edit profile</span>
                </button>
              </div>

              {/* Card Body with Overlapping Avatar & Stats */}
              <div className="px-6 md:px-8 pb-8 pt-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                
                {/* Left Side: Overlapping Avatar & User Bio */}
                <div className="flex flex-col">
                  {/* Overlapping Avatar */}
                  <div className="-mt-14 md:-mt-16 mb-4 shrink-0 relative z-10">
                    <img
                      src={avatarURL}
                      alt={displayName}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl bg-stone-100"
                    />
                  </div>

                  {/* Name Header */}
                  <h1 className="text-[26px] md:text-[34px] font-extrabold text-stone-900 tracking-tight leading-tight mb-1">
                    {displayName}
                  </h1>

                  {/* Location & Profession */}
                  <div className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-stone-500 mb-1">
                    {location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-stone-400" />
                        <span>{location}</span>
                      </div>
                    )}
                    {profession && (
                      <span className="text-stone-400">• {profession}</span>
                    )}
                    <div className="flex items-center gap-1 text-[#4A3AFF] font-semibold ml-2">
                      <Globe size={14} />
                      <span>{visibility}</span>
                    </div>
                  </div>

                  {/* Birthday Line (Directly Below Location) */}
                  {formattedBirthDate && (
                    <div className="text-[13px] font-semibold text-stone-500 mb-3 flex items-center gap-1.5">
                      <span>🎂 Born {formattedBirthDate}</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-[14px] md:text-[15px] font-medium text-stone-600 max-w-2xl leading-relaxed">
                    {bio}
                  </p>
                </div>

                {/* Right Side: Real Counter Stats */}
                <div className="flex items-center gap-8 md:gap-10 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/60 w-full md:w-auto">
                  <div className="flex flex-col items-center">
                    <span className="text-[24px] md:text-[28px] font-extrabold text-stone-900 leading-none">
                      {safeMemories.length}
                    </span>
                    <span className="text-[12px] font-bold text-stone-400 uppercase tracking-wider mt-1">
                      Memories
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[24px] md:text-[28px] font-extrabold text-stone-900 leading-none">
                      {albums.length}
                    </span>
                    <span className="text-[12px] font-bold text-stone-400 uppercase tracking-wider mt-1">
                      Albums
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[24px] md:text-[28px] font-extrabold text-stone-900 leading-none">
                      {followersCount.toLocaleString()}
                    </span>
                    <span className="text-[12px] font-bold text-stone-400 uppercase tracking-wider mt-1">
                      Followers
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

          {/* ====================================================
              FIGMA PURPLE PILL TAB NAVIGATION BAR
              ==================================================== */}
          <motion.div variants={fadeInUp} className="w-full mb-8">
            <div className="w-full bg-[#4A3AFF] rounded-full p-1.5 flex items-center justify-between text-[14px] font-bold text-white shadow-md">
              <button
                onClick={() => setActiveTab("memories")}
                className={`flex-1 py-3 px-6 rounded-full transition-all text-center cursor-pointer ${
                  activeTab === "memories"
                    ? "bg-white text-stone-900 shadow-md font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                Memories
              </button>

              <button
                onClick={() => setActiveTab("albums")}
                className={`flex-1 py-3 px-6 rounded-full transition-all text-center cursor-pointer ${
                  activeTab === "albums"
                    ? "bg-white text-stone-900 shadow-md font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                Albums
              </button>

              <button
                onClick={() => setActiveTab("milestones")}
                className={`flex-1 py-3 px-6 rounded-full transition-all text-center cursor-pointer ${
                  activeTab === "milestones"
                    ? "bg-white text-stone-900 shadow-md font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                Milestones
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex-1 py-3 px-6 rounded-full transition-all text-center cursor-pointer ${
                  activeTab === "timeline"
                    ? "bg-white text-stone-900 shadow-md font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                Timeline
              </button>
            </div>
          </motion.div>

          {/* ====================================================
              TAB CONTENT: MEMORIES / ALBUMS / MILESTONES / TIMELINE
              ==================================================== */}
          
          {/* TAB 1: MEMORIES 3-COLUMN MASONRY GRID */}
          {activeTab === "memories" && (
            <motion.div variants={fadeInUp} className="w-full">
              {isLoading ? (
                <div className="w-full py-16 flex flex-col items-center justify-center text-stone-400">
                  <Loader2 size={32} className="animate-spin text-[#4A3AFF] mb-3" />
                  <span className="text-[14px] font-semibold">Loading your memory archive...</span>
                </div>
              ) : safeMemories.length === 0 ? (
                <div className="w-full py-16 text-center bg-white/60 backdrop-blur-md rounded-[24px] border border-stone-200/70 p-8">
                  <BookOpen size={36} className="mx-auto text-stone-300 mb-3" />
                  <h3 className="text-[18px] font-bold text-stone-800 mb-1">No memories created yet</h3>
                  <p className="text-[14px] text-stone-500 mb-4">Start preserving your life stories and audio memories.</p>
                  <button 
                    onClick={() => router.push("/record")}
                    className="bg-[#4A3AFF] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-[14px]"
                  >
                    Publish Memory
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {safeMemories.slice(0, visibleCount).map((story) => {
                      if (!story) return null;
                      const typeStr = String(story.type || "").toLowerCase();
                      const isVoice = typeStr === "voice" || Boolean(story.audioUrl && !story.mediaUrl && !story.image && !story.photoURL && (!story.mediaList || story.mediaList.length === 0));
                      
                      // Audio recordings should NEVER render a photo/video cover container
                      const mediaSources = isVoice ? [] : getMemoryMediaSources(story);
                      const tagsList = story.tags && Array.isArray(story.tags) && story.tags.length > 0
                        ? story.tags
                        : ["reflection", "life", "memory"];

                      const targetId = story.id || story._id || story.memoryId || "m1";

                      return (
                        <motion.div
                          variants={fadeInUp}
                          key={targetId}
                          onClick={() => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...story, date: formatDateSafely(story.createdAt || story.date) } }))}
                          className="figma-card flex flex-col overflow-hidden rounded-[24px] bg-white/70 backdrop-blur-md border border-[#C7D2FE]/70 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                          {/* Media Cover (ONLY for Photos/Videos - NEVER for Voice) */}
                          {!isVoice && mediaSources.length > 0 && (
                            <div className="w-full relative overflow-hidden bg-stone-100">
                              <CardMediaSlider mediaItems={mediaSources} />
                            </div>
                          )}

                          {/* Card Body */}
                          <div className="p-6 flex flex-col flex-grow">
                            
                            {/* Top Row: Type Badge + Date */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              {getMemoryTypeBadge(story)}
                              <span className="text-[12px] font-semibold text-stone-400 flex items-center gap-1">
                                {story.privacy?.toLowerCase() === "private" && <Lock size={11} />}
                                {formatDateSafely(story.createdAt || story.date)}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-[18px] font-bold text-stone-900 tracking-tight leading-snug mb-2 group-hover:text-[#4A3AFF] transition-colors line-clamp-2">
                              {story.title || "Untitled Memory"}
                            </h3>

                            {/* Description */}
                            <p className="text-[14px] font-medium text-stone-600 leading-relaxed mb-4 line-clamp-3">
                              {story.description || story.content || "No description written."}
                            </p>

                            {/* Audio Waveform Player (For Voice Memories) */}
                            {(story.type === "voice" || story.audioUrl) && (
                              <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                                <VoicePlayer memory={story} />
                              </div>
                            )}

                            {/* Soft Blue Hashtag Pills (Matching Figma Screen) */}
                            <div className="mt-auto pt-3 border-t border-[#C7D2FE]/50 flex flex-wrap gap-2">
                              {tagsList.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-[#EEF2FF] text-[#4A3AFF] font-bold text-[12px] px-3 py-1 rounded-lg border border-[#C7D2FE]/60"
                                >
                                  #{String(tag).replace(/^#/, "")}
                                </span>
                              ))}
                            </div>

                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {visibleCount < safeMemories.length && (
                    <div className="w-full pt-4 flex justify-center">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                        className="px-6 py-2.5 rounded-full bg-[#EEF2FF] text-[#4A3AFF] font-bold text-sm border border-[#C7D2FE] hover:bg-[#4A3AFF] hover:text-white transition-all shadow-xs"
                      >
                        Load More Memories ({safeMemories.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: ALBUMS GRID (Figma Screenshot 2) */}
          {activeTab === "albums" && (
            <motion.div variants={fadeInUp} className="w-full">
              {albums.length === 0 ? (
                <div className="w-full py-16 text-center bg-white/60 backdrop-blur-md rounded-[24px] border border-stone-200/70 p-8">
                  <Album size={36} className="mx-auto text-stone-300 mb-3" />
                  <h3 className="text-[18px] font-bold text-stone-800 mb-1">No albums created yet</h3>
                  <p className="text-[14px] text-stone-500 mb-4">Group your memories into photo & voice albums.</p>
                  <button 
                    onClick={() => router.push("/albums")}
                    className="bg-[#4A3AFF] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-[14px]"
                  >
                    Create Album
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((alb) => {
                    const getRealAlbumMemoriesCount = (albumItem) => {
                      if (!albumItem) return 0;
                      const albId = String(albumItem.id || "").toLowerCase();
                      const albTitle = String(albumItem.title || "").toLowerCase();

                      const matching = safeMemories.filter(m => {
                        if (!m) return false;
                        const mAlbId = String(m.albumId || "").toLowerCase();
                        const mAlbTitle = String(m.albumTitle || m.album || "").toLowerCase();
                        const inAlbumsList = Array.isArray(m.albums) && m.albums.some(a => String(a).toLowerCase() === albId);

                        const isCareerCraftMatch = (mAlbId === "career-craft" || mAlbId === "career-and-craft") && (albId === "career-and-craft" || albId === "career-craft");

                        return (mAlbId && mAlbId === albId) || 
                               isCareerCraftMatch ||
                               inAlbumsList ||
                               (mAlbTitle && albTitle && mAlbTitle === albTitle) ||
                               (albTitle && mAlbTitle.includes(albTitle));
                      });

                      const mapCount = (typeof ALBUM_MEMORIES_MAP !== "undefined" && (ALBUM_MEMORIES_MAP[albId] || ALBUM_MEMORIES_MAP[albumItem.id])?.length) || 0;
                      const presetCount = typeof albumItem.memoryCount === "number" ? albumItem.memoryCount : 0;
                      const entriesCount = typeof albumItem.entries === "number" && albumItem.entries > 0 ? albumItem.entries : 0;
                      const memoriesArrCount = Array.isArray(albumItem.memories) ? albumItem.memories.length : 0;

                      const baseCount = Math.max(entriesCount, memoriesArrCount, mapCount, presetCount);
                      return baseCount + matching.length;
                    };

                    const albumMemoriesCount = getRealAlbumMemoriesCount(alb);

                    return (
                      <div 
                        key={alb.id}
                        onClick={() => router.push(`/albums/${alb.id}?from=profile`)}
                        className="figma-card overflow-hidden rounded-[24px] bg-white/70 backdrop-blur-md border border-[#C7D2FE]/70 cursor-pointer hover:shadow-lg transition-all flex flex-col group"
                      >
                        {/* Top Media Cover */}
                        <div className="w-full h-44 md:h-48 overflow-hidden bg-stone-200 relative">
                          <img 
                            src={normalizeMediaUrl(alb.coverImageUrl || alb.coverImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600")} 
                            alt={alb.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>

                        {/* Soft Purple Bottom Text Container */}
                        <div className="p-5 bg-[#EEF2FF] border-t border-[#C7D2FE]/60 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-[18px] text-stone-900 mb-0.5 group-hover:text-[#4A3AFF] transition-colors">{alb.title}</h3>
                            <p className="text-[13px] font-medium text-stone-500">{albumMemoriesCount} memories</p>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-full border border-[#C7D2FE]/70 text-[#4A3AFF] font-extrabold text-xs shadow-xs">
                            <FolderHeart size={15} className="text-[#4A3AFF] fill-[#4A3AFF]/20" />
                            <span>{albumMemoriesCount}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: MILESTONES (Figma Screenshot 1) */}
          {activeTab === "milestones" && (
            <motion.div variants={fadeInUp} className="w-full flex flex-col gap-4">
              {/* Default Birth Milestone if BirthDate Exists */}
              {rawBirthDate && (
                <div className="figma-card w-full rounded-2xl bg-white/70 backdrop-blur-md border border-[#C7D2FE] p-5 md:p-6 shadow-sm flex items-center gap-6">
                  <div className="bg-[#EEF2FF] text-[#4A3AFF] font-black text-[16px] md:text-[18px] px-5 py-2.5 rounded-xl border border-[#C7D2FE]/60 shrink-0">
                    {new Date(rawBirthDate).getFullYear()}
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#4A3AFF] shrink-0" />
                  <span className="text-[16px] md:text-[18px] font-bold text-stone-900">
                    Born in {location || "Cork, Ireland"}
                  </span>
                </div>
              )}

              {milestonesMemories.length === 0 && !rawBirthDate ? (
                <div className="w-full py-16 text-center bg-white/60 backdrop-blur-md rounded-[24px] border border-stone-200/70 p-8">
                  <Award size={36} className="mx-auto text-stone-300 mb-3" />
                  <h3 className="text-[18px] font-bold text-stone-800 mb-1">No life milestones recorded</h3>
                  <p className="text-[14px] text-stone-500 mb-4">Tag important life events as milestones.</p>
                </div>
              ) : (
                milestonesMemories.slice(0, visibleCount).map((story) => {
                  const mId = story.id || story._id || story.memoryId || "m1";
                  return (
                    <div 
                      key={mId}
                      onClick={() => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...story, date: formatDateSafely(story.createdAt || story.date) } }))}
                      className="figma-card w-full rounded-2xl bg-white/70 backdrop-blur-md border border-[#C7D2FE] p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-6 cursor-pointer group"
                    >
                      <div className="bg-[#EEF2FF] text-[#4A3AFF] font-black text-[16px] md:text-[18px] px-5 py-2.5 rounded-xl border border-[#C7D2FE]/60 shrink-0">
                        {new Date(story.createdAt || story.date || Date.now()).getFullYear()}
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#4A3AFF] shrink-0" />
                      <span className="text-[16px] md:text-[18px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors">
                        {story.title}
                      </span>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === "timeline" && (
            <motion.div variants={fadeInUp} className="w-full">
              <div className="w-full bg-white/70 backdrop-blur-md rounded-[24px] border border-[#C7D2FE]/70 p-6 md:p-8">
                <h3 className="text-[18px] font-bold text-stone-900 mb-6">Life Story Timeline</h3>
                <div className="relative pl-6 border-l-2 border-[#4A3AFF]/30 space-y-6">
                  {safeMemories.slice(0, visibleCount).map((story, idx) => {
                    const tId = story.id || story._id || story.memoryId || "m1";
                    return (
                      <div 
                        key={tId || idx} 
                        className="relative group cursor-pointer" 
                        onClick={() => window.dispatchEvent(new CustomEvent("openMemoryView", { detail: { ...story, date: formatDateSafely(story.createdAt || story.date) } }))}
                      >
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4A3AFF] border-2 border-white shadow-sm" />
                        <span className="text-[12px] font-bold text-stone-400">
                          {formatDateSafely(story.createdAt || story.date)}
                        </span>
                        <h4 className="font-bold text-[16px] text-stone-900 group-hover:text-[#4A3AFF] transition-colors">{story.title || "Untitled Memory"}</h4>
                        <p className="text-[13px] text-stone-600 line-clamp-2">{story.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* IN-PAGE EDIT PROFILE MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[28px] max-w-xl w-full p-6 md:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <h3 className="text-[22px] font-extrabold text-stone-900">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfileInPage} className="flex flex-col gap-5">
                
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                    Cover Banner Image
                  </label>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                    <img src={coverPreview || coverURL} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-bold text-xs gap-2">
                      <Camera size={16} />
                      <span>Change Cover Image</span>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Avatar Image Upload */}
                <div>
                  <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                      <img src={avatarPreview || avatarURL} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center shadow-sm">
                        <Camera size={12} />
                      </div>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                    </div>
                    <span className="text-[13px] text-stone-500 font-medium">Click avatar to select new photo</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.displayName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F8F9FF] border border-[#D1D9FF] rounded-xl font-medium text-stone-800 text-[14px]"
                  />
                </div>

                {/* Grid: Location & Profession */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8F9FF] border border-[#D1D9FF] rounded-xl font-medium text-stone-800 text-[14px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                      Profession / Occupation
                    </label>
                    <input
                      type="text"
                      value={editForm.profession}
                      onChange={(e) => setEditForm(prev => ({ ...prev, profession: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8F9FF] border border-[#D1D9FF] rounded-xl font-medium text-stone-800 text-[14px]"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                    Date of Birth / Birthday
                  </label>
                  <input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F8F9FF] border border-[#D1D9FF] rounded-xl font-medium text-stone-800 text-[14px]"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F8F9FF] border border-[#D1D9FF] rounded-xl font-medium text-stone-800 text-[14px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-[14px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex-1 py-3 bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white font-bold rounded-xl text-[14px] shadow-md flex items-center justify-center gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save changes</span>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}

        {/* IN-PLACE MEMORY DETAIL MODAL */}
        {selectedMemory && (
          <MemoryDetailModal
            memory={selectedMemory}
            userProfile={userProfile || profile}
            onClose={() => setSelectedMemory(null)}
          />
        )}

      </motion.div>
    </WavesBackground>
  );
}
