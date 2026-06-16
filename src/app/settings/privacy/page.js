"use client";

import { ChevronLeft, ShieldCheck, Users, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PrivacySettings() {
  const [defaultPrivacy, setDefaultPrivacy] = useState("family");

  const privacyOptions = [
    { 
      id: "public", 
      icon: Globe, 
      label: "Public (Community)", 
      desc: "Anyone can view this on the global community feed.", 
      color: "text-indigo-600 dark:text-indigo-400", 
      bg: "bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100/20" 
    },
    { 
      id: "family", 
      icon: Users, 
      label: "Family Circle", 
      desc: "Only approved family members can view this memory.", 
      color: "text-[var(--brand)]", 
      bg: "bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 border border-[var(--border)]/20" 
    },
    { 
      id: "private", 
      icon: Lock, 
      label: "Private (Just Me)", 
      desc: "Visible strictly to you. Perfect for personal journals.", 
      color: "text-rose-600 dark:text-rose-450", 
      bg: "bg-rose-50 dark:bg-rose-950/20 border border-rose-100/20" 
    },
  ];

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
          <h1 className="text-2xl font-black text-stone-850 dark:text-white tracking-tight">Default Privacy</h1>
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">Configure default accessibility for saved records.</p>
        </div>
      </header>

      {/* Unified Master Settings Card */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-855 rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-md p-6 md:p-8 space-y-6">
        
        {/* Info Box */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 flex gap-3 text-left">
          <ShieldCheck size={20} className="shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed">
            Choose the default privacy setting for all your new memories. You can always override this visibility rule for any specific memory when creating it.
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-4">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = defaultPrivacy === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setDefaultPrivacy(option.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]/20 dark:bg-[var(--brand-soft)]/5" 
                    : "border-stone-200/60 dark:border-stone-800/80 hover:border-[var(--brand)]/30 bg-stone-50/10 dark:bg-stone-900/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${option.bg} ${option.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-extrabold text-sm text-stone-850 dark:text-stone-200">{option.label}</h4>
                  <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 mt-1 leading-normal">{option.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? "border-[var(--brand)] bg-[var(--brand)]" : "border-stone-200 dark:border-stone-700"
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
