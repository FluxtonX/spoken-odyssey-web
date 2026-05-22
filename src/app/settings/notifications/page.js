"use client";

import { ChevronLeft, BellRing } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    familyUpdates: true,
    communityLikes: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full animation-fade-in max-w-2xl mx-auto pb-24 px-4 pt-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/settings" className="w-10 h-10 rounded-full glass hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      </header>

      <div className="mb-6 flex justify-center text-[var(--brand)]">
        <div className="w-24 h-24 rounded-full bg-[var(--brand-soft)] flex items-center justify-center relative shadow-inner">
          <BellRing size={40} className="filter drop-shadow-md" />
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Core Methods */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-3 ml-2">Delivery Methods</h3>
          <div className="glass-card rounded-3xl overflow-hidden divide-y divide-[var(--border)]/50">
            <div className="flex items-center justify-between p-5">
              <div>
                <h4 className="font-bold text-base">Push Notifications</h4>
                <p className="text-xs opacity-60">Receive alerts on your device.</p>
              </div>
              <button 
                onClick={() => toggleSetting("push")}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.push ? "bg-[var(--brand)]" : "bg-[var(--surface-hover)] border border-[var(--border)]"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.push ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-5">
              <div>
                <h4 className="font-bold text-base">Email Summaries</h4>
                <p className="text-xs opacity-60">Get a weekly wrap-up in your inbox.</p>
              </div>
              <button 
                onClick={() => toggleSetting("email")}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.email ? "bg-[var(--brand)]" : "bg-[var(--surface-hover)] border border-[var(--border)]"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.email ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Content Events */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-3 ml-2">Alert Triggers</h3>
          <div className="glass-card rounded-3xl overflow-hidden divide-y divide-[var(--border)]/50">
            <div className="flex items-center justify-between p-5">
              <div>
                <h4 className="font-bold text-base">Family Updates</h4>
                <p className="text-xs opacity-60">When a family member adds a memory.</p>
              </div>
              <button 
                onClick={() => toggleSetting("familyUpdates")}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.familyUpdates ? "bg-[var(--brand)]" : "bg-[var(--surface-hover)] border border-[var(--border)]"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.familyUpdates ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-5">
              <div>
                <h4 className="font-bold text-base">Community Interactions</h4>
                <p className="text-xs opacity-60">Likes and comments on public posts.</p>
              </div>
              <button 
                onClick={() => toggleSetting("communityLikes")}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.communityLikes ? "bg-[var(--brand)]" : "bg-[var(--surface-hover)] border border-[var(--border)]"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.communityLikes ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
