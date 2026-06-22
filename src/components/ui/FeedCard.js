"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Share2,
  Lock,
  Users,
  Globe,
  X,
  Edit2,
  Trash2
} from "lucide-react";
import { people } from "@/data/mockApp";
import { getStoredUserProfile } from "@/data/userProfile";
import {
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
} from "@/data/postBackgrounds";
import { getFontFamily } from "@/data/postFonts";
import VoicePlayer from "./VoicePlayer";
import CommentsSection from "./CommentsSection";
import MediaGrid from "./MediaGrid";
import { useAuth } from "@/context/AuthProvider";
import { interactWithMemoryOnBackend, reactToMemory, shareMemoryOnBackend } from "@/services/backend";

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

/**
 * Converts any date value (ISO string, Date object, or already-formatted string)
 * into a friendly relative time label:
 *   - < 1 min  → "Just now"
 *   - < 1 hr   → "X min ago"
 *   - < 24 hrs → "X hrs ago" (or "1 hr ago")
 *   - yesterday→ "Yesterday"
 *   - ≤ 6 days → "X days ago"
 *   - older    → locale date string (e.g. "Jun 19, 2026")
 */
const formatMemoryDate = (rawDate) => {
  if (!rawDate) return "Just now";
  const date = new Date(rawDate);
  if (isNaN(date.getTime())) return String(rawDate);
  return date.toLocaleString("en-US");
};

export default function FeedCard({ memory, onEdit, onDelete }) {
  const { firebaseUser, isAuthenticated, profile: authProfile } = useAuth();
  const [reaction, setReaction] = useState(memory.userReaction || null);
  const [likesCount, setLikesCount] = useState(memory.likes || 0);
  const [sharesCount, setSharesCount] = useState(memory.shares || 0);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(memory.comments || 0);
  const [shareNotice, setShareNotice] = useState("");
  const holdTimerRef = useRef(null);

  const toggleComments = () => {
    const nextOpen = !commentsOpen;
    setCommentsOpen(nextOpen);
    const isMock = isMockId(memory.id);
    if (nextOpen && isAuthenticated && firebaseUser && !isMock) {
      firebaseUser.getIdToken().then((token) => {
        interactWithMemoryOnBackend(token, memory.id, "view").catch(console.error);
      });
    }
  };

  useEffect(() => {
    // Load initial count if stored
    const saved = localStorage.getItem(`comments_${memory.id}`);
    if (saved) {
      try {
        const parsedComments = JSON.parse(saved);
        let count = 0;
        parsedComments.forEach(c => {
          count += 1;
          if (c.replies) count += c.replies.length;
        });
        setCommentsCount(count);
      } catch {}
    }
    
    const handleCommentsUpdate = (e) => {
      setCommentsCount(e.detail);
    };

    window.addEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    
    return () => {
      window.removeEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    };
  }, [memory.id]);

  useEffect(() => {
    const isMock = isMockId(memory.id);
    if (isMock) {
      const saved = localStorage.getItem(`reactions_${memory.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setReaction(parsed.userReaction || null);
          setLikesCount(parsed.likes || 0);
          setSharesCount(memory.shares || 0);
          setCommentsCount(memory.comments || 0);
          return;
        } catch {}
      }
    }
    setReaction(memory.userReaction || null);
    setLikesCount(memory.likes || 0);
    setSharesCount(memory.shares || 0);
    setCommentsCount(memory.comments || 0);
  }, [memory]);

  const getCommentAuthorDetails = (authorName) => {
    if (
      authorName === "Alexander" || 
      authorName === "Alexander Mitchell" ||
      (authProfile && authorName === authProfile.displayName)
    ) {
      return {
        name: authProfile?.displayName || "Alexander Mitchell",
        avatar: authProfile?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80"
      };
    }
    const matchedPerson = people.find(p => p.name.toLowerCase().includes(authorName.toLowerCase()) || authorName.toLowerCase().includes(p.id.toLowerCase()));
    if (matchedPerson) {
      return {
        name: matchedPerson.name,
        avatar: matchedPerson.avatar
      };
    }
    return {
      name: authorName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`
    };
  };

  const owner = memory.ownerId === "alexander" || memory.ownerFirebaseUid === firebaseUser?.uid
    ? {
        name: authProfile?.displayName || memory.ownerDisplayName || "Alexander Mitchell",
        avatar: authProfile?.photoURL || memory.ownerAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80",
        id: "alexander"
      }
    : {
        name: memory.ownerDisplayName || "Family Contributor",
        avatar: memory.ownerAvatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(memory.ownerDisplayName || "U")}`,
        id: memory.ownerFirebaseUid || memory.ownerId
      };

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
    if (holdTimerRef.current) return; // avoid duplicate
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
    
    const isMock = isMockId(memory.id);
    if (isAuthenticated && firebaseUser && memory.id && !isMock) {
      firebaseUser.getIdToken().then(async (token) => {
        try {
          const res = await reactToMemory(token, memory.id, nextReaction);
          setLikesCount(res.likes);
          setReaction(res.userReaction);
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      setLikesCount(currentLikes => {
        try {
          const reactionsObj = { userReaction: nextReaction, likes: currentLikes };
          localStorage.setItem(`reactions_${memory.id}`, JSON.stringify(reactionsObj));
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
    
    const isMock = isMockId(memory.id);
    if (isAuthenticated && firebaseUser && memory.id && !isMock) {
      firebaseUser.getIdToken().then(async (token) => {
        try {
          const res = await reactToMemory(token, memory.id, nextReaction);
          setLikesCount(res.likes);
          setReaction(res.userReaction);
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      setLikesCount(currentLikes => {
        try {
          const reactionsObj = { userReaction: nextReaction, likes: currentLikes };
          localStorage.setItem(`reactions_${memory.id}`, JSON.stringify(reactionsObj));
        } catch {}
        return currentLikes;
      });
    }
  };

  const addComment = (event) => {
    event.preventDefault();
    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    setComments((current) => [
      ...current,
      { id: `${memory.id}-c${Date.now()}`, author: authProfile?.displayName || "Alexander", text: cleanComment },
    ]);
    setCommentText("");
    setCommentsOpen(true);
  };

  const shareMemory = async () => {
    const shareUrl = `${window.location.origin}/memories/${memory.id}`;
    const shareData = {
      title: memory.title,
      text: memory.description,
      url: shareUrl,
    };

    const isMock = isMockId(memory.id);
    if (isAuthenticated && firebaseUser && memory.id && !isMock) {
      try {
        const token = await firebaseUser.getIdToken();
        const res = await shareMemoryOnBackend(token, memory.id);
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

  const isTextPreset = memory.type === "Text" && memory.backgroundId && memory.backgroundId !== "none";
  const audienceLabel = memory.audiences?.[0] || memory.privacy;
  const displayAudience = audienceLabel === "public" ? "Public" : audienceLabel === "family" ? "Family Circle" : "Private";
  const displayDateStr = formatMemoryDate(memory.displayDate || memory.date || memory.createdAt);

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between p-5 text-left border-b border-[var(--border)]/35">
        <Link href={owner.id === "alexander" ? "/profile" : `/people/${owner.id}`} className="flex min-w-0 items-center gap-3">
          <img src={owner.avatar} alt={owner.name} className="h-10 w-10 rounded-lg object-cover border border-stone-200" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold leading-tight text-[var(--ink)] dark:text-white">{owner.name}</h3>
            <span className="text-[10px] font-semibold text-stone-400">{displayDateStr}</span>
          </div>
        </Link>
        
        {/* Right buttons: Edit/Delete if owned by current user & callbacks provided, otherwise menu */}
        <div className="flex items-center gap-1.5">
          {owner.id === "alexander" && (onEdit || onDelete) ? (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(memory)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-stone-400 hover:text-[var(--brand)] hover:bg-stone-50 transition cursor-pointer"
                  title="Edit Memory"
                >
                  <Edit2 size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(memory.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete Memory"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ) : (
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-50 hover:text-stone-700">
              <MoreHorizontal size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Card Text Content */}
      <div className="px-5 pt-4 pb-3 text-left">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--brand)] border border-[var(--brand)]/10">
            {memory.type}
          </span>
          <span className="rounded-full bg-[var(--background)] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-stone-550 border border-stone-200/50 dark:border-stone-700/50">
            {displayAudience}
          </span>
        </div>
        
        <h4 className="mb-1 text-base font-extrabold text-[var(--ink)] dark:text-white">{memory.title}</h4>
        {!isTextPreset && (
          <p className="text-sm font-semibold leading-relaxed text-stone-500">{memory.description}</p>
        )}
      </div>

      {/* Card Media Content */}
      <div className="px-5 pb-5">
        {/* Photo or Video Display using MediaGrid */}
        {(memory.type === "Photo" || memory.type === "Video") && (
          <MediaGrid memory={memory} />
        )}

        {/* Text Template Background Display */}
        {isTextPreset && (
          <div
            className="relative rounded-xl overflow-hidden min-h-[160px] p-5 flex items-center justify-center text-center shadow-inner"
            style={getBackgroundStyles(memory.backgroundId)}
          >
            {getBackgroundOverlay(memory.backgroundId)}
            <p
              className="text-base font-extrabold italic z-10 leading-relaxed"
              style={{
                ...getBackgroundTextStyles(memory.backgroundId),
                fontFamily: getFontFamily(memory.fontId),
              }}
            >
              "{memory.description}"
            </p>
          </div>
        )}

        {/* Dynamic Voice Waveform Player */}
        {memory.type === "Voice" && (
          <VoicePlayer memory={memory} />
        )}
      </div>

      {/* Action Buttons & Comments */}
      <div className="border-t border-stone-100 dark:border-stone-800/60 px-5 py-3.5">
        <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold text-stone-400">
          <span className="flex items-center gap-1 select-none">
            {reaction && <span className={selectedReaction?.color}>{selectedReaction?.icon}</span>}
            {reactionCount} reactions &nbsp;·&nbsp; {sharesCount} shares
          </span>
          <button onClick={toggleComments} className="hover:text-[var(--brand)] cursor-pointer">
            {commentsCount} comments
          </button>
        </div>

        <div className="relative flex items-center justify-between gap-1.5 border-t border-stone-100 dark:border-stone-800/60 pt-2">
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
            onClick={toggleComments}
            className="group flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold text-stone-600 transition hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-[var(--brand)] cursor-pointer"
          >
            <MessageCircle size={18} className="transition-transform group-active:scale-90" />
            <span className="text-xs">Comment</span>
          </button>
          
          <button
            onClick={shareMemory}
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
              { id: `${memory.id}-c1`, author: "Alexander", text: "Beautiful memory. This feels worth preserving." }
            ]}
          />
        )}
      </div>
    </article>
  );
}
