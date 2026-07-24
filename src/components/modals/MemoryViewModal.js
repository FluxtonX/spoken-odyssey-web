"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Mic, FileText, Image as ImageIcon, Calendar, Clock, Smile, Globe, Heart, 
  Bookmark, Share2, Download, Edit2, Trash2, Play, Pause, ChevronLeft, ChevronRight, 
  Sparkles, Lock, Users, Maximize2, Check, Loader2, Film, ThumbsUp, Laugh, Frown, Send, 
  AlertTriangle, MessageSquare, ChevronDown, ChevronUp, Reply, Copy, MessageCircle, 
  Mail, ExternalLink, MoreVertical, Gauge, CornerDownRight
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthProvider";
import { 
  normalizeMediaUrl, 
  deleteMemoryOnBackend, 
  updateMemoryOnBackend, 
  reactToMemoryOnBackend, 
  getMemoryCommentsFromBackend, 
  addMemoryCommentOnBackend,
  reactToCommentOnBackend,
  shareMemoryOnBackend
} from "@/services/backend";

// Facebook-style Emojis mapping
const REACTION_EMOJIS = [
  { id: "heart", label: "Love", emoji: "❤️", icon: Heart, color: "text-pink-500", bg: "bg-pink-50 text-pink-600" },
  { id: "like", label: "Like", emoji: "👍", icon: ThumbsUp, color: "text-blue-500", bg: "bg-blue-50 text-blue-600" },
  { id: "care", label: "Care", emoji: "🙏", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50 text-purple-600" },
  { id: "haha", label: "Haha", emoji: "😂", icon: Laugh, color: "text-amber-500", bg: "bg-amber-50 text-amber-600" },
  { id: "wow", label: "Wow", emoji: "😮", icon: Sparkles, color: "text-amber-400", bg: "bg-amber-50 text-amber-600" },
  { id: "angry", label: "Angry", emoji: "😡", icon: Frown, color: "text-rose-500", bg: "bg-rose-50 text-rose-600" },
];

const countReactionsSafely = (reactions) => {
  if (!reactions) return 0;
  let target = reactions;
  if (typeof target === "string") {
    try { target = JSON.parse(target); } catch (_) { return 0; }
  }
  if (typeof target !== "object" || target === null) return 0;
  return Object.values(target).reduce((a, b) => a + (typeof b === "number" ? b : 0), 0);
};

const renderTextWithMentions = (text) => {
  if (!text || typeof text !== "string") return text;
  const parts = text.split(/(@[A-Za-z0-9_\u00C0-\u024F]+(?:\s+[A-Za-z0-9_\u00C0-\u024F]+)?)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("@")) {
      return (
        <span key={idx} className="text-[#4A3AFF] font-bold dark:text-[#8f83ff] mr-0.5">
          {part}
        </span>
      );
    }
    return part;
  });
};

const flattenReplies = (repliesList, rootAuthor = "") => {
  if (!Array.isArray(repliesList)) return [];
  const flat = [];
  const visited = new Set();
  const traverse = (list, parentAuthor = rootAuthor, depth = 0) => {
    if (!Array.isArray(list)) return [];
    list.forEach((item) => {
      if (!item) return;
      const key = item.id || item._id;
      if (key && visited.has(key)) return;
      if (key) visited.add(key);
      const { replies, ...rest } = item;
      const isSubReply = depth > 0 || Boolean(item.parentCommentId && item.parentCommentId !== item.id);
      flat.push({
        ...rest,
        isSubReply,
        replyToAuthor: parentAuthor || rootAuthor
      });
      if (Array.isArray(replies) && replies.length > 0) {
        traverse(replies, item.author || parentAuthor, depth + 1);
      }
    });
  };
  traverse(repliesList, rootAuthor, 0);
  return flat;
};

export default function MemoryViewModal() {
  const { isAuthenticated, firebaseUser, getToken } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [memory, setMemory] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});

  // Custom Delete Confirmation Popup State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMood, setEditMood] = useState("");
  const [editVisibility, setEditVisibility] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Facebook-Style Memory Reaction Picker State
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({
    heart: 0,
    like: 0,
    care: 0,
    haha: 0,
    wow: 0,
    angry: 0,
  });

  // Comments & Replies State (With Comment Reaction Picker)
  const [showCommentsSection, setShowCommentsSection] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeCommentPickerId, setActiveCommentPickerId] = useState(null); // Active emoji picker for comments/replies

  // Audio Player State (Custom Tick Player)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioPlayerRef = useRef(null);

  // Video Player State (Play, Pause, Resume, Speed Controls)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState(1);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    const handleOpen = async (e) => {
      try {
        if (!e || !e.detail) return;
        const mem = e.detail;
        setMemory(mem);
        setActiveMediaIndex(0);
        setIsLightboxOpen(false);
        setIsPlayingAudio(false);
        setIsPlayingVideo(false);
        setAudioCurrentTime(0);
        setVideoCurrentTime(0);
        setBrokenImages({});
        setIsEditing(false);
        setIsDeleteConfirmOpen(false);
        setIsShareModalOpen(false);
        setIsCopied(false);
        setIsReactionPickerOpen(false);
        setActiveReplyId(null);
        setActiveCommentPickerId(null);
        setUserReaction(mem.userReaction || null);

        if (mem.reactions && typeof mem.reactions === "object") {
          setReactionCounts({
            heart: mem.reactions.heart || (typeof mem.likes === "number" ? mem.likes : 0),
            like: mem.reactions.like || 0,
            care: mem.reactions.care || 0,
            haha: mem.reactions.haha || 0,
            wow: mem.reactions.wow || 0,
            angry: mem.reactions.angry || 0,
          });
        } else {
          setReactionCounts({
            heart: typeof mem.likes === "number" ? mem.likes : 0,
            like: 0,
            care: 0,
            haha: 0,
            wow: 0,
            angry: 0,
          });
        }

        // Load initial comments from memory object or local cache
        let initialComments = [];
        const memId = mem._id || mem.id;
        try {
          const savedComments = localStorage.getItem(`comments_${memId}`);
          if (savedComments) {
            initialComments = JSON.parse(savedComments);
          } else if (Array.isArray(mem.comments) && mem.comments.length > 0) {
            initialComments = mem.comments;
          } else {
            const savedMemories = localStorage.getItem("spokenOdysseyLocalMemories");
            if (savedMemories) {
              const parsed = JSON.parse(savedMemories);
              const found = parsed.find((m) => (m.id || m._id) === memId);
              if (found && Array.isArray(found.comments) && found.comments.length > 0) {
                initialComments = found.comments;
              }
            }
          }
        } catch (_) {}

        setComments(initialComments);
        setIsOpen(true);

        if (memId) {
          try {
            const token = isAuthenticated && firebaseUser ? await getToken() : null;
            const backendComments = await getMemoryCommentsFromBackend(token, memId);
            if (Array.isArray(backendComments) && backendComments.length > 0) {
              setComments(backendComments);
              try {
                localStorage.setItem(`comments_${memId}`, JSON.stringify(backendComments));
                const saved = localStorage.getItem("spokenOdysseyLocalMemories");
                if (saved) {
                  const parsed = JSON.parse(saved);
                  const updated = parsed.map((m) => ((m.id || m._id) === memId ? { ...m, comments: backendComments } : m));
                  localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(updated));
                }
              } catch (_) {}
            }
          } catch (err) {
            console.warn("Failed to sync comments from backend:", err.message);
          }
        }
      } catch (err) {
        console.error("Error opening memory view modal:", err);
      }
    };

    window.addEventListener("openMemoryView", handleOpen);
    return () => window.removeEventListener("openMemoryView", handleOpen);
  }, [isAuthenticated, firebaseUser, getToken]);

  const mediaList = useMemo(() => {
    if (!memory) return [];
    const list = [];

    const addMediaItem = (rawUrl, defaultType = "image") => {
      const norm = normalizeMediaUrl(rawUrl);
      if (!norm) return;
      if (!list.some((m) => m.url === norm)) {
        const isVid = defaultType === "video" || norm.match(/\.(mp4|webm|mov)$/i) || norm.startsWith("data:video/");
        list.push({ url: norm, rawUrl, type: isVid ? "video" : "image" });
      }
    };

    if (Array.isArray(memory.media) && memory.media.length > 0) {
      memory.media.forEach((item) => {
        if (typeof item === "string") {
          addMediaItem(item);
        } else if (item?.url) {
          addMediaItem(item.url, item.type);
        }
      });
    } else if (memory.media) {
      const url = typeof memory.media === "string" ? memory.media : memory.media.url;
      addMediaItem(url);
    }

    if (Array.isArray(memory.images)) {
      memory.images.forEach((img) => {
        const url = typeof img === "string" ? img : img?.url;
        addMediaItem(url, "image");
      });
    }

    if (Array.isArray(memory.videos)) {
      memory.videos.forEach((vid) => {
        const url = typeof vid === "string" ? vid : vid?.url;
        addMediaItem(url, "video");
      });
    }

    if (memory.image) addMediaItem(memory.image, "image");
    if (memory.cover) addMediaItem(memory.cover, "image");
    if (memory.videoUrl) addMediaItem(memory.videoUrl, "video");
    if (memory.mediaUrl && !memory.audioUrl && !memory.audio) addMediaItem(memory.mediaUrl);
    if (memory.fileUrl) addMediaItem(memory.fileUrl);

    return list;
  }, [memory]);

  const rawAudioUrl = 
    memory?.audioUrl || 
    memory?.audio || 
    (memory?.type?.toLowerCase() === "voice" || memory?.type?.toLowerCase() === "audio" 
      ? (memory?.mediaUrl || memory?.url || memory?.fileUrl || memory?.mediaList?.[0]?.mediaUrl || memory?.mediaList?.[0]?.url) 
      : null);
  
  const audioSrc = normalizeMediaUrl(rawAudioUrl);
  const isVoice = memory?.type?.toLowerCase() === "voice" || memory?.type?.toLowerCase() === "audio" || !!audioSrc;
  const hasMedia = mediaList.length > 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || mediaList.length <= 1) return;
      if (e.key === "ArrowRight") {
        setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
      } else if (e.key === "ArrowLeft") {
        setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
      } else if (e.key === "Escape") {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else if (isShareModalOpen) setIsShareModalOpen(false);
        else if (isDeleteConfirmOpen) setIsDeleteConfirmOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mediaList.length, isLightboxOpen, isShareModalOpen, isDeleteConfirmOpen]);

  const memoryDate = useMemo(() => {
    if (!memory) return "Recent";
    if (typeof memory.date === "string" && memory.date.trim()) return memory.date;
    const rawVal = memory.date || memory.createdAt || memory.occurredAt;
    if (!rawVal) return "Recent";
    const d = new Date(rawVal);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }, [memory]);

  // Total count including root comments, replies, and sub-replies
  const totalCommentsAndRepliesCount = useMemo(() => {
    if (!Array.isArray(comments)) return 0;
    let count = 0;
    const visited = new Set();
    const countRecursively = (list) => {
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (!item) return;
        const key = item.id || item._id;
        if (key && visited.has(key)) return;
        if (key) visited.add(key);
        count++;
        if (Array.isArray(item.replies) && item.replies.length > 0) {
          countRecursively(item.replies);
        }
      });
    };
    try {
      countRecursively(comments);
    } catch (_) {}
    return count;
  }, [comments]);

  if (!isOpen || !memory) return null;

  const handleClose = () => {
    setIsLightboxOpen(false);
    setIsDeleteConfirmOpen(false);
    setIsShareModalOpen(false);
    setIsOpen(false);
    setTimeout(() => setMemory(null), 300);
  };

  const rawPrivacy = (memory?.privacy || memory?.visibility || "Private").toString();
  const privacyStr = rawPrivacy.charAt(0).toUpperCase() + rawPrivacy.slice(1).toLowerCase();
  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];

  const prevMedia = () => {
    setIsPlayingVideo(false);
    setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const nextMedia = () => {
    setIsPlayingVideo(false);
    setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.playbackRate = playbackSpeed;
      audioPlayerRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
      setIsPlayingAudio(true);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  const togglePlayVideo = () => {
    if (!videoPlayerRef.current) return;
    if (isPlayingVideo) {
      videoPlayerRef.current.pause();
      setIsPlayingVideo(false);
    } else {
      videoPlayerRef.current.playbackRate = videoPlaybackSpeed;
      videoPlayerRef.current.play().catch((err) => {
        console.error("Video playback error:", err);
      });
      setIsPlayingVideo(true);
    }
  };

  const handleVideoSpeedChange = (speed) => {
    setVideoPlaybackSpeed(speed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = speed;
    }
  };

  // --- MEMORY REACTION HANDLING ---
  const handleSelectReaction = async (reactionId) => {
    setIsReactionPickerOpen(false);
    const memId = memory._id || memory.id;
    const isRemoving = userReaction === reactionId;
    const nextReaction = isRemoving ? null : reactionId;

    setUserReaction(nextReaction);
    setReactionCounts((prev) => ({
      ...prev,
      [reactionId]: isRemoving ? Math.max(0, (prev[reactionId] || 0) - 1) : (prev[reactionId] || 0) + 1,
      ...(userReaction && userReaction !== reactionId
        ? { [userReaction]: Math.max(0, (prev[userReaction] || 0) - 1) }
        : {}),
    }));

    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        await reactToMemoryOnBackend(token, memId, reactionId);
      } catch (err) {
        console.warn("Could not save reaction on backend:", err.message);
      }
    }
  };

  const totalReactionsCount = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  const activeReactionMeta = REACTION_EMOJIS.find(r => r.id === userReaction);

  // --- COMMENT SUBMISSION & MULTI-EMOJI REACTION HANDLING ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setIsPostingComment(true);

    const memId = memory._id || memory.id;
    const newCommentObj = {
      id: `comment-${Date.now()}`,
      author: firebaseUser?.displayName || "You",
      avatar: firebaseUser?.photoURL || "",
      text: commentInput.trim(),
      time: "Just now",
      reactions: { like: 0 },
      replies: [],
      createdAt: new Date().toISOString(),
    };

    const nextComments = [...comments, newCommentObj];
    setComments(nextComments);
    setCommentInput("");

    // Persist to local memories cache & comments cache
    try {
      localStorage.setItem(`comments_${memId}`, JSON.stringify(nextComments));
      window.dispatchEvent(new CustomEvent(`commentsUpdated_${memId}`, { detail: totalCommentsAndRepliesCount + 1 }));

      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((m) => ((m.id || m._id) === memId ? { ...m, comments: nextComments } : m));
        localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(updated));
      }
    } catch (_) {}

    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        await addMemoryCommentOnBackend(token, memId, commentInput.trim());
      } catch (err) {
        console.warn("Backend add comment error:", err.message);
      }
    }
    setIsPostingComment(false);
  };

  const handleAddReply = async (e, rootCommentId, parentCommentId = null, replyToAuthor = "") => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    setIsPostingReply(true);

    const targetParentId = parentCommentId || rootCommentId;
    const memId = memory._id || memory.id;
    const prefixedText = replyToAuthor ? `@${replyToAuthor} ${replyInput.trim()}` : replyInput.trim();

    const replyObj = {
      id: `reply-${Date.now()}`,
      author: firebaseUser?.displayName || "You",
      avatar: firebaseUser?.photoURL || "",
      text: prefixedText,
      time: "Just now",
      parentCommentId: targetParentId,
      createdAt: new Date().toISOString(),
    };

    const nextComments = comments.map((c) => {
      if (c.id === rootCommentId || c._id === rootCommentId) {
        return {
          ...c,
          replies: [...(c.replies || []), replyObj],
        };
      }
      return c;
    });

    setComments(nextComments);
    setExpandedReplies((prev) => ({ ...prev, [rootCommentId]: true }));
    setReplyInput("");
    setActiveReplyId(null);

    // Persist to local memories cache & comments cache
    try {
      localStorage.setItem(`comments_${memId}`, JSON.stringify(nextComments));
      window.dispatchEvent(new CustomEvent(`commentsUpdated_${memId}`, { detail: totalCommentsAndRepliesCount + 1 }));

      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((m) => ((m.id || m._id) === memId ? { ...m, comments: nextComments } : m));
        localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(updated));
      }
    } catch (_) {}

    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        await addMemoryCommentOnBackend(token, memId, prefixedText, targetParentId);
        const refreshed = await getMemoryCommentsFromBackend(token, memId);
        if (Array.isArray(refreshed) && refreshed.length > 0) {
          setComments(refreshed);
          try {
            localStorage.setItem(`comments_${memId}`, JSON.stringify(refreshed));
          } catch (_) {}
        }
      } catch (err) {
        console.warn("Backend add reply error:", err.message);
      }
    }
    setIsPostingReply(false);
  };

  // MULTI-EMOJI REACTION FOR COMMENTS & REPLIES (Heart, Like, Care, Haha, Wow, Angry)
  const handleReactToComment = async (commentId, reactionType = "like") => {
    const memId = memory._id || memory.id;
    setActiveCommentPickerId(null);

    const updateItemReaction = (item) => {
      const isRemoving = item.userReaction === reactionType;
      const oldReaction = item.userReaction;
      const newReaction = isRemoving ? null : reactionType;
      const currentReactions = { ...(item.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0 }) };

      if (oldReaction && oldReaction !== reactionType) {
        currentReactions[oldReaction] = Math.max(0, (currentReactions[oldReaction] || 1) - 1);
      }
      const count = currentReactions[reactionType] || 0;
      currentReactions[reactionType] = isRemoving ? Math.max(0, count - 1) : count + 1;

      return {
        ...item,
        userReaction: newReaction,
        reactions: currentReactions,
      };
    };

    const updateListRecursively = (list) => {
      if (!Array.isArray(list)) return list;
      return list.map((item) => {
        if (!item) return item;
        const itemId = item.id || item._id;
        if (itemId === commentId) {
          return updateItemReaction(item);
        }
        if (Array.isArray(item.replies) && item.replies.length > 0) {
          return {
            ...item,
            replies: updateListRecursively(item.replies),
          };
        }
        return item;
      });
    };

    const updatedComments = updateListRecursively(comments);
    setComments(updatedComments);

    try {
      localStorage.setItem(`comments_${memId}`, JSON.stringify(updatedComments));
    } catch (_) {}

    if (isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        await reactToCommentOnBackend(token, memId, commentId, reactionType);
      } catch (err) {
        console.warn("React comment error:", err.message);
      }
    }
  };

  const toggleExpandReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // --- SHARE MODAL LOGIC ---

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const memId = memory?._id || memory?.id;
    return `${window.location.origin}/memories?id=${memId}`;
  };

  const trackShareOnBackend = async () => {
    if (isAuthenticated && firebaseUser && (memory?._id || memory?.id)) {
      try {
        const token = await getToken();
        await shareMemoryOnBackend(token, memory._id || memory.id);
      } catch (err) {
        console.warn("Could not track share on backend:", err.message);
      }
    }
  };

  const handleCopyLink = () => {
    const shareUrl = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => null);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
    trackShareOnBackend();
  };

  const handleShare = (e) => {
    if (e) e.stopPropagation();
    const shareUrl = getShareUrl();

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => null);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }

    trackShareOnBackend();
    setIsShareModalOpen(true);

    if (typeof navigator !== "undefined" && navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share({
        title: memory?.title || "Spoken Odyssey Memory",
        text: memory?.description || "Check out this memory on Spoken Odyssey",
        url: shareUrl,
      }).catch(() => null);
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: memory?.title || "Spoken Odyssey Memory",
        text: memory?.description || "Check out this memory on Spoken Odyssey",
        url: getShareUrl(),
      }).then(() => trackShareOnBackend()).catch(() => null);
    } else {
      handleCopyLink();
    }
  };

  const handleExternalShare = (platform) => {
    const url = encodeURIComponent(getShareUrl());
    const title = encodeURIComponent(memory.title || "Spoken Odyssey Memory");
    const text = encodeURIComponent(`Check out "${memory.title || 'Memory'}" on Spoken Odyssey!`);

    let shareUrl = "";
    if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "email") {
      shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      trackShareOnBackend();
    }
  };

  // --- DOWNLOAD, EDIT, DELETE ---

  const handleDownload = () => {
    let targetUrl = activeMedia?.url || audioSrc;
    if (!targetUrl) {
      alert("No media file available to download.");
      return;
    }
    const a = document.createElement("a");
    a.href = targetUrl;
    a.download = `${(memory.title || "memory").toLowerCase().replace(/\s+/g, "_")}.${activeMedia?.type === "video" ? "mp4" : isVoice ? "webm" : "png"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleConfirmDelete = async () => {
    const memId = memory._id || memory.id;
    setIsDeleting(true);

    try {
      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.filter((m) => (m.id || m._id) !== memId);
        localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(updated));
      }

      if (isAuthenticated && firebaseUser) {
        try {
          const token = await getToken();
          await deleteMemoryOnBackend(token, memId);
        } catch (err) {
          console.warn("Backend delete error:", err.message);
        }
      }

      window.dispatchEvent(new CustomEvent("memoryDeleted", { detail: { id: memId } }));
      setIsDeleteConfirmOpen(false);
      handleClose();
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartEdit = () => {
    setEditTitle(memory.title || "");
    setEditDescription(memory.description || "");
    setEditMood(memory.mood || "Reflective");
    setEditVisibility(privacyStr);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const memId = memory._id || memory.id;
    setIsSavingEdit(true);

    const updatedMem = {
      ...memory,
      title: editTitle.trim() || memory.title,
      description: editDescription.trim() || memory.description,
      mood: editMood,
      privacy: editVisibility,
      visibility: editVisibility,
    };

    try {
      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((m) => ((m.id || m._id) === memId ? { ...m, ...updatedMem } : m));
        localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(updated));
      }

      if (isAuthenticated && firebaseUser) {
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append("title", editTitle);
          formData.append("description", editDescription);
          formData.append("mood", editMood);
          formData.append("visibility", editVisibility);
          formData.append("privacy", editVisibility);
          await updateMemoryOnBackend(token, memId, formData);
        } catch (err) {
          console.warn("Backend update error:", err.message);
        }
      }

      setMemory(updatedMem);
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent("memoryUpdated", { detail: { memory: updatedMem } }));
    } catch (e) {
      console.error("Failed to update memory:", e);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 animate-fade-in p-3 sm:p-6 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div 
          className="w-full max-w-[980px] bg-white rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden animate-scale-up max-h-[92vh] min-h-[580px]"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* --- HEADER / MEDIA HERO SECTION --- */}

          {/* VOICE MEMORY HEADER */}
          {isVoice && (
            <div className="bg-gradient-to-br from-[#4A3AFF] to-[#7b6eff] text-white p-6 sm:p-8 relative flex flex-col">
              <button 
                onClick={handleClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-stone-900 rounded-full transition-colors backdrop-blur-md z-20 cursor-pointer shadow-md"
                title="Close preview"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Mic size={16} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-extrabold tracking-widest uppercase opacity-90">VOICE MEMORY</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold mb-2 leading-tight">{memory.title}</h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium mb-6">{memoryDate}</p>

              {/* Functional Custom Audio Player Bar */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 mt-auto shadow-inner">
                {audioSrc && (
                  <audio 
                    ref={audioPlayerRef} 
                    src={audioSrc} 
                    onEnded={() => setIsPlayingAudio(false)} 
                    onTimeUpdate={(e) => setAudioCurrentTime(e.target.currentTime)} 
                    onLoadedMetadata={(e) => setAudioDuration(e.target.duration)} 
                  />
                )}

                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlayAudio}
                    className="w-12 h-12 rounded-full bg-white text-[#4A3AFF] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shrink-0 cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                  </button>

                  <div className="flex-1 flex flex-col gap-1.5">
                    {/* Interactive Audio Progress Bar */}
                    <input 
                      type="range"
                      min="0"
                      max={audioDuration || 100}
                      value={audioCurrentTime}
                      onChange={(e) => {
                        const newTime = Number(e.target.value);
                        setAudioCurrentTime(newTime);
                        if (audioPlayerRef.current) audioPlayerRef.current.currentTime = newTime;
                      }}
                      className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                    />

                    <div className="flex justify-between text-xs font-bold text-white/80">
                      <span>{Math.floor(audioCurrentTime / 60)}:{(Math.floor(audioCurrentTime) % 60).toString().padStart(2, '0')}</span>
                      <span>{memory.duration || `${Math.floor((audioDuration || 0) / 60)}:${(Math.floor(audioDuration || 0) % 60).toString().padStart(2, '0')}`}</span>
                    </div>
                  </div>

                  {/* Playback Speed Dropup Menu (3-dots vertical trigger labeled Speed) */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                      className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-white/10 transition-all cursor-pointer shadow-sm"
                      title="Adjust playback speed"
                    >
                      <Gauge size={13} className="text-amber-400" />
                      <span className="hidden sm:inline">Speed</span>
                      <span className="text-[#A5B4FC]">{playbackSpeed}x</span>
                      <MoreVertical size={14} className="text-white/80" />
                    </button>

                    {isSpeedMenuOpen && (
                      <div className="absolute bottom-full right-0 mb-2 bg-stone-900 border border-stone-700/80 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 min-w-[105px] animate-scale-up backdrop-blur-md">
                        <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 border-b border-stone-800 mb-0.5">
                          Speed
                        </div>
                        {[0.75, 1, 1.25, 1.5, 1.75, 2].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => {
                              handleSpeedChange(spd);
                              setIsSpeedMenuOpen(false);
                            }}
                            className={clsx(
                              "w-full text-left px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer",
                              playbackSpeed === spd
                                ? "bg-[#4A3AFF] text-white shadow-sm"
                                : "text-stone-300 hover:bg-stone-800 hover:text-white"
                            )}
                          >
                            <span>{spd}x</span>
                            {playbackSpeed === spd && <Check size={12} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISUAL / MEDIA MEMORY HERO CAROUSEL */}
          {/* VISUAL / MEDIA MEMORY HERO CAROUSEL */}
          {!isVoice && hasMedia && (
            <div className="p-3 sm:p-4 bg-stone-900 border-b border-stone-800">
              <div className="h-[160px] sm:h-[190px] bg-stone-950 rounded-2xl relative flex flex-col justify-end group select-none overflow-hidden border border-stone-800/80 shadow-inner">
                
                {/* Floating X Cross Close Button */}
                <button 
                  onClick={handleClose}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black text-white rounded-full transition-all shadow-xl backdrop-blur-md z-30 cursor-pointer border border-white/10"
                  title="Close preview"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>

                {/* Media Display (Fixed height, object-cover filling rectangular container) */}
                {activeMedia?.type === "video" ? (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black group/vid">
                    <video 
                      ref={videoPlayerRef}
                      src={activeMedia?.url} 
                      controls 
                      onEnded={() => setIsPlayingVideo(false)}
                      onTimeUpdate={(e) => setVideoCurrentTime(e.target.currentTime)}
                      onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                      className="w-full h-full object-cover"
                    />

                    {/* Interactive Video Playback & Speed Controller Bar */}
                    <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-2xl p-2 flex items-center justify-between gap-3 text-white z-20 border border-white/10 opacity-90 group-hover/vid:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={togglePlayVideo}
                          className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shrink-0 cursor-pointer shadow-md"
                        >
                          {isPlayingVideo ? <Pause size={14} strokeWidth={2.5} /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>

                        <span className="text-[11px] font-bold text-white/90">
                          {Math.floor(videoCurrentTime / 60)}:{(Math.floor(videoCurrentTime) % 60).toString().padStart(2, '0')} / {Math.floor((videoDuration || 0) / 60)}:{(Math.floor(videoDuration || 0) % 60).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Video Speed Toggles */}
                      <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                        {[1, 1.25, 1.5, 1.75, 2].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => handleVideoSpeedChange(spd)}
                            className={clsx(
                              "px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                              videoPlaybackSpeed === spd ? "bg-white text-black shadow-xs" : "text-white/80 hover:text-white"
                            )}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : brokenImages[activeMedia?.url] ? (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950 text-stone-400 p-6 text-center">
                    <ImageIcon size={40} className="mb-2 opacity-50 text-[#818CF8]" />
                    <span className="font-bold text-sm text-stone-200">{memory.title}</span>
                    <span className="text-xs opacity-60 mt-1">Photo memory placeholder</span>
                  </div>
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                    title="Click to expand full screen"
                  >
                    <img 
                      src={activeMedia?.url} 
                      alt={memory.title || "Photo memory"}
                      onError={() => setBrokenImages(prev => ({ ...prev, [activeMedia?.url]: true }))}
                      className="w-full h-full object-cover opacity-95 transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <Maximize2 size={12} /> Click to expand
                    </div>
                  </div>
                )}

                {/* Dark gradient overlay for title contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-10" />

                {/* Carousel Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button 
                      onClick={prevMedia}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-20 shadow-lg cursor-pointer"
                      title="Previous media"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextMedia}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-20 shadow-lg cursor-pointer"
                      title="Next media"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Header Overlay (Title, Date & Badge over covered image) */}
                <div className="relative z-20 p-4 sm:p-5 pt-0 pointer-events-none">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="px-2.5 py-0.5 rounded-full bg-[#3b82f6] text-white flex items-center gap-1 text-[10px] font-extrabold shadow-sm">
                      {activeMedia?.type === "video" ? <Film size={12} /> : <ImageIcon size={12} />}
                      <span>{activeMedia?.type === "video" ? "VIDEO MEMORY" : "PHOTO MEMORY"}</span>
                    </div>
                    {mediaList.length > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md">
                        {activeMediaIndex + 1} of {mediaList.length}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{memory.title}</h2>
                  <p className="text-white/80 text-[11px] sm:text-xs font-semibold drop-shadow-sm">{memoryDate}</p>
                </div>

                {/* Thumbnail Strip */}
                {mediaList.length > 1 && (
                  <div className="relative z-20 px-6 pb-4 flex items-center gap-2 overflow-x-auto">
                    {mediaList.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={clsx(
                          "w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-stone-900 cursor-pointer",
                          activeMediaIndex === idx ? "border-[#4A3AFF] scale-105 shadow-md" : "border-white/40 opacity-70 hover:opacity-100"
                        )}
                      >
                        {m.type === "video" ? (
                          <div className="w-full h-full flex items-center justify-center bg-stone-950 text-white relative">
                            <Play size={14} fill="currentColor" />
                          </div>
                        ) : (
                          <img src={m.url} alt="thumbnail" className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WRITTEN JOURNAL HEADER */}
          {!isVoice && !hasMedia && (
            <div className="bg-white px-8 pt-8 pb-4 relative flex flex-col border-b border-stone-100">
              <button 
                onClick={handleClose}
                className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-500 hover:bg-stone-200 rounded-full transition-colors z-10 cursor-pointer"
                title="Close preview"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center">
                  <FileText size={16} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-extrabold tracking-widest uppercase text-[#10b981]">WRITTEN JOURNAL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-stone-900 leading-tight">{memory.title}</h2>
              <p className="text-stone-400 text-sm font-medium">{memoryDate}</p>
            </div>
          )}

          {/* --- BODY CONTENT & NESTED COMMENTS SECTION --- */}
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-white">
            
            {/* Main Story Content / Inline Edit Form */}
            <div className="flex-1 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-stone-100 flex flex-col justify-between space-y-6">
              <div>
                {isEditing ? (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-bold text-stone-900 text-base mb-2">Edit Memory Details</h3>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium text-stone-800 focus:outline-none focus:border-[#4A3AFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Description / Story</label>
                      <textarea 
                        rows={5}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl p-3 text-sm font-medium text-stone-800 focus:outline-none focus:border-[#4A3AFF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Mood</label>
                        <select 
                          value={editMood}
                          onChange={(e) => setEditMood(e.target.value)}
                          className="w-full border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-800"
                        >
                          <option value="Reflective">Reflective</option>
                          <option value="Joyful">Joyful</option>
                          <option value="Nostalgic">Nostalgic</option>
                          <option value="Grateful">Grateful</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Visibility</label>
                        <select 
                          value={editVisibility}
                          onChange={(e) => setEditVisibility(e.target.value)}
                          className="w-full border border-stone-200 rounded-xl p-2.5 text-xs font-semibold text-stone-800"
                        >
                          <option value="Private">Private</option>
                          <option value="Family">Family</option>
                          <option value="Public">Public</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        disabled={isSavingEdit}
                        className="px-5 py-2 rounded-xl bg-[#4A3AFF] text-white font-bold text-xs hover:bg-[#3b2dd1] flex items-center gap-1.5 shadow-sm"
                      >
                        {isSavingEdit ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                      <FileText size={16} className="text-[#4A3AFF]" /> {isVoice ? "Transcript & Story" : "Memory Reflection"}
                    </h3>
                    <p className="text-stone-600 leading-relaxed text-[15px] whitespace-pre-wrap mb-6">
                      {memory.description || (isVoice ? "Voice recording reflection captured on Spoken Odyssey." : "No written description provided for this memory.")}
                    </p>
                  </>
                )}
              </div>

              {/* --- FACEBOOK-STYLE COMMENTS & REPLIES (WITH EMOJI POP-OVER FOR ALL COMMENTS) --- */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setShowCommentsSection(!showCommentsSection)}
                    className="font-bold text-stone-800 text-sm flex items-center gap-2 hover:text-[#4A3AFF] transition-colors cursor-pointer"
                  >
                    <MessageSquare size={16} className="text-[#4A3AFF]" /> 
                    <span>Comments ({totalCommentsAndRepliesCount})</span>
                    {showCommentsSection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <span className="text-xs font-semibold text-stone-400">
                    {showCommentsSection ? "Click to hide" : "Click to view"}
                  </span>
                </div>

                {showCommentsSection && (
                  <div className="animate-fade-in space-y-4">
                    {/* Main Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input 
                        type="text" 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a reflection or comment..."
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#4A3AFF] transition-all"
                      />
                      <button 
                        type="submit" 
                        disabled={isPostingComment || !commentInput.trim()}
                        className="bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {isPostingComment ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Post
                      </button>
                    </form>

                    {/* Comments & Nested Replies List */}
                    <div className="space-y-4 pr-1">
                      {comments.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">No comments yet. Leave the first reflection!</p>
                      ) : (
                        comments.map((c) => {
                          const commentId = c.id || c._id;
                          const allReplies = flattenReplies(c.replies, c.author);
                          const hasReplies = allReplies.length > 0;
                          const isReplyingThis = activeReplyId === commentId;
                          const isShowReplies = !!expandedReplies[commentId];

                          const commentReactionMeta = REACTION_EMOJIS.find(r => r.id === c.userReaction);
                          const totalCommentReactions = countReactionsSafely(c.reactions);

                          return (
                            <div key={commentId} className="py-2.5 flex flex-col gap-1.5 border-b border-stone-100/90 last:border-none">
                              {/* Comment Header */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center font-bold text-xs">
                                    {(c.author || c.user?.displayName || "U").charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-bold text-xs text-stone-900">{c.author || c.user?.displayName || "Family Member"}</span>
                                </div>
                                <span className="text-[10px] text-stone-400 font-medium">{c.time || "Recent"}</span>
                              </div>

                              {/* Comment Text with Blue Mention Highlighting */}
                              <p className="text-xs text-stone-700 font-medium leading-relaxed pl-9">{renderTextWithMentions(c.text || c.content)}</p>

                              {/* Comment Action Bar with Emoji Pop-over */}
                              <div className="flex items-center gap-4 pl-9 text-[11px] font-bold text-stone-500 pt-0.5">
                                
                                {/* Emoji Reaction Pop-over Trigger for Comment */}
                                <div className="relative">
                                  {activeCommentPickerId === commentId && (
                                    <div 
                                      className="absolute bottom-full mb-1.5 left-0 bg-white rounded-full p-1.5 shadow-xl border border-stone-200 flex items-center gap-1.5 z-40 animate-scale-up backdrop-blur-md"
                                      onMouseLeave={() => setActiveCommentPickerId(null)}
                                    >
                                      {REACTION_EMOJIS.map((r) => (
                                        <button
                                          key={r.id}
                                          type="button"
                                          onClick={() => handleReactToComment(commentId, r.id)}
                                          className="w-7 h-7 rounded-full hover:scale-125 transition-transform flex items-center justify-center text-base cursor-pointer hover:bg-stone-100"
                                          title={r.label}
                                        >
                                          {r.emoji}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  <button 
                                    type="button"
                                    onMouseEnter={() => setActiveCommentPickerId(commentId)}
                                    onClick={() => setActiveCommentPickerId(activeCommentPickerId === commentId ? null : commentId)}
                                    className={clsx(
                                      "flex items-center gap-1 hover:text-[#4A3AFF] transition-colors cursor-pointer text-[11px] font-bold",
                                      commentReactionMeta ? commentReactionMeta.color : "text-stone-500"
                                    )}
                                  >
                                    <span>{commentReactionMeta ? commentReactionMeta.emoji : "👍"}</span>
                                    <span>{commentReactionMeta ? commentReactionMeta.label : "React"}</span>
                                    {totalCommentReactions > 0 && <span className="text-[10px] opacity-75">({totalCommentReactions})</span>}
                                  </button>
                                </div>

                                <button 
                                  onClick={() => setActiveReplyId(isReplyingThis ? null : commentId)}
                                  className="flex items-center gap-1 hover:text-[#4A3AFF] transition-colors cursor-pointer"
                                >
                                  <Reply size={12} /> Reply
                                </button>

                                {hasReplies && (
                                  <button 
                                    onClick={() => toggleExpandReplies(commentId)}
                                    className="text-[#4A3AFF] hover:underline cursor-pointer ml-auto"
                                  >
                                    {isShowReplies ? `Hide ${allReplies.length} replies` : `Show ${allReplies.length} replies`}
                                  </button>
                                )}
                              </div>

                              {/* Inline Reply Input for Top-Level Comment */}
                              {isReplyingThis && (
                                <form onSubmit={(e) => handleAddReply(e, commentId, null, c.author)} className="flex gap-2 mt-2 pl-9 animate-fade-in">
                                  <input 
                                    type="text" 
                                    value={replyInput}
                                    onChange={(e) => setReplyInput(e.target.value)}
                                    placeholder={`Reply to ${c.author || 'comment'}...`}
                                    className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#4A3AFF]"
                                    autoFocus
                                  />
                                  <button 
                                    type="submit" 
                                    disabled={isPostingReply || !replyInput.trim()}
                                    className="bg-[#4A3AFF] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                  >
                                    {isPostingReply ? <Loader2 size={12} className="animate-spin" /> : "Reply"}
                                  </button>
                                </form>
                              )}

                              {/* Nested Replies Stream (Simple, Background-Free with Indented Thread Line) */}
                              {hasReplies && isShowReplies && (
                                <div className="mt-2 pl-6 space-y-2 border-l-2 border-[#4A3AFF]/30 ml-3">
                                  {allReplies.map((r) => {
                                    const replyId = r.id || r._id;
                                    const isReplyingReply = activeReplyId === replyId;
                                    const replyReactionMeta = REACTION_EMOJIS.find(em => em.id === r.userReaction);
                                    const totalReplyReactions = countReactionsSafely(r.reactions);
                                    const isSub = r.isSubReply;

                                    return (
                                      <div 
                                        key={replyId} 
                                        className={clsx(
                                          "flex flex-col gap-1 py-1.5 transition-all pl-2",
                                          isSub ? "ml-3 border-l-2 border-l-[#4A3AFF]/50" : ""
                                        )}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-bold text-[11px] text-stone-900">{r.author || "User"}</span>
                                          <span className="text-[9px] text-stone-400 font-medium">{r.time || "Recent"}</span>
                                        </div>

                                        {/* Reply Text with Blue Mention Highlighting */}
                                        <p className="text-[11px] text-stone-600 font-medium">{renderTextWithMentions(r.text)}</p>

                                        {/* Action Bar for Reply (Multi-Emoji React & Reply to Reply) */}
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-stone-500 pt-0.5">
                                          
                                          {/* Emoji Reaction Pop-over Trigger for Reply */}
                                          <div className="relative">
                                            {activeCommentPickerId === replyId && (
                                              <div 
                                                className="absolute bottom-full mb-1.5 left-0 bg-white rounded-full p-1.5 shadow-xl border border-stone-200 flex items-center gap-1.5 z-40 animate-scale-up backdrop-blur-md"
                                                onMouseLeave={() => setActiveCommentPickerId(null)}
                                              >
                                                {REACTION_EMOJIS.map((em) => (
                                                  <button
                                                    key={em.id}
                                                    type="button"
                                                    onClick={() => handleReactToComment(replyId, em.id)}
                                                    className="w-6 h-6 rounded-full hover:scale-125 transition-transform flex items-center justify-center text-sm cursor-pointer hover:bg-stone-100"
                                                    title={em.label}
                                                  >
                                                    {em.emoji}
                                                  </button>
                                                ))}
                                              </div>
                                            )}

                                            <button 
                                              type="button"
                                              onMouseEnter={() => setActiveCommentPickerId(replyId)}
                                              onClick={() => setActiveCommentPickerId(activeCommentPickerId === replyId ? null : replyId)}
                                              className={clsx(
                                                "flex items-center gap-1 hover:text-[#4A3AFF] transition-colors cursor-pointer text-[10px] font-bold",
                                                replyReactionMeta ? replyReactionMeta.color : "text-stone-500"
                                              )}
                                            >
                                              <span>{replyReactionMeta ? replyReactionMeta.emoji : "👍"}</span>
                                              <span>{replyReactionMeta ? replyReactionMeta.label : "React"}</span>
                                              {totalReplyReactions > 0 && <span className="text-[9px] opacity-75">({totalReplyReactions})</span>}
                                            </button>
                                          </div>

                                          <button 
                                            onClick={() => setActiveReplyId(isReplyingReply ? null : replyId)}
                                            className="flex items-center gap-1 hover:text-[#4A3AFF] transition-colors cursor-pointer text-[#4A3AFF]"
                                          >
                                            <Reply size={11} /> Reply
                                          </button>
                                        </div>

                                        {/* Inline Reply Input for Reply to Reply */}
                                        {isReplyingReply && (
                                          <form onSubmit={(e) => handleAddReply(e, commentId, replyId, r.author)} className="flex gap-2 mt-1 animate-fade-in">
                                            <input 
                                              type="text" 
                                              value={replyInput}
                                              onChange={(e) => setReplyInput(e.target.value)}
                                              placeholder={`Reply to @${r.author || 'user'}...`}
                                              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-[11px] font-medium focus:outline-none focus:border-[#4A3AFF]"
                                              autoFocus
                                            />
                                            <button 
                                              type="submit" 
                                              disabled={isPostingReply || !replyInput.trim()}
                                              className="bg-[#4A3AFF] text-white px-3 py-1 rounded-xl text-[11px] font-bold transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                            >
                                              {isPostingReply ? <Loader2 size={11} className="animate-spin" /> : "Reply"}
                                            </button>
                                          </form>
                                        )}

                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Details Sidebar (Right) */}
            <div className="w-full md:w-[320px] p-6 sm:p-8 bg-stone-50/70 flex flex-col justify-between shrink-0 border-t md:border-t-0 md:border-l border-stone-100">
              <div className="space-y-4">
                <h4 className="text-[11px] font-extrabold tracking-widest text-stone-400 uppercase">MEMORY DETAILS</h4>
                
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-stone-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">DATE</p>
                    <p className="text-sm font-semibold text-stone-800">{memoryDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Smile size={18} className="text-[#f59e0b] shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">MOOD</p>
                    <p className="text-sm font-semibold text-stone-800">{memory.mood || "Reflective"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {privacyStr === "Family" ? <Users size={18} className="text-[#3b82f6] shrink-0" /> :
                   privacyStr === "Public" ? <Globe size={18} className="text-[#10b981] shrink-0" /> :
                   <Lock size={18} className="text-stone-400 shrink-0" />}
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">VISIBILITY</p>
                    <p className="text-sm font-semibold text-stone-800">{privacyStr}</p>
                  </div>
                </div>

                {memory.duration && (
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">DURATION</p>
                      <p className="text-sm font-semibold text-stone-800">{memory.duration}</p>
                    </div>
                  </div>
                )}

                {hasMedia && (
                  <div className="flex items-center gap-3">
                    <ImageIcon size={18} className="text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">ATTACHED MEDIA</p>
                      <p className="text-sm font-semibold text-stone-800">{mediaList.length} Photo / Video(s)</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Bookmark size={12}/> TAGS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(memory.tags || ["reflection", "archive"]).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#EEF2FF] text-[#4A3AFF] rounded-full text-[11px] font-bold">
                        #{tag.toLowerCase().replace('#', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Reflection Box attached directly to Details */}
              <div className="mt-6 p-4 rounded-2xl border border-[#D5DDFF] bg-[#EEF2FF] shadow-xs">
                <div className="flex items-center gap-2 mb-1.5 text-[#4A3AFF]">
                  <Sparkles size={16} strokeWidth={2.5}/>
                  <span className="text-[11px] font-extrabold tracking-widest uppercase">AI Insights</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  This story captures meaningful moments of your personal journey preserved in your Odyssey archive.
                </p>
              </div>
              
            </div>
          </div>

          {/* --- FOOTER SECTION WITH FACEBOOK-STYLE HOVER REACTION PICKER & ACTIONS --- */}
          <div className="p-4 sm:px-8 sm:py-4 border-t border-stone-100 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Facebook-Style Floating Reaction Picker */}
            <div className="relative">
              
              {/* Floating Reaction Emoji Picker Pop-over */}
              {isReactionPickerOpen && (
                <div 
                  className="absolute bottom-full mb-3 left-0 bg-white rounded-full p-2 shadow-2xl border border-stone-200/80 flex items-center gap-2 animate-scale-up z-50 backdrop-blur-md"
                  onMouseLeave={() => setIsReactionPickerOpen(false)}
                >
                  {REACTION_EMOJIS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectReaction(r.id)}
                      className="w-9 h-9 rounded-full hover:scale-125 transition-transform flex items-center justify-center text-xl cursor-pointer hover:bg-stone-100"
                      title={r.label}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Reaction Trigger Button */}
              <button 
                onMouseEnter={() => setIsReactionPickerOpen(true)}
                onClick={() => setIsReactionPickerOpen(!isReactionPickerOpen)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all shadow-xs cursor-pointer",
                  activeReactionMeta 
                    ? activeReactionMeta.bg 
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
                )}
              >
                <span className="text-sm">{activeReactionMeta ? activeReactionMeta.emoji : "❤️"}</span>
                <span>{activeReactionMeta ? activeReactionMeta.label : "React"}</span>
                <span className="bg-black/10 px-2 py-0.5 rounded-full text-[10px]">{totalReactionsCount}</span>
              </button>

            </div>

            {/* Functional Action Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <button 
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-[#4A3AFF] active:scale-95 transition-all text-xs font-bold shadow-xs cursor-pointer"
              >
                <Share2 size={14} className="text-[#4A3AFF]" /> Share
              </button>

              <button 
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors text-xs font-bold shadow-xs cursor-pointer"
              >
                <Download size={14} /> Download
              </button>

              <button 
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors text-xs font-bold shadow-xs cursor-pointer"
              >
                <Edit2 size={14} /> Edit
              </button>

              <button 
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-xs font-bold shadow-xs cursor-pointer"
              >
                <Trash2 size={14} /> Delete
              </button>

              <button 
                onClick={handleClose}
                className="px-5 py-2 rounded-[12px] bg-[#4A3AFF] text-white hover:bg-[#3b2dd1] transition-colors text-xs font-bold shadow-sm cursor-pointer ml-1"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* --- CUSTOM SHARE MODAL POPUP --- */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-100 flex flex-col relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center font-bold shrink-0">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Share Memory</h3>
                <p className="text-xs text-stone-500 font-medium">Share "{memory.title}" with friends & family</p>
              </div>
            </div>

            {/* Copy Link Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Direct Memory Link</label>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl p-1.5 pl-3">
                <input 
                  type="text" 
                  readOnly 
                  value={getShareUrl()} 
                  className="flex-1 bg-transparent text-xs font-medium text-stone-700 outline-none select-all truncate"
                />
                <button 
                  onClick={handleCopyLink}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs",
                    isCopied ? "bg-emerald-500 text-white" : "bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white"
                  )}
                >
                  {isCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                </button>
              </div>
            </div>

            {/* External Social Share Buttons */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">Share Externally</label>
              <div className="grid grid-cols-5 gap-2 text-center">
                <button 
                  onClick={() => handleExternalShare("whatsapp")}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                  title="Share to WhatsApp"
                >
                  <MessageCircle size={22} />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </button>

                <button 
                  onClick={() => handleExternalShare("facebook")}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                  title="Share to Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span className="text-[10px] font-bold">Facebook</span>
                </button>

                <button 
                  onClick={() => handleExternalShare("twitter")}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all cursor-pointer"
                  title="Share to X / Twitter"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span className="text-[10px] font-bold">Twitter</span>
                </button>

                <button 
                  onClick={() => handleExternalShare("linkedin")}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all cursor-pointer"
                  title="Share to LinkedIn"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  <span className="text-[10px] font-bold">LinkedIn</span>
                </button>

                <button 
                  onClick={() => handleExternalShare("email")}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all cursor-pointer"
                  title="Share via Email"
                >
                  <Mail size={22} />
                  <span className="text-[10px] font-bold">Email</span>
                </button>
              </div>
            </div>

            {/* Native Share button for Mobile */}
            {typeof navigator !== "undefined" && navigator.share && (
              <button 
                onClick={handleNativeShare}
                className="w-full py-3 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <ExternalLink size={15} /> More Sharing Options
              </button>
            )}

          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION POPUP MODAL --- */}
      {isDeleteConfirmOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsDeleteConfirmOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-100 flex flex-col items-center text-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-inner">
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">Delete Memory?</h3>
            <p className="text-stone-500 text-sm font-medium leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-bold text-stone-800">"{memory.title}"</span>? This memory will be permanently removed from your Odyssey archive.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-3 rounded-2xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FULLSCREEN LIGHTBOX MODAL FOR IMAGES/VIDEOS --- */}
      {isLightboxOpen && activeMedia && (
        <div 
          className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Top Header */}
          <div className="w-full flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{memory.title}</span>
              {mediaList.length > 1 && (
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  {activeMediaIndex + 1} / {mediaList.length}
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              title="Close full screen"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Lightbox Media Content */}
          <div 
            className="flex-1 w-full max-w-5xl flex items-center justify-center my-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaList.length > 1 && (
              <button 
                onClick={prevMedia}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl z-20 cursor-pointer"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {activeMedia.type === "video" ? (
              <div className="relative w-full max-w-4xl max-h-[80vh] bg-black rounded-2xl overflow-hidden flex flex-col justify-end group/vid shadow-2xl">
                <video 
                  ref={videoPlayerRef}
                  src={activeMedia.url} 
                  controls 
                  autoPlay
                  onEnded={() => setIsPlayingVideo(false)}
                  onTimeUpdate={(e) => setVideoCurrentTime(e.target.currentTime)}
                  onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                  className="max-h-[80vh] max-w-full object-contain" 
                />

                {/* Lightbox Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between gap-3 text-white z-20 border border-white/10 opacity-90 group-hover/vid:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={togglePlayVideo}
                      className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shrink-0 cursor-pointer shadow-md"
                    >
                      {isPlayingVideo ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>

                    <span className="text-xs font-bold text-white/90">
                      {Math.floor(videoCurrentTime / 60)}:{(Math.floor(videoCurrentTime) % 60).toString().padStart(2, '0')} / {Math.floor((videoDuration || 0) / 60)}:{(Math.floor(videoDuration || 0) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Video Speed Toggles */}
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                    {[1, 1.25, 1.5, 1.75, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleVideoSpeedChange(spd)}
                        className={clsx(
                          "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          videoPlaybackSpeed === spd ? "bg-white text-black shadow-xs" : "text-white/80 hover:text-white"
                        )}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : brokenImages[activeMedia.url] ? (
              <div className="w-80 h-80 rounded-3xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center text-stone-400 p-6 text-center shadow-2xl">
                <ImageIcon size={54} className="mb-3 text-[#818CF8]" />
                <span className="font-bold text-base text-stone-200">{memory.title}</span>
                <span className="text-xs text-stone-500 mt-1">Image preview unavailable</span>
              </div>
            ) : (
              <img 
                src={activeMedia.url} 
                alt={memory.title || "Photo memory"} 
                onError={() => setBrokenImages(prev => ({ ...prev, [activeMedia.url]: true }))}
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl" 
              />
            )}

            {mediaList.length > 1 && (
              <button 
                onClick={nextMedia}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl z-20 cursor-pointer"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Lightbox Thumbnail Strip */}
          {mediaList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
              {mediaList.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => { setIsPlayingVideo(false); setActiveMediaIndex(idx); }}
                  className={clsx(
                    "w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-stone-900 cursor-pointer",
                    activeMediaIndex === idx ? "border-[#4A3AFF] scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                  )}
                >
                  {m.type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center bg-stone-950 text-white">
                      <Play size={14} fill="currentColor" />
                    </div>
                  ) : (
                    <img src={m.url} alt="thumb" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
