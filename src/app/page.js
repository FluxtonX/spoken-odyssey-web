"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import LandingPage from "@/app/landing/page";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

// Sliding Album Card Component
function AlbumSlideshowCard({ album }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Link href={`/albums/${album.id}`} className="shrink-0 w-40 md:w-52 h-52 md:h-64 rounded-3xl snap-center relative overflow-hidden shadow-lg cursor-pointer group active:scale-95 transition-transform block">
      {album.images.map((img, index) => (
        <img key={index} src={img} alt={album.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
      <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/20 to-transparent text-white">
        <h3 className="font-bold text-base md:text-lg leading-tight mb-1">{album.title}</h3>
        <p className="text-xs font-medium opacity-90">{album.count}</p>
        <div className="flex gap-1 mt-2">
          {album.images.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const quickActions = [
    { name: "Voice", icon: "🎙️", color: "bg-amber-500/10", label: "Quick Audio" },
    { name: "Write", icon: "✍️", color: "bg-orange-500/10", label: "Journal Entry" },
    { name: "Photo", icon: "🖼️", color: "bg-emerald-500/10", label: "Upload Image" },
    { name: "Video", icon: "🎬", color: "bg-purple-500/10", label: "Record Clip" },
  ];

  const recentMemories = [
    { id: 1, title: "Trip to the Mountains", desc: "A beautiful weekend getaway with the family.", date: "2 days ago", icon: "🖼️", privacy: "Family Circle" },
    { id: 2, title: "Grandpa's Childhood Story", desc: "Recording of grandpa talking about his old village.", date: "Last week", icon: "🎙️", privacy: "Private" },
    { id: 3, title: "Graduation Day Thoughts", desc: "Reflecting on four years of hard work.", date: "2 weeks ago", icon: "✍️", privacy: "Public" },
  ];

  const heroAlbums = [
    {
      id: 1, title: "Summer 2023", count: "42 Memories", color: "from-orange-400 to-rose-500",
      images: [
        "https://images.unsplash.com/photo-1473496169904-658ba37448eb?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80"
      ]
    },
    {
      id: 2, title: "Grandpa's Tales", count: "18 Records", color: "from-blue-500 to-indigo-600",
      images: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80"
      ]
    },
    {
      id: 3, title: "Family Recipes", count: "12 Notes", color: "from-amber-500 to-orange-600",
      images: [
        "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80"
      ]
    },
  ];

  // ── LANDING PAGE (Logged-out) ──
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  // ── DASHBOARD (Logged-in) ──
  return (
    <div className="w-full animation-fade-in pb-24">
      {/* Header */}
      <header className="mb-6 md:mb-8 flex justify-between items-end">
        <div>
          <p className="text-[var(--foreground)] opacity-60 text-sm font-medium mb-1">Good Morning,</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">Alexander</h1>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] shadow-md lg:hidden flex items-center justify-center bg-gradient-to-tr from-brand-300 to-brand-500">
          <span className="text-2xl">👤</span>
        </div>
      </header>

      {/* Albums Gallery Strip */}
      <section className="mb-10 -mx-4 sm:mx-0">
        <div className="px-4 sm:px-0 flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Albums</h2>
          <Link href="/albums" className="text-sm px-4 py-1.5 rounded-full glass hover:bg-[var(--surface-hover)] transition-colors text-[var(--brand)] font-semibold flex items-center gap-1 border border-[var(--border)]/50">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-4 sm:px-0 gap-4">
          <div className="shrink-0 w-32 md:w-40 h-52 md:h-64 rounded-3xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center snap-center hover:bg-[var(--surface-hover)] hover:border-[var(--brand)]/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-light leading-none text-[var(--brand)]">+</span>
            </div>
            <span className="font-bold text-sm">New Album</span>
          </div>
          {heroAlbums.map((album) => (
            <AlbumSlideshowCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-10">

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-bold mb-4">Capture Memory</h2>
            <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {quickActions.map((action) => (
                <button key={action.name} className="group flex flex-col items-center sm:items-start justify-center sm:p-5 p-3 bg-white border border-stone-200/80 hover:border-amber-400/40 hover:shadow-lg rounded-[2rem] transition-all active:scale-95 w-full">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50/40 border border-amber-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    {resolveGlass3DIcon(action.name)}
                  </div>
                  <span className="text-[11px] md:text-sm font-bold text-stone-800">{action.name}</span>
                  <span className="hidden sm:block text-xs text-stone-400 mt-1 font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Archives */}
          <section>
            <h2 className="text-xl font-bold mb-5">Recent Archives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentMemories.map((memory) => (
                <div key={memory.id} className="p-5 glass-card group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-amber-50/50 border border-amber-100/60 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      {resolveGlass3DIcon(memory.title)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1 group-hover:text-[var(--brand)] transition-colors">{memory.title}</h3>
                      <p className="text-sm opacity-60 mb-3 line-clamp-2">{memory.desc}</p>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="opacity-60">⏳ {memory.date}</span>
                        <span className="px-2.5 py-1 bg-[var(--border)]/50 rounded-md opacity-80">{memory.privacy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[var(--brand)] opacity-10 rounded-full blur-3xl" />
            <h2 className="text-base font-bold opacity-90 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 rounded-full bg-[var(--brand)]" />
              Your Legacy Progress
            </h2>
            <div className="space-y-6">
              {[
                { icon: "📚", label: "Total Memories", count: "24", bg: "bg-blue-500/10" },
                { icon: "🖼️", label: "Albums Curated", count: "3", bg: "bg-emerald-500/10" },
                { icon: "👨‍👩‍👧‍👦", label: "Family Members", count: "5", bg: "bg-amber-500/10" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                      {resolveGlass3DIcon(stat.label)}
                    </div>
                    <span className="font-medium opacity-80">{stat.label}</span>
                  </div>
                  <span className="text-xl font-bold">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
