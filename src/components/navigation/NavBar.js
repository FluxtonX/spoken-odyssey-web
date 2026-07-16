"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";
import { useAuth } from "@/context/AuthProvider";
import { isPublicRoute } from "@/lib/routes";
import { Plus, X, Home, Archive, Clock, Image as ImageIcon, Users, Sparkles, Globe, Settings } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // We map the icons to Lucide icons for a clean look, or use the resolveGlass3DIcon if we want 3D.
  // The prompt asks for "proffesional icons". Lucide icons are professional and clean.
  const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "My Archive", href: "/memories", icon: Archive },
    { name: "Timeline", href: "/timeline", icon: Clock },
    { name: "Albums", href: "/albums", icon: ImageIcon },
    { name: "Family", href: "/family", icon: Users, badge: 2 },
    { name: "AI Insights", href: "/insights", icon: Sparkles },
    { name: "Discover", href: "/feed", icon: Globe },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (isPublicRoute(pathname) || !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/90 pb-safe shadow-lg backdrop-blur-md md:hidden">
        <div className="relative flex items-center justify-around px-1 py-2.5">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "relative flex h-12 w-14 flex-col items-center justify-center transition-all duration-300",
                  isActive ? "scale-105 text-[var(--brand)]" : "text-stone-500 opacity-60 hover:opacity-100"
                )}
              >
                {isActive && <span className="absolute -top-2.5 h-1 w-6 rounded-full bg-[var(--brand)]" />}
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
                <span className="mt-0.5 text-[8px] font-black tracking-wide truncate max-w-[50px] text-center">{item.name}</span>
              </Link>
            );
          })}
          <div className="relative -top-3.5 flex flex-col items-center">
            <button
              onClick={() => window.dispatchEvent(new Event("openPublishModal"))}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/30 transition-all active:scale-90 cursor-pointer floating-button"
              aria-label="Publish Memory"
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="fixed bottom-0 left-0 top-0 z-50 hidden w-20 flex-col bg-[#F4F5FF]/15 backdrop-blur-lg border-r border-[#C7D2FE]/30 transition-all duration-300 md:flex lg:w-[260px]">
        {/* Logo */}
        <div className="mb-8 hidden items-center gap-3 p-6 pb-2 lg:flex">
          <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="h-7 w-auto object-contain" />
        </div>
        <div className="mb-6 mt-2 flex justify-center p-4 lg:hidden">
          <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="h-9 w-auto object-contain" />
        </div>

        {/* Publish Memory Button */}
        <div className="px-4 mb-8">
          <button
            onClick={() => window.dispatchEvent(new Event("openPublishModal"))}
            className="w-full flex items-center justify-center lg:justify-start gap-2 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-[14px] p-3 lg:px-5 transition-all active:scale-95 group"
          >
            <Plus size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-bold text-sm">Publish Memory</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex w-full flex-1 flex-col overflow-y-auto hide-scrollbar pb-4 pr-4">
          <div className="w-full mb-2 lg:mb-4">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center justify-center lg:justify-start gap-4 py-3 px-4 lg:px-5 lg:mx-3 transition-all mb-1.5 rounded-[14px] w-[calc(100%-24px)] mx-auto",
                    isActive
                      ? "bg-gradient-to-b from-[#EEF2FF] to-[#E5E9FF] shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_-4px_rgba(74,58,255,0.2)] border border-[#ffffff] text-[var(--brand)] font-bold"
                      : "text-stone-500 hover:bg-[#EAEBFF]/40 font-medium border border-transparent"
                  )}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2.5} className={clsx(isActive ? "text-[var(--brand)] drop-shadow-sm" : "text-stone-400 group-hover:text-stone-600")} />
                  <span className="hidden text-[14px] lg:block">{item.name}</span>
                  {item.badge && (
                    <span className="hidden lg:flex ml-auto mr-4 h-5 w-5 items-center justify-center rounded-full bg-[#4A3AFF] text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && (
                    <span className="lg:hidden absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--brand)]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="w-full">
            {navItems.slice(5).map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center justify-center lg:justify-start gap-4 py-3 px-4 lg:px-5 lg:mx-3 transition-all mb-1.5 rounded-[14px] w-[calc(100%-24px)] mx-auto",
                    isActive
                      ? "bg-gradient-to-b from-[#EEF2FF] to-[#E5E9FF] shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_-4px_rgba(74,58,255,0.2)] border border-[#ffffff] text-[var(--brand)] font-bold"
                      : "text-stone-500 hover:bg-[#EAEBFF]/40 font-medium border border-transparent"
                  )}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2.5} className={clsx(isActive ? "text-[var(--brand)] drop-shadow-sm" : "text-stone-400 group-hover:text-stone-600")} />
                  <span className="hidden text-[14px] lg:block">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

    </>
  );
}

