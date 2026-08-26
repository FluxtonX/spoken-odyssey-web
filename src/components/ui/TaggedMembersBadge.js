"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCheck, ChevronRight } from "lucide-react";
import { normalizeMediaUrl } from "@/services/backend";

// Known fallback connections map for legacy demo IDs
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

  // Extract tagged users list from all possible formats
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
        rawTaggedList = parsedIds.map((id) => {
          if (typeof id === "object" && id !== null) return id;
          const idStr = String(id).toLowerCase();
          const known = KNOWN_CONNECTIONS[idStr];
          if (known) {
            return {
              id: String(id),
              displayName: known.name,
              name: known.name,
              avatar: known.avatar,
              profession: known.profession,
            };
          }

          // Match memory owner details if tagged ID matches owner
          if (memory?.owner && (memory.owner.id === id || memory.ownerId === id)) {
            const ownerName = memory.owner.displayName || memory.owner.name || memory.ownerDisplayName;
            const ownerAvatar = memory.owner.photoURL || memory.owner.avatarUrl || memory.ownerAvatarUrl;
            if (ownerName) {
              return {
                id: String(id),
                displayName: ownerName,
                name: ownerName,
                avatar: ownerAvatar || "",
                profession: memory.owner.profession || "Family Member",
              };
            }
          }

          if (memory?.ownerDisplayName && (memory.ownerId === id || String(id) === String(memory.ownerId))) {
            return {
              id: String(id),
              displayName: memory.ownerDisplayName,
              name: memory.ownerDisplayName,
              avatar: memory.ownerAvatarUrl || "",
              profession: "Family Member",
            };
          }

          return {
            id: String(id),
            displayName: idStr.includes("@") ? idStr.split("@")[0] : "",
            name: idStr.includes("@") ? idStr.split("@")[0] : "",
            avatar: "",
            profession: "",
          };
        });
      }
    } catch (_) {}
  }

  // Format and resolve all tagged users with REAL data from database
  const taggedUsers = rawTaggedList.map((user, idx) => {
    if (typeof user === "string") {
      const known = KNOWN_CONNECTIONS[user.toLowerCase()];
      const realName = known ? known.name : (user.includes("@") ? user.split("@")[0] : user);
      return {
        id: user,
        displayName: realName,
        name: realName,
        avatar: known ? known.avatar : "",
        profession: known ? known.profession : "",
      };
    }

    const idKey = String(user?.id || user?._id || user?.uid || `user-${idx}`).toLowerCase();
    const known = KNOWN_CONNECTIONS[idKey];
    
    const realName = 
      user?.displayName || 
      user?.name || 
      (known ? known.name : null) || 
      (user?.email ? user.email.split("@")[0] : "");

    const realAvatar = 
      user?.avatar || 
      user?.photoURL || 
      user?.avatarUrl || 
      user?.photoKey || 
      user?.image || 
      (known ? known.avatar : "");

    return {
      id: user?.id || user?._id || user?.uid || idKey,
      displayName: realName,
      name: realName,
      avatar: realAvatar,
      profession: user?.profession || user?.relation || (known ? known.profession : ""),
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
    if (raw && typeof raw === "string" && (raw.startsWith("http") || raw.length > 5)) {
      return normalizeMediaUrl(raw);
    }
    const idKey = String(user?.id || user?._id || user?.uid || "").toLowerCase();
    if (KNOWN_CONNECTIONS[idKey]?.avatar) return KNOWN_CONNECTIONS[idKey].avatar;
    const name = user?.displayName || user?.name || "Member";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4A3AFF&color=fff`;
  };

  const firstUserName = firstUser?.displayName || firstUser?.name || "";
  const isGenericName = !firstUserName || firstUserName.toLowerCase().startsWith("family member") || firstUserName.toLowerCase() === "family";
  const displayLabel = !isMultiple 
    ? (!isGenericName ? `@${firstUserName.split(" ")[0]}` : "Tagged")
    : "and more";

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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-[#1E1B4B]/90 text-[#4A3AFF] dark:text-[#A5B4FC] border border-[#C7D2FE] dark:border-[#4338CA]/60 font-bold shrink-0 shadow-2xs hover:bg-[#E0E7FF] dark:hover:bg-[#312E81] hover:border-[#818CF8] transition-all duration-200 cursor-pointer select-none max-w-max ${className}`}
      >
        {/* Avatars Container */}
        <div className="flex items-center shrink-0">
          {/* Avatar 1: Profile image */}
          <img
            src={getAvatarUrl(firstUser)}
            alt={firstUserName || "Tagged Member"}
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover ring-1.5 ring-white dark:ring-slate-900 shrink-0 z-10 shadow-2xs"
          />

          {/* Avatar 2 (if multiple users) */}
          {isMultiple && (
            <img
              src={getAvatarUrl(secondUser)}
              alt={secondUser.displayName || secondUser.name || "Tagged member"}
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover ring-1.5 ring-white dark:ring-slate-900 shrink-0 -ml-2.5 z-0 shadow-2xs"
            />
          )}
        </div>

        {/* Text Label */}
        <span className="text-[11px] font-bold shrink-0 tracking-tight leading-none whitespace-nowrap">
          {displayLabel}
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
              const rawName = user.displayName || user.name || "";
              const showName = rawName && !rawName.toLowerCase().startsWith("family member") ? rawName : "Tagged Member";
              const relation = user.profession || user.relation || "";

              return (
                <div
                  key={user.id || showName}
                  onClick={(e) => handleUserClick(e, user)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#EEF2FF] dark:hover:bg-[#2C2D54] transition-colors cursor-pointer group"
                >
                  <img src={avatar} alt={showName} className="w-7 h-7 rounded-full object-cover shrink-0 shadow-2xs border border-white dark:border-slate-800" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate group-hover:text-[#4A3AFF] transition-colors">
                      @{showName}
                    </p>
                    {relation && relation.toLowerCase() !== "family member" && (
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
