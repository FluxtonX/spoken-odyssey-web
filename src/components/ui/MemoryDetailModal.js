"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, MessageCircle, Globe, Users, X, Link as LinkIcon, Mail } from "lucide-react";
import WavesBackground from "@/components/layout/WavesBackground";
import MediaGrid from "./MediaGrid";
import VoicePlayer from "./VoicePlayer";
import CommentsSection from "./CommentsSection";
import { useAuth } from "@/context/AuthProvider";
import { reactToMemory, interactWithMemoryOnBackend, shareMemoryOnBackend } from "@/services/backend";
import { getFontFamily } from "@/data/postFonts";
import {
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
} from "@/data/postBackgrounds";

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

export default function MemoryDetailModal({ memory, userProfile, onClose }) {
  const { firebaseUser, isAuthenticated, getToken} = useAuth();
  
  // States copied from FeedCard for realism
  const [reaction, setReaction] = useState(memory.userReaction || null);
  const [likesCount, setLikesCount] = useState(memory.likes || 0);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(memory.comments || 0);
  const [shareNotice, setShareNotice] = useState("");
  const holdTimerRef = useRef(null);

  useEffect(() => {
    // Lock body scroll when open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`comments_${memory.id}`);
    if (saved) {
      try {
        const parsedComments = JSON.parse(saved);
        let count = 0;
        parsedComments.forEach(c => {
          count += 1;
          if (c.replies) count += c.replies.length;
        });
        setTimeout(() => setCommentsCount(count), 0);
      } catch {}
    }
    
    const handleCommentsUpdate = (e) => {
      setCommentsCount(e.detail);
    };

    window.addEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
    return () => window.removeEventListener(`commentsUpdated_${memory.id}`, handleCommentsUpdate);
  }, [memory.id]);

  useEffect(() => {
    const isMock = isMockId(memory.id);
    if (isMock) {
      const saved = localStorage.getItem(`reactions_${memory.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTimeout(() => {
            setReaction(parsed.userReaction || null);
            setLikesCount(parsed.likes || 0);
            setCommentsCount(memory.comments || 0);
          }, 0);
          return;
        } catch {}
      }
    }
    setTimeout(() => {
      setReaction(memory.userReaction || null);
      setLikesCount(memory.likes || 0);
      setCommentsCount(memory.comments || 0);
    }, 0);
  }, [memory]);

  const toggleComments = () => {
    const nextOpen = !commentsOpen;
    setCommentsOpen(nextOpen);
    const isMock = isMockId(memory.id);
    if (nextOpen && isAuthenticated && firebaseUser && !isMock) {
      getToken().then((token) => {
        interactWithMemoryOnBackend(token, memory.id, "view").catch(console.error);
      });
    }
  };

  const persistReactionLocally = (newReactionId, newCount) => {
    if (isMockId(memory.id)) {
      localStorage.setItem(`reactions_${memory.id}`, JSON.stringify({
        userReaction: newReactionId,
        likes: newCount
      }));
    }
  };

  const chooseReaction = async (reactionId) => {
    setReactionPickerOpen(false);
    clearTimeout(holdTimerRef.current);

    let newCount = likesCount;
    if (reaction === reactionId) {
      setReaction(null);
      newCount = Math.max(0, likesCount - 1);
    } else {
      if (!reaction) newCount = likesCount + 1;
      setReaction(reactionId);
    }
    setLikesCount(newCount);
    persistReactionLocally(reaction === reactionId ? null : reactionId, newCount);

    if (!isMockId(memory.id) && isAuthenticated && firebaseUser) {
      try {
        const token = await getToken();
        await reactToMemory(token, memory.id, reaction === reactionId ? "remove" : reactionId);
      } catch (err) {
        console.error("Failed to react to memory", err);
      }
    }
  };

  const quickReact = (e) => {
    if (e) e.preventDefault();
    clearTimeout(holdTimerRef.current);
    if (reactionPickerOpen) {
      // Do not close it immediately, allow the user to tap an emoji
      return;
    }
    chooseReaction("heart");
  };

  const startReactionHold = () => {
    holdTimerRef.current = setTimeout(() => {
      setReactionPickerOpen(true);
    }, 400);
  };

  const clearHoldTimer = () => {
    clearTimeout(holdTimerRef.current);
  };

  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleShare = async () => {
    // We now open the custom share modal instead of native share
    setShareModalOpen(true);
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareNotice("Copied!");
    setTimeout(() => setShareNotice(""), 1800);
  };

  const selectedReaction = reactions.find((r) => r.id === reaction);
  const isTextPreset = memory.type === "Text" && memory.backgroundId && memory.backgroundId !== "none";
  const audienceLabel = memory.audiences?.[0] || memory.privacy || "public";
  
  // Format Date
  const dateObj = new Date(memory.displayDate || memory.date || memory.createdAt);
  const dateStr = isNaN(dateObj.getTime()) 
    ? String(memory.displayDate || memory.date || memory.createdAt || "Just now") 
    : dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    
  // Format Tags
  let tags = memory.tags && memory.tags.length > 0 ? memory.tags : [];
  if (tags.length === 0) tags = memory.type === "Voice" ? ["Grateful", "Family Moments"] : ["Proud", "Career & Growth"];
  
  // Custom Hashtags formatting
  const customTags = ["loving", "grateful"]; // from screenshot
  const hashtags = ["family", "moments"]; // from screenshot

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[var(--background)] overflow-hidden animate-fade-in">
      <WavesBackground>
        <div className="relative z-10 flex-1 overflow-y-auto w-full h-full pb-6">
          <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-12 pb-6">
            
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-8">
              <button onClick={onClose} className="p-2 -ml-2 text-[#4f37ff] hover:bg-[#4f37ff]/10 rounded-full transition cursor-pointer">
                <ArrowLeft size={24} strokeWidth={2.5} />
              </button>
              <div className="relative">
                <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-1.5 text-[#4f37ff] text-sm font-bold hover:bg-[#4f37ff]/10 px-3 py-1.5 rounded-full transition cursor-pointer">
                  <Share2 size={16} strokeWidth={2.5} />
                  Share
                </button>
              </div>
            </div>

            {/* Profile Row */}
            <Link href="/profile" onClick={onClose} className="flex items-center gap-4 mb-6 hover:opacity-80 transition cursor-pointer">
              <img 
                src={userProfile?.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"} 
                alt="Profile" 
                className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white"
              />
              <div>
                <h3 className="text-xl font-black text-stone-900 leading-tight">
                  {userProfile?.displayName || "Dr. Maya Patel"}
                </h3>
                <p className="text-sm font-semibold text-stone-500">
                  {userProfile?.profession || "Cardiac Surgeon"}
                </p>
              </div>
            </Link>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#c8c5ff] bg-[#eff0ff]/50 text-[#4f37ff] text-xs font-bold shadow-sm">
                {audienceLabel === "public" ? <Globe size={12} /> : <Users size={12} />}
                <span className="capitalize">{audienceLabel === "family" ? "Family Circle" : audienceLabel}</span>
              </div>
              {customTags.map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded bg-[#eff0ff] text-[#4f37ff] text-xs font-bold lowercase">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title & Date */}
            <div className="mb-6">
              <h1 className="text-3xl font-black text-stone-900 leading-tight mb-2">
                {memory.title}
              </h1>
              <p className="text-sm font-semibold text-stone-500">
                {dateStr}
              </p>
            </div>

            {/* Main Content Area */}
            <div className="mb-8 space-y-4">
              {(memory.type === "Photo" || memory.type === "Video") && (
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <MediaGrid memory={memory} />
                </div>
              )}
              
              {memory.type === "Voice" && (
                <div className="my-6">
                  <VoicePlayer memory={memory} />
                </div>
              )}

              {isTextPreset && (
                <div
                  className="relative rounded-2xl overflow-hidden min-h-[220px] p-8 flex items-center justify-center text-center shadow-lg"
                  style={getBackgroundStyles(memory.backgroundId)}
                >
                  {getBackgroundOverlay(memory.backgroundId)}
                  <p
                    className="text-2xl font-extrabold italic z-10 leading-relaxed"
                    style={{
                      ...getBackgroundTextStyles(memory.backgroundId),
                      fontFamily: getFontFamily(memory.fontId),
                    }}
                  >
                    &quot;{memory.description}&quot;
                  </p>
                </div>
              )}

              {!isTextPreset && memory.description && (
                <div className={`${(memory.type === "Photo" || memory.type === "Video" || memory.type === "Voice") ? "p-6 rounded-2xl bg-white shadow-sm border border-[#eff0ff]" : "pt-2"}`}>
                  <p className={`font-semibold text-stone-700 leading-relaxed ${memory.type === "Text" ? "text-lg" : "text-[15px] italic text-stone-600"}`}>
                    {memory.type === "Text" ? memory.description : `"${memory.description}"`}
                  </p>
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="flex items-center gap-3 mb-4">
              {hashtags.map(tag => (
                <span key={tag} className="text-[#4f37ff] text-sm font-bold">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-[#4f37ff] mb-4"></div>

            {/* Footer Actions */}
            <div className="flex items-center gap-6 text-stone-500 relative mb-8">
              {reactionPickerOpen && (
                <div className="absolute bottom-full left-0 z-20 mb-3 flex rounded-full border border-[var(--border)] bg-white p-1.5 shadow-xl animate-scale-up">
                  {reactions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => chooseReaction(item.id)}
                      className="flex h-12 w-12 items-center justify-center rounded-full text-2xl transition hover:-translate-y-1 hover:bg-[#eff0ff] cursor-pointer"
                      aria-label={item.label}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              )}

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setReactionPickerOpen(!reactionPickerOpen);
                }}
                className={`flex items-center gap-2 transition cursor-pointer ${reaction ? selectedReaction?.color : "hover:text-[#4f37ff]"}`}
              >
                {reaction && selectedReaction?.id !== "heart" ? (
                  <span className="text-2xl leading-none -mt-1">{selectedReaction.icon}</span>
                ) : (
                  <Heart size={20} strokeWidth={2.5} className={reaction === "heart" ? "fill-rose-500 text-rose-500" : ""} />
                )}
                <span className="text-sm font-black">{likesCount}</span>
              </button>
              
              <button onClick={toggleComments} className="flex items-center gap-2 hover:text-[#4f37ff] transition cursor-pointer">
                <MessageCircle size={20} strokeWidth={2.5} />
                <span className="text-sm font-black">{commentsCount}</span>
              </button>
            </div>

            {/* Comments Section */}
            {commentsOpen && (
              <div className="border-t border-[#d2d5ff] pt-6 animate-fade-in">
                <h4 className="text-lg font-black text-stone-900 mb-4">Comments</h4>
                <CommentsSection
                  memoryId={memory.id}
                  initialComments={[]}
                />
              </div>
            )}
            
          </div>
        </div>
      </WavesBackground>

      {/* Share Memory Modal Overlay */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl animate-scale-up overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-[#4f37ff] p-5">
              <h3 className="text-lg font-black text-stone-900">Share Memory</h3>
              <button onClick={() => setShareModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-5 space-y-6">
              <p className="text-sm font-semibold text-stone-600">
                Share &quot;{memory.title}&quot; with the world or someone special.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-black/80 cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  Twitter / X
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1877F2]/80 cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#EA4335] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#EA4335]/80 cursor-pointer">
                  <Mail size={18} />
                  Email
                </button>
                <button onClick={copyLink} className="flex items-center justify-center gap-2 rounded-xl bg-[#eff0ff] px-4 py-3 text-sm font-bold text-[#4f37ff] transition hover:bg-[#c8c5ff] cursor-pointer">
                  <LinkIcon size={18} />
                  Copy Link
                </button>
              </div>

              <div className="flex items-center rounded-xl bg-[#eff0ff] p-2">
                <div className="flex-1 flex items-center gap-2 px-3 overflow-hidden">
                  <LinkIcon size={16} className="text-stone-400 shrink-0" />
                  <span className="truncate text-xs font-semibold text-stone-600">spokenodyssey.com/memories/{memory.id?.substring(0,6) || "link"}</span>
                </div>
                <button onClick={copyLink} className="rounded-lg bg-[#4f37ff] px-4 py-2 text-xs font-black text-white hover:bg-[#3b23e0] transition cursor-pointer flex items-center gap-1.5 relative">
                  <LinkIcon size={14} />
                  Copy
                  {shareNotice && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[10px] whitespace-nowrap">
                      {shareNotice}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
