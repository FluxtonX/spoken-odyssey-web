"use client";

import { useEffect, useState, useRef } from "react";
import { Reply, Send, CornerDownRight } from "lucide-react";
import { getStoredUserProfile } from "@/data/userProfile";
import { people } from "@/data/mockApp";

const REACTIONS = [
  { id: "like", label: "Like", icon: "👍", color: "text-blue-500 dark:text-blue-400 font-extrabold" },
  { id: "love", label: "Love", icon: "❤️", color: "text-rose-500 font-extrabold" },
  { id: "haha", label: "Haha", icon: "😄", color: "text-amber-500 font-extrabold" },
  { id: "wow", label: "Wow", icon: "😮", color: "text-yellow-500 font-extrabold" },
  { id: "sad", label: "Sad", icon: "😢", color: "text-blue-400 font-extrabold" }
];

export default function CommentsSection({ memoryId, initialComments = [] }) {
  const [userProfile, setUserProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputMap, setReplyInputMap] = useState({}); // { [commentId]: string }
  const [activeReplyId, setActiveReplyId] = useState(null); // ID of comment user is currently replying to

  // Thread controls
  const [expandedComments, setExpandedComments] = useState({}); // { [commentId]: boolean }
  const [expandedReplies, setExpandedReplies] = useState({}); // { [replyId]: boolean }
  const [hoveredItemId, setHoveredItemId] = useState(null); // ID of comment/reply user is hovering for reactions

  const hoverTimeout = useRef(null);

  useEffect(() => {
    setUserProfile(getStoredUserProfile());
    const loadProfile = () => setUserProfile(getStoredUserProfile());
    window.addEventListener("profileUpdated", loadProfile);

    // Load comments from localStorage
    const saved = localStorage.getItem(`comments_${memoryId}`);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch {
        setComments(seedDefaultComments());
      }
    } else {
      setComments(seedDefaultComments());
    }

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, [memoryId]);

  const seedDefaultComments = () => {
    const formatted = initialComments.map((c, idx) => {
      const id = c.id || `${memoryId}-comment-${idx}-${Date.now()}`;
      return {
        id,
        author: c.author,
        avatar: c.avatar || getAuthorAvatar(c.author),
        text: c.text,
        time: c.time || "2 hours ago",
        reactions: c.reactions || {
          like: Math.floor(Math.random() * 8) + 2,
          love: Math.floor(Math.random() * 4),
          haha: Math.floor(Math.random() * 2),
          wow: 0,
          sad: 0
        },
        userReaction: null,
        replies: (c.replies || []).map((r, rIdx) => ({
          id: r.id || `${id}-reply-${rIdx}-${Date.now()}`,
          author: r.author,
          avatar: r.avatar || getAuthorAvatar(r.author),
          text: r.text,
          time: r.time || "1 hour ago",
          reactions: r.reactions || {
            like: Math.floor(Math.random() * 3),
            love: 0,
            haha: 0,
            wow: 0,
            sad: 0
          },
          userReaction: null
        }))
      };
    });
    localStorage.setItem(`comments_${memoryId}`, JSON.stringify(formatted));
    return formatted;
  };

  const getAuthorAvatar = (authorName) => {
    if (!authorName) return "https://api.dicebear.com/7.x/initials/svg?seed=A";
    if (
      authorName.toLowerCase().includes("alexander") || 
      (userProfile && authorName.toLowerCase().includes(userProfile.name.toLowerCase()))
    ) {
      return userProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80";
    }
    const matched = people.find(p => p.name.toLowerCase().includes(authorName.toLowerCase()));
    return matched ? matched.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
  };

  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem(`comments_${memoryId}`, JSON.stringify(updatedComments));
    
    // Fire a custom event to notify parent components to update their comments counters
    window.dispatchEvent(new CustomEvent(`commentsUpdated_${memoryId}`, { detail: updatedComments.length }));

    // Also update comments count in local memories list if it exists
    const saved = localStorage.getItem("spokenOdysseyLocalMemories");
    if (saved) {
      try {
        const allMemories = JSON.parse(saved);
        const memIndex = allMemories.findIndex(m => m.id === memoryId);
        if (memIndex !== -1) {
          allMemories[memIndex].comments = updatedComments.length;
          localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(allMemories));
          window.dispatchEvent(new CustomEvent("memoriesUpdated"));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const cleanText = commentInput.trim();
    if (!cleanText) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: userProfile?.name || "Alexander Mitchell",
      avatar: userProfile?.avatar || getAuthorAvatar("Alexander Mitchell"),
      text: cleanText,
      time: "Just now",
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0 },
      userReaction: null,
      replies: []
    };

    const updated = [...comments, newComment];
    saveComments(updated);
    setCommentInput("");
  };

  const handleAddReply = (commentId) => {
    const text = replyInputMap[commentId]?.trim();
    if (!text) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      author: userProfile?.name || "Alexander Mitchell",
      avatar: userProfile?.avatar || getAuthorAvatar("Alexander Mitchell"),
      text: text,
      time: "Just now",
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0 },
      userReaction: null
    };

    const updated = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    });

    saveComments(updated);
    setReplyInputMap(prev => ({ ...prev, [commentId]: "" }));
    setActiveReplyId(null);
    // Auto expand the thread when adding a reply so they see it
    setExpandedComments(prev => ({ ...prev, [commentId]: true }));
  };

  const handleReact = (commentId, replyId = null, reactionId) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        if (replyId) {
          const updatedReplies = (c.replies || []).map(r => {
            if (r.id === replyId) {
              const reactions = { ...(r.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0 }) };
              let userReaction = r.userReaction || null;

              if (userReaction === reactionId) {
                reactions[reactionId] = Math.max(0, (reactions[reactionId] || 1) - 1);
                userReaction = null;
              } else {
                if (userReaction) {
                  reactions[userReaction] = Math.max(0, (reactions[userReaction] || 1) - 1);
                }
                reactions[reactionId] = (reactions[reactionId] || 0) + 1;
                userReaction = reactionId;
              }
              return { ...r, reactions, userReaction };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        } else {
          const reactions = { ...(c.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0 }) };
          let userReaction = c.userReaction || null;

          if (userReaction === reactionId) {
            reactions[reactionId] = Math.max(0, (reactions[reactionId] || 1) - 1);
            userReaction = null;
          } else {
            if (userReaction) {
              reactions[userReaction] = Math.max(0, (reactions[userReaction] || 1) - 1);
            }
            reactions[reactionId] = (reactions[reactionId] || 0) + 1;
            userReaction = reactionId;
          }
          return { ...c, reactions, userReaction };
        }
      }
      return c;
    });

    saveComments(updated);
    setHoveredItemId(null);
  };

  const handleLikeClick = (commentId, replyId = null) => {
    const item = replyId 
      ? comments.find(c => c.id === commentId)?.replies?.find(r => r.id === replyId)
      : comments.find(c => c.id === commentId);
    
    if (!item) return;
    const currentReaction = item.userReaction;
    if (currentReaction) {
      handleReact(commentId, replyId, currentReaction);
    } else {
      handleReact(commentId, replyId, "like");
    }
  };

  const handleMouseEnter = (itemId) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredItemId(itemId);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredItemId(null);
    }, 350);
  };

  const renderReactionsPicker = (commentId, replyId = null) => {
    return (
      <div 
        className="absolute bottom-full left-0 z-35 mb-2 flex items-center gap-1 rounded-full border border-stone-200 dark:border-stone-850 bg-white dark:bg-slate-900 px-2 py-1.5 shadow-xl animate-scale-up"
        onMouseEnter={() => {
          if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
        {REACTIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => handleReact(commentId, replyId, r.id)}
            className="text-lg hover:scale-130 transition-transform p-1 cursor-pointer duration-150 active:scale-95"
            title={r.label}
          >
            {r.icon}
          </button>
        ))}
      </div>
    );
  };

  const getItemReactionDetails = (item) => {
    const reactions = item.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0 };
    const totalCount = Object.values(reactions).reduce((a, b) => a + b, 0);
    const activeTypes = Object.entries(reactions)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => REACTIONS.find(r => r.id === type));

    return { totalCount, activeTypes };
  };

  const renderReplyText = (reply) => {
    const text = reply.text;
    const isExpanded = expandedReplies[reply.id];
    
    if (text.length <= 60 || isExpanded) {
      return <span>{text}</span>;
    }
    
    return (
      <span>
        {text.slice(0, 55)}...
        <button 
          onClick={() => setExpandedReplies(prev => ({ ...prev, [reply.id]: true }))}
          className="ml-1 font-extrabold text-[var(--brand)] hover:underline focus:outline-none cursor-pointer"
        >
          See More
        </button>
      </span>
    );
  };

  return (
    <div className="space-y-4 pt-4 mt-2 border-t border-stone-100 dark:border-stone-800/60 animate-fade-in text-left">
      {/* Comments List */}
      <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
        {comments.map((comment) => {
          const { totalCount, activeTypes } = getItemReactionDetails(comment);
          const showReplies = comment.replies && comment.replies.length > 0;
          const isRepliesExpanded = expandedComments[comment.id];
          const displayedReplies = showReplies 
            ? (isRepliesExpanded ? comment.replies : [])
            : [];
          const hasMoreReplies = showReplies && !isRepliesExpanded;

          return (
            <div key={comment.id} className="space-y-3 relative">
              {/* Top Level Comment Card */}
              <div className="flex gap-2.5 items-start relative z-10">
                <img
                  src={comment.avatar || getAuthorAvatar(comment.author)}
                  alt={comment.author}
                  className="h-8.5 w-8.5 rounded-full object-cover shrink-0 border border-stone-200 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="relative inline-block rounded-2xl bg-stone-100 dark:bg-slate-800/70 px-4 py-2.5 shadow-sm max-w-[92%] break-words">
                    <div className="flex items-baseline justify-between gap-4 mb-0.5">
                      <p className="text-[12px] font-extrabold text-[var(--ink)] dark:text-white leading-tight">{comment.author}</p>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed text-stone-605 dark:text-stone-300">{comment.text}</p>
                    
                    {/* Floating Reactions Badge */}
                    {totalCount > 0 && (
                      <div className="absolute bottom-[-9px] right-2 bg-white dark:bg-slate-800 rounded-full py-0.5 px-1.5 shadow-sm border border-stone-100 dark:border-stone-700 flex items-center gap-0.5 text-[10px] text-stone-505 dark:text-stone-400 font-bold select-none z-20">
                        <span className="flex items-center">
                          {activeTypes.map((t) => (
                            <span key={t.id} title={t.label} className="mr-[1px] last:mr-0">{t.icon}</span>
                          ))}
                        </span>
                        <span>{totalCount}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions Row */}
                  <div className="mt-1 flex items-center gap-3 pl-3.5 text-[11px] font-extrabold text-stone-400 select-none">
                    <span>{comment.time}</span>
                    
                    {/* Hover Reaction Trigger */}
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(comment.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {hoveredItemId === comment.id && renderReactionsPicker(comment.id, null)}
                      <button 
                        onClick={() => handleLikeClick(comment.id, null)}
                        className={`hover:underline cursor-pointer ${
                          comment.userReaction 
                            ? REACTIONS.find(r => r.id === comment.userReaction)?.color 
                            : "hover:text-stone-500"
                        }`}
                      >
                        {comment.userReaction 
                          ? REACTIONS.find(r => r.id === comment.userReaction)?.label 
                          : "Like"}
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                        setReplyInputMap(prev => ({ ...prev, [comment.id]: "" }));
                      }}
                      className="hover:underline cursor-pointer hover:text-stone-500"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Nested Replies Stream */}
              {showReplies && (
                <div className="pl-11 relative space-y-3.5">
                  {displayedReplies.map((reply, rIdx) => {
                    const { totalCount: replyReactionsCount, activeTypes: replyActiveTypes } = getItemReactionDetails(reply);
                    const isReplyLast = false;

                    return (
                      <div key={reply.id} className="relative pl-6 flex items-start gap-2 z-10 animate-fade-in group/reply">
                        {/* Curved Tree Connector */}
                        <div className="absolute left-[-16px] top-0 bottom-0 w-5 pointer-events-none">
                          <div className={`absolute left-0 top-0 ${isReplyLast ? "h-[17px]" : "bottom-0"} border-l-2 border-stone-200 dark:border-stone-800`} />
                          <div className="absolute left-0 top-0 h-[17px] w-full border-b-2 border-stone-200 dark:border-stone-800 rounded-bl-lg" />
                        </div>

                        <img
                          src={reply.avatar || getAuthorAvatar(reply.author)}
                          alt={reply.author}
                          className="h-6.5 w-6.5 rounded-full object-cover shrink-0 border border-stone-200 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="relative inline-block rounded-2xl bg-stone-100/70 dark:bg-slate-800/40 px-3.5 py-2 shadow-sm max-w-[92%] break-words">
                            <div className="flex items-baseline justify-between gap-3 mb-0.5">
                              <p className="text-[11px] font-extrabold text-[var(--ink)] dark:text-white leading-tight">{reply.author}</p>
                            </div>
                            <p className="text-xs font-semibold leading-relaxed text-stone-605 dark:text-stone-300">
                              <span className="font-extrabold text-stone-400 dark:text-stone-555 mr-1 select-none">
                                {comment.author.split(" ")[0]}
                              </span>
                              {renderReplyText(reply)}
                            </p>

                            {/* Reply reaction floating badge */}
                            {replyReactionsCount > 0 && (
                              <div className="absolute bottom-[-9px] right-2 bg-white dark:bg-slate-800 rounded-full py-0.5 px-1.2 shadow-sm border border-stone-100 dark:border-stone-700 flex items-center gap-0.5 text-[9px] text-stone-500 dark:text-stone-400 font-bold select-none z-20">
                                <span className="flex items-center">
                                  {replyActiveTypes.map((t) => (
                                    <span key={t.id} title={t.label} className="mr-[1px] last:mr-0">{t.icon}</span>
                                  ))}
                                </span>
                                <span>{replyReactionsCount}</span>
                              </div>
                            )}
                          </div>

                          {/* Reply actions */}
                          <div className="mt-1 flex items-center gap-3 pl-3 text-[10px] font-extrabold text-stone-400 select-none">
                            <span>{reply.time}</span>
                            
                            {/* Hover Reaction Trigger */}
                            <div 
                              className="relative"
                              onMouseEnter={() => handleMouseEnter(reply.id)}
                              onMouseLeave={handleMouseLeave}
                            >
                              {hoveredItemId === reply.id && renderReactionsPicker(comment.id, reply.id)}
                              <button 
                                onClick={() => handleLikeClick(comment.id, reply.id)}
                                className={`hover:underline cursor-pointer ${
                                  reply.userReaction 
                                    ? REACTIONS.find(r => r.id === reply.userReaction)?.color 
                                    : "hover:text-stone-500"
                                }`}
                              >
                                {reply.userReaction 
                                  ? REACTIONS.find(r => r.id === reply.userReaction)?.label 
                                  : "Like"}
                              </button>
                            </div>

                            <button 
                              onClick={() => {
                                setActiveReplyId(comment.id);
                                setReplyInputMap(prev => ({ ...prev, [comment.id]: `@${reply.author.split(" ")[0]} ` }));
                              }}
                              className="hover:underline cursor-pointer hover:text-stone-500"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* View More Replies link */}
                  {hasMoreReplies && (
                    <div className="relative pl-6 flex items-center z-10 py-0.5">
                      {/* Curved tree line to connection */}
                      <div className="absolute left-[-16px] top-0 bottom-0 w-5 pointer-events-none">
                        <div className="absolute left-0 top-0 h-[15px] border-l-2 border-stone-200 dark:border-stone-800" />
                        <div className="absolute left-0 top-0 h-[15px] w-full border-b-2 border-stone-200 dark:border-stone-800 rounded-bl-lg" />
                      </div>
                      
                      <button 
                        onClick={() => setExpandedComments(prev => ({ ...prev, [comment.id]: true }))}
                        className="text-[12px] font-extrabold text-stone-500 hover:text-[var(--brand)] transition cursor-pointer hover:underline pl-0.5"
                      >
                        View {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}...
                      </button>
                    </div>
                  )}

                  {/* Hide replies link */}
                  {isRepliesExpanded && comment.replies.length > 0 && (
                    <div className="relative pl-6 flex items-center z-10 py-0.5">
                      {/* Curved tree line to connection */}
                      <div className="absolute left-[-16px] top-0 bottom-0 w-5 pointer-events-none">
                        <div className="absolute left-0 top-0 h-[15px] border-l-2 border-stone-200 dark:border-stone-800" />
                        <div className="absolute left-0 top-0 h-[15px] w-full border-b-2 border-stone-200 dark:border-stone-800 rounded-bl-lg" />
                      </div>
                      
                      <button 
                        onClick={() => setExpandedComments(prev => ({ ...prev, [comment.id]: false }))}
                        className="text-[12px] font-extrabold text-stone-500 hover:text-[var(--brand)] transition cursor-pointer hover:underline pl-0.5"
                      >
                        Hide replies
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Reply Input form */}
              {activeReplyId === comment.id && (
                <div className="pl-11 ml-4 relative flex gap-2 items-center animate-scale-up z-10">
                  {/* Curved tree line to reply input field */}
                  <div className="absolute left-[-16px] top-0 bottom-0 w-5 pointer-events-none">
                    <div className="absolute left-0 top-0 h-[18px] border-l-2 border-stone-200 dark:border-stone-800" />
                    <div className="absolute left-0 top-0 h-[18px] w-full border-b-2 border-stone-200 dark:border-stone-800 rounded-bl-lg" />
                  </div>

                  <input
                    type="text"
                    placeholder={`Reply to ${comment.author.split(" ")[0]}...`}
                    value={replyInputMap[comment.id] || ""}
                    onChange={e => setReplyInputMap(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === "Enter") handleAddReply(comment.id);
                    }}
                    className="h-8.5 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
                    autoFocus
                  />
                  <button 
                    onClick={() => handleAddReply(comment.id)}
                    className="h-8.5 w-8.5 rounded-xl bg-[var(--brand)] text-white flex items-center justify-center hover:bg-[var(--brand-hover)] transition cursor-pointer shrink-0"
                    aria-label="Send reply"
                  >
                    <Send size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {comments.length === 0 && (
          <p className="text-xs font-semibold text-stone-450 text-center py-6">No comments yet. Start the conversation!</p>
        )}
      </div>

      {/* Main Comment Input Box */}
      <form onSubmit={handleAddComment} className="flex gap-2.5 items-center border-t border-stone-100 dark:border-stone-800/60 pt-4">
        {userProfile?.avatar ? (
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="h-8.5 w-8.5 rounded-full object-cover shrink-0 border border-stone-200 hidden sm:block"
          />
        ) : (
          <div className="h-8.5 w-8.5 rounded-full bg-[var(--brand)] text-white text-xs font-bold flex items-center justify-center shrink-0 hidden sm:flex">
            {userProfile?.name?.charAt(0) || "A"}
          </div>
        )}
        <input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder={`Comment as ${userProfile?.name || "Alexander Mitchell"}...`}
          className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-xs font-bold outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
        />
        <button 
          type="submit"
          className="h-10 rounded-xl bg-[var(--brand)] px-4 text-xs font-black text-white hover:bg-[var(--brand-hover)] transition cursor-pointer"
        >
          Post
        </button>
      </form>
    </div>
  );
}
