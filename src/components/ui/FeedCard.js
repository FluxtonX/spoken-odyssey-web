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
import { interactWithMemoryOnBackend } from "@/services/backend";

const reactions = [
  { id: "heart", label: "Heart", icon: "♥", color: "text-rose-600" },
  { id: "like", label: "Like", icon: "👍", color: "text-[var(--brand)]" },
  { id: "wow", label: "Wow", icon: "😮", color: "text-amber-600" },
  { id: "haha", label: "Haha", icon: "😄", color: "text-yellow-600" },
  { id: "angry", label: "Angry", icon: "😡", color: "text-red-600" },
];

export default function FeedCard({ memory, onEdit, onDelete }) {
  const { firebaseUser, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState((memory.comments || 0) + 1);
  const [shareNotice, setShareNotice] = useState("");
  const holdTimerRef = useRef(null);

  const toggleComments = () => {
    const nextOpen = !commentsOpen;
    setCommentsOpen(nextOpen);
    if (nextOpen && isAuthenticated && firebaseUser) {
      firebaseUser.getIdToken().then((token) => {
        interactWithMemoryOnBackend(token, memory.id, "view").catch(console.error);
      });
    }
  };

  useEffect(() => {
    setUserProfile(getStoredUserProfile());
    const loadProfile = () => {
      setUserProfile(getStoredUserProfile());
    };
    
    // Load initial count if stored
    const saved = localStorage.getItem(`comments_${memory.id}`);
    if (saved) {
      try {
        setCommentsCount(JSON.parse(saved).length);
      } catch {}
    }
    
    const handleCommentsUpdate = (e) => {
      setCommentsCount(e.detail);
    };

    window.addEventListener("profileUpdated", loadProfile);
    window.addEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    
    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      window.removeEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    };
  }, [memory.id]);

  const getCommentAuthorDetails = (authorName) => {
    if (
      authorName === "Alexander" || 
      authorName === "Alexander Mitchell" ||
      (userProfile && authorName === userProfile.name)
    ) {
      return {
        name: userProfile?.name || "Alexander Mitchell",
        avatar: userProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80"
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

  const owner = memory.ownerId === "alexander"
    ? {
        name: userProfile?.name || "Alexander Mitchell",
        avatar: userProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80",
        id: "alexander"
      }
    : (people.find((person) => person.id === memory.ownerId) ?? people[0]);

  const selectedReaction = reactions.find((item) => item.id === reaction);
  const reactionCount = (memory.likes || 0) + (reaction ? 1 : 0);

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
    setReaction(nextReaction);
    if (isAuthenticated && firebaseUser && nextReaction) {
      firebaseUser.getIdToken().then((token) => {
        interactWithMemoryOnBackend(token, memory.id, "like").catch(console.error);
      });
    }
  };

  const chooseReaction = (nextReaction) => {
    setReaction(nextReaction);
    setReactionPickerOpen(false);
    if (isAuthenticated && firebaseUser && nextReaction) {
      firebaseUser.getIdToken().then((token) => {
        interactWithMemoryOnBackend(token, memory.id, "like").catch(console.error);
      });
    }
  };

  const addComment = (event) => {
    event.preventDefault();
    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    setComments((current) => [
      ...current,
      { id: `${memory.id}-c${Date.now()}`, author: userProfile?.name || "Alexander", text: cleanComment },
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
  const displayDateStr = memory.displayDate || memory.date || "Just now";

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
            {reactionCount} reactions
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
