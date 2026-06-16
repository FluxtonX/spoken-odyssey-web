"use client";

import { ChevronLeft, Lock, KeyRound, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  return (
    <div className="w-full max-w-2xl mx-auto animation-fade-in pb-24">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <Link 
          href="/settings" 
          className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 hover:bg-stone-50 dark:hover:bg-stone-750 flex items-center justify-center transition-colors shadow-sm"
        >
          <ChevronLeft size={20} className="text-stone-600 dark:text-stone-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white tracking-tight">Security & Login</h1>
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">Configure authentication credentials and account protection.</p>
        </div>
      </header>

      {/* Unified Settings Card */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-855 rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-md p-6 md:p-8 space-y-8">
        
        {/* Reset Password Form Section */}
        <div className="text-left space-y-6">
          <h2 className="text-base font-extrabold text-stone-850 dark:text-white flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800/60">
            <KeyRound size={18} className="text-[var(--brand)]" />
            Reset Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 pl-2">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-855 dark:text-white placeholder-stone-400 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-semibold transition-all shadow-inner"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 pl-2">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-855 dark:text-white placeholder-stone-400 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-semibold transition-all shadow-inner"
                value={passwords.newPass}
                onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 pl-2">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-855 dark:text-white placeholder-stone-400 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-semibold transition-all shadow-inner"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </div>

            <button className="w-full py-4 rounded-xl bg-[var(--brand)] text-white font-black hover:scale-[1.01] active:scale-95 transition-all shadow-md cursor-pointer mt-6">
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="text-left pt-2">
          <h2 className="text-base font-extrabold text-stone-850 dark:text-white flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800/60 mb-4">
            <Lock size={18} className="text-[var(--brand)]" />
            Two-Factor Authentication
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[10px] font-semibold text-stone-400 leading-normal block max-w-sm mt-0.5">Secure your legacy archives with an additional verification step.</span>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 text-xs font-black text-stone-750 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors shadow-sm self-end sm:self-center cursor-pointer">
              Enable
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
