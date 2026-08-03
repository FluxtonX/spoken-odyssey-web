"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { 
  UserPlus, UserCheck, Heart, Award, Star, Briefcase, Calendar, 
  Folder, Loader2, ArrowLeft, Inbox, Sparkles, BookOpen, Mic, Play,
  FileText, Image as ImageIcon, Film, Headphones
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useAuth } from "@/context/AuthProvider";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";
import { 
  getUserProfileFromBackend, 
  getMemoriesFromBackend, 
  getAlbumsFromBackend, 
  followUser, 
  unfollowUser, 
  reactToMemory,
  normalizeMediaUrl 
} from "@/services/backend";
import { getFeaturedPersonData } from "@/data/featuredPeopleData";

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

  const firstVideo = items.find((item) => item.type === "video")?.url;
  const firstImage = items.find((item) => item.type === "image")?.url;
  return { items, video: firstVideo, image: firstImage };
};

export default function PersonDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { isAuthenticated, firebaseUser, getToken } = useAuth();

  // Extract ID reliably from useParams or pathname
  const id = params?.id || (pathname ? pathname.split("/").filter(Boolean).at(-1) : null);

  // Tab State: "stories" | "milestones" | "albums"
  const [activeTab, setActiveTab] = useState("stories");

  // Main Data States
  const [person, setPerson] = useState(null);
  const [stories, setStories] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Reaction maps for stories
  const [userReactionMap, setUserReactionMap] = useState({});
  const [reactionsCountMap, setReactionsCountMap] = useState({});

  // Main Data Hydration Effect
  useEffect(() => {
    if (!id || id === "[id]") {
      setIsLoading(false);
      return;
    }

    async function loadPersonData() {
      setIsLoading(true);
      try {
        let token = null;
        if (isAuthenticated && firebaseUser) {
          try {
            token = await getToken();
          } catch (_) {}
        }

        let dbUser = null;
        let dbMemories = [];
        let dbAlbums = [];

        // Attempt to fetch real database user details
        try {
          dbUser = await getUserProfileFromBackend(token, id);
        } catch (_) {}

        // Attempt to fetch user's memories & albums from DB
        try {
          if (dbUser?.id || id) {
            dbMemories = await getMemoriesFromBackend(token, dbUser?.id || id);
            dbAlbums = await getAlbumsFromBackend(token, dbUser?.id || id);
          }
        } catch (_) {}

        // Check if explicit mock featured person slug exists (e.g. "grace-hopper", "nelson-mandela", "maya-angelou")
        const mockPerson = getFeaturedPersonData(id);

        if (dbUser && (dbUser.id || dbUser.email || dbUser.displayName)) {
          // ====================================================
          // REAL DATABASE USER FOUND -> STRICTLY RENDER REAL DB DATA
          // ====================================================
          const displayName = dbUser.displayName || dbUser.name || (dbUser.email ? dbUser.email.split("@")[0] : "Storyteller");
          
          setPerson({
            id: dbUser.id,
            name: displayName,
            role: dbUser.profession || dbUser.role || dbUser.bio || "Odyssey Creator",
            avatar: dbUser.photoURL || dbUser.photoKey || dbUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
            cover: dbUser.coverURL || dbUser.coverKey || dbUser.cover || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
            bio: dbUser.bio || "Sharing stories and digital memories on Spoken Odyssey.",
            birthDate: dbUser.birthDate || "",
            location: dbUser.location || "",
            profession: dbUser.profession || "",
            followersCount: dbUser.followersCount || 0,
            storiesCount: Array.isArray(dbMemories) ? dbMemories.length : 0,
            milestonesCount: Array.isArray(dbMemories) ? dbMemories.filter(m => String(m.type).toLowerCase() === "milestone" || (m.tags && m.tags.includes("milestone"))).length : 0,
            isFollowing: !!dbUser.isFollowing
          });
          setIsFollowing(!!dbUser.isFollowing);
          setFollowersCount(dbUser.followersCount || 0);

          // Real DB Memories / Stories
          if (Array.isArray(dbMemories)) {
            setStories(dbMemories);
            
            // Extract milestones from DB memories
            const dbMs = dbMemories.filter(m => String(m.type).toLowerCase() === "milestone" || (m.tags && m.tags.includes("milestone"))).map((m, idx) => ({
              id: m.id || `ms-${idx}`,
              category: (m.tags && m.tags[0]) ? m.tags[0].toUpperCase() : "CAREER",
              year: m.date ? new Date(m.date).getFullYear().toString() : "2024",
              title: m.title,
              description: m.description,
              iconType: idx % 2 === 0 ? "award" : "star"
            }));
            setMilestones(dbMs);

            const initialReactMap = {};
            const initialCountMap = {};
            dbMemories.forEach(m => {
              initialReactMap[m.id] = m.userReaction || null;
              initialCountMap[m.id] = m.totalReactions ?? m.likes ?? 0;
            });
            setUserReactionMap(initialReactMap);
            setReactionsCountMap(initialCountMap);
          } else {
            setStories([]);
            setMilestones([]);
          }

          // Real DB Albums
          if (Array.isArray(dbAlbums)) {
            setAlbums(dbAlbums);
          } else {
            setAlbums([]);
          }

        } else if (mockPerson) {
          // ====================================================
          // FEATURED HISTORICAL FIGURE (e.g., Grace Hopper)
          // ====================================================
          setPerson(mockPerson);
          setIsFollowing(mockPerson.isFollowing || false);
          setFollowersCount(mockPerson.followersCount || 45200);
          setStories(mockPerson.stories || []);
          setMilestones(mockPerson.milestones || []);
          setAlbums(mockPerson.albums || []);

          const initialReactMap = {};
          const initialCountMap = {};
          (mockPerson.stories || []).forEach(m => {
            initialReactMap[m.id] = null;
            initialCountMap[m.id] = m.likes || 0;
          });
          setUserReactionMap(initialReactMap);
          setReactionsCountMap(initialCountMap);
        } else {
          // ====================================================
          // FALLBACK DEFAULT FOR UNKNOWN ID
          // ====================================================
          setPerson({
            id: id || "unknown",
            name: "Odyssey Creator",
            role: "Member",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
            cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
            bio: "Spoken Odyssey Member",
            followersCount: 0,
            storiesCount: 0,
            milestonesCount: 0,
            isFollowing: false
          });
          setStories([]);
          setMilestones([]);
          setAlbums([]);
        }
      } catch (err) {
        console.error("Error loading user profile details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPersonData();
  }, [id, isAuthenticated, firebaseUser, getToken]);

  // Handle Follow / Unfollow Toggle
  const handleFollowToggle = async () => {
    if (!person) return;
    const targetId = person.id;
    const nextState = !isFollowing;
    const nextCount = nextState ? followersCount + 1 : Math.max(0, followersCount - 1);

    setIsFollowing(nextState);
    setFollowersCount(nextCount);
    setIsFollowLoading(true);

    try {
      if (isAuthenticated && firebaseUser) {
        const token = await getToken();
        if (isFollowing) {
          await unfollowUser(token, targetId);
        } else {
          await followUser(token, targetId);
        }
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      setIsFollowing(isFollowing);
      setFollowersCount(followersCount);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Handle Story Like Toggle
  const handleLikeToggle = async (e, story) => {
    e.stopPropagation();
    const storyId = story.id;
    const currentReaction = userReactionMap[storyId] || (story.userReaction ? "heart" : null);
    const isLiked = !!currentReaction;
    const nextReaction = isLiked ? null : "heart";
    const currentCount = reactionsCountMap[storyId] ?? story.likes ?? 0;
    const newCount = isLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    setUserReactionMap(prev => ({ ...prev, [storyId]: nextReaction }));
    setReactionsCountMap(prev => ({ ...prev, [storyId]: newCount }));

    try {
      if (isAuthenticated && firebaseUser) {
        const token = await getToken();
        const resData = await reactToMemory(token, storyId, "heart");
        if (resData) {
          const finalReaction = resData.userReaction !== undefined ? resData.userReaction : nextReaction;
          const finalTotal = resData.totalReactions ?? resData.likes ?? newCount;
          setUserReactionMap(prev => ({ ...prev, [storyId]: finalReaction }));
          setReactionsCountMap(prev => ({ ...prev, [storyId]: finalTotal }));
        }
      }
    } catch (err) {
      console.error("Failed to react to story:", err);
      setUserReactionMap(prev => ({ ...prev, [storyId]: currentReaction }));
      setReactionsCountMap(prev => ({ ...prev, [storyId]: currentCount }));
    }
  };

  // Open MemoryViewModal Popup
  const handleOpenMemoryModal = (story) => {
    window.dispatchEvent(
      new CustomEvent("openMemoryView", {
        detail: { ...story, date: story.date || "Public Story" },
      })
    );
  };

  if (isLoading) {
    return (
      <WavesBackground>
        <div className="w-full relative pb-24 min-h-screen">
          <DashboardHeader />
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={40} className="animate-spin text-[#4A3AFF] mb-4" />
            <p className="text-stone-500 font-bold uppercase tracking-wide text-[13px]">Loading Profile...</p>
          </div>
        </div>
      </WavesBackground>
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

        {/* Master Alignment Wrapper */}
        <div className="w-full mt-2 md:mt-6 px-4 md:px-8 max-w-6xl mx-auto flex flex-col">
          
          {/* Back Button Bar */}
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-full text-[14px] font-bold text-stone-700 hover:text-stone-900 transition-all shadow-sm"
            >
              <ArrowLeft size={16} />
              Back to Discover
            </button>
          </div>

          {/* ====================================================
              HEADER PROFILE CARD (Exact Figma Layout with 3D Inset Shadow)
              ==================================================== */}
          {person && (
            <motion.div variants={fadeInUp} className="figma-card w-full rounded-[24px] overflow-hidden mb-8 relative">
              
              {/* Cover Banner (h-[200px] md:h-[240px]) */}
              <div className="w-full h-[200px] md:h-[240px] relative overflow-hidden">
                {person.cover ? (
                  <img
                    src={person.cover}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#4A3AFF] via-[#6366F1] to-[#818CF8] opacity-90 shadow-inner" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Overlapping Avatar Circle */}
              <div className="absolute top-[140px] md:top-[170px] left-6 md:left-8 w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden shadow-lg z-10 bg-white">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Body (Below Cover) */}
              <div className="pt-12 md:pt-14 px-6 md:px-8 pb-6 flex flex-col">
                
                {/* Top Row: Name/Role + Follow Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[26px] md:text-[34px] font-bold text-stone-900 tracking-tight leading-tight mb-1">
                      {person.name}
                    </h1>
                    <p className="text-[15px] font-medium text-stone-500">
                      {person.location && person.profession 
                        ? `${person.location} · ${person.profession}` 
                        : person.location || person.profession || person.role}
                    </p>
                    {person.birthDate && (
                      <p className="text-[13px] font-semibold text-stone-500 mt-1 flex items-center gap-1.5">
                        <span>🎂 Born {new Date(person.birthDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>
                      </p>
                    )}
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm self-start sm:self-auto ${
                      isFollowing
                        ? "bg-stone-200 text-stone-800 hover:bg-stone-300"
                        : "bg-[#4A3AFF] text-white hover:bg-[#3b2bee] shadow-md"
                    }`}
                  >
                    {isFollowLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck size={16} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Follow
                      </>
                    )}
                  </button>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-stone-200/80 my-5" />

                {/* Stats Line */}
                <div className="flex flex-wrap items-center gap-6 text-[15px] text-stone-500 font-medium">
                  <div>
                    <strong className="text-stone-900 font-bold">{followersCount.toLocaleString()}</strong> followers
                  </div>
                  <div>
                    <strong className="text-stone-900 font-bold">{stories.length}</strong> stories
                  </div>
                  <div>
                    <strong className="text-stone-900 font-bold">{milestones.length}</strong> milestones
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ====================================================
              PALL-STYLE TABS SELECTOR (Stories, Milestones, Albums)
              ==================================================== */}
          <motion.div variants={fadeInUp} className="w-full mb-8">
            <div className="w-full bg-white/70 backdrop-blur-md border border-white/80 rounded-full p-1.5 flex items-center shadow-sm">
              <button
                onClick={() => setActiveTab("stories")}
                className={`flex-1 py-3 px-6 rounded-full text-[15px] font-bold transition-all text-center ${
                  activeTab === "stories"
                    ? "bg-[#4A3AFF] text-white shadow-md"
                    : "bg-transparent text-stone-600 hover:text-stone-900 font-semibold"
                }`}
              >
                Stories
              </button>
              <button
                onClick={() => setActiveTab("milestones")}
                className={`flex-1 py-3 px-6 rounded-full text-[15px] font-bold transition-all text-center ${
                  activeTab === "milestones"
                    ? "bg-[#4A3AFF] text-white shadow-md"
                    : "bg-transparent text-stone-600 hover:text-stone-900 font-semibold"
                }`}
              >
                Milestones
              </button>
              <button
                onClick={() => setActiveTab("albums")}
                className={`flex-1 py-3 px-6 rounded-full text-[15px] font-bold transition-all text-center ${
                  activeTab === "albums"
                    ? "bg-[#4A3AFF] text-white shadow-md"
                    : "bg-transparent text-stone-600 hover:text-stone-900 font-semibold"
                }`}
              >
                Albums
              </button>
            </div>
          </motion.div>

          {/* ====================================================
              TAB 1: STORIES VIEW (Exact Figma 3-Column Grid)
              ==================================================== */}
          {activeTab === "stories" && (
            stories.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-md rounded-[24px] border border-white/80">
                <Inbox size={44} className="text-stone-300 mb-3" />
                <h3 className="text-[17px] font-bold text-stone-800 mb-1">No Public Stories Yet</h3>
                <p className="text-stone-500 text-[14px] font-medium text-center max-w-sm">
                  This user has not published any public stories yet.
                </p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {stories.map((story) => {
                  const mediaSources = getMemoryMediaSources(story);
                  const normType = String(story.type || "").toLowerCase();
                  const isVoice = normType === "voice" || normType === "audio" || !!story.audioUrl || !!story.audio;
                  const isVideo = !isVoice && (normType === "video" || !!mediaSources.video);
                  const isWritten = !isVideo && !isVoice && (normType === "written" || normType === "text" || normType === "thought" || !mediaSources.items.length);
                  const isPhoto = !isVoice && !isVideo && !isWritten;

                  const currentReact = userReactionMap[story.id] || (story.userReaction ? "heart" : null);
                  const isLiked = !!currentReact;
                  const likeCount = reactionsCountMap[story.id] ?? story.totalReactions ?? story.likes ?? 0;

                  const dateBadgeText = (isVoice ? "VOICE " : isVideo ? "VIDEO " : isWritten ? "WRITTEN " : "PHOTO ") + 
                    (story.date || (story.createdAt ? new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jul 27, 2026"));

                  const displayTags = (story.tags || ["story"]).slice(0, 3);

                  return (
                    <motion.div
                      variants={fadeInUp}
                      key={story.id}
                      onClick={() => handleOpenMemoryModal(story)}
                      className="figma-card flex flex-col overflow-hidden group cursor-pointer h-full"
                    >
                      {/* Media Header depending on type */}
                      {isVideo && (
                        <div className="w-full h-[180px] overflow-hidden shrink-0 relative border-b border-[#C7D2FE]/50 bg-stone-900" onClick={(e) => e.stopPropagation()}>
                          {mediaSources.items.length > 0 ? (
                            <CardMediaSlider mediaItems={mediaSources.items} title={story.title} />
                          ) : (
                            <div className="relative w-full h-full">
                              <img 
                                src={normalizeMediaUrl(story.mediaUrl || story.image) || "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?q=80&w=600&auto=format&fit=crop"} 
                                alt={story.title} 
                                className="w-full h-full object-cover opacity-80" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
                                  <Play size={22} fill="currentColor" className="ml-0.5" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {isPhoto && (
                        <div className="w-full h-[190px] relative overflow-hidden bg-stone-200 border-b border-[#C7D2FE]/40" onClick={(e) => e.stopPropagation()}>
                          {mediaSources.items.length > 0 ? (
                            <CardMediaSlider mediaItems={mediaSources.items} title={story.title} />
                          ) : (
                            <img 
                              src={normalizeMediaUrl(story.mediaUrl || story.image) || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"} 
                              alt={story.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                          )}
                        </div>
                      )}

                      {/* Card Content Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        
                        {/* Author Profile Bar */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={story.ownerAvatarUrl || story.authorAvatar || person.avatar}
                              alt={story.ownerDisplayName || story.authorName || person.name}
                              className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            />
                            <div>
                              <h4 className="text-[13px] font-bold text-stone-800 leading-tight">
                                {story.ownerDisplayName || story.authorName || person.name}
                              </h4>
                              <p className="text-[11px] font-bold text-stone-500 tracking-wide uppercase">
                                {dateBadgeText}
                              </p>
                            </div>
                          </div>

                          {/* Heart Reaction Button */}
                          <button
                            onClick={(e) => handleLikeToggle(e, story)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold transition-all ${
                              isLiked ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-500"
                            }`}
                          >
                            <Heart
                              size={15}
                              className={isLiked ? "fill-rose-500 text-rose-500" : "text-stone-400"}
                            />
                            <span>{likeCount}</span>
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-[17px] font-bold text-stone-900 mb-2 leading-snug group-hover:text-[#4A3AFF] transition-colors">
                          {story.title}
                        </h3>

                        {/* Voice Player Embed for Voice Memories */}
                        {isVoice && (
                          <div className="mb-4 w-full" onClick={(e) => e.stopPropagation()}>
                            <VoicePlayer memory={story} />
                          </div>
                        )}

                        {/* Written Memory Box */}
                        {isWritten && (
                          <div className="p-4 bg-[#F4F6FF] rounded-xl border border-[#D1D9FF]/60 mb-4">
                            <p className="text-[14px] text-stone-700 font-medium italic line-clamp-3 leading-relaxed">
                              "{story.description}"
                            </p>
                          </div>
                        )}

                        {/* Description Snippet for non-written */}
                        {!isWritten && (
                          <p className="text-[14px] text-stone-600 line-clamp-2 mb-4 font-medium leading-relaxed flex-grow">
                            {story.description}
                          </p>
                        )}

                        {/* Card Footer: Hashtags */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#C7D2FE]/40 mt-auto">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {displayTags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#4A3AFF] text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md uppercase tracking-wider"
                              >
                                #{tag.replace(/^#/, "")}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          )}

          {/* ====================================================
              TAB 2: MILESTONES VIEW (Vertical Timeline Figma Design)
              ==================================================== */}
          {activeTab === "milestones" && (
            milestones.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-md rounded-[24px] border border-white/80">
                <Award size={44} className="text-stone-300 mb-3" />
                <h3 className="text-[17px] font-bold text-stone-800 mb-1">No Milestones Recorded</h3>
                <p className="text-stone-500 text-[14px] font-medium text-center max-w-sm">
                  There are no documented milestones for this profile yet.
                </p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} className="w-full relative pl-10 md:pl-14 flex flex-col gap-8">
                
                {/* Vertical Timeline Axis Line */}
                <div className="absolute left-[20px] md:left-[27px] top-6 bottom-6 w-[2px] bg-[#4A3AFF]/20" />

                {milestones.map((ms) => (
                  <motion.div variants={fadeInUp} key={ms.id} className="relative w-full">
                    
                    {/* Circular Icon Node */}
                    <div className="absolute -left-[40px] md:-left-[54px] top-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#4A3AFF] bg-white shadow-sm flex items-center justify-center text-[#4A3AFF] z-10">
                      {ms.iconType === "star" ? (
                        <Star size={18} />
                      ) : ms.iconType === "briefcase" ? (
                        <Briefcase size={18} />
                      ) : (
                        <Award size={18} />
                      )}
                    </div>

                    {/* Milestone Glass Card */}
                    <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-[20px] p-6 shadow-sm flex flex-col">
                      
                      {/* Top Header Line: Category Pill + Year */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-[#4A3AFF]/10 text-[#4A3AFF] font-bold text-[12px] uppercase tracking-wider px-3 py-1 rounded-md">
                          {ms.category || "HONOR"}
                        </span>
                        <span className="text-stone-400 font-bold text-[15px]">
                          {ms.year}
                        </span>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="text-[20px] font-bold text-stone-900 mb-2 leading-snug">
                        {ms.title}
                      </h3>

                      {/* Description Paragraph */}
                      <p className="text-[15px] text-stone-600 font-medium leading-relaxed">
                        {ms.description}
                      </p>

                    </div>

                  </motion.div>
                ))}

              </motion.div>
            )
          )}

          {/* ====================================================
              TAB 3: ALBUMS VIEW
              ==================================================== */}
          {activeTab === "albums" && (
            albums.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-md rounded-[24px] border border-white/80">
                <Folder size={44} className="text-stone-300 mb-3" />
                <h3 className="text-[17px] font-bold text-stone-800 mb-1">No Albums Found</h3>
                <p className="text-stone-500 text-[14px] font-medium text-center max-w-sm">
                  This user has not created any public albums yet.
                </p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {albums.map((album) => (
                  <motion.div
                    variants={fadeInUp}
                    key={album.id}
                    className="bg-white/80 backdrop-blur-md border border-white/90 rounded-[22px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
                  >
                    <div className="w-full h-[180px] relative overflow-hidden bg-stone-200">
                      <img
                        src={album.coverImage || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop"}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-[#4A3AFF]/10 text-[#4A3AFF] font-bold text-[12px] px-3 py-1 rounded-full">
                          {album.entries || 0} entries
                        </span>
                        <span className="text-[12px] font-semibold text-stone-400">
                          {album.privacy || "Public"}
                        </span>
                      </div>

                      <h3 className="text-[18px] font-bold text-stone-900 mb-1 leading-snug group-hover:text-[#4A3AFF] transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-[13px] text-stone-500 font-medium">
                        {album.subtitle || "Family Memory Archive"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}

        </div>
      </motion.div>
    </WavesBackground>
  );
}
