"use client";

import { Bell, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import LandingPage from "@/app/landing/page";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";
import { albums, memories } from "@/data/mockApp";

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
      <div className="absolute inset-0 bg-[var(--brand)] mix-blend-multiply opacity-35 group-hover:opacity-20 transition-opacity duration-500" />
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
    { name: "Voice", label: "Quick Audio", href: "/record?mode=Voice" },
    { name: "Write", label: "Journal Entry", href: "/record?mode=Text" },
    { name: "Photo", label: "Upload Image", href: "/record?mode=Photo" },
    { name: "Video", label: "Record Clip", href: "/record?mode=Video" },
  ];

  const recentMemories = memories.slice(0, 4);

  const heroAlbums = albums.slice(0, 3).map((album) => ({
    ...album,
    count: `${memories.filter((memory) => memory.albumId === album.id).length} Memories`,
    images: [
      album.cover,
      memories.find((memory) => memory.albumId === album.id)?.image ?? album.cover,
    ],
  }));
  // ── LANDING PAGE (Logged-out) ──
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  // ── DASHBOARD (Logged-in) ──
  return (
    <div className="w-full animation-fade-in pb-24">
      {/* Header */}
      <header className="mb-6 md:mb-8 flex justify-between items-end gap-4">
        <div>
          <p className="text-[var(--foreground)] opacity-60 text-sm font-medium mb-1">Good Morning,</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">Alexander</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/search" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95" aria-label="Search">
            <Search size={18} />
          </Link>
          <Link href="/notifications" className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
          </Link>
          <Link href="/profile" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--brand)] text-sm font-black text-white shadow-sm lg:hidden" aria-label="Profile">
            A
          </Link>
          <span className="hidden" aria-hidden="true" />
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
          <Link href="/albums" className="shrink-0 w-32 md:w-40 h-52 md:h-64 rounded-3xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center snap-center hover:bg-[var(--surface-hover)] hover:border-[var(--brand)]/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-light leading-none text-[var(--brand)]">+</span>
            </div>
            <span className="font-bold text-sm">New Album</span>
          </Link>
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
                <Link href={action.href} key={action.name} className="group flex flex-col items-center sm:items-start justify-center sm:p-5 p-3 bg-white border border-stone-200/80 hover:border-[var(--brand)]/40 hover:shadow-lg rounded-lg transition-all active:scale-95 w-full">
                  <div className="w-14 h-14 rounded-lg bg-[var(--brand-soft)] border border-[var(--border)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm text-[var(--brand)]">
                    {resolveGlass3DIcon(action.name)}
                  </div>
                  <span className="text-[11px] md:text-sm font-bold text-stone-800">{action.name}</span>
                  <span className="hidden sm:block text-xs text-stone-400 mt-1 font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Archives */}
          <section>
            <h2 className="text-xl font-bold mb-5">Recent Archives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentMemories.map((memory) => (
                <Link href={`/memories/${memory.id}`} key={memory.id} className="block p-5 glass-card group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-lg bg-[var(--brand-soft)] border border-[var(--border)] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm text-[var(--brand)]">
                      {resolveGlass3DIcon(memory.title)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1 group-hover:text-[var(--brand)] transition-colors">{memory.title}</h3>
                      <p className="text-sm opacity-60 mb-3 line-clamp-2">{memory.description}</p>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="opacity-60">{memory.date}</span>
                        <span className="px-2.5 py-1 bg-[var(--border)]/50 rounded-md opacity-80">{memory.privacy}</span>
                      </div>
                    </div>
                  </div>
                </Link>
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
            <div className="space-y-3">
              {[
                { label: "Total Memories", count: memories.length, href: "/search" },
                { label: "Albums Curated", count: albums.length, href: "/albums" },
                { label: "Family Members", count: "5", href: "/family" },
              ].map((stat) => (
                <Link key={stat.label} href={stat.href} className="flex items-center justify-between rounded-lg p-2 transition hover:bg-[var(--surface-hover)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[var(--brand-soft)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm text-[var(--brand)]">
                      {resolveGlass3DIcon(stat.label)}
                    </div>
                    <span className="font-medium opacity-80">{stat.label}</span>
                  </div>
                  <span className="text-xl font-bold">{stat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
