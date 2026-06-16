"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Moon, 
  Sun, 
  Monitor, 
  Wifi, 
  Globe, 
  Users, 
  FolderHeart,
  Archive
} from "lucide-react";

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState("light");
  const [privacy, setPrivacy] = useState("Family Circle");

  // Sync theme with document class for dark mode support
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    localStorage.setItem("app-theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System setting
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  // Custom high-fidelity dynamic toggle switch
  const ToggleSwitch = ({ checked, onChange, icon: Icon }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[var(--brand)]" : "bg-stone-200 dark:bg-stone-850"
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
    <div className="w-full max-w-5xl mx-auto animation-fade-in pb-24">
      {/* Header - Clean alignment with baseline */}
      <header className="pb-6 text-left">
        <h1 className="text-3xl font-black text-[var(--ink)] dark:text-white tracking-tight mb-1">Settings</h1>
        <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">Manage your account, preferences, and legacy vault.</p>
      </header>

      {/* Master Settings Dashboard Card - Unified split panel */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-850 rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* Left Sidebar Pane (lg:col-span-4) */}
        <div className="lg:col-span-4 border-r lg:border-r border-stone-100 dark:border-stone-800/60 bg-stone-50/20 dark:bg-stone-900/10 flex flex-col justify-between border-b lg:border-b-0">
          <div>
            {/* Cover Gradient */}
            <div className="h-16 bg-gradient-to-r from-[var(--brand-soft)] to-transparent dark:from-[var(--brand-soft)]/10" />
            
            {/* Profile Info */}
            <div className="p-6 pt-0 -mt-10 text-center relative flex flex-col items-center border-b border-stone-100 dark:border-stone-800/60">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-2xl bg-[var(--brand)] border-4 border-white dark:border-stone-900 text-3xl font-black text-white flex items-center justify-center shadow-lg">
                  A
                </div>
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-stone-900 w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-md">
                  ✓
                </span>
              </div>
              
              <h2 className="font-extrabold text-stone-850 dark:text-white text-lg leading-tight">Alexander</h2>
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-550 mt-0.5">alex@example.com</p>
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/20 text-[var(--brand)] border border-[var(--border)]/40 mt-3.5">
                👑 Vault Curator
              </span>
            </div>

            {/* Statistics Row */}
            <div className="px-4 py-4 grid grid-cols-3 gap-1 text-center border-b border-stone-100 dark:border-stone-800/60 bg-white/40 dark:bg-stone-900/20">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Memories</span>
                <div className="flex items-center gap-1">
                  <Archive size={12} className="text-[var(--brand)]" />
                  <span className="text-xs font-black text-stone-800 dark:text-stone-200">48</span>
                </div>
              </div>
              <div className="w-px h-6 bg-stone-200 dark:bg-stone-800/50 self-center justify-self-center" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Albums</span>
                <div className="flex items-center gap-1">
                  <FolderHeart size={12} className="text-[var(--brand)]" />
                  <span className="text-xs font-black text-stone-800 dark:text-stone-200">4</span>
                </div>
              </div>
              <div className="w-px h-6 bg-stone-200 dark:bg-stone-800/50 self-center justify-self-center" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Family</span>
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-[var(--brand)]" />
                  <span className="text-xs font-black text-stone-800 dark:text-stone-200">5</span>
                </div>
              </div>
            </div>

            {/* Desktop Settings Menu Tabs List (Hidden on mobile to keep layout compact) */}
            <div className="hidden lg:block p-4 space-y-1">
              <p className="text-[9px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest pl-2.5 mb-2 text-left">Navigation</p>
              {[
                { id: "profile", label: "Edit Profile", href: "/settings/profile", icon: User },
                { id: "privacy", label: "Default Privacy", href: "/settings/privacy", icon: Lock },
                { id: "notifications", label: "Notifications", href: "/settings/notifications", icon: Bell },
                { id: "security", label: "Security & Login", href: "/settings/security", icon: Shield }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors text-stone-700 dark:text-stone-300 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-stone-400 dark:text-stone-550 group-hover:text-[var(--brand)] transition-colors" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-stone-300 dark:text-stone-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Logout button at the base of the left sidebar */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 border-t border-stone-100 dark:border-stone-800/60 hover:bg-rose-50/30 dark:hover:bg-rose-950/10 text-rose-650 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={16} className="text-rose-500" />
              <span className="text-xs font-extrabold">Log Out</span>
            </div>
            <ChevronRight size={14} className="text-rose-350 dark:text-rose-500/50" />
          </button>
        </div>

        {/* Right Content Pane (lg:col-span-8) */}
        <div className="lg:col-span-8 p-6 md:p-8 space-y-8">
          
          {/* Group 1: Privacy & Account */}
          <div className="text-left">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4 pl-1">Account & Privacy</h3>
            <div className="space-y-4">
              
              <Link href="/settings/profile" className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">Edit Profile</span>
                    <span className="text-[10px] font-semibold text-stone-400">Update name, avatar, and background bio</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/settings/privacy" className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                    <Lock size={18} />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">Default Privacy</span>
                    <span className="text-[10px] font-semibold text-stone-400">Change visibility rules for newly saved memories</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-lg">
                    {privacy}
                  </span>
                  <ChevronRight size={16} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

            </div>
          </div>

          {/* Group 2: Notifications & Sync */}
          <div className="text-left">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4 pl-1">Notifications & Sync</h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                    <Bell size={18} />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">Push Notifications</span>
                    <span className="text-[10px] font-semibold text-stone-400">Receive alerts when family updates their legacy</span>
                  </div>
                </div>
                <ToggleSwitch checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} icon={Bell} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                    <Shield size={18} />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">Email Alerts</span>
                    <span className="text-[10px] font-semibold text-stone-400">Weekly digests and critical security updates</span>
                  </div>
                </div>
                <ToggleSwitch checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} icon={Shield} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                    <Wifi size={18} />
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">Auto-Sync over Wi-Fi</span>
                    <span className="text-[10px] font-semibold text-stone-400">Upload records to cloud storage only when on Wi-Fi</span>
                  </div>
                </div>
                <ToggleSwitch checked={autoSync} onChange={() => setAutoSync(!autoSync)} icon={Wifi} />
              </div>

            </div>
          </div>

          {/* Group 3: Appearance */}
          <div className="text-left">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4 pl-1">Appearance</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] dark:bg-[var(--brand-soft)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                  {theme === "light" ? <Sun size={18} /> : theme === "dark" ? <Moon size={18} /> : <Monitor size={18} />}
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200 block">App Theme</span>
                  <span className="text-[10px] font-semibold text-stone-400">Switch interface styling dynamically</span>
                </div>
              </div>

              {/* Theme Selector segmented control */}
              <div className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-1 flex items-center gap-1 w-max self-end sm:self-center">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleThemeChange(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive 
                          ? "bg-white dark:bg-stone-800 text-[var(--brand)] shadow-sm border border-stone-200/55 dark:border-stone-700/55" 
                          : "text-stone-555 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200"
                      }`}
                    >
                      <Icon size={12} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
