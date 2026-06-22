"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Heart,
  Lock,
  MessageCircle,
  Mic,
  Pause,
  Play,
  Save,
  Share2,
  Tag,
  Trash2,
  Type,
  Users,
  Video,
  X,
  Upload,
} from "lucide-react";
import { getMemoryById, getPersonById, memories } from "@/data/mockApp";
import { getStoredAlbums, seedInitialMemoriesIfNeeded } from "@/data/userProfile";
import {
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
  postBackgrounds,
} from "@/data/postBackgrounds";
import { getFontFamily, postFonts } from "@/data/postFonts";
import CommentsSection from "@/components/ui/CommentsSection";
import VoicePlayer from "@/components/ui/VoicePlayer";
import MediaGrid from "@/components/ui/MediaGrid";
import { useAuth } from "@/context/AuthProvider";
import {
  getMemoryDetailsFromBackend,
  getBackendErrorMessage,
  updateMemoryOnBackend,
  reactToMemory,
  shareMemoryOnBackend
} from "@/services/backend";

const typeIcons = {
  Voice: Mic,
  Text: Type,
  Photo: Tag,
  Video,
};

const reactions = [
  { id: "heart", label: "Heart", icon: "♥", color: "text-rose-600" },
  { id: "like", label: "Like", icon: "👍", color: "text-[var(--brand)]" },
  { id: "wow", label: "Wow", icon: "😮", color: "text-amber-600" },
  { id: "haha", label: "Haha", icon: "😄", color: "text-yellow-600" },
  { id: "angry", label: "Angry", icon: "😡", color: "text-red-600" },
];

const isMockId = (id) => {
  if (!id) return true;
  const idStr = String(id);
  return !/^[0-9a-fA-F]{24}$/.test(idStr);
};

export default function MemoryDetailPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = pathname.split("/").filter(Boolean).at(-1);

  const [memory, setMemory] = useState(null);
  const [album, setAlbum] = useState(null);
  const [owner, setOwner] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const holdTimerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [showShareToast, setShowShareToast] = useState(false);

  const { firebaseUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const loadMemoryDetails = async () => {
    setIsLoading(true);
    const isMock = isMockId(id);
    if (isAuthenticated && firebaseUser && id && !isMock) {
      try {
        const token = await firebaseUser.getIdToken();
        const backendMemory = await getMemoryDetailsFromBackend(token, id);
        
        const mappedMemory = {
          id: backendMemory.id,
          title: backendMemory.title,
          description: backendMemory.description,
          type: backendMemory.type,
          mood: backendMemory.mood || "Calm",
          privacy: backendMemory.privacy || "Private",
          date: new Date(backendMemory.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          image: backendMemory.thumbnailUrl || backendMemory.mediaUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
          mediaUrl: backendMemory.mediaUrl,
          mediaMimeType: backendMemory.mediaMimeType,
          mediaList: backendMemory.mediaList || [],
          backgroundId: backendMemory.backgroundId || "none",
          fontId: backendMemory.fontId || "default",
          tags: backendMemory.tags || [],
          likes: backendMemory.likes || 0,
          comments: backendMemory.comments || 0,
          ownerId: backendMemory.ownerFirebaseUid === firebaseUser.uid ? "alexander" : backendMemory.ownerFirebaseUid,
          ownerDisplayName: backendMemory.ownerDisplayName,
          ownerEmail: backendMemory.ownerEmail,
          ownerProfession: backendMemory.ownerProfession,
          ownerAvatarUrl: backendMemory.ownerAvatarUrl,
        };
        setMemory(mappedMemory);
        setReaction(backendMemory.userReaction || null);
        setLikesCount(backendMemory.likes || 0);
        setSharesCount(backendMemory.shares || 0);
        setCommentsCount(backendMemory.comments || 0);

        if (backendMemory.albumId) {
          const storedAlbums = getStoredAlbums();
          const foundAlbum = storedAlbums.find((a) => a.id === backendMemory.albumId);
          if (foundAlbum) {
            setAlbum(foundAlbum);
          } else {
            setAlbum({ id: backendMemory.albumId, title: backendMemory.albumTitle || "Album" });
          }
        } else {
          setAlbum({ id: "none", title: "No Album" });
        }

        const foundOwner = {
          id: backendMemory.ownerFirebaseUid === firebaseUser.uid ? "alexander" : backendMemory.ownerFirebaseUid,
          name: backendMemory.ownerDisplayName || "Alexander Mitchell",
          role: backendMemory.ownerProfession || (backendMemory.ownerFirebaseUid === firebaseUser.uid ? "Family Archivist" : "Family Contributor"),
          avatar: backendMemory.ownerAvatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(backendMemory.ownerDisplayName || "U")}`
        };
        setOwner(foundOwner);
        setIsLoading(false);
        return;
      } catch (error) {
        console.warn("Failed to load memory details from backend, falling back:", getBackendErrorMessage(error));
      }
    }

    // Local Storage Fallback
    seedInitialMemoriesIfNeeded();
    const savedMemories = localStorage.getItem("spokenOdysseyLocalMemories");
    let foundMemory = null;
    if (savedMemories) {
      try {
        const parsed = JSON.parse(savedMemories);
        foundMemory = parsed.find((m) => m.id === id);
      } catch {}
    }
    
    // Check cached album memories
    if (!foundMemory) {
      const albumIdFromQuery = searchParams.get("albumId");
      if (albumIdFromQuery) {
        const cached = localStorage.getItem(`cached_album_memories_${albumIdFromQuery}`);
        if (cached) {
          try {
            const list = JSON.parse(cached);
            foundMemory = list.find((m) => m.id === id || m._id === id);
          } catch {}
        }
      }
    }

    // Check cached feed memories
    if (!foundMemory) {
      const cachedFeed = localStorage.getItem("cached_feed_memories");
      if (cachedFeed) {
        try {
          const list = JSON.parse(cachedFeed);
          foundMemory = list.find((m) => m.id === id || m._id === id);
        } catch {}
      }
    }

    if (!foundMemory) {
      foundMemory = getMemoryById(id);
    }
    
    if (!foundMemory) {
      foundMemory = memories.find((m) => m.id === id) || memories[0];
    }
    
    setMemory(foundMemory);

    const storedAlbums = getStoredAlbums();
    const albumId = (foundMemory.albums && foundMemory.albums[0]) || foundMemory.albumId || searchParams.get("albumId");
    const foundAlbum = storedAlbums.find((a) => a.id === albumId);
    if (foundAlbum) {
      setAlbum(foundAlbum);
    } else if (foundMemory.albumTitle) {
      setAlbum({ id: albumId || "none", title: foundMemory.albumTitle });
    } else {
      let cachedAlbumTitle = "";
      if (albumId) {
        try {
          const cachedMemories = localStorage.getItem(`cached_album_memories_${albumId}`);
          if (cachedMemories) {
            const list = JSON.parse(cachedMemories);
            if (list.length > 0 && list[0].albumTitle) {
              cachedAlbumTitle = list[0].albumTitle;
            }
          }
        } catch {}
      }
      setAlbum({ id: albumId || "none", title: cachedAlbumTitle || "Album Details" });
    }

    const foundOwner = {
      id: foundMemory.ownerId || foundMemory.ownerFirebaseUid || "alexander",
      name: foundMemory.ownerDisplayName || (getPersonById(foundMemory.ownerId || foundMemory.ownerFirebaseUid)?.name) || "Alexander Mitchell",
      role: foundMemory.ownerProfession || (foundMemory.ownerId === "alexander" || foundMemory.ownerFirebaseUid === firebaseUser?.uid ? "Family Archivist" : "Family Contributor"),
      avatar: foundMemory.ownerAvatarUrl || getPersonById(foundMemory.ownerId || foundMemory.ownerFirebaseUid)?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(foundMemory.ownerDisplayName || "Alexander Mitchell")}`
    };
    setOwner(foundOwner);
    
    // Set reaction and likes count for local fallback
    const isMockLocal = isMockId(foundMemory.id);
    let currentReaction = foundMemory.userReaction || null;
    let currentLikes = foundMemory.likes || 0;
    let currentShares = foundMemory.shares || 0;
    if (isMockLocal) {
      const savedReaction = localStorage.getItem(`reactions_${foundMemory.id}`);
      if (savedReaction) {
        try {
          const parsed = JSON.parse(savedReaction);
          currentReaction = parsed.userReaction || null;
          currentLikes = parsed.likes || 0;
        } catch {}
      }
    }
    setReaction(currentReaction);
    setLikesCount(currentLikes);
    setSharesCount(currentShares);

    setIsLoading(false);
  };

  useEffect(() => {
    loadMemoryDetails();
  }, [id, isAuthenticated, firebaseUser]);

  useEffect(() => {
    if (!memory) return;
    const savedComments = localStorage.getItem(`comments_${memory.id}`);
    let initialCount = 0;
    if (savedComments) {
      try {
        const parsedComments = JSON.parse(savedComments);
        parsedComments.forEach(c => {
          initialCount += 1;
          if (c.replies) initialCount += c.replies.length;
        });
      } catch {
        initialCount = memory.comments || 0;
      }
    } else {
      initialCount = memory.comments || 0;
    }
    setCommentsCount(initialCount);

    const handleCommentsUpdate = (e) => {
      setCommentsCount(e.detail);
    };

    window.addEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    return () => {
      window.removeEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    };
  }, [memory?.id]);

  const selectedReaction = reactions.find((item) => item.id === reaction);
  const reactionCount = likesCount;

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const startReactionHold = () => {
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      setReactionPickerOpen(true);
    }, 450);
  };

  const quickReact = () => {
    clearHoldTimer();
    if (reactionPickerOpen) return;
    const nextReaction = reaction === "heart" ? null : "heart";
    const prevReaction = reaction;
    setReaction(nextReaction);

    setLikesCount(prev => {
      let diff = 0;
      if (prevReaction && !nextReaction) diff = -1;
      else if (!prevReaction && nextReaction) diff = 1;
      return Math.max(0, prev + diff);
    });

    const isMock = isMockId(id);
    if (isAuthenticated && firebaseUser && id && !isMock) {
      firebaseUser.getIdToken().then(async (token) => {
        try {
          const res = await reactToMemory(token, id, nextReaction);
          setLikesCount(res.likes);
          setReaction(res.userReaction);
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      setLikesCount(currentLikes => {
        try {
          const reactionsObj = {};
          reactionsObj.userReaction = nextReaction;
          reactionsObj.likes = currentLikes;
          localStorage.setItem(`reactions_${id}`, JSON.stringify(reactionsObj));
        } catch {}
        return currentLikes;
      });
    }
  };

  const chooseReaction = (nextReaction) => {
    const prevReaction = reaction;
    setReaction(nextReaction);
    
    setLikesCount(prev => {
      let diff = 0;
      if (!prevReaction && nextReaction) diff = 1;
      else if (prevReaction && !nextReaction) diff = -1;
      return Math.max(0, prev + diff);
    });

    setReactionPickerOpen(false);

    const isMock = isMockId(id);
    if (isAuthenticated && firebaseUser && id && !isMock) {
      firebaseUser.getIdToken().then(async (token) => {
        try {
          const res = await reactToMemory(token, id, nextReaction);
          setLikesCount(res.likes);
          setReaction(res.userReaction);
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      setLikesCount(currentLikes => {
        try {
          const reactionsObj = {};
          reactionsObj.userReaction = nextReaction;
          reactionsObj.likes = currentLikes;
          localStorage.setItem(`reactions_${id}`, JSON.stringify(reactionsObj));
        } catch {}
        return currentLikes;
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: memory?.title,
      text: memory?.description,
      url: shareUrl,
    };

    const isMock = isMockId(id);
    if (isAuthenticated && firebaseUser && id && !isMock) {
      try {
        const token = await firebaseUser.getIdToken();
        const res = await shareMemoryOnBackend(token, id);
        setSharesCount(res.shares);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSharesCount(prev => prev + 1);
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareNotice("Shared");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareNotice("Link copied");
      }
    } catch {
      setShareNotice("Share cancelled");
    }

    window.setTimeout(() => setShareNotice(""), 1800);
  };

  if (isLoading || !memory || !album) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin mb-2" />
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Loading memory...</span>
      </div>
    );
  }

  const Icon = typeIcons[memory.type] ?? Type;
  const from = searchParams.get("from");
  const albumIdFromQuery = searchParams.get("albumId");
  const personIdFromQuery = searchParams.get("personId");

  const backHref = from === "family"
    ? "/family/memories"
    : from === "album"
      ? `/albums/${albumIdFromQuery || album.id}`
      : from === "home"
        ? "/home"
        : from === "profile"
          ? "/profile"
          : from === "feed"
            ? "/feed"
            : from === "search"
              ? "/search"
              : from === "people" && personIdFromQuery
                ? `/people/${personIdFromQuery}`
                : `/albums/${album.id}`;

  const backLabel = from === "family"
    ? "Back to family memories"
    : from === "home"
      ? "Back to home dashboard"
      : from === "profile"
        ? "Back to profile"
        : from === "feed"
          ? "Back to discovery feed"
          : from === "search"
            ? "Back to search results"
            : from === "people"
              ? "Back to profile details"
              : "Back to album";

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  return (
    <div className="w-full max-w-5xl pb-24 animation-fade-in">
      <header className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:text-[var(--brand)] transition-colors cursor-pointer"
          aria-label={backLabel}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer"
          >
            <Edit3 size={15} />
            Edit
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 shadow-sm cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        
        {/* Main Column */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            {memory.type === "Text" ? (
              <div
                className="relative min-h-[360px] flex flex-col items-center justify-center p-6 text-center overflow-hidden"
                style={getBackgroundStyles(memory.backgroundId)}
              >
                {getBackgroundOverlay(memory.backgroundId)}
                <div className="z-10 max-w-2xl">
                  <div className="mb-4 flex justify-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-current/25 bg-current/10 px-3 py-1 text-xs font-black backdrop-blur-sm">
                      <Icon size={14} />
                      {memory.type}
                    </span>
                    {memory.mood && (
                      <span className="rounded-full border border-current/25 bg-current/10 px-3 py-1 text-xs font-black backdrop-blur-sm">
                        {memory.mood}
                      </span>
                    )}
                  </div>
                  <h1 
                    className="text-3xl font-black tracking-tight sm:text-4xl mb-4" 
                    style={{
                      ...getBackgroundTextStyles(memory.backgroundId),
                      fontFamily: getFontFamily(memory.fontId),
                    }}
                  >
                    {memory.title}
                  </h1>
                  <p 
                    className="text-lg font-bold leading-relaxed italic" 
                    style={{
                      ...getBackgroundTextStyles(memory.backgroundId),
                      fontFamily: getFontFamily(memory.fontId),
                    }}
                  >
                    "{memory.description}"
                  </p>
                </div>
              </div>
            ) : memory.type === "Voice" ? (
              <div className="p-6 bg-[var(--surface)] text-left">
                <div className="mb-4 flex gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-black text-[var(--brand)] border border-[var(--brand)]/10">
                    <Icon size={14} />
                    {memory.type}
                  </span>
                  {memory.mood && (
                    <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-black text-stone-550 border border-stone-200/50 dark:border-stone-700/50">
                      {memory.mood}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">{memory.title}</h1>
                <p className="text-xs sm:text-sm font-semibold text-stone-500 mb-6 leading-relaxed">{memory.description}</p>
                
                <VoicePlayer memory={memory} />
              </div>
            ) : (
              <div className="space-y-0.5">
                <MediaGrid memory={memory} />
                <div className="p-6 bg-[var(--surface)] text-left">
                  <div className="mb-4 flex gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-black text-[var(--brand)] border border-[var(--brand)]/10">
                      <Icon size={14} />
                      {memory.type}
                    </span>
                    {memory.mood && (
                      <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-black text-stone-550 border border-stone-200/50 dark:border-stone-700/50">
                        {memory.mood}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">{memory.title}</h1>
                  <p className="text-xs sm:text-sm font-semibold text-stone-550 leading-relaxed">{memory.description}</p>
                </div>
              </div>
            )}
            {/* Action Buttons & Comments */}
            <div className="border-t border-stone-100 dark:border-stone-800/60 px-5 py-3.5 bg-[var(--surface)] text-left">
              <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold text-stone-400">
                <span className="flex items-center gap-1 select-none">
                  {reaction && <span className={selectedReaction?.color}>{selectedReaction?.icon}</span>}
                  {likesCount} reactions &nbsp;·&nbsp; {sharesCount} shares
                </span>
                <button onClick={() => setCommentsOpen((current) => !current)} className="hover:text-[var(--brand)] cursor-pointer">
                  {commentsCount} comments
                </button>
              </div>

              <div className="relative flex items-center justify-between gap-1.5 border-t border-stone-100 dark:border-stone-800/60 pt-2 pb-1">
                {reactionPickerOpen && (
                  <div className="absolute bottom-full left-0 z-20 mb-2 flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl animate-scale-up">
                    {reactions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => chooseReaction(item.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:-translate-y-1 hover:bg-[var(--brand-soft)] cursor-pointer"
                        aria-label={item.label}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onMouseDown={startReactionHold}
                  onMouseUp={quickReact}
                  onMouseLeave={clearHoldTimer}
                  onTouchStart={startReactionHold}
                  onTouchEnd={quickReact}
                  className={`group flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold transition hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer ${
                    reaction ? selectedReaction?.color : "text-stone-600 hover:text-[var(--brand)]"
                  }`}
                >
                  <span className="text-lg leading-none">{reaction ? selectedReaction?.icon : "♥"}</span>
                  <span className="text-xs">{reaction ? selectedReaction?.label : "Like"}</span>
                </button>
                
                <button
                  onClick={() => setCommentsOpen((current) => !current)}
                  className={`group flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold transition hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer ${
                    commentsOpen ? "text-[var(--brand)]" : "text-stone-600 hover:text-[var(--brand)]"
                  }`}
                >
                  <MessageCircle size={18} className="transition-transform group-active:scale-90" />
                  <span className="text-xs">Comment</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="group flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold text-stone-600 transition hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-[var(--brand)] cursor-pointer"
                >
                  <Share2 size={18} className="transition-transform group-active:scale-90" />
                  <span className="text-xs">{shareNotice || "Share"}</span>
                </button>
              </div>

              {commentsOpen && (
                <CommentsSection
                  memoryId={memory.id}
                  initialComments={[
                    { author: "Sarah Mitchell", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", text: "This is a beautiful memory! Thanks for sharing.", time: "2 hours ago" },
                    { author: "Robert Mitchell", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80", text: "Wow, brings back so many memories.", time: "1 day ago" }
                  ].slice(0, memory.comments || 2)}
                />
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-5">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-left">
            <div className="flex items-center gap-3">
              <img src={owner?.avatar} alt="" className="h-12 w-12 rounded-full object-cover border border-stone-200" />
              <div className="min-w-0">
                <Link href={`/people/${owner?.id}`} className="block truncate text-sm font-black hover:text-[var(--brand)]">
                  {owner?.name}
                </Link>
                <p className="truncate text-xs font-bold text-stone-500">{owner?.role}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow icon={CalendarDays} label="Occurred" value={memory.date} />
              <InfoRow icon={memory.privacy === "Private" ? Lock : Users} label="Privacy" value={memory.privacy} />
              <InfoRow icon={Tag} label="Album" value={album.title} />
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-left">
            <h2 className="text-sm font-black uppercase tracking-wide text-stone-500">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {memory.tags && memory.tags.length > 0 ? (
                memory.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-black">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-stone-400">No tags</span>
              )}
            </div>
          </section>


        </aside>
      </main>

      {editOpen && (
        <EditSheet 
          memory={memory} 
          onClose={() => setEditOpen(false)} 
          onUpdate={(updated) => setMemory(updated)}
        />
      )}
      
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 border border-stone-800 text-white p-4 text-xs font-bold shadow-lg animate-fade-in">
          <span>🔗 Memory link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--background)] px-3 py-3">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
        <Icon size={14} />
        {label}
      </span>
      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}

function EditSheet({ memory, onClose, onUpdate }) {
  const { firebaseUser } = useAuth();
  const [title, setTitle] = useState(memory.title);
  const [description, setDescription] = useState(memory.description);
  const [backgroundId, setBackgroundId] = useState(memory.backgroundId || "none");
  const [fontId, setFontId] = useState(memory.fontId || "default");
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setPreviews(files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    })));
  };

  const handleVoice = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles([file]);
      setPreviews([{
        url: URL.createObjectURL(file),
        name: file.name
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorNotice("Title is required.");
      return;
    }

    setIsSaving(true);
    setErrorNotice("");

    try {
      const token = await firebaseUser.getIdToken();
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      if (memory.type === "Text") {
        formData.append("backgroundId", backgroundId);
        formData.append("fontId", fontId);
      } else {
        selectedFiles.forEach(file => {
          formData.append("media", file);
        });
      }

      const updated = await updateMemoryOnBackend(token, memory.id, formData);
      onUpdate({
        ...memory,
        title: updated.title,
        description: updated.description,
        backgroundId: updated.backgroundId,
        fontId: updated.fontId,
        mediaUrl: updated.mediaUrl,
        thumbnailUrl: updated.thumbnailUrl,
        mediaList: updated.mediaList,
        image: updated.thumbnailUrl || updated.mediaUrl || memory.image
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorNotice(getBackendErrorMessage(err) || "Failed to update memory.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4 text-left">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:max-w-xl sm:rounded-2xl flex flex-col justify-between">
        <div>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white">Edit Memory</h2>
              <p className="mt-1.5 text-xs font-bold text-stone-500">Update memory properties and attachments.</p>
            </div>
            <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background)] border border-[var(--border)] cursor-pointer text-stone-600 dark:text-stone-300">
              <X size={18} />
            </button>
          </div>

          {errorNotice && (
            <div className="mb-4 rounded-xl border border-rose-250 bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
              {errorNotice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 pl-0.5 mb-1.5">Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-semibold outline-none focus:border-[var(--brand)]" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 pl-0.5 mb-1.5">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-medium leading-relaxed outline-none focus:border-[var(--brand)]" 
              />
            </div>

            {memory.type === "Text" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 pl-0.5 mb-2">Background Preset</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {postBackgrounds.map((bg) => {
                      const isSelected = backgroundId === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setBackgroundId(bg.id)}
                          style={bg.previewStyle || bg.containerStyle}
                          className={`snap-center flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 transition-all relative cursor-pointer ${
                            isSelected ? "border-[var(--brand)] scale-105" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase text-center select-none truncate px-1 drop-shadow-sm text-stone-850 dark:text-white">
                            {bg.overlayEmoji || bg.name.slice(0, 3)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 pl-0.5 mb-2">Font Family</label>
                  <select 
                    value={fontId}
                    onChange={(e) => setFontId(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-semibold outline-none focus:border-[var(--brand)]"
                  >
                    {postFonts.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (memory.type === "Photo" || memory.type === "Video") ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 pl-0.5 mb-1.5">Replace Attachments</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-slate-50 p-6 text-center dark:border-stone-850 dark:bg-slate-900/50 hover:bg-stone-50 transition">
                  <Upload className="mb-2 text-[var(--brand)]" size={22} />
                  <span className="text-xs font-black text-[var(--ink)] dark:text-white">Upload new files</span>
                  <span className="mt-0.5 text-[10px] text-stone-550">Choose {memory.type === "Photo" ? "photos" : "videos"} from your device</span>
                  <input type="file" multiple accept={memory.type === "Photo" ? "image/*" : "video/*"} onChange={handleFiles} className="sr-only" />
                </label>

                {previews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                    {previews.map((item, index) => (
                      <div key={index} className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-stone-200">
                        {memory.type === "Photo" ? (
                          <img src={item.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-black flex items-center justify-center text-[8px] text-white font-bold p-1 truncate">
                            {item.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : memory.type === "Voice" ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 pl-0.5 mb-1.5">Replace Voice Note</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-slate-50 p-6 text-center dark:border-stone-850 dark:bg-slate-900/50 hover:bg-stone-50 transition">
                  <Mic className="mb-2 text-[var(--brand)]" size={22} />
                  <span className="text-xs font-black text-[var(--ink)] dark:text-white">Choose audio recording file</span>
                  <span className="mt-0.5 text-[10px] text-stone-550">Replaces current recording (.mp3, .wav, .m4a)</span>
                  <input type="file" accept="audio/*" onChange={handleVoice} className="sr-only" />
                </label>

                {previews.length > 0 && (
                  <div className="text-[10px] font-bold text-stone-500 bg-stone-100 p-2 rounded-lg truncate">
                    🎵 Selected: {previews[0].name}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 py-3.5 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 font-extrabold text-sm hover:bg-stone-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
