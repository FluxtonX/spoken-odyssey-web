"use client";

import { Plus, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { albums } from "@/data/mockApp";

export default function AlbumsGallery() {
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
                src={album.cover} 
                alt={album.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10`} />
              <div className="absolute inset-0 bg-[var(--brand)] mix-blend-multiply opacity-30 group-hover:opacity-15 transition-opacity duration-500" />

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wide uppercase">
                {album.privacy}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold opacity-80 mb-0.5">{album.created}</p>
                <h3 className="font-bold text-lg leading-tight filter drop-shadow-md group-hover:text-white transition-colors">
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
