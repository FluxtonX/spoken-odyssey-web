"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { Search, Loader2, Heart, MessageCircle, UserPlus, UserCheck, Inbox, Mic, FileText, Image as ImageIcon, Film, Globe2, SlidersHorizontal, ChevronDown, ArrowUpRight, Check } from "lucide-react";
import { getDiscoveryMemories, getFeaturedPeople, followUser, unfollowUser, reactToMemory, normalizeMediaUrl } from "@/services/backend";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import VoicePlayer from "@/components/ui/VoicePlayer";
import CardMediaSlider from "@/components/ui/CardMediaSlider";
import HighlightText from "@/components/ui/HighlightText";
import TaggedMembersBadge from "@/components/ui/TaggedMembersBadge";

const STORY_FILTERS = [
  "All Stories", "Visual Stories", "Voice Recordings", "Written Stories", "Family", "Heritage", "Love", "Career", "Adventure"
];

const PEOPLE_FILTERS = [
  "All People", "Mutual Connections", "Family Circle", "Designers & Tech", "Storytellers", "Writers & Historians", "Most Followed"
];

const formatDateSafely = (dateVal, memoryItem) => {
  if (!dateVal && memoryItem?.year) {
    return `${memoryItem.month || "August"} ${memoryItem.year}`;
  }
  if (!dateVal) return "Public Memory";
  const strVal = String(dateVal).trim();
  if (/^\d{4}$/.test(strVal)) {
    return `${memoryItem?.month || "August"} ${strVal}`;
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return strVal;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getStoryCommentCount = (story) => {
  const value = story?.commentsCount ?? story?.commentCount ?? story?.comments ?? 0;
  if (Array.isArray(value)) return value.length;
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? count : 0;
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

const getCleanMediaKey = (u) => {
  if (!u || typeof u !== "string") return "";
  try {
    const clean = decodeURIComponent(u.split("?")[0]);
    const parts = clean.split("/");
    const lastPart = parts[parts.length - 1] || "";
    return lastPart.toLowerCase().trim();
  } catch (_) {
    const clean = u.split("?")[0];
    const parts = clean.split("/");
    return (parts[parts.length - 1] || "").toLowerCase().trim();
  }
};

const getMemoryMediaSources = (memory) => {
  const items = [];
  const addItem = (url, type = "image", mimeType = "") => {
    if (!url || typeof url !== "string") return;
    const mediaType = isVideoLike(url, mimeType, type) ? "video" : "image";
    const normUrl = normalizeMediaUrl(url);
    const cleanKey = getCleanMediaKey(normUrl);
    if (normUrl && cleanKey && !items.some(i => getCleanMediaKey(i.url) === cleanKey)) {
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
  const searchParams = useSearchParams();
  const highlightMemoryId = searchParams?.get('memoryId');
  const { firebaseUser, isAuthenticated, getToken, profile } = useAuth();
  
  const activeTab = "latest-stories";
  const [activeFilter, setActiveFilter] = useState("All Stories");
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => {
      const dropdown = filterDropdownRef.current;
      if (dropdown && !dropdown.contains(event.target)) dropdown.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  
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
  const [commentsCountMap, setCommentsCountMap] = useState({});

  // 350ms Search Debounce Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle memory highlighting from search
  useEffect(() => {
    if (highlightMemoryId && dbMemoriesList.length > 0) {
      const targetMemory = dbMemoriesList.find(m => m.id === highlightMemoryId);
      if (targetMemory) {
        // Scroll to the memory
        const element = document.getElementById(`memory-${highlightMemoryId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight animation
          element.classList.add('ring-4', 'ring-[#4A3AFF]', 'ring-opacity-50');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-[#4A3AFF]', 'ring-opacity-50');
          }, 3000);
        }
        // Auto-open the modal after a short delay
        setTimeout(() => {
          const dateStr = formatDateSafely(targetMemory.date || targetMemory.createdAt || targetMemory.occurredAt);
          window.dispatchEvent(
            new CustomEvent("openMemoryView", {
              detail: { ...targetMemory, date: dateStr },
            })
          );
        }, 500);
      }
    }
  }, [highlightMemoryId, dbMemoriesList]);
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

  useEffect(() => {
    const listeners = dbMemoriesList
      .filter(story => story.id)
      .map(story => {
        const eventName = `commentsUpdated_${story.id}`;
        const handleCommentsUpdate = (event) => {
          const count = Number(event.detail);
          if (Number.isFinite(count)) {
            setCommentsCountMap(prev => ({ ...prev, [story.id]: count }));
          }
        };
        window.addEventListener(eventName, handleCommentsUpdate);
        return () => window.removeEventListener(eventName, handleCommentsUpdate);
      });

    return () => listeners.forEach(removeListener => removeListener());
  }, [dbMemoriesList]);

  // Infinite Scroll Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Main Data Hydration from PostgreSQL Database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setPage(1);
      setHasMore(true);
      try {
        let token = null;
        if (isAuthenticated) {
          try {
            token = await getToken();
          } catch (tErr) {
            console.warn("Token fetch warning:", tErr);
          }
        }

        if (activeTab === "latest-stories") {
          // Fetch Real Public Memories from Database with Pagination (Page 1, 20 Items)
          const categoryFilter = activeFilter !== "All Stories" && activeFilter !== "All" ? activeFilter : "";
          const res = await getDiscoveryMemories(token, "public", categoryFilter, debouncedQuery, 1, 20);
          const data = res?.data || (Array.isArray(res) ? res : []);
          const pagination = res?.pagination || null;

          if (Array.isArray(data)) {
            setDbMemoriesList(data);
            setHasMore(pagination ? pagination.hasMore : data.length >= 20);
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
            setHasMore(false);
          }
        } else {
          // Fetch Real Database Users
          const categoryFilter = activeFilter !== "All People" && activeFilter !== "All" ? activeFilter : "";
          const dbUsers = await getFeaturedPeople(token, categoryFilter, debouncedQuery);
          
          if (Array.isArray(dbUsers)) {
            const currentUserId = profile?.id || profile?.uid || firebaseUser?.uid || "localUser";
            const myFollowersList = JSON.parse(localStorage.getItem(`spokenOdysseyFollowers_${currentUserId}`) || "[]");

            const sanitizedUsers = dbUsers.map(u => ({
              ...u,
              isFollowerOfMe: Boolean(u.isFollowerOfMe || myFollowersList.includes(u.id))
            }));

            setPeopleList(sanitizedUsers);
            const initialFollowMap = {};
            const initialCountMap = {};
            sanitizedUsers.forEach(u => {
              initialFollowMap[u.id] = u.isFollowing || false;
              initialCountMap[u.id] = u.followersCount || 0;
            });
            setFollowingMap(initialFollowMap);
            setFollowersCountMap(initialCountMap);
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
  }, [isAuthenticated, firebaseUser, profile, activeTab, activeFilter, debouncedQuery]);

  // Infinite Scroll Handler to load next 20 memories
  const loadMoreMemories = async () => {
    if (!hasMore || isFetchingMore || isLoading || activeTab !== "latest-stories") return;
    setIsFetchingMore(true);

    try {
      let token = null;
      if (isAuthenticated) {
        try {
          token = await getToken();
        } catch (_) {}
      }

      const nextPage = page + 1;
      const categoryFilter = activeFilter !== "All Stories" && activeFilter !== "All" ? activeFilter : "";
      const res = await getDiscoveryMemories(token, "public", categoryFilter, debouncedQuery, nextPage, 20);
      const newItems = res?.data || (Array.isArray(res) ? res : []);
      const pagination = res?.pagination || null;

      if (Array.isArray(newItems) && newItems.length > 0) {
        setDbMemoriesList(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNew = newItems.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
        setHasMore(pagination ? pagination.hasMore : newItems.length >= 20);

        const newReactions = {};
        const newLiked = {};
        newItems.forEach(m => {
          newReactions[m.id] = m.totalReactions ?? m.likes ?? 0;
          newLiked[m.id] = m.userReaction || null;
        });
        setReactionsCountMap(prev => ({ ...prev, ...newReactions }));
        setUserReactionMap(prev => ({ ...prev, ...newLiked }));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn("Infinite scroll load error:", err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Scroll threshold listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
        loadMoreMemories();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetchingMore, isLoading, page, activeTab, activeFilter, debouncedQuery]);

  // Handle follow / unfollow button toggle with API persistence
  const handleFollowToggle = async (e, person) => {
    e.stopPropagation();
    const personId = person.id;
    const currentlyFollowing = followingMap[personId] ?? person.isFollowing ?? false;
    const currentCount = followersCountMap[personId] ?? person.followersCount ?? 0;

    const nextFollowingState = !currentlyFollowing;

    setFollowingMap(prev => ({ ...prev, [personId]: nextFollowingState }));
    setFollowersCountMap(prev => ({
      ...prev,
      [personId]: currentlyFollowing ? Math.max(0, currentCount - 1) : currentCount + 1,
    }));
    setFollowLoadingMap(prev => ({ ...prev, [personId]: true }));

    try {
      const storedTimestamps = JSON.parse(localStorage.getItem("spokenOdysseyFollowTimestamps") || "{}");
      if (nextFollowingState) {
        storedTimestamps[personId] = Date.now();
      } else {
        delete storedTimestamps[personId];
      }
      localStorage.setItem("spokenOdysseyFollowTimestamps", JSON.stringify(storedTimestamps));

      const currentUserId = profile?.id || profile?.uid || firebaseUser?.uid || "localUser";
      const targetFollowersKey = `spokenOdysseyFollowers_${personId}`;
      const targetFollowers = JSON.parse(localStorage.getItem(targetFollowersKey) || "[]");
      if (nextFollowingState) {
        if (!targetFollowers.includes(currentUserId)) targetFollowers.push(currentUserId);
      } else {
        const idx = targetFollowers.indexOf(currentUserId);
        if (idx !== -1) targetFollowers.splice(idx, 1);
      }
      localStorage.setItem(targetFollowersKey, JSON.stringify(targetFollowers));
    } catch (_) {}

    try {
      if (isAuthenticated) {
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

  const currentFilters = activeTab === "latest-stories" ? STORY_FILTERS : PEOPLE_FILTERS;

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
            <div className="relative w-full mb-5">
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

          </motion.div>

          {/* Keep all existing filter choices in one accessible dropdown. */}
          <motion.div variants={fadeInUp} className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                {activeTab === "latest-stories" ? "Stories from the community" : "Meet the community"}
              </h2>
              <p className="mt-0.5 text-xs text-stone-500">
                {activeFilter === currentFilters[0] ? "A little discovery, every day" : activeFilter}
              </p>
            </div>
            <details
              ref={filterDropdownRef}
              className="relative shrink-0 ml-auto group/filter"
              onKeyDown={(event) => {
                const dropdown = filterDropdownRef.current;
                if (event.key === "Escape") {
                  dropdown.open = false;
                  dropdown.querySelector("summary").focus();
                } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                  event.preventDefault();
                  dropdown.open = true;
                  const options = [...dropdown.querySelectorAll('[role="menuitemradio"]')];
                  const index = options.indexOf(document.activeElement);
                  const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : event.key === "ArrowDown" ? (index + 1) % options.length : (index - 1 + options.length) % options.length;
                  options[next]?.focus();
                }
              }}
            >
              <summary
                aria-label="Filter stories"
                aria-haspopup="menu"
                className="flex items-center gap-2.5 list-none [&::-webkit-details-marker]:hidden rounded-xl border border-[#C7D2FE]/80 bg-white/30 backdrop-blur-xl px-3.5 py-2.5 text-sm font-medium text-[#4A3AFF] shadow-sm cursor-pointer hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A3AFF]/30"
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span className="min-w-28">{activeFilter}</span>
                <ChevronDown size={14} aria-hidden="true" className="transition-transform group-open/filter:rotate-180" />
              </summary>
              <div
                role="menu"
                aria-label="Story filters"
                className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-3rem)] rounded-2xl border border-[#C7D2FE]/80 bg-gradient-to-b from-white/65 to-[#E5E8FF]/60 backdrop-blur-2xl p-1.5 shadow-[0_12px_32px_rgba(74,58,255,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]"
              >
                {currentFilters.map(filter => (
                  <button
                    key={filter}
                    type="button"
                    role="menuitemradio"
                    aria-checked={activeFilter === filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      filterDropdownRef.current.open = false;
                      filterDropdownRef.current.querySelector("summary").focus();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-[#4A3AFF]/10 ${activeFilter === filter ? "bg-[#4A3AFF]/10 text-[#4A3AFF] font-semibold" : "text-stone-700 hover:bg-white/50"}`}
                  >
                    <Check size={15} aria-hidden="true" className={activeFilter === filter ? "opacity-100" : "opacity-0"} />
                    {filter}
                  </button>
                ))}
              </div>
            </details>
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
                  const coverSrc = normalizeMediaUrl(person.coverURL || person.coverKey || person.cover);
                  const avatarSrc = normalizeMediaUrl(person.photoURL || person.photoKey || person.avatar) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

                  return (
                    <motion.div
                      variants={fadeInUp}
                      key={person.id}
                      onClick={() => router.push(`/people/${person.id}`)}
                      className="figma-card flex flex-col overflow-hidden group cursor-pointer"
                    >
                      {/* Minimized Cover Image Height (h-[95px] md:h-[105px]) */}
                      <div className="w-full h-[95px] md:h-[105px] relative overflow-hidden">
                        {coverSrc ? (
                          <img
                            src={coverSrc}
                            alt={person.displayName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-[#4A3AFF] via-[#6366F1] to-[#818CF8] opacity-90 shadow-inner" />
                        )}
                      </div>

                      {/* Card Body with Overlapping Avatar */}
                      <div className="px-6 md:px-8 pb-6 flex flex-col flex-grow relative">
                        <div className="relative -mt-10 md:-mt-12 mb-3 shrink-0 flex items-end justify-between">
                          <img
                            src={avatarSrc}
                            alt={person.displayName}
                            className="w-18 h-18 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-md bg-stone-100"
                          />
                          {person.isFollowerOfMe && !isFollowing ? (
                            <span className="text-[11px] font-bold text-[#4338ca] bg-[#e0e7ff] border border-[#c7d2fe] px-3 py-1 rounded-full shadow-xs mb-1 flex items-center gap-1">
                              👋 Follows you
                            </span>
                          ) : person.mutualConnectionsCount > 0 ? (
                            <span className="text-[11px] font-bold text-[#4A3AFF] bg-[#EEF2FF] border border-[#C7D2FE]/60 px-3 py-1 rounded-full shadow-xs mb-1">
                              ✨ {person.mutualConnectionsCount} mutual connection{person.mutualConnectionsCount > 1 ? "s" : ""}
                            </span>
                          ) : person.isFamily ? (
                            <span className="text-[11px] font-bold text-[#10b981] bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-1 rounded-full shadow-xs mb-1">
                              🏡 Family Member
                            </span>
                          ) : person.isSuggested ? (
                            <span className="text-[11px] font-bold text-[#f59e0b] bg-[#fffbeb] border border-[#fde68a] px-3 py-1 rounded-full shadow-xs mb-1">
                              💡 Suggested for you
                            </span>
                          ) : null}
                        </div>

                        <h2 className="text-[20px] md:text-[22px] font-semibold text-stone-900 tracking-tight leading-snug mb-0.5">
                          <HighlightText text={person.displayName || person.email?.split("@")[0] || "User Author"} query={debouncedQuery} />
                        </h2>
                        <p className="text-[13px] md:text-[14px] font-bold text-stone-500 mb-3">
                          <HighlightText 
                            text={
                              person.location && person.profession 
                                ? `${person.location} · ${person.profession}` 
                                : person.location || person.profession || "Featured Author"
                            } 
                            query={debouncedQuery} 
                          />
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
                                : person.isFollowerOfMe
                                  ? "bg-gradient-to-r from-[#4A3AFF] to-[#6366F1] text-white hover:shadow-md"
                                  : "bg-[#4A3AFF] text-white hover:bg-[#3b2ee0]"
                            }`}
                          >
                            {isBtnLoading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : isFollowing ? (
                              <>
                                <UserCheck size={15} />
                                <span>Following</span>
                              </>
                            ) : person.isFollowerOfMe ? (
                              <>
                                <UserPlus size={15} />
                                <span>Follow Back</span>
                              </>
                            ) : (
                              <>
                                <UserPlus size={15} />
                                <span>Follow</span>
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
              <motion.div variants={staggerContainer} className="flex flex-col gap-6 w-full max-w-[720px] self-center">
                {dbMemoriesList.map(story => {
                  const normType = (story.type || "").toLowerCase();
                  const mediaSources = getMemoryMediaSources(story);
                  const isVoice = normType === "voice" || normType === "audio" || (!!story.audioUrl && !mediaSources.video && !mediaSources.image);
                  const isVideo = !isVoice && (normType === "video" || !!mediaSources.video);
                  const isPhoto = !isVoice && !isVideo && (normType === "photo" || normType === "visual" || normType === "image" || !!mediaSources.image);
                  const dateStr = formatDateSafely(story.date || story.createdAt || story.occurredAt);
                  const displayHashtags = Array.isArray(story.tags) ? story.tags.filter(Boolean).slice(0, 3) : [];
                  const reactionCount = reactionsCountMap[story.id] ?? story.totalReactions ?? story.likes ?? 0;
                  const commentsCount = commentsCountMap[story.id] ?? getStoryCommentCount(story);
                  const userReactType = userReactionMap[story.id] || (story.userReaction ? "heart" : null);
                  const isLiked = !!userReactType;
                  const TypeIcon = isVoice ? Mic : isVideo ? Film : isPhoto ? ImageIcon : FileText;
                  const typeLabel = isVoice ? "Voice" : isVideo ? "Video" : isPhoto ? "Photo" : "Written";

                  return (
                    <motion.article
                      variants={fadeInUp}
                      key={story.id}
                      id={`memory-${story.id}`}
                      aria-label={story.title || "Community story"}
                      onClick={(e) => handleOpenMemoryModal(e, story)}
                      className="figma-card overflow-hidden cursor-pointer"
                    >
                      <div className="p-5 sm:p-6 pb-4 sm:pb-4">
                        <div className="flex items-start justify-between gap-3 mb-5">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={normalizeMediaUrl(story.ownerAvatarUrl) || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"}
                              alt=""
                              className="w-11 h-11 rounded-full object-cover border border-stone-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-stone-900 truncate">
                                <HighlightText text={story.ownerDisplayName || "Author"} query={debouncedQuery} />
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                                <span>{dateStr}</span>
                                <span aria-hidden="true">·</span>
                                <Globe2 size={12} aria-label="Public story" />
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#F5F4FF] px-2.5 py-1.5 text-[11px] font-medium text-[#4A3AFF]">
                            <TypeIcon size={13} />{typeLabel}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className="text-xl sm:text-[23px] font-semibold leading-snug tracking-tight text-stone-900 break-words min-w-0">
                            <button type="button" onClick={(e) => handleOpenMemoryModal(e, story)} className="text-left cursor-pointer hover:text-[#4A3AFF] focus-visible:outline-2 focus-visible:outline-[#4A3AFF] rounded">
                              <HighlightText text={story.title || "Untitled memory"} query={debouncedQuery} />
                            </button>
                          </h3>
                          <TaggedMembersBadge memory={story} />
                        </div>
                        {story.description && (
                          <p className="text-[15px] leading-7 text-stone-600 whitespace-pre-line break-words line-clamp-5">
                            <HighlightText text={story.description} query={debouncedQuery} />
                          </p>
                        )}
                        {displayHashtags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                            {displayHashtags.map(tag => (
                              <span key={tag} className="text-sm font-medium text-[#4A3AFF]">#{String(tag).replace(/^#/, "")}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isVoice ? (
                        <div className="px-5 sm:px-6 pb-5" onClick={(e) => e.stopPropagation()}>
                          <VoicePlayer memory={story} />
                        </div>
                      ) : mediaSources.items.length > 0 ? (
                        <div className="bg-stone-100 border-y border-stone-100 [&>div]:rounded-none [&>div]:h-[300px] sm:[&>div]:h-[420px] [&_img]:object-contain [&_video]:object-contain">
                          <CardMediaSlider mediaItems={mediaSources.items} title={story.title} />
                        </div>
                      ) : null}

                      <div className="px-5 sm:px-6">
                        <div className="flex items-center gap-2 py-3 text-xs text-stone-500 border-b border-stone-100">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-500"><Heart size={11} fill="currentColor" /></span>
                          <span>{reactionCount} {reactionCount === 1 ? "reaction" : "reactions"}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-pressed={isLiked}
                              aria-label={isLiked ? "Unlike story" : "Like story"}
                              onClick={(e) => handleReactionToggle(e, story)}
                              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A3AFF] ${isLiked ? "text-rose-500 bg-rose-50" : "text-stone-500 hover:bg-stone-50 hover:text-rose-500"}`}
                            >
                              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />{isLiked ? "Liked" : "Like"}
                            </button>
                            <button
                              type="button"
                              aria-label={`Open comments for ${story.title || "story"} (${commentsCount} comments)`}
                              onClick={(e) => handleOpenMemoryModal(e, story)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-[#F5F4FF] hover:text-[#4A3AFF] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A3AFF]"
                            >
                              <MessageCircle size={18} />Comments {commentsCount}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleOpenMemoryModal(e, story)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-[#F5F4FF] hover:text-[#4A3AFF] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A3AFF]"
                          >
                            View memory<ArrowUpRight size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
                {isFetchingMore && (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-stone-500">
                    <Loader2 size={20} className="animate-spin text-[#4A3AFF]" />Loading more stories...
                  </div>
                )}
              </motion.div>
            )
          )}

        </div>
      </motion.div>
    </WavesBackground>
  );
}
