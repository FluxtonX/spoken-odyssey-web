"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCheck, AtSign, Users, ChevronRight } from "lucide-react";
import { normalizeMediaUrl } from "@/services/backend";

// Known fallback connections map so tagged members always resolve real photos and names
const KNOWN_CONNECTIONS = {
  "conn-sarah": { name: "Sarah Mitchell", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80", profession: "Family Circle" },
  "sarah": { name: "Sarah Mitchell", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80", profession: "Family Circle" },
  "conn-mum": { name: "Margaret Murphy", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80", profession: "Mother" },
  "mum": { name: "Margaret Murphy", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80", profession: "Mother" },
  "conn-robert": { name: "Robert Mitchell", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80", profession: "Legacy Custodian" },
  "robert": { name: "Robert Mitchell", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80", profession: "Legacy Custodian" },
  "conn-elena": { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80", profession: "Product Designer" },
  "elena": { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80", profession: "Product Designer" },
  "conn-ciaran": { name: "Ciarán Murphy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80", profession: "Family Circle" },
  "ciaran": { name: "Ciarán Murphy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80", profession: "Family Circle" },
};

/**
 * TaggedMembersBadge Component
 *
 * Displays a compact, beautiful label for tagged members next to the memory title or author header:
 * - 1 tagged member: Profile avatar image + "Tagged" text label.
 * - 2+ tagged members: 2 overlapping avatar images + "and more" (or "+N more") text label.
 * - Interactive hover/tap tooltip popup listing all tagged members with links.
 * - Fully responsive on all device viewports without layout clipping.
 */
export default function TaggedMembersBadge({
  memory,
  taggedUsers: propTaggedUsers,
  className = "",
  size = "sm",
  showTooltip = true,
}) {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const badgeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Extract and normalize tagged users list from all possible formats
  let rawTaggedList = [];

  if (Array.isArray(propTaggedUsers) && propTaggedUsers.length > 0) {
    rawTaggedList = propTaggedUsers;
  } else if (memory?.taggedUsers) {
    try {
      const parsed = typeof memory.taggedUsers === "string" ? JSON.parse(memory.taggedUsers) : memory.taggedUsers;
      if (Array.isArray(parsed) && parsed.length > 0) rawTaggedList = parsed;
    } catch (_) {}
  }

  if (rawTaggedList.length === 0 && memory?.taggedUserIds) {
    try {
      const parsedIds = typeof memory.taggedUserIds === "string" ? JSON.parse(memory.taggedUserIds) : memory.taggedUserIds;
      if (Array.isArray(parsedIds) && parsedIds.length > 0) {
        rawTaggedList = parsedIds.map((id, idx) => {
          if (typeof id === "object" && id !== null) return id;
          const known = KNOWN_CONNECTIONS[String(id).toLowerCase()] || {};
          return {
            id: String(id),
            displayName: known.name || `Family Member ${idx + 1}`,
            name: known.name || `Family Member ${idx + 1}`,
            avatar: known.avatar || "",
            profession: known.profession || "",
          };
        });
      }
    } catch (_) {}
  }

  // Format and enrich all tagged users
  const taggedUsers = rawTaggedList.map((user, idx) => {
    if (typeof user === "string") {
      const known = KNOWN_CONNECTIONS[user.toLowerCase()] || {};
      return {
        id: user,
        displayName: known.name || user.replace(/^@/, ""),
        name: known.name || user.replace(/^@/, ""),
        avatar: known.avatar || "",
        profession: known.profession || "",
      };
    }
    const idKey = String(user?.id || user?._id || user?.uid || `user-${idx}`).toLowerCase();
    const known = KNOWN_CONNECTIONS[idKey] || {};
    return {
      id: user?.id || user?._id || user?.uid || idKey,
      displayName: user?.displayName || user?.name || known.name || `Family Member ${idx + 1}`,
      name: user?.name || user?.displayName || known.name || `Family Member ${idx + 1}`,
      avatar: user?.avatar || user?.photoURL || user?.photoKey || user?.image || known.avatar || "",
      profession: user?.profession || user?.relation || known.profession || "",
    };
  }).filter(u => Boolean(u.id || u.name || u.displayName));

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (badgeRef.current && !badgeRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [popoverOpen]);

  if (!taggedUsers || taggedUsers.length === 0) {
    return null;
  }

  const firstUser = taggedUsers[0];
  const secondUser = taggedUsers[1];
  const isMultiple = taggedUsers.length > 1;

  const handleMouseEnter = () => {
    if (!showTooltip) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPopoverOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPopoverOpen(false);
    }, 250);
  };

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    if (isMultiple) {
      setPopoverOpen((prev) => !prev);
    } else if (firstUser?.id && firstUser.id !== "undefined" && !firstUser.id.startsWith("user-")) {
      router.push(`/people/${firstUser.id}`);
    }
  };

  const handleUserClick = (e, user) => {
    e.stopPropagation();
    setPopoverOpen(false);
    if (user?.id && user.id !== "undefined" && !user.id.startsWith("user-")) {
      router.push(`/people/${user.id}`);
    }
  };

  const getAvatarUrl = (user) => {
    const raw = user?.avatar || user?.photoURL || user?.photoKey || user?.avatarUrl || user?.image;
    return raw ? normalizeMediaUrl(raw) : null;
  };

  const getInitials = (user) => {
    const name = user?.displayName || user?.name || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      ref={badgeRef}
      className="relative inline-flex items-center shrink-0 z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleBadgeClick}
        aria-label={`${taggedUsers.length} tagged ${taggedUsers.length === 1 ? "member" : "members"}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#EEF2FF] dark:bg-[#1E1B4B]/90 text-[#4A3AFF] dark:text-[#A5B4FC] border border-[#C7D2FE] dark:border-[#4338CA]/60 font-bold shrink-0 shadow-2xs hover:bg-[#E0E7FF] dark:hover:bg-[#312E81] hover:border-[#818CF8] transition-all duration-200 cursor-pointer select-none max-w-max ${className}`}
      >
        {/* Avatars Container */}
        <div className="flex items-center shrink-0">
          {/* Avatar 1 */}
          {getAvatarUrl(firstUser) ? (
            <img
              src={getAvatarUrl(firstUser)}
              alt={firstUser.displayName || firstUser.name || "Tagged member"}
              className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full object-cover ring-1.5 ring-white dark:ring-slate-900 shrink-0 z-10 shadow-2xs"
            />
          ) : (
            <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black ring-1.5 ring-white dark:ring-slate-900 shrink-0 z-10 shadow-2xs">
              {getInitials(firstUser)}
            </div>
          )}

          {/* Avatar 2 (if multiple users) */}
          {isMultiple && (
            getAvatarUrl(secondUser) ? (
              <img
                src={getAvatarUrl(secondUser)}
                alt={secondUser.displayName || secondUser.name || "Tagged member"}
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full object-cover ring-1.5 ring-white dark:ring-slate-900 shrink-0 -ml-2 sm:-ml-2.5 z-0 shadow-2xs"
              />
            ) : (
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#818CF8] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black ring-1.5 ring-white dark:ring-slate-900 shrink-0 -ml-2 sm:-ml-2.5 z-0 shadow-2xs">
                {getInitials(secondUser)}
              </div>
            )
          )}
        </div>

        {/* Text Label */}
        <span className="text-[10px] sm:text-[11px] font-bold shrink-0 tracking-tight leading-none whitespace-nowrap">
          {!isMultiple ? "Tagged" : "and more"}
        </span>
      </button>

      {/* Interactive Tooltip Popover on Hover/Tap */}
      {showTooltip && popoverOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-2 z-50 min-w-[210px] max-w-[280px] bg-white dark:bg-[#1E2038] rounded-2xl shadow-xl border border-[#C7D2FE] dark:border-[#4338CA]/60 p-2.5 animate-scale-up text-left"
        >
          <div className="flex items-center gap-1.5 px-2 py-1 mb-1 border-b border-stone-100 dark:border-stone-800 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-400">
            <UserCheck size={12} className="text-[#4A3AFF]" />
            <span>Tagged People ({taggedUsers.length})</span>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto hide-scrollbar py-0.5">
            {taggedUsers.map((user) => {
              const avatar = getAvatarUrl(user);
              const name = user.displayName || user.name || "Family Member";
              const relation = user.profession || user.relation || "";

              return (
                <div
                  key={user.id || name}
                  onClick={(e) => handleUserClick(e, user)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#EEF2FF] dark:hover:bg-[#2C2D54] transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#4A3AFF] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs border border-white dark:border-slate-800">
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate group-hover:text-[#4A3AFF] transition-colors">
                      @{name}
                    </p>
                    {relation && (
                      <p className="text-[10px] text-stone-400 dark:text-stone-400 truncate">
                        {relation}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={13} className="text-stone-300 group-hover:text-[#4A3AFF] transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
