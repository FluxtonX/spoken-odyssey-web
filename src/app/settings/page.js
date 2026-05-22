"use client";

import { LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

export default function Settings() {
  const settingGroups = [
    {
      title: "Account",
      items: [
        { id: "profile", href: "/settings/profile", icon: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", label: "Edit Profile", desc: "Name, Avatar & Bio", bg: "bg-[var(--brand-soft)]" },
        { id: "privacy", href: "/settings/privacy", icon: "privacy", label: "Privacy Default", desc: "Currently set to Family Only", bg: "bg-[var(--brand-soft)]" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { id: "notifications", href: "/settings/notifications", icon: "notification", label: "Notifications", desc: "Push & Email alerts", bg: "bg-[var(--brand-soft)]" },
        { id: "security", href: "/settings/security", icon: "security", label: "Security & Login", desc: "Password & 2FA", bg: "bg-[var(--brand-soft)]" },
      ]
    }
  ];

  return (
    <div className="w-full animation-fade-in max-w-2xl mx-auto pb-24 px-4 sm:px-0">
      {/* Header */}
      <header className="pt-8 pb-6 text-left">
        <h1 className="text-3xl font-black text-[var(--ink)] tracking-tight mb-2">Settings</h1>
        <p className="text-sm font-semibold text-stone-500">Manage your account and preferences.</p>
      </header>

      {/* User Profile Summary Card */}
      <div className="mb-8">
        <div className="bg-white border border-stone-200/80 p-5 rounded-[2rem] flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-lg bg-[var(--brand-soft)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm">
            {resolveGlass3DIcon("family")}
          </div>
          <div className="flex-1 text-left">
            <h2 className="font-extrabold text-stone-850 text-lg leading-tight">Alexander</h2>
            <p className="text-xs font-semibold text-stone-400 mt-0.5">alex@example.com</p>
          </div>
          <Link href="/settings/profile" className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-black text-stone-750 hover:bg-stone-100 transition-colors">
            Edit
          </Link>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-8">
        {settingGroups.map((group, idx) => (
          <section key={idx}>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-3 ml-2 text-left">{group.title}</h3>
            <div className="bg-white border border-stone-200/80 rounded-[2rem] overflow-hidden divide-y divide-stone-100 shadow-sm">
              {group.items.map((item) => (
                <Link href={item.href} key={item.id} className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors cursor-pointer group w-full text-left">
                  <div className={`w-12 h-12 rounded-lg ${item.bg} border border-[var(--border)] flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0`}>
                    {item.icon.startsWith("http") ? (
                      <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="scale-75 shrink-0">
                        {resolveGlass3DIcon(item.icon)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-sm text-stone-850">{item.label}</h4>
                    <p className="text-xs font-semibold text-stone-400 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-stone-400 group-hover:text-stone-700 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Danger Zone / Logout */}
        <section className="pt-4">
          <div className="bg-white rounded-[2rem] overflow-hidden border border-red-200/60 shadow-sm">
            <button 
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");
                window.location.href = "/";
              }}
              className="w-full flex items-center gap-4 p-5 hover:bg-red-50/5 transition-colors text-red-650"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <LogOut size={20} className="text-red-500" />
              </div>
              <span className="font-extrabold text-sm flex-1 text-left text-red-600">Log Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
