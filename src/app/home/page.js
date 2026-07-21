"use client";

import { ChevronRight, Play, Pause, Mic, Image as ImageIcon, FileText, Share2, LogOut, Settings, HelpCircle, User, Sparkles, Users, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import LandingPage from "@/app/landing/page";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { getAlbumsFromBackend, getMemoriesFromBackend } from "@/services/backend";
import { memories } from "@/data/mockApp";
import { getStoredAlbums, seedInitialMemoriesIfNeeded, getStoredUserProfile, COVER_PRESETS } from "@/data/userProfile";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, fadeInScale } from "@/lib/animations";

function MemoryCard({ memory, index }) {
  const type = memory.type?.toLowerCase() || "voice";
  const dateStr = memory.date || new Date(memory.createdAt).toLocaleDateString() || "Unknown Date";
  
  const openView = () => {
    window.dispatchEvent(new CustomEvent("openMemoryView", { detail: {
      ...memory,
      date: dateStr
    } }));
  };

  const delay = `stagger-${(index % 4) + 2}`;

  if (type === "voice") {
    return (
      <div onClick={openView} className={`figma-card p-6 md:p-8 animate-fade-in-up ${delay} break-inside-avoid cursor-pointer`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-[#f59e0b]">
            <Mic size={16} strokeWidth={2.5} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">VOICE</span>
          </div>
          <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
        </div>
        <h3 className="text-[22px] font-bold mb-3 text-stone-900">{memory.title}</h3>
        <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">
          {memory.description || "No transcript available for this voice memory."}
        </p>
        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-full p-1.5 pr-6 mb-6 w-full max-w-full">
          <button className="h-10 w-10 shrink-0 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center hover:bg-[#3b2dd1] transition-colors">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </button>
          <div className="flex-1 flex items-center overflow-hidden">
            <div className="w-full border-t-4 border-dotted border-[#A5B4FC] opacity-60" />
          </div>
          <span className="text-xs font-bold text-stone-500">{memory.duration || "1:00"}</span>
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
          <h3 className="text-[22px] font-bold mb-3 text-stone-900">{memory.title}</h3>
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
        <img src={memory.image || memory.cover || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80"} alt="Memory" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} strokeWidth={2.5} className="text-[#3b82f6]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#3b82f6]">PHOTO</span>
          </div>
          <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
        </div>
        <h3 className="text-[22px] font-bold mb-2 text-stone-900">{memory.title}</h3>
        <p className="text-stone-500 mb-6 line-clamp-2 text-[15px] leading-relaxed">{memory.description}</p>
        <div className="flex flex-wrap gap-2">
          {(memory.tags || []).map(tag => (
            <span key={tag} className="px-3 py-1 bg-[#4A3AFF] text-white rounded-full text-[11px] font-semibold">{tag}</span>
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
      if (isAuthenticated && firebaseUser) {
        try {
          const token = await getToken();
          const [backendAlbums, backendMemories] = await Promise.all([
            getAlbumsFromBackend(token),
            getMemoriesFromBackend(token)
          ]);
          
          if (backendMemories && backendMemories.length > 0) {
            setMemoriesList(backendMemories);
          } else {
            seedInitialMemoriesIfNeeded();
            const saved = localStorage.getItem("spokenOdysseyLocalMemories");
            setMemoriesList(saved ? JSON.parse(saved) : memories);
          }
          return;
        } catch (error) {
          console.warn("Failed to load backend data", error);
        }
      }
      seedInitialMemoriesIfNeeded();
      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
      setMemoriesList(saved ? JSON.parse(saved) : memories);
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
          Your archive has <span className="font-bold text-[var(--brand)]">{memoriesList.length} memories</span> and is growing.
        </p>
      </motion.div>

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[
          { icon: BookOpen, count: 247, label: "Memories", iconColor: "text-[#4A3AFF]", delay: "stagger-1" },
          { icon: Mic, count: 89, label: "Voice recordings", iconColor: "text-[#f59e0b]", delay: "stagger-2" },
          { icon: Users, count: 5, label: "Family members", iconColor: "text-[#0ea5e9]", delay: "stagger-3" },
          { icon: TrendingUp, count: 34, label: "This year", iconColor: "text-[#10b981]", delay: "stagger-4" }
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
                <span className="text-[11px] font-bold tracking-widest text-[#4A3AFF] uppercase">AI Insight</span>
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

