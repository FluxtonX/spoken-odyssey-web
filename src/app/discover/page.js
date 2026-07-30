"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { Search, Loader2, Headphones, Heart, UserPlus, UserCheck, Inbox, Mic, FileText, Image as ImageIcon, Film, Play, Lock } from "lucide-react";
import { getDiscoveryMemories, getFeaturedPeople, followUser, unfollowUser, reactToMemory, normalizeMediaUrl } from "@/services/backend";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";

const FILTER_PILLS = [
  "All Stories", "Family", "Immigration", "Heritage", "Love", "Career", "Loss", "Adventure"
];

const formatDateSafely = (dateVal) => {
  if (!dateVal) return "Public Memory";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "Public Memory";
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

  const firstVideo = items.find((item) => item.type === "video")?.url;
  const firstImage = items.find((item) => item.type === "image")?.url;
  return { items, video: firstVideo, image: firstImage };
};

export default function DiscoverPage() {
  const router = useRouter();
  const { firebaseUser, isAuthenticated, getToken } = useAuth();
  
  // Tab state: "latest-stories" vs "featured-people"
  const [activeTab, setActiveTab] = useState("latest-stories");
  const [activeFilter, setActiveFilter] = useState("All Stories");
  
  // Search state & Debounce state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Real Database Records (100% PostgreSQL Hydration)
  const [dbMemoriesList, setDbMemoriesList] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  
  // Follow State maps
  const [followingMap, setFollowingMap] = useState({});
  const [followersCountMap, setFollowersCountMap] = useState({});
  const [followLoadingMap, setFollowLoadingMap] = useState({});

  // Reactions & Likes Map
  const [reactionsCountMap, setReactionsCountMap] = useState({});
  const [userReactionMap, setUserReactionMap] = useState({});

  // 350ms Search Debounce Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Listen for memoryReactionUpdated event dispatched from MemoryViewModal or other components
  useEffect(() => {
    const handleReactionUpdate = (e) => {
      const { memoryId, userReaction, totalReactions } = e.detail || {};
      if (memoryId) {
        setReactionsCountMap(prev => ({
          ...prev,
          [memoryId]: totalReactions,
        }));
        setUserReactionMap(prev => ({
          ...prev,
          [memoryId]: userReaction || null,
        }));
      }
    };

    window.addEventListener("memoryReactionUpdated", handleReactionUpdate);
    return () => window.removeEventListener("memoryReactionUpdated", handleReactionUpdate);
  }, []);

  // Main Data Hydration from PostgreSQL Database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        let token = null;
        if (isAuthenticated && firebaseUser) {
          try {
            token = await getToken();
          } catch (tErr) {
            console.warn("Token fetch warning:", tErr);
          }
        }

        if (activeTab === "latest-stories") {
          // Fetch Real Public Memories from Database
          const categoryFilter = activeFilter !== "All Stories" ? activeFilter : "";
          const data = await getDiscoveryMemories(token, "public", categoryFilter, debouncedQuery);
          
          if (Array.isArray(data)) {
            setDbMemoriesList(data);
            const initialReactions = {};
            const initialLiked = {};
            data.forEach(m => {
              initialReactions[m.id] = m.totalReactions ?? m.likes ?? 0;
              initialLiked[m.id] = m.userReaction || null;
            });
            setReactionsCountMap(prev => ({ ...prev, ...initialReactions }));
            setUserReactionMap(prev => ({ ...prev, ...initialLiked }));
          } else {
            setDbMemoriesList([]);
          }
        } else {
          // Fetch Real Database Users
          const categoryFilter = activeFilter !== "All Stories" ? activeFilter : "";
          const dbUsers = await getFeaturedPeople(token, categoryFilter, debouncedQuery);
          
          if (Array.isArray(dbUsers)) {
            setPeopleList(dbUsers);
            const initialFollowMap = {};
            const initialCountMap = {};
            dbUsers.forEach(u => {
              initialFollowMap[u.id] = u.isFollowing || false;
              initialCountMap[u.id] = u.followersCount || 0;
            });
            setFollowingMap(prev => ({ ...initialFollowMap, ...prev }));
            setFollowersCountMap(prev => ({ ...initialCountMap, ...prev }));
          } else {
            setPeopleList([]);
          }
        }
      } catch (err) {
        console.error("Discover Database API Error:", err);
        setDbMemoriesList([]);
        setPeopleList([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, firebaseUser, activeTab, activeFilter, debouncedQuery]);

  // Handle follow / unfollow button toggle with API persistence
  const handleFollowToggle = async (e, person) => {
    e.stopPropagation();
    const personId = person.id;
    const currentlyFollowing = followingMap[personId] ?? person.isFollowing ?? false;
    const currentCount = followersCountMap[personId] ?? person.followersCount ?? 0;

    setFollowingMap(prev => ({ ...prev, [personId]: !currentlyFollowing }));
    setFollowersCountMap(prev => ({
      ...prev,
      [personId]: currentlyFollowing ? Math.max(0, currentCount - 1) : currentCount + 1,
    }));
    setFollowLoadingMap(prev => ({ ...prev, [personId]: true }));

    try {
      if (isAuthenticated && firebaseUser) {
        const token = await getToken();
        if (currentlyFollowing) {
          await unfollowUser(token, personId);
        } else {
          await followUser(token, personId);
        }
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      setFollowingMap(prev => ({ ...prev, [personId]: currentlyFollowing }));
      setFollowersCountMap(prev => ({ ...prev, [personId]: currentCount }));
    } finally {
      setFollowLoadingMap(prev => ({ ...prev, [personId]: false }));
    }
  };

  // Handle Memory Reaction / Like Toggle via Backend API
  const handleReactionToggle = async (e, story) => {
    e.stopPropagation();
    const memoryId = story.id;
    const currentReaction = userReactionMap[memoryId] || (story.userReaction ? "heart" : null);
    const isLiked = !!currentReaction;
    const nextReaction = isLiked ? null : "heart";
    const currentCount = reactionsCountMap[memoryId] ?? story.totalReactions ?? story.likes ?? 0;
    const newCount = isLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    // Optimistic UI update
    setUserReactionMap(prev => ({ ...prev, [memoryId]: nextReaction }));
    setReactionsCountMap(prev => ({ ...prev, [memoryId]: newCount }));

    try {
      if (isAuthenticated && firebaseUser) {
        const token = await getToken();
        const resData = await reactToMemory(token, memoryId, "heart");
        if (resData) {
          const finalReaction = resData.userReaction !== undefined ? resData.userReaction : nextReaction;
          const finalTotal = resData.totalReactions ?? resData.likes ?? newCount;
          setUserReactionMap(prev => ({ ...prev, [memoryId]: finalReaction }));
          setReactionsCountMap(prev => ({ ...prev, [memoryId]: finalTotal }));
        }
      }
    } catch (err) {
      console.error("Failed to persist memory reaction, rolling back:", err);
      setUserReactionMap(prev => ({ ...prev, [memoryId]: currentReaction }));
      setReactionsCountMap(prev => ({ ...prev, [memoryId]: currentCount }));
    }
  };

  const formatFollowers = (count) => {
    if (count === undefined || count === null) return "0 followers";
    if (typeof count === "number") {
      return `${count.toLocaleString()} followers`;
    }
    return `${count} followers`;
  };

  // Open MemoryViewModal Popup
  const handleOpenMemoryModal = (e, story) => {
    e.stopPropagation();
    const dateStr = formatDateSafely(story.date || story.createdAt || story.occurredAt);
    window.dispatchEvent(
      new CustomEvent("openMemoryView", {
        detail: { ...story, date: dateStr },
      })
    );
  };

  // Dynamic Featured Story Hero Banner from Database Top Record
  const heroStory = dbMemoriesList.length > 0 ? dbMemoriesList[0] : null;

  // Grid Stories from Database
  const gridStoriesList = dbMemoriesList.length > 1 ? dbMemoriesList.slice(1) : dbMemoriesList;

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
          
          {/* Header Title */}
          <motion.div variants={fadeInUp} className="flex flex-col mb-6">
            <h1 className="text-[32px] md:text-[40px] font-semibold text-stone-900 tracking-tight leading-tight mb-2">Discover</h1>
            <p className="text-stone-500 font-medium text-[15px] mb-6">
              Explore extraordinary lives, shared publicly
            </p>
            
            {/* Search Input */}
            <div className="relative w-full mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search stories, authors, keywords, hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/70 backdrop-blur-md border border-white/80 rounded-full text-[15px] font-medium text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]/20 transition-all shadow-sm"
              />
            </div>

            {/* Dual-Tab Selector */}
            <div className="w-full mb-8">
              <div className="w-full bg-white/70 backdrop-blur-md border border-white/80 rounded-full p-1.5 flex items-center shadow-sm">
                <button
                  onClick={() => setActiveTab("latest-stories")}
                  className={`flex-1 py-3.5 px-6 rounded-full text-[15px] font-bold transition-all text-center ${
                    activeTab === "latest-stories"
                      ? "bg-[#4A3AFF] text-white shadow-md"
                      : "bg-transparent text-[#4A3AFF] hover:text-stone-900 font-semibold"
                  }`}
                >
                  Latest Stories
                </button>
                <button
                  onClick={() => setActiveTab("featured-people")}
                  className={`flex-1 py-3.5 px-6 rounded-full text-[15px] font-bold transition-all text-center ${
                    activeTab === "featured-people"
                      ? "bg-[#4A3AFF] text-white shadow-md"
                      : "bg-transparent text-[#4A3AFF] hover:text-stone-900 font-semibold"
                  }`}
                >
                  Featured People
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filter Pills Bar */}
          <motion.div variants={fadeInUp} className="w-full flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-2">
            {FILTER_PILLS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-[14px] font-bold transition-all ${
                  activeFilter === filter
                    ? "bg-transparent border-2 border-[#4A3AFF] text-[#4A3AFF]"
                    : "bg-white/70 backdrop-blur-md border border-transparent text-stone-500 hover:text-stone-800 shadow-sm"
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#4A3AFF] mb-4" />
              <p className="text-stone-500 font-bold tracking-wide uppercase text-[12px]">Fetching Real Database Records...</p>
            </div>
          ) : activeTab === "featured-people" ? (
            /* ==========================================
               TAB 1: FEATURED PEOPLE VIEW
               ========================================== */
            peopleList.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 figma-card rounded-[24px]">
                <Inbox size={48} className="text-stone-300 mb-4" />
                <h3 className="text-[18px] font-bold text-stone-800 mb-1">No Featured Authors Found</h3>
                <p className="text-stone-500 text-[14px] font-medium text-center max-w-md">
                  {debouncedQuery 
                    ? `No registered database users match "${debouncedQuery}".`
                    : "No registered database users exist right now."}
                </p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
                {peopleList.map((person) => {
                  const isFollowing = followingMap[person.id] ?? person.isFollowing ?? false;
                  const followersCount = followersCountMap[person.id] ?? person.followersCount ?? 0;
                  const isBtnLoading = followLoadingMap[person.id] || false;

                  return (
                    <motion.div
                      variants={fadeInUp}
                      key={person.id}
                      onClick={() => router.push(`/people/${person.id}`)}
                      className="figma-card flex flex-col overflow-hidden group cursor-pointer"
                    >
                      {/* Minimized Cover Image Height (h-[95px] md:h-[105px]) */}
                      <div className="w-full h-[95px] md:h-[105px] relative overflow-hidden bg-stone-200">
                        <img
                          src={person.coverURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"}
                          alt={person.displayName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Card Body with Overlapping Avatar */}
                      <div className="px-6 md:px-8 pb-6 flex flex-col flex-grow relative">
                        <div className="relative -mt-10 md:-mt-12 mb-3 shrink-0">
                          <img
                            src={person.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                            alt={person.displayName}
                            className="w-18 h-18 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-md bg-stone-100"
                          />
                        </div>

                        <h2 className="text-[20px] md:text-[22px] font-semibold text-stone-900 tracking-tight leading-snug mb-0.5">
                          {person.displayName || person.email?.split("@")[0] || "User Author"}
                        </h2>
                        <p className="text-[13px] md:text-[14px] font-bold text-stone-500 mb-3">
                          {person.profession || person.location || "Featured Author"}
                        </p>

                        <p className="text-[14px] font-medium text-stone-600 leading-relaxed mb-5 line-clamp-2">
                          {person.bio || "Sharing life stories, memories, and wisdom publicly."}
                        </p>

                        <div className="mt-auto border-t border-[#C7D2FE]/50 pt-4 flex items-center justify-between">
                          <span className="text-[14px] font-bold text-stone-900">
                            {formatFollowers(followersCount)}
                          </span>

                          <button
                            onClick={(e) => handleFollowToggle(e, person)}
                            disabled={isBtnLoading}
                            className={`px-5 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                              isFollowing
                                ? "bg-stone-200 text-stone-800 hover:bg-stone-300 border border-stone-300"
                                : "bg-[#4A3AFF] text-white hover:bg-[#3b2ee0]"
                            }`}
                          >
                            {isBtnLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : isFollowing ? (
                              <>
                                <UserCheck size={15} />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus size={15} />
                                Follow
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          ) : (
            /* ==========================================
               TAB 2: LATEST STORIES VIEW
               ========================================== */
            dbMemoriesList.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 figma-card rounded-[24px]">
                <Inbox size={48} className="text-stone-300 mb-4" />
                <h3 className="text-[18px] font-bold text-stone-800 mb-1">No Public Stories Found</h3>
                <p className="text-stone-500 text-[14px] font-medium text-center max-w-md">
                  {debouncedQuery 
                    ? `No public database stories match "${debouncedQuery}".`
                    : "No public stories have been published to the database yet."}
                </p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} className="flex flex-col gap-8 w-full">
                
                {/* 100% Dynamic Featured Hero Story Banner Card */}
                {heroStory && (
                  <motion.div 
                    variants={fadeInUp} 
                    onClick={(e) => handleOpenMemoryModal(e, heroStory)}
                    className="w-full flex flex-col md:flex-row rounded-[24px] overflow-hidden shadow-lg border border-white/40 bg-[#4A3AFF] min-h-[360px] cursor-pointer hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Left Side: Content */}
                    <div className="w-full md:w-[55%] p-8 md:p-10 lg:p-12 flex flex-col justify-center text-white relative z-10">
                      <div className="text-[11px] font-bold tracking-widest text-white/80 uppercase mb-8 flex items-center gap-2">
                        <span>Featured Story</span>
                        {heroStory.type === "Voice" && <Mic size={14} />}
                        {heroStory.type === "Video" && <Film size={14} />}
                        {heroStory.type === "Written" && <FileText size={14} />}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <img 
                          src={heroStory.ownerAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} 
                          alt={heroStory.ownerDisplayName || "Author"} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] leading-tight">{heroStory.ownerDisplayName || "Spoken Odyssey Author"}</span>
                          <span className="text-[12px] text-white/70">{formatDateSafely(heroStory.date || heroStory.createdAt)}</span>
                        </div>
                      </div>

                      <h2 className="text-[28px] md:text-[36px] font-semibold leading-tight mb-4 text-white tracking-tight group-hover:text-white/95 transition-colors">
                        {heroStory.title}
                      </h2>
                      <p className="text-[15px] text-white/90 font-medium mb-8 max-w-md leading-relaxed line-clamp-3">
                        {heroStory.description || "Public memory published on Spoken Odyssey."}
                      </p>

                      {/* Render Maximum 3 Hashtags ONLY */}
                      {Array.isArray(heroStory.tags) && heroStory.tags.filter(Boolean).length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          {heroStory.tags.filter(Boolean).slice(0, 3).map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/20 rounded-md text-[12px] font-bold tracking-wide">
                              #{tag.replace(/^#/, "")}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4">
                        <button 
                          onClick={(e) => handleOpenMemoryModal(e, heroStory)}
                          className="flex items-center gap-2 bg-white text-[#4A3AFF] px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-stone-50 transition-colors shadow-sm cursor-pointer"
                        >
                          {heroStory.type === "Voice" ? <Headphones size={16} /> : <FileText size={16} />}
                          View Memory
                        </button>
                        <span className="text-[13px] font-medium text-white/80">
                          {reactionsCountMap[heroStory.id] ?? heroStory.totalReactions ?? heroStory.likes ?? 0} reactions
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Media Banner */}
                    <div className="w-full md:w-[45%] h-[250px] md:h-auto relative bg-stone-900">
                      <img 
                        src={heroStory.mediaUrl || "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1200&auto=format&fit=crop"} 
                        alt="Featured" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4A3AFF] to-transparent md:hidden" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4A3AFF] via-[#4A3AFF]/20 to-transparent hidden md:block" />
                    </div>
                  </motion.div>
                )}

                {/* Grid Stories: Type-Specific Figma Glass Cards */}
                {gridStoriesList.length > 0 && (
                  <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {gridStoriesList.map(story => {
                      const normType = (story.type || "").toLowerCase();
                      const isVoice = normType === "voice" || normType === "audio" || !!story.audioUrl || !!story.audio;
                      const mediaSources = isVoice ? { items: [], video: null, image: null } : getMemoryMediaSources(story);
                      const isVideo = !isVoice && (normType === "video" || !!mediaSources.video);
                      const isWritten = !isVideo && !isVoice && (normType === "written" || normType === "text" || normType === "thought" || !mediaSources.items.length);
                      const dateStr = formatDateSafely(story.date || story.createdAt || story.occurredAt);

                      const displayHashtags = Array.isArray(story.tags) ? story.tags.filter(Boolean).slice(0, 3) : [];
                      const reactionCount = reactionsCountMap[story.id] ?? story.totalReactions ?? story.likes ?? 0;
                      const userReactType = userReactionMap[story.id] || (story.userReaction ? "heart" : null);
                      const isLiked = !!userReactType;

                      /* Reusable Author Profile Header */
                      const AuthorHeader = () => (
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={story.ownerAvatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"} 
                              alt={story.ownerDisplayName || "Author"} 
                              className="w-9 h-9 rounded-full object-cover border border-white shadow-sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-[13px] text-stone-900 leading-tight">
                                {story.ownerDisplayName || "Author"}
                              </span>
                              <span className="text-[11px] text-stone-500 font-medium">{dateStr}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAEBFF]/60 border border-[#C7D2FE]/60">
                            {isVoice ? <Mic size={13} className="text-[#f59e0b]" /> :
                             isVideo ? <Film size={13} className="text-[#ec4899]" /> :
                             isWritten ? <FileText size={13} className="text-[#10b981]" /> :
                             <ImageIcon size={13} className="text-[#3b82f6]" />}
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-700">
                              {isVoice ? "VOICE" : isVideo ? "VIDEO" : isWritten ? "WRITTEN" : "PHOTO"}
                            </span>
                          </div>
                        </div>
                      );

                      /* ----------------------------------
                         1. VOICE MEMORY CARD LAYOUT
                         ---------------------------------- */
                      if (isVoice) {
                        return (
                          <motion.div
                            variants={fadeInUp}
                            key={story.id}
                            onClick={(e) => handleOpenMemoryModal(e, story)}
                            className="figma-card flex flex-col overflow-hidden group cursor-pointer h-full p-6"
                          >
                            <AuthorHeader />

                            <h3 className="text-[18px] font-semibold text-stone-900 leading-tight mb-2 tracking-tight group-hover:text-[#4A3AFF] transition-colors">
                              {story.title}
                            </h3>
                            <p className="text-[14px] text-stone-600 font-medium leading-relaxed mb-4 line-clamp-2">
                              {story.description || "Voice recording memory."}
                            </p>

                            <div className="mb-4 w-full" onClick={(e) => e.stopPropagation()}>
                              <VoicePlayer memory={story} />
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#C7D2FE]/40">
                              {displayHashtags.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {displayHashtags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-[#4A3AFF] text-white rounded-md text-[11px] font-bold tracking-wide">
                                      #{tag.replace(/^#/, "")}
                                    </span>
                                  ))}
                                </div>
                              ) : <div />}

                              <button 
                                onClick={(e) => handleReactionToggle(e, story)}
                                className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer ${
                                  isLiked ? "text-[#ef4444]" : "text-stone-500 hover:text-[#ef4444]"
                                }`}
                              >
                                <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                                {reactionCount}
                              </button>
                            </div>
                          </motion.div>
                        );
                      }

                      /* ----------------------------------
                         2. VIDEO MEMORY CARD LAYOUT
                         ---------------------------------- */
                      if (isVideo) {
                        return (
                          <motion.div
                            variants={fadeInUp}
                            key={story.id}
                            onClick={(e) => handleOpenMemoryModal(e, story)}
                            className="figma-card flex flex-col overflow-hidden group cursor-pointer h-full"
                          >
                            <div className="w-full h-[180px] overflow-hidden shrink-0 relative border-b border-[#C7D2FE]/50 bg-stone-900">
                              {mediaSources.items.length > 0 ? (
                                <CardMediaSlider mediaItems={mediaSources.items} title={story.title} />
                              ) : (
                                <div className="relative w-full h-full">
                                  <img 
                                    src={story.mediaUrl || "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?q=80&w=600&auto=format&fit=crop"} 
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

                            <div className="p-6 flex flex-col grow">
                              <AuthorHeader />

                              <h3 className="text-[18px] font-semibold text-stone-900 leading-tight mb-2 tracking-tight group-hover:text-[#4A3AFF] transition-colors">
                                {story.title}
                              </h3>
                              <p className="text-[14px] text-stone-600 font-medium leading-relaxed mb-6 line-clamp-2">
                                {story.description}
                              </p>

                              <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#C7D2FE]/40">
                                {displayHashtags.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {displayHashtags.map(tag => (
                                      <span key={tag} className="px-2.5 py-1 bg-[#4A3AFF] text-white rounded-md text-[11px] font-bold tracking-wide">
                                        #{tag.replace(/^#/, "")}
                                      </span>
                                    ))}
                                  </div>
                                ) : <div />}

                                <button 
                                  onClick={(e) => handleReactionToggle(e, story)}
                                  className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer ${
                                    isLiked ? "text-[#ef4444]" : "text-stone-500 hover:text-[#ef4444]"
                                  }`}
                                >
                                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                                  {reactionCount}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      /* ----------------------------------
                         3. WRITTEN MEMORY CARD LAYOUT
                         ---------------------------------- */
                      if (isWritten) {
                        return (
                          <motion.div
                            variants={fadeInUp}
                            key={story.id}
                            onClick={(e) => handleOpenMemoryModal(e, story)}
                            className="figma-card flex flex-col overflow-hidden group cursor-pointer h-full p-6 justify-between"
                          >
                            <div>
                              <AuthorHeader />

                              <h3 className="text-[18px] font-semibold text-stone-900 leading-tight mb-3 tracking-tight group-hover:text-[#4A3AFF] transition-colors">
                                {story.title}
                              </h3>
                              <p className="text-[14px] text-stone-700 font-medium leading-relaxed mb-6 italic border-l-2 border-[#10b981] pl-3 py-0.5 line-clamp-4">
                                "{story.description || "Written story entry."}"
                              </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#C7D2FE]/40">
                              {displayHashtags.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {displayHashtags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-[#4A3AFF] text-white rounded-md text-[11px] font-bold tracking-wide">
                                      #{tag.replace(/^#/, "")}
                                    </span>
                                  ))}
                                </div>
                              ) : <div />}

                              <button 
                                onClick={(e) => handleReactionToggle(e, story)}
                                className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer ${
                                  isLiked ? "text-[#ef4444]" : "text-stone-500 hover:text-[#ef4444]"
                                }`}
                              >
                                <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                                {reactionCount}
                              </button>
                            </div>
                          </motion.div>
                        );
                      }

                      /* ----------------------------------
                         4. PHOTO MEMORY CARD LAYOUT
                         ---------------------------------- */
                      return (
                        <motion.div
                          variants={fadeInUp}
                          key={story.id}
                          onClick={(e) => handleOpenMemoryModal(e, story)}
                          className="figma-card flex flex-col overflow-hidden group cursor-pointer h-full"
                        >
                          <div className="w-full h-[180px] overflow-hidden shrink-0 relative border-b border-[#C7D2FE]/50 bg-stone-200">
                            <img 
                              src={story.mediaUrl || "https://images.unsplash.com/photo-1449247666642-264389f5f5b1?q=80&w=600&auto=format&fit=crop"} 
                              alt={story.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="p-6 flex flex-col grow">
                            <AuthorHeader />

                            <h3 className="text-[18px] font-semibold text-stone-900 leading-tight mb-2 tracking-tight group-hover:text-[#4A3AFF] transition-colors">
                              {story.title}
                            </h3>
                            <p className="text-[14px] text-stone-600 font-medium leading-relaxed mb-6 line-clamp-3">
                              {story.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#C7D2FE]/40">
                              {displayHashtags.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {displayHashtags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-[#4A3AFF] text-white rounded-md text-[11px] font-bold tracking-wide">
                                      #{tag.replace(/^#/, "")}
                                    </span>
                                  ))}
                                </div>
                              ) : <div />}

                              <button 
                                onClick={(e) => handleReactionToggle(e, story)}
                                className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer ${
                                  isLiked ? "text-[#ef4444]" : "text-stone-500 hover:text-[#ef4444]"
                                }`}
                              >
                                <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                                {reactionCount}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

              </motion.div>
            )
          )}

        </div>
      </motion.div>
    </WavesBackground>
  );
}
