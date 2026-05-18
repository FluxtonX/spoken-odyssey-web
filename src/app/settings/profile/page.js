"use client";

import { ChevronLeft, Camera, Save } from "lucide-react";
import Link from "next/link";

export default function EditProfile() {
  return (
    <div className="w-full animation-fade-in max-w-2xl mx-auto pb-24 px-4 pt-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/settings" className="w-10 h-10 rounded-full glass hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full border-4 border-[var(--surface)] bg-gradient-to-tr from-[var(--brand)] to-brand-400 shadow-xl flex items-center justify-center overflow-hidden transition-transform group-active:scale-95 text-5xl">
            👤
          </div>
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--background)] rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shadow-lg hover:bg-[var(--surface-hover)]">
            <Camera size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Display Name</label>
          <input 
            type="text" 
            defaultValue="Alexander"
            className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Email Address</label>
          <input 
            type="email" 
            defaultValue="alex@example.com"
            disabled
            className="w-full p-4 rounded-2xl glass border border-[var(--border)] opacity-60 outline-none font-semibold cursor-not-allowed"
          />
          <p className="text-xs opacity-50 mt-2 ml-2">Email cannot be changed directly for security reasons.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Bio (Optional)</label>
          <textarea 
            placeholder="A short description about yourself..."
            rows={4}
            className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none transition-all resize-none"
          />
        </div>

        <button className="w-full mt-6 py-4 rounded-2xl bg-[var(--brand)] text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
}
