"use client";

import { ChevronLeft, Lock, Key, ShieldAlert, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  return (
    <div className="w-full animation-fade-in max-w-2xl mx-auto pb-24 px-4 pt-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/settings" className="w-10 h-10 rounded-full glass hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Security & Login</h1>
      </header>

      <div className="space-y-8">
        
        {/* Reset Password Form */}
        <section className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <KeyRound size={20} className="text-[var(--brand)]" />
            Reset Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
                value={passwords.newPass}
                onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] outline-none font-semibold transition-all"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </div>

            <button className="w-full mt-4 py-4 rounded-2xl bg-[var(--brand)] text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              Update Password
            </button>
          </div>
        </section>

        {/* Two-Factor Authentication */}
        <section className="glass-card p-6 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs opacity-60 mt-0.5 max-w-sm">Secure your account with an additional verification step.</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-sm font-semibold hover:bg-[var(--border)] transition-colors">
            Enable
          </button>
        </section>

      </div>
    </div>
  );
}
