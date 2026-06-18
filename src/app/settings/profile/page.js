"use client";

import { ChevronLeft, Camera, Save } from "lucide-react";
import Link from "next/link";

export default function EditProfile() {
  return (
    <div className="w-full max-w-3xl animation-fade-in pb-24">
      {/* Header aligned with base padding */}
      <header className="flex items-center gap-4 mb-6">
        <Link 
          href="/settings" 
          className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 hover:bg-stone-50 dark:hover:bg-stone-750 flex items-center justify-center transition-colors shadow-sm"
        >
          <ChevronLeft size={20} className="text-stone-600 dark:text-stone-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white tracking-tight">Edit Profile</h1>
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">Update your personal avatar, display name, and bio.</p>
        </div>
      </header>

      {/* Master Content Card */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-850 rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-md p-6 md:p-8">
        
        {/* Avatar Settings */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer">
            <div className="w-28 h-28 rounded-2xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 border-4 border-white dark:border-stone-900 shadow-lg flex items-center justify-center overflow-hidden transition-transform group-active:scale-95 text-4xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-750 flex items-center justify-center text-[var(--brand)] shadow-md hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors">
              <Camera size={14} />
            </div>
          </div>
          <span className="text-[10px] font-bold text-stone-400 dark:text-stone-550 mt-3 uppercase tracking-wider">Change Photo</span>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          
          <div className="text-left">
            <label className="block text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 pl-2">Display Name</label>
            <input 
              type="text" 
              defaultValue="Alexander"
              className="w-full p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-850 dark:text-white placeholder-stone-400 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-semibold transition-all shadow-inner"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 pl-2">Email Address</label>
            <input 
              type="email" 
              defaultValue="alex@example.com"
              disabled
              className="w-full p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/20 border border-stone-200/60 dark:border-stone-800/40 text-stone-500/80 dark:text-stone-500 outline-none font-semibold cursor-not-allowed"
            />
            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 mt-2 ml-2">Email cannot be changed directly for legacy security reasons.</p>
          </div>

          <div className="text-left">
            <label className="block text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 pl-2">Bio (Optional)</label>
            <textarea 
              placeholder="A short description about yourself..."
              rows={4}
              className="w-full p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-850 dark:text-white placeholder-stone-400 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-semibold transition-all resize-none shadow-inner"
            />
          </div>

          {/* Submit button */}
          <button className="w-full py-4 rounded-xl bg-[var(--brand)] text-white font-black hover:scale-[1.01] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-8">
            <Save size={18} /> Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}
