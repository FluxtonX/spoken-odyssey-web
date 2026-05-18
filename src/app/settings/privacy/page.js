"use client";

import { ChevronLeft, ShieldCheck, Users, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PrivacySettings() {
  const [defaultPrivacy, setDefaultPrivacy] = useState("family");

  const privacyOptions = [
    { id: "public", icon: Globe, label: "Public (Community)", desc: "Anyone can view this on the global feed.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "family", icon: Users, label: "Family Circle", desc: "Only invited family members can view.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "private", icon: Lock, label: "Private (Just Me)", desc: "Visible strictly to you.", color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="w-full animation-fade-in max-w-2xl mx-auto pb-24 px-4 pt-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/settings" className="w-10 h-10 rounded-full glass hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Privacy Default</h1>
      </header>

      <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex gap-3">
        <ShieldCheck size={24} className="shrink-0" />
        <p className="text-sm font-medium">
          Choose the default privacy setting for all your new memories. You can always override this when creating a specific memory.
        </p>
      </div>

      <div className="space-y-4">
        {privacyOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setDefaultPrivacy(option.id)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
              defaultPrivacy === option.id 
                ? "border-[var(--brand)] bg-[var(--brand)]/5" 
                : "border-[var(--border)] hover:border-[var(--brand)]/40 glass-card"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl ${option.bg} ${option.color} flex items-center justify-center`}>
              <option.icon size={24} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-base">{option.label}</h4>
              <p className="text-sm opacity-60 mt-0.5">{option.desc}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              defaultPrivacy === option.id ? "border-[var(--brand)] bg-[var(--brand)]" : "border-[var(--border)]"
            }`}>
              {defaultPrivacy === option.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
