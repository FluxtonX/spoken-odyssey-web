"use client";

import { Plus, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AlbumsGallery() {
  const albums = [
    { id: 1, title: "Summer 2023", count: "42 Memories", color: "from-orange-400 to-rose-500", image: "https://images.unsplash.com/photo-1473496169904-658ba37448eb?auto=format&fit=crop&w=500&q=80", privacy: "Family" },
    { id: 2, title: "Grandpa's Tales", count: "18 Records", color: "from-blue-500 to-indigo-600", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80", privacy: "Private" },
    { id: 3, title: "Sarah's First Year", count: "124 Photos", color: "from-emerald-500 to-teal-600", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80", privacy: "Family" },
    { id: 4, title: "Family Recipes", count: "12 Notes", color: "from-amber-500 to-orange-600", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=500&q=80", privacy: "Public" },
    { id: 5, title: "Europe Trip '18", count: "215 Photos", color: "from-purple-500 to-fuchsia-600", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=80", privacy: "Private" },
  ];

  return (
    <div className="w-full animation-fade-in pb-24">
      {/* Header Area */}
      <header className="sticky top-0 z-20 glass px-4 py-4 md:py-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Albums</h1>
          <button className="w-10 h-10 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
            <Plus size={24} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
          <input 
            type="text" 
            placeholder="Search albums..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] outline-none focus:border-[var(--brand)] transition-colors text-sm font-medium"
          />
        </div>
      </header>

      {/* Grid Layout */}
      <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {albums.map((album) => (
          <Link href={`/albums/${album.id}`} key={album.id} className="group cursor-pointer">
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
              
              <img 
                src={album.image} 
                alt={album.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${album.color} mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity duration-500`} />

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wide uppercase">
                {album.privacy}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold opacity-80 mb-0.5">{album.count}</p>
                <h3 className="font-bold text-lg leading-tight filter drop-shadow-md group-hover:text-[var(--brand-300)] transition-colors">
                  {album.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}

        {/* Create New Album Card */}
        <div className="relative w-full aspect-square rounded-[2rem] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center hover:bg-[var(--surface-hover)] hover:border-[var(--brand)]/50 transition-colors cursor-pointer group active:scale-95">
          <div className="w-16 h-16 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <h3 className="font-bold text-base">New Album</h3>
          <p className="text-xs opacity-60 mt-1">Organize new memories</p>
        </div>
      </div>
    </div>
  );
}
