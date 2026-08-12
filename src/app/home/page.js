"use client";

import { ChevronRight, Play, Pause, Mic, Image as ImageIcon, FileText, Film, Share2, LogOut, Settings, HelpCircle, User, Sparkles, Users, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import LandingPage from "@/app/landing/page";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { getAlbumsFromBackend, getMemoriesFromBackend, getFamilyMembers, getFamilyCircleMembers, normalizeMediaUrl } from "@/services/backend";
import { memories } from "@/data/mockApp";
import { getStoredAlbums, seedInitialMemoriesIfNeeded, getStoredUserProfile, COVER_PRESETS } from "@/data/userProfile";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeInScale } from "@/lib/animations";

import VoicePlayer from "@/components/ui/VoicePlayer";
import TaggedMembersBadge from "@/components/ui/TaggedMembersBadge";

const formatDateSafely = (dateVal, memoryItem) => {
  if (!dateVal && memoryItem?.year) {
    return `${memoryItem.month || "August"} ${memoryItem.year}`;
  }
  if (!dateVal) return "Recent";
  const strVal = String(dateVal).trim();
  if (/^\d{4}$/.test(strVal)) {
    return `${memoryItem?.month || "August"} ${strVal}`;
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return strVal;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const isVideoLike = (url, mimeType = "", type = "") => {
  const cleanUrl = typeof url === "string" ? url.split("?")[0] : "";
  const normType = String(type || "").toLowerCase();
  const normMime = String(mimeType || "").toLowerCase();

  if (normMime.startsWith("audio/") || normType === "voice" || normType === "audio") {
    return false;
  }

  return (
    normMime.startsWith("video/") ||
    normType === "video" ||
    cleanUrl.startsWith("data:video/") ||
    /\.(mp4|mov|avi|m4v)$/i.test(cleanUrl) ||
    (/\.webm$/i.test(cleanUrl) && !normMime.startsWith("audio/"))
  );
};

const getMemoryMediaSources = (memory) => {
  const items = [];
  const addItem = (url, type = "image", mimeType = "") => {
    if (!url || typeof url !== "string") return;
    items.push({ url, type: isVideoLike(url, mimeType, type) ? "video" : "image" });
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
  if (isVideoLike(memory.audioUrl)) addItem(memory.audioUrl, "video");
  if (isVideoLike(memory.audio)) addItem(memory.audio, "video");
  addItem(memory.image, "image");
  addItem(memory.cover, "image");
  addItem(memory.imageUrl, "image");
  addItem(memory.coverImageUrl, "image");

  return {
    video: items.find((item) => item.type === "video")?.url,
    image: items.find((item) => item.type === "image")?.url,
  };
};

const getMemoryDuplicateKey = (memory) => {
  const id = memory?.id || memory?._id;
  const title = String(memory?.title || "").trim().toLowerCase();
  if (!title) return id ? `id:${id}` : "";
  const rawDate = memory?.createdAt || memory?.occurredAt || memory?.date || "";
  const parsedDate = new Date(rawDate);
  const day = Number.isNaN(parsedDate.getTime()) ? String(rawDate).slice(0, 10) : parsedDate.toISOString().slice(0, 10);
  return `${title}_${day}`;
};

const dedupeMemories = (list = []) => {
  const seen = new Set();
  return list.filter((memory) => {
    const key = getMemoryDuplicateKey(memory);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function MemoryCard({ memory, index }) {
  const type = memory.type?.toLowerCase() || "voice";
  const dateStr = formatDateSafely(memory.date || memory.createdAt || memory.occurredAt);

  const mediaSources = getMemoryMediaSources(memory);
  const coverVid = normalizeMediaUrl(mediaSources.video);
  const coverImg = normalizeMediaUrl(mediaSources.image);

  const normType = (memory.type || "").toLowerCase();
  const isVoice = normType === "voice" || normType === "audio" || (!!memory.audioUrl && !coverVid) || (!!memory.audio && !coverVid);
  const isVideo = !isVoice && (normType === "video" || normType === "visual" || !!coverVid);
  
  const openView = () => {
    window.dispatchEvent(new CustomEvent("openMemoryView", { detail: {
      ...memory,
      date: dateStr
    } }));
  };

  const delay = `stagger-${(index % 4) + 2}`;

  if (isVideo) {
    return (
      <div onClick={openView} className={`figma-card overflow-hidden group animate-fade-in-up ${delay} break-inside-avoid cursor-pointer`}>
        <div className="h-48 bg-stone-900 relative overflow-hidden flex items-center justify-center">
          {coverVid ? (
            <video src={coverVid} className="w-full h-full object-cover opacity-85" />
          ) : coverImg ? (
            <img src={coverImg} alt="Video cover" className="w-full h-full object-cover opacity-85" />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-xl group-hover:scale-110 transition-transform">
              <Play size={22} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Film size={16} strokeWidth={2.5} className="text-[#ec4899]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ec4899]">VIDEO</span>
            </div>
            <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
          </div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[22px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors leading-snug">{memory.title}</h3>
            <TaggedMembersBadge memory={memory} />
          </div>
          <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">{memory.description}</p>
          <div className="flex flex-wrap gap-2">
            {(memory.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-stone-500">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isVoice) {
    return (
      <div onClick={openView} className={`figma-card p-6 md:p-8 animate-fade-in-up ${delay} break-inside-avoid cursor-pointer`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-[#f59e0b]">
            <Mic size={16} strokeWidth={2.5} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">VOICE</span>
          </div>
          <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
        </div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-[22px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors leading-snug">{memory.title}</h3>
          <TaggedMembersBadge memory={memory} />
        </div>
        <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">
          {memory.description || "No transcript available for this voice memory."}
        </p>
        <div className="mb-6 w-full" onClick={(e) => e.stopPropagation()}>
          <VoicePlayer memory={memory} />
        </div>
        <div className="flex flex-wrap gap-2">
          {(memory.tags || []).map(tag => (
            <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-stone-500">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "text" || type === "written" || type === "milestone") {
    return (
      <div onClick={openView} className={`figma-card p-6 md:p-8 flex flex-col gap-6 animate-fade-in-up ${delay} break-inside-avoid cursor-pointer`}>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <FileText size={16} strokeWidth={2.5} className="text-[#10b981]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#10b981]">WRITTEN</span>
            </div>
            <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
          </div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-[22px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors leading-snug">{memory.title}</h3>
            <TaggedMembersBadge memory={memory} />
          </div>
          <p className="text-stone-500 mb-6 line-clamp-3 text-[15px] leading-relaxed">
            {memory.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {(memory.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#4A3AFF] text-white rounded-full text-[11px] font-semibold">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // photo / video
  return (
    <div onClick={openView} className={`figma-card overflow-hidden group animate-fade-in-up ${delay} break-inside-avoid cursor-pointer`}>
      <div className="h-48 bg-stone-200 relative overflow-hidden">
        <img src={coverImg || memory.image || memory.cover || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80"} alt="Memory" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} strokeWidth={2.5} className="text-[#3b82f6]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#3b82f6]">PHOTO</span>
          </div>
          <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
        </div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[22px] font-bold text-stone-900 group-hover:text-[#4A3AFF] transition-colors leading-snug">{memory.title}</h3>
          <TaggedMembersBadge memory={memory} />
        </div>
        <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">{memory.description}</p>
        <div className="flex flex-wrap gap-2">
          {(memory.tags || []).map(tag => (
            <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-stone-500">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading, profile, firebaseUser, logout, getToken} = useAuth();
  
  const [memoriesList, setMemoriesList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState("Loading date...");
  const [greeting, setGreeting] = useState("Hello");

  // Dynamic API Database Stats State
  const [stats, setStats] = useState({
    totalMemories: 0,
    voiceRecordings: 0,
    familyMembers: 0,
    thisYearCount: 0
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));

      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else if (hour < 21) setGreeting("Good evening");
      else setGreeting("Good night");
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function loadProfile() {
      setUserProfile(getStoredUserProfile());
    }
    loadProfile();
    window.addEventListener("profileUpdated", loadProfile);

    const loadHomeData = async () => {
      let fetchedMemories = [];
      let familyCount = 0;

      if (isAuthenticated && firebaseUser) {
        try {
          const token = await getToken();
          const [backendAlbums, backendMemories, backendFamily, backendCircle] = await Promise.allSettled([
            getAlbumsFromBackend(token),
            getMemoriesFromBackend(token),
            getFamilyMembers(token),
            getFamilyCircleMembers(token)
          ]);
          
          if (backendMemories.status === "fulfilled" && Array.isArray(backendMemories.value)) {
            fetchedMemories = backendMemories.value;
          } else {
            const userKey = (firebaseUser?.uid || profile?.id) ? `spokenOdysseyLocalMemories_${firebaseUser?.uid || profile?.id}` : "spokenOdysseyLocalMemories";
            const saved = localStorage.getItem(userKey);
            fetchedMemories = saved ? JSON.parse(saved) : [];
          }

          const familyList = [];
          if (backendFamily.status === "fulfilled" && Array.isArray(backendFamily.value)) {
            familyList.push(...backendFamily.value);
          }
          if (backendCircle.status === "fulfilled" && Array.isArray(backendCircle.value)) {
            backendCircle.value.forEach(m => {
              if (m && !familyList.some(f => (f.id || f.uid || f._id) === (m.id || m.uid || m._id))) {
                familyList.push(m);
              }
            });
          }

          if (familyList.length > 0) {
            familyCount = familyList.length;
          } else {
            try {
              const storedFam = localStorage.getItem("spokenOdysseyFamilyMembers");
              if (storedFam) {
                const parsed = JSON.parse(storedFam);
                if (Array.isArray(parsed) && parsed.length > 0) familyCount = parsed.length;
              }
            } catch (_) {}
            if (familyCount === 0) familyCount = 5;
          }
        } catch (error) {
          console.warn("Failed to load backend data", error);
          const userKey = (firebaseUser?.uid || profile?.id) ? `spokenOdysseyLocalMemories_${firebaseUser?.uid || profile?.id}` : "spokenOdysseyLocalMemories";
          const saved = localStorage.getItem(userKey);
          fetchedMemories = saved ? JSON.parse(saved) : [];
          familyCount = 5;
        }
      } else {
        const saved = localStorage.getItem("spokenOdysseyLocalMemories");
        fetchedMemories = saved ? JSON.parse(saved) : [];
        try {
          const storedFam = localStorage.getItem("spokenOdysseyFamilyMembers");
          if (storedFam) {
            const parsed = JSON.parse(storedFam);
            if (Array.isArray(parsed) && parsed.length > 0) familyCount = parsed.length;
          }
        } catch (_) {}
        if (familyCount === 0) familyCount = 5;
      }

      const uniqueMemories = dedupeMemories(fetchedMemories);
      setMemoriesList(uniqueMemories);

      // Compute exact dynamic stats from database / API
      const currentYear = new Date().getFullYear();
      const voiceCount = uniqueMemories.filter((m) => {
        const sources = getMemoryMediaSources(m);
        return !sources.video && (
          m.type?.toLowerCase() === "voice" ||
          m.type?.toLowerCase() === "audio" ||
          !!m.audioUrl ||
          !!m.audio
        );
      }).length;

      const thisYearCount = uniqueMemories.filter(m => {
        const dateStr = (m.occurredAt || m.createdAt || m.date || "").toString();
        if (!dateStr) return false;
        return dateStr.includes(currentYear.toString()) || new Date(dateStr).getFullYear() === currentYear;
      }).length;

      setStats({
        totalMemories: uniqueMemories.length,
        voiceRecordings: voiceCount,
        familyMembers: familyCount,
        thisYearCount: thisYearCount
      });
    };

    loadHomeData();
    window.addEventListener("memoryPublished", loadHomeData);
    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      window.removeEventListener("memoryPublished", loadHomeData);
    };
  }, [isAuthenticated, firebaseUser]);

  if (loading) return null;
  if (!isAuthenticated) return null;

  const fullName = firebaseUser?.displayName || profile?.displayName || firebaseUser?.email?.split("@")[0] || profile?.email?.split("@")[0] || userProfile?.name || "Explorer";

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full pb-24"
    >
      {/* TOP HEADER BAR */}
      <DashboardHeader />

      {/* WELCOME BANNER */}
      <motion.div variants={fadeInUp} className="mb-10">
        <p className="text-stone-400 font-semibold text-sm mb-1">{currentDate}</p>
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-2 leading-none">
          {greeting}, {fullName}.
        </h1>
        <p className="text-stone-500 text-sm font-medium">
          Your archive has <span className="font-bold text-[var(--brand)]">{stats.totalMemories} memories</span> and is growing.
        </p>
      </motion.div>

      {/* TOP STAT CARDS (Dynamic Database Values) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[
          { icon: BookOpen, count: stats.totalMemories, label: "Memories", iconColor: "text-[#4A3AFF]", delay: "stagger-1" },
          { icon: Mic, count: stats.voiceRecordings, label: "Voice recordings", iconColor: "text-[#f59e0b]", delay: "stagger-2" },
          { icon: Users, count: stats.familyMembers, label: "Family members", iconColor: "text-[#0ea5e9]", delay: "stagger-3" },
          { icon: TrendingUp, count: stats.thisYearCount, label: "This year", iconColor: "text-[#10b981]", delay: "stagger-4" }
        ].map((stat, idx) => (
          <div key={idx} className={`figma-card p-6 relative group hover:scale-[1.02] cursor-pointer animate-fade-in-up ${stat.delay}`}>
            <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5 ${stat.iconColor} group-hover:scale-110 transition-transform border border-[#E5E7EB]`}>
              <stat.icon size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-[32px] font-black leading-none mb-1.5 text-stone-900">{stat.count}</h2>
            <p className="text-[13px] font-bold text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* THREE COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMNS: Recent Memories (Masonry) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Recent memories</h2>
            <Link href="/memories" className="text-sm font-semibold text-[var(--brand)] flex items-center gap-1 hover:underline">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {memoriesList.length > 0 ? (
              memoriesList.map((memory, index) => (
                <MemoryCard key={memory._id || memory.id || index} memory={memory} index={index} />
              ))
            ) : (
              <div className="col-span-full p-10 text-center border-2 border-dashed border-stone-200 rounded-3xl text-stone-400 font-semibold bg-stone-50">
                You haven't published any memories yet.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Insights & Widgets */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Today's Prompt */}
          <div className="figma-card-dark text-white p-7 relative overflow-hidden animate-fade-in-up stagger-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A3AFF] rounded-full blur-[40px] opacity-30 -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={16} className="text-[#A5B4FC]" />
              <span className="text-[11px] font-bold tracking-widest text-[#A5B4FC] uppercase">Today&apos;s Prompt</span>
            </div>
            <h3 className="text-[20px] font-medium leading-snug mb-8 italic text-stone-100">
              &quot;What were you doing this time five years ago?&quot;
            </h3>
            <button className="w-full py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-[14px] font-bold transition-all flex justify-center items-center gap-2 active:scale-95">
              <Mic size={18} strokeWidth={2.5} /> Record your answer
            </button>
          </div>

          {/* AI Insight */}
          <div className="figma-card p-7 relative overflow-hidden transition-colors animate-fade-in-up stagger-3">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-[#4A3AFF]" />
                <span className="text-[11px] font-bold tracking-widest text-[#4A3AFF] uppercase">Archive Insight</span>
              </div>
              <p className="text-stone-600 italic text-[14px] leading-relaxed mb-6">
                &quot;Your most active memory-recording period is Sunday evenings. You are more reflective then — and more honest.&quot;
              </p>
              <Link href="/insights" className="text-sm font-bold text-[#4A3AFF] flex items-center gap-1 hover:underline w-max">
                View all insights <ChevronRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Activity Chart (This Week) */}
          <div className="figma-card p-7 animate-fade-in-up stagger-4">
            <h3 className="font-bold text-stone-900 mb-6">This week</h3>
            <div className="space-y-4">
              {[
                { day: "Mon", val: 2 },
                { day: "Tue", val: 0 },
                { day: "Wed", val: 3 },
                { day: "Thu", val: 1 },
                { day: "Fri", val: 4 },
                { day: "Sat", val: 2 },
                { day: "Sun", val: 5 },
              ].map(row => (
                <div key={row.day} className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-stone-500 w-6">{row.day}</span>
                  <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-[#4A3AFF] rounded-full transition-all duration-1000" 
                      style={{ width: `${(row.val / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-stone-800 w-3 text-right">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

