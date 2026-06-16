"use client";

import { ChevronLeft, BellRing, Bell, Mail, Users, Heart } from "lucide-react";
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

  // Custom high-fidelity dynamic toggle switch
  const ToggleSwitch = ({ checked, onChange, icon: Icon }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[var(--brand)]" : "bg-stone-200 dark:bg-stone-800"
      }`}
    >
      <span
        className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
          checked ? "translate-x-5 text-[var(--brand)]" : "translate-x-0 text-stone-400"
        }`}
      >
        {Icon && <Icon size={10} strokeWidth={2.5} />}
      </span>
    </button>
  );

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
          <h1 className="text-2xl font-black text-stone-850 dark:text-white tracking-tight">Notifications</h1>
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">Configure alert delivery channels and triggers.</p>
        </div>
      </header>

      {/* Unified Settings Card */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-855 rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-md p-6 md:p-8 space-y-8">
        
        {/* Animated Bell Header Graphic */}
        <div className="flex justify-center text-[var(--brand)] pt-2">
          <div className="w-20 h-20 rounded-2xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 flex items-center justify-center relative shadow-md">
            <BellRing size={32} />
            <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-rose-500 border border-white dark:border-stone-900 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Core Delivery Methods */}
        <div className="text-left">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4 pl-1">Delivery Methods</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                  <Bell size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Push Notifications</span>
                  <span className="text-[10px] font-semibold text-stone-400">Receive instant push alerts on your active device</span>
                </div>
              </div>
              <ToggleSwitch checked={settings.push} onChange={() => toggleSetting("push")} icon={Bell} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Email Summaries</span>
                  <span className="text-[10px] font-semibold text-stone-400">Receive weekly summaries of legacy updates in your inbox</span>
                </div>
              </div>
              <ToggleSwitch checked={settings.email} onChange={() => toggleSetting("email")} icon={Mail} />
            </div>

          </div>
        </div>

        {/* Delivery Triggers */}
        <div className="text-left">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4 pl-1">Alert Triggers</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Family Updates</span>
                  <span className="text-[10px] font-semibold text-stone-400">When family members record or upload new archive memories</span>
                </div>
              </div>
              <ToggleSwitch checked={settings.familyUpdates} onChange={() => toggleSetting("familyUpdates")} icon={Users} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Community Interactions</span>
                  <span className="text-[10px] font-semibold text-stone-400">Likes, reactions, and comments on your public memories</span>
                </div>
              </div>
              <ToggleSwitch checked={settings.communityLikes} onChange={() => toggleSetting("communityLikes")} icon={Heart} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
