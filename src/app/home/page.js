"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mic,
  Camera,
  Video,
  PenLine,
  ChevronRight,
  ChevronLeft,
  Settings,
  Plus,
  Lock,
  Flag,
  Users,
  Image as ImageIcon,
  FolderArchive,
  HelpCircle,
  Clock,
  Play,
  Check,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/context/AuthProvider";
import {
  getDashboardHomeData,
  getAlbumsFromBackend,
  getMemoriesFromBackend,
  getFamilySharedMemories,
  getFamilyCircleDetails,
  getFamilyCircleMembers,
  getFamilyPrompts,
  getFamilySpaceTimeline,
  getNotifications,
  getUserProfileFromBackend,
  normalizeMediaUrl,
} from "@/services/backend";
import { getStoredUserProfile } from "@/data/userProfile";

/* ══════════════════════════════════════════════════════════
   HELPERS FOR MEDIA, TIME & AVATARS
══════════════════════════════════════════════════════════ */
function formatRelativeTime(dateInput) {
  if (!dateInput) return "Recent";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Recent";
  const diffInSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
}

function getMemoryCover(memory) {
  if (!memory) return null;
  const rawUrl =
    memory.coverImageUrl ||
    memory.cover ||
    memory.thumbnailUrl ||
    memory.mediaUrl ||
    memory.imageUrl ||
    memory.image ||
    (Array.isArray(memory.images) && memory.images[0]) ||
    (Array.isArray(memory.mediaList) && (memory.mediaList[0]?.mediaUrl || memory.mediaList[0]?.url)) ||
    (Array.isArray(memory.media) &&
      (typeof memory.media[0] === "string"
        ? memory.media[0]
        : memory.media[0]?.mediaUrl || memory.media[0]?.url));
  return normalizeMediaUrl(rawUrl);
}

function getMemberAvatar(member) {
  if (!member) return null;
  const url =
    member.avatarUrl ||
    member.avatar ||
    member.photoURL ||
    member.profileImage ||
    member.image;
  return normalizeMediaUrl(url);
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading, profile, firebaseUser, getToken } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [familyCircle, setFamilyCircle] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [memoriesList, setMemoriesList] = useState([]);
  const [albumsList, setAlbumsList] = useState([]);
  const [qaQuestions, setQaQuestions] = useState([]);
  const [timelineMilestones, setTimelineMilestones] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [stats, setStats] = useState({
    totalMemories: 0,
    momentsThisMonth: 0,
    albumsCount: 0,
    albumsThisMonth: 0,
    qaCount: 0,
    qaThisMonth: 0,
    milestonesCount: 0,
    daysTogether: "1",
  });

  // 0ms Instant Boot from LocalStorage SWR Snapshot
  useEffect(() => {
    try {
      const cachedRaw = localStorage.getItem("so_dashboard_home_cache");
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && typeof cached === "object") {
          if (cached.stats) setStats(cached.stats);
          if (cached.familySpace) setFamilyCircle(cached.familySpace);
          if (Array.isArray(cached.familySpace?.members) && cached.familySpace.members.length > 0) {
            setFamilyMembers(cached.familySpace.members);
          }
          if (Array.isArray(cached.recentMoments)) setMemoriesList(cached.recentMoments);
          if (Array.isArray(cached.familyPrompts)) setQaQuestions(cached.familyPrompts);
          if (Array.isArray(cached.timelineMilestones)) setTimelineMilestones(cached.timelineMilestones);
          if (Array.isArray(cached.recentActivities)) setRecentActivities(cached.recentActivities);
          setIsLoadingData(false);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    function loadProfile() {
      setUserProfile(getStoredUserProfile());
    }
    loadProfile();
    window.addEventListener("profileUpdated", loadProfile);

    const loadHomeData = async () => {
      if (!isAuthenticated || !firebaseUser) return;

      try {
        const token = await getToken();
        if (!token) return;

        // 1. High-Performance Primary Route: Single consolidated backend query (~5KB payload)
        try {
          const dashboardData = await getDashboardHomeData(token);
          if (dashboardData && dashboardData.stats) {
            setStats(dashboardData.stats);
            if (dashboardData.familySpace) {
              setFamilyCircle(dashboardData.familySpace);
              if (
                Array.isArray(dashboardData.familySpace.members) &&
                dashboardData.familySpace.members.length > 0
              ) {
                setFamilyMembers(dashboardData.familySpace.members);
              }
            }
            if (Array.isArray(dashboardData.recentMoments)) {
              setMemoriesList(dashboardData.recentMoments);
            }
            if (Array.isArray(dashboardData.familyPrompts)) {
              setQaQuestions(dashboardData.familyPrompts);
            }
            if (Array.isArray(dashboardData.timelineMilestones)) {
              setTimelineMilestones(dashboardData.timelineMilestones);
            }
            if (Array.isArray(dashboardData.recentActivities)) {
              setRecentActivities(dashboardData.recentActivities);
            }

            // Persist fresh snapshot for instant 0ms render on future visits
            try {
              localStorage.setItem(
                "so_dashboard_home_cache",
                JSON.stringify(dashboardData)
              );
            } catch (_) {}

            setIsLoadingData(false);
            return; // Complete! 1 single network roundtrip
          }
        } catch (dashErr) {
          console.warn(
            "Consolidated dashboard API unavailable, running multi-query fallback:",
            dashErr?.message
          );
        }

        // 2. Resilient Multi-Database Fallback Pipeline (if consolidated API is unreachable)
        const [
          circleRes,
          membersRes,
          memoriesRes,
          sharedMemoriesRes,
          albumsRes,
          notifsRes,
        ] = await Promise.allSettled([
          getFamilyCircleDetails(token),
          getFamilyCircleMembers(token),
          getMemoriesFromBackend(token),
          getFamilySharedMemories(token),
          getAlbumsFromBackend(token),
          getNotifications(token, { limit: 8 }),
        ]);

        const circle = circleRes.status === "fulfilled" ? circleRes.value : null;

        // Extract Members
        let members =
          membersRes.status === "fulfilled" && Array.isArray(membersRes.value)
            ? membersRes.value
            : [];

        // If no members in family space yet, fallback to current logged-in user
        if (members.length === 0 && firebaseUser) {
          members = [
            {
              id: firebaseUser.uid || "me",
              name:
                firebaseUser.displayName ||
                profile?.displayName ||
                userProfile?.name ||
                "You",
              avatarUrl: firebaseUser.photoURL || profile?.avatarUrl || null,
              role: "Owner",
            },
          ];
        }

        // Extract & Merge Memories
        let allMemories = [];
        if (memoriesRes.status === "fulfilled" && Array.isArray(memoriesRes.value)) {
          allMemories = [...memoriesRes.value];
        }
        if (
          sharedMemoriesRes.status === "fulfilled" &&
          Array.isArray(sharedMemoriesRes.value)
        ) {
          sharedMemoriesRes.value.forEach((sm) => {
            const smId = sm._id || sm.id;
            if (!allMemories.some((m) => (m._id || m.id) === smId)) {
              allMemories.push(sm);
            }
          });
        }
        // Sort descending by date
        allMemories.sort(
          (a, b) =>
            new Date(b.occurredAt || b.createdAt || 0) -
            new Date(a.occurredAt || a.createdAt || 0)
        );

        // Extract Albums
        const albums =
          albumsRes.status === "fulfilled" && Array.isArray(albumsRes.value)
            ? albumsRes.value
            : [];

        // Extract Notifications
        const notifs =
          notifsRes.status === "fulfilled" && Array.isArray(notifsRes.value)
            ? notifsRes.value
            : [];

        // 2. Fetch Family Prompts & Timeline if Circle Exists
        const familyCircleId =
          circle?._id || circle?.id || members[0]?.familyCircleId;

        let prompts = [];
        let timelineData = [];

        if (familyCircleId) {
          const [promptsRes, timelineRes] = await Promise.allSettled([
            getFamilyPrompts(token, familyCircleId),
            getFamilySpaceTimeline(token, familyCircleId, { limit: 12 }),
          ]);

          if (promptsRes.status === "fulfilled" && Array.isArray(promptsRes.value)) {
            prompts = promptsRes.value;
          }
          if (timelineRes.status === "fulfilled" && timelineRes.value) {
            timelineData = Array.isArray(timelineRes.value)
              ? timelineRes.value
              : timelineRes.value.items || timelineRes.value.milestones || [];
          }
        }

        // 3. Extract Timeline Milestones
        let milestones = [];
        if (timelineData.length > 0) {
          milestones = timelineData.map((item) => {
            const dateStr = item.date || item.occurredAt || item.createdAt;
            const yearVal = item.year || (dateStr ? new Date(dateStr).getFullYear() : "") || "Milestone";
            return {
              id: item._id || item.id,
              year: String(yearVal),
              label: item.title || item.label || "Family milestone",
              image:
                getMemoryCover(item) ||
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&q=80",
              raw: item,
            };
          });
        } else {
          // Extract from memories that are marked as milestones
          const milestoneMemories = allMemories.filter(
            (m) => m.isMilestone || m.type === "milestone" || m.category === "Milestone"
          );
          if (milestoneMemories.length > 0) {
            milestones = milestoneMemories.slice(0, 6).map((m) => {
              const d = new Date(m.occurredAt || m.createdAt || Date.now());
              return {
                id: m._id || m.id,
                year: isNaN(d.getTime()) ? "Milestone" : String(d.getFullYear()),
                label: m.title || "Family milestone",
                image:
                  getMemoryCover(m) ||
                  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&q=80",
                raw: m,
              };
            });
          }
        }

        // Helper to resolve real user profile for any author or actor ID
        const resolveRealProfile = async (targetId) => {
          if (!targetId) return null;
          if (targetId === firebaseUser.uid) {
            return {
              name:
                profile?.displayName ||
                userProfile?.name ||
                firebaseUser.displayName ||
                "You",
              avatar: normalizeMediaUrl(
                profile?.avatarUrl ||
                profile?.avatar ||
                profile?.photoURL ||
                profile?.profileImage ||
                firebaseUser.photoURL ||
                userProfile?.avatar
              ),
            };
          }

          // Check in family members first
          const member = members.find(
            (m) =>
              m.id === targetId ||
              m._id === targetId ||
              m.userId === targetId ||
              m.firebaseUid === targetId ||
              m.email === targetId
          );
          if (member) {
            return {
              name:
                member.name ||
                member.displayName ||
                member.email?.split("@")[0] ||
                "Family member",
              avatar: normalizeMediaUrl(
                member.avatarUrl ||
                member.avatar ||
                member.photoURL ||
                member.profileImage
              ),
            };
          }

          // If not in local family members, fetch real user profile directly from backend API
          try {
            const fetched = await getUserProfileFromBackend(token, targetId);
            if (fetched) {
              return {
                name:
                  fetched.displayName ||
                  fetched.name ||
                  fetched.email?.split("@")[0] ||
                  "Family member",
                avatar: normalizeMediaUrl(
                  fetched.avatarUrl ||
                  fetched.avatar ||
                  fetched.photoURL ||
                  fetched.profileImage
                ),
              };
            }
          } catch (_) {}

          return null;
        };

        // 4. Extract Activities Feed (From Notifications or Real Latest Memories)
        let rawActivities = [];
        if (notifs.length > 0) {
          rawActivities = notifs.slice(0, 6).map((notif) => {
            const actorId =
              notif.metadata?.actorId ||
              notif.metadata?.senderId ||
              notif.metadata?.userId ||
              notif.actorId ||
              notif.senderId ||
              notif.actor?.id ||
              notif.actor?._id;

            return {
              id: notif._id || notif.id,
              userId: actorId,
              fallbackUser:
                notif.actor?.displayName ||
                notif.sender?.name ||
                notif.actorName ||
                notif.metadata?.actorName ||
                "Family member",
              fallbackAvatar: getMemberAvatar(notif.actor || notif.sender),
              action: notif.action || notif.message || "updated the archive",
              title: notif.title || notif.targetTitle || "Family update",
              timeAgo: formatRelativeTime(notif.createdAt),
              thumb: normalizeMediaUrl(
                notif.mediaUrl || notif.thumbnailUrl || notif.metadata?.thumbnailUrl
              ),
              memory: notif.memory || notif.memoryId,
            };
          });
        } else if (allMemories.length > 0) {
          // Derive from live memory feed
          rawActivities = allMemories.slice(0, 5).map((m) => {
            const authorId = m.ownerId || m.userId || m.authorId || m.user;
            const isMe = authorId === firebaseUser.uid;

            return {
              id: m._id || m.id,
              userId: authorId,
              fallbackUser: isMe
                ? "You"
                : m.author?.displayName || m.creatorName || "Family member",
              fallbackAvatar: isMe
                ? normalizeMediaUrl(
                    profile?.avatarUrl || profile?.avatar || firebaseUser.photoURL
                  )
                : getMemberAvatar(m.author),
              action:
                m.type === "video"
                  ? "added a new video"
                  : m.type === "voice" || m.audioUrl
                  ? "recorded a voice story"
                  : "shared a moment",
              title: m.title || "Untitled moment",
              timeAgo: formatRelativeTime(m.occurredAt || m.createdAt),
              thumb: getMemoryCover(m),
              memory: m,
            };
          });
        }

        // Resolve real user profiles in parallel
        const activities = await Promise.all(
          rawActivities.map(async (act) => {
            const realProf = act.userId ? await resolveRealProfile(act.userId) : null;
            return {
              ...act,
              user: realProf?.name || act.fallbackUser,
              avatar: realProf?.avatar || act.fallbackAvatar || null,
            };
          })
        );

        // 5. Dynamic Stats Calculations
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const memoriesThisMonth = allMemories.filter(
          (m) => new Date(m.createdAt || m.occurredAt || 0) >= startOfMonth
        ).length;
        const albumsThisMonth = albums.filter(
          (a) => new Date(a.createdAt || 0) >= startOfMonth
        ).length;

        // Days Together
        const baseDate =
          circle?.createdAt ||
          members[0]?.joinedAt ||
          firebaseUser?.metadata?.creationTime ||
          userProfile?.createdAt ||
          new Date(Date.now() - 86400000 * 30);
        const daysDiff = Math.max(
          1,
          Math.floor((Date.now() - new Date(baseDate).getTime()) / (1000 * 60 * 60 * 24))
        );

        // 6. Set State
        setFamilyCircle(circle);
        setFamilyMembers(members);
        setMemoriesList(allMemories);
        setAlbumsList(albums);
        setQaQuestions(prompts);
        setTimelineMilestones(milestones);
        setRecentActivities(activities);

        setStats({
          totalMemories: allMemories.length,
          momentsThisMonth: memoriesThisMonth,
          albumsCount: albums.length,
          albumsThisMonth: albumsThisMonth,
          qaCount: prompts.length,
          qaThisMonth: prompts.filter((p) => new Date(p.createdAt || 0) >= startOfMonth).length,
          milestonesCount: milestones.length,
          daysTogether: daysDiff.toLocaleString(),
        });
      } catch (error) {
        console.warn("Failed to load home data from backend:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadHomeData();
    window.addEventListener("memoryPublished", loadHomeData);
    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      window.removeEventListener("memoryPublished", loadHomeData);
    };
  }, [isAuthenticated, firebaseUser]);

  const handleOpenPublish = (type = "all") => {
    window.dispatchEvent(
      new CustomEvent("openPublishModal", { detail: { initialType: type } })
    );
  };

  const handleOpenMemory = (memory) => {
    if (!memory) return;
    window.dispatchEvent(
      new CustomEvent("openMemoryView", {
        detail: {
          ...memory,
          date: formatRelativeTime(memory.occurredAt || memory.createdAt),
        },
      })
    );
  };

  if (loading || !isAuthenticated) return null;

  const familyName =
    familyCircle?.name ||
    profile?.familyName ||
    userProfile?.familyName ||
    (firebaseUser?.displayName
      ? `${firebaseUser.displayName.split(" ")[0]}'s Family`
      : "Our Family");

  return (
    <div className="w-full space-y-5 pb-16">

      {/* ════════════════════════════════════════════════════════
          1. HERO BANNER WITH CLEAN EARTH ARTWORK & LIVE FAMILY SPACE
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-slate-900 min-h-[210px] sm:min-h-[230px] flex items-center">
        {/* Clean Earth Banner Background (No baked-in text or cards) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/earth-banner.jpg"
            alt="Earth banner"
            className="w-full h-full object-fill object-center"
          />
          {/* Soft vignette overlay so text is 100% crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Left Text & CTA */}
          <div className="max-w-md text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              Welcome back,
              <br />
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">{familyName}! 👋</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-100 font-medium mt-2 leading-relaxed max-w-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
              This is your space to capture, celebrate and live your life together.
            </p>

            <button
              onClick={() => handleOpenPublish("all")}
              className="mt-4 inline-flex items-center gap-2 rounded-full font-bold text-white text-xs px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] shadow-[0_4px_18px_rgba(37,99,235,0.45)] transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Create a moment
              <span className="w-4 h-4 rounded-full border border-white/80 flex items-center justify-center text-[10px] font-black">
                +
              </span>
            </button>
          </div>

          {/* Right: Floating "Our Family Space" Glass Card (Live API Data) */}
          <div className="w-full md:w-auto self-end md:self-auto">
            <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 p-4 sm:p-5 shadow-[0_8px_25px_rgba(0,0,0,0.08)] min-w-[280px] sm:min-w-[340px]">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                  Our Family Space
                </h3>
                <Link
                  href="/family"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline"
                >
                  Manage <Settings size={12} className="stroke-[2.2]" />
                </Link>
              </div>

              {/* Avatars Row */}
              <div className="flex items-center justify-between gap-2">
                {familyMembers.slice(0, 5).map((member, idx) => {
                  const avatarSrc = getMemberAvatar(member);
                  const displayName =
                    member.name ||
                    member.displayName ||
                    member.email?.split("@")[0] ||
                    `Member ${idx + 1}`;
                  return (
                    <div
                      key={member.id || member._id || idx}
                      className="flex flex-col items-center"
                    >
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-[#2563eb] font-extrabold border-2 border-white shadow-sm flex items-center justify-center text-xs">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-[10px] font-medium text-slate-700 mt-1 max-w-[55px] truncate">
                        {displayName}
                      </span>
                    </div>
                  );
                })}

                {/* +N Overflow Bubble */}
                {familyMembers.length > 5 && (
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[11px] font-bold text-[#2563eb] shadow-sm">
                      +{familyMembers.length - 5}
                    </div>
                    <span className="text-[10px] font-medium text-transparent mt-1">.</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mt-2 text-left">
                <p className="text-[10px] font-medium text-slate-500">
                  {familyMembers.length} {familyMembers.length === 1 ? "member" : "members"} &nbsp;•&nbsp; Private
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. STAT CARDS SECTION (5 COMPACT LIVE DATABASE CARDS)
      ════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {/* Card 1: Moments */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 shadow-sm text-left flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Camera size={14} className="stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">Moments</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {stats.totalMemories}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              +{stats.momentsThisMonth} this month
            </p>
          </div>
        </div>

        {/* Card 2: Albums */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 shadow-sm text-left flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <FolderArchive size={14} className="stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">Albums</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {stats.albumsCount}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              +{stats.albumsThisMonth} this month
            </p>
          </div>
        </div>

        {/* Card 3: Family Q&A */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 shadow-sm text-left flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <HelpCircle size={14} className="stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">Family Q&A</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {stats.qaCount}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              +{stats.qaThisMonth} this month
            </p>
          </div>
        </div>

        {/* Card 4: Milestones */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 shadow-sm text-left flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Flag size={14} className="stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">Milestones</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {stats.milestonesCount}
            </h2>
            <Link
              href="/timeline"
              className="inline-block text-[10px] font-bold text-[#2563eb] hover:underline mt-1"
            >
              Celebrate life
            </Link>
          </div>
        </div>

        {/* Card 5: Days Together */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 shadow-sm text-left flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Users size={14} className="stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">Days Together</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {stats.daysTogether}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              and counting
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. MAIN CONTENT GRID (LEFT 2 COLS + RIGHT ACTIVITY COL)
      ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">

        {/* ── LEFT 2 COLUMNS ── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Top Row: Capture a moment + Recent Moments */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">

            {/* A. Capture a moment Card (4 Cols on md+) */}
            <div className="md:col-span-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-4 shadow-sm text-left flex flex-col justify-between">
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 mb-3">
                Capture a moment
              </h3>
              <div className="grid grid-cols-2 gap-2.5 my-auto">
                {/* Voice */}
                <button
                  onClick={() => handleOpenPublish("voice")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-[#2563eb] group-hover:scale-105 transition-transform">
                    <Mic size={16} className="stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                    Voice
                  </span>
                </button>

                {/* Photo */}
                <button
                  onClick={() => handleOpenPublish("photo")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-[#2563eb] group-hover:scale-105 transition-transform">
                    <Camera size={16} className="stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                    Photo
                  </span>
                </button>

                {/* Video */}
                <button
                  onClick={() => handleOpenPublish("video")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-[#2563eb] group-hover:scale-105 transition-transform">
                    <Video size={16} className="stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                    Video
                  </span>
                </button>

                {/* Write */}
                <button
                  onClick={() => handleOpenPublish("text")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-[#2563eb] group-hover:scale-105 transition-transform">
                    <PenLine size={16} className="stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                    Write
                  </span>
                </button>
              </div>
            </div>

            {/* B. Recent Moments Media Rail (8 Cols on md+) - Live API */}
            <div className="md:col-span-8 rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-4 shadow-sm text-left flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                  Recent Moments
                </h3>
                <Link
                  href="/memories"
                  className="text-[11px] font-semibold text-[#2563eb] hover:underline"
                >
                  View all
                </Link>
              </div>

              {/* 4 Cards Row or Clean Empty State */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {memoriesList.length > 0 ? (
                  memoriesList.slice(0, 4).map((item) => {
                    const cover = getMemoryCover(item);
                    const duration =
                      item.duration ||
                      item.mediaDuration ||
                      (item.type === "voice" || item.type === "audio" || item.audioUrl
                        ? "Voice"
                        : null);

                    return (
                      <div
                        key={item._id || item.id}
                        onClick={() => handleOpenMemory(item)}
                        className="group cursor-pointer flex flex-col"
                      >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-xs">
                          {cover ? (
                            <img
                              src={cover}
                              alt={item.title || "Memory"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-500 p-2 text-center">
                              <Camera size={18} className="mb-1 opacity-70" />
                              <span className="text-[9px] font-bold text-slate-600 truncate max-w-full">
                                {item.title || "Moment"}
                              </span>
                            </div>
                          )}

                          {/* Duration / Type Pill */}
                          {duration && (
                            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white leading-none">
                              {duration}
                            </div>
                          )}
                        </div>
                        <h4 className="text-[11.5px] font-bold text-slate-900 mt-1.5 truncate group-hover:text-[#2563eb] transition-colors">
                          {item.title || "Untitled Moment"}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-400">
                          {formatRelativeTime(item.occurredAt || item.createdAt)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 sm:col-span-4 p-5 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">
                      No moments captured yet.
                    </p>
                    <button
                      onClick={() => handleOpenPublish("all")}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
                    >
                      <Plus size={12} /> Capture your first moment
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Row 2: Family Q&A Card (Live Database Prompts) */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-4 sm:p-5 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900">
                    Family Q&A
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-[#2563eb] text-white">
                    Prompts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Get to know each other better. One question at a time.
                </p>
              </div>

              <Link
                href="/discover"
                className="inline-flex items-center rounded-full border border-slate-200 px-3.5 py-1 text-[11px] font-bold text-slate-700 hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-blue-50/40 transition-all whitespace-nowrap"
              >
                View Questions
              </Link>
            </div>

            {/* Q&A Questions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {qaQuestions.length > 0 ? (
                qaQuestions.slice(0, 3).map((qa) => {
                  const responsesCount = Array.isArray(qa.responses)
                    ? qa.responses.length
                    : qa.responseCount || 0;
                  const authorName =
                    qa.creator?.displayName ||
                    qa.creator?.name ||
                    qa.authorName ||
                    "Family Prompt";
                  const authorAvatar = getMemberAvatar(qa.creator);
                  const responderAvatars = (qa.responses || [])
                    .map((r) => getMemberAvatar(r.user || r.author))
                    .filter(Boolean)
                    .slice(0, 3);
                  const isCompleted = responsesCount >= (familyMembers.length || 1);

                  return (
                    <div
                      key={qa._id || qa.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex flex-col justify-between hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start gap-2.5">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-white shadow-xs"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <p className="text-[11.5px] font-bold text-slate-900 leading-snug">
                          {qa.question}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {responsesCount}/{familyMembers.length || 1} answered
                        </span>
                        <div className="flex items-center -space-x-1.5">
                          {responderAvatars.map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt="Answered"
                              className="w-5 h-5 rounded-full border border-white object-cover shadow-2xs"
                            />
                          ))}
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[#2563eb]">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenPublish("voice")}
                              className="w-5 h-5 rounded-full bg-blue-50 border border-white flex items-center justify-center text-[9px] font-bold text-[#2563eb] hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Answer Prompt"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Interactive Starter Prompts when DB has no custom prompts yet */
                [
                  {
                    id: "starter-1",
                    question: "What was your favorite memory together this year?",
                    category: "Memories",
                  },
                  {
                    id: "starter-2",
                    question: "What advice would you give your younger self?",
                    category: "Wisdom",
                  },
                  {
                    id: "starter-3",
                    question: "What family tradition means the most to you?",
                    category: "Heritage",
                  },
                ].map((prompt, idx) => (
                  <div
                    key={prompt.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex flex-col justify-between hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                        Q{idx + 1}
                      </div>
                      <p className="text-[11.5px] font-bold text-slate-900 leading-snug">
                        {prompt.question}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[9.5px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {prompt.category}
                      </span>
                      <button
                        onClick={() => handleOpenPublish("voice")}
                        className="text-[10px] font-bold text-[#2563eb] hover:underline cursor-pointer"
                      >
                        Answer prompt →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Row 3: Our Life Timeline (Live Database Milestones) */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-4 sm:p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900">
                Our Life Timeline
              </h3>
              <Link
                href="/timeline"
                className="text-[11px] font-semibold text-[#2563eb] hover:underline"
              >
                View full timeline
              </Link>
            </div>

            {/* Timeline Horizontal Line with Nodes */}
            <div className="relative pt-3 pb-1 overflow-x-auto">
              {/* Connected Line */}
              <div className="absolute top-[26px] left-6 right-6 h-0.5 bg-blue-100 border-dashed border-b border-blue-300" />

              <div className="flex items-start justify-between gap-4 min-w-[540px] relative z-10 px-2">
                {timelineMilestones.length > 0 ? (
                  timelineMilestones.map((mile) => (
                    <div
                      key={mile.id || mile.year}
                      onClick={() => mile.raw && handleOpenMemory(mile.raw)}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      <span className="text-[10.5px] font-extrabold text-slate-500 mb-1 group-hover:text-[#2563eb] transition-colors">
                        {mile.year}
                      </span>
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-blue-100 bg-slate-100 group-hover:scale-105 group-hover:ring-[#2563eb] transition-all">
                        <img
                          src={mile.image}
                          alt={mile.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 mt-1.5 max-w-[85px] leading-tight truncate group-hover:text-[#2563eb] transition-colors">
                        {mile.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-center text-slate-400 w-full">
                    <span className="text-xs font-medium">Add key milestones to build your family story line.</span>
                  </div>
                )}

                {/* Add Milestone Dashed Button */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10.5px] font-extrabold text-transparent mb-1">
                    .
                  </span>
                  <button
                    onClick={() => handleOpenPublish("milestone")}
                    className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 hover:border-[#2563eb] flex items-center justify-center text-slate-400 hover:text-[#2563eb] bg-white transition-colors cursor-pointer"
                  >
                    <Plus size={16} className="stroke-[2.2]" />
                  </button>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1.5 leading-tight">
                    Add
                    <br />
                    milestone
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: RECENT ACTIVITY (Live Notifications / Actions) ── */}
        <div className="xl:col-span-1 space-y-5">
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-4 sm:p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900">
                Recent Activity
              </h3>
              <Link
                href="/memories"
                className="text-[11px] font-semibold text-[#2563eb] hover:underline"
              >
                View all
              </Link>
            </div>

            {/* Activity List */}
            <div className="divide-y divide-slate-100">
              {recentActivities.length > 0 ? (
                recentActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => act.memory && handleOpenMemory(act.memory)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors rounded-lg px-1.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {act.avatar ? (
                        <img
                          src={act.avatar}
                          alt={act.user}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white shadow-2xs"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 border border-white shadow-2xs">
                          {(act.user || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-600 truncate">
                          <span className="font-bold text-slate-900">{act.user}</span>{" "}
                          {act.action}
                        </p>
                        <p className="text-[11.5px] font-bold text-slate-900 truncate">
                          {act.title}
                        </p>
                        <p className="text-[9.5px] text-slate-400 font-medium mt-0.5">
                          {act.timeAgo}
                        </p>
                      </div>
                    </div>

                    {/* Right Media Thumbnail */}
                    {act.thumb && (
                      <div className="w-12 h-8 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60 shadow-2xs">
                        <img
                          src={act.thumb}
                          alt={act.title || "thumbnail"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs font-semibold">No recent activity yet</p>
                  <p className="text-[10px] mt-1 text-slate-500">
                    Capture a moment to begin your family story.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════════
          4. BOTTOM SECURITY & PRIVACY PILL
      ════════════════════════════════════════════════════════ */}
      <div className="flex justify-center pt-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 px-5 py-2 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <Lock size={12} className="text-slate-500" />
          <span>Your space is private, secure and always yours.</span>
        </div>
      </div>

    </div>
  );
}
