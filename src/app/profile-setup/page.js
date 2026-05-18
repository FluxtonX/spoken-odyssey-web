"use client";

import { Camera, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProfileSetup() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col px-6 py-8 animation-fade-in relative">
      
      <header className="relative z-10 mb-8 pt-4">
        <div className="w-1/3 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="w-full h-full bg-[var(--brand)] rounded-full" />
        </div>
        <p className="mt-4 text-[var(--brand)] font-bold text-sm tracking-wide uppercase">Final Step</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Setup your profile</h1>
      </header>

      <main className="flex-1 flex flex-col max-w-sm mx-auto w-full relative z-10">
        
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-[var(--surface)] bg-gradient-to-tr from-[var(--border)] to-[var(--surface-hover)] shadow-xl flex items-center justify-center overflow-hidden transition-transform group-active:scale-95">
              <span className="text-5xl filter drop-shadow-md">👤</span>
            </div>
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--brand)] rounded-full border-4 border-[var(--background)] flex items-center justify-center text-white shadow-lg">
              <Camera size={16} strokeWidth={3} />
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold opacity-60">Upload a nice photo of yourself</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 w-full">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Display Name</label>
            <input 
              type="text" 
              placeholder="e.g. Alexander" 
              className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all font-semibold"
              defaultValue="Alexander"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Default Privacy</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-2xl glass-card border-2 border-[var(--brand)] bg-[var(--brand)]/5 flex flex-col items-center gap-2">
                <span className="text-2xl filter drop-shadow-sm">👨‍👩‍👧‍👦</span>
                <span className="font-bold text-sm text-[var(--brand)]">Family Only</span>
              </button>
              <button className="p-4 rounded-2xl glass border border-[var(--border)] opacity-60 hover:opacity-100 flex flex-col items-center gap-2 transition-all">
                <span className="text-2xl filter drop-shadow-sm grayscale">🌍</span>
                <span className="font-bold text-sm">Public</span>
              </button>
            </div>
            <p className="text-xs opacity-50 text-center mt-3 font-medium">You can change this per memory.</p>
          </div>
        </div>

        <div className="mt-auto pt-10">
          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--brand)] text-white font-bold shadow-lg shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-95 transition-all group"
          >
            Complete Setup
            <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </main>
    </div>
  );
}
