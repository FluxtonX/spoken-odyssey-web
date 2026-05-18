"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

export default function NavBar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/", icon: "home" },
    { name: "Record", href: "/record", icon: "voice" },
    { name: "Feed", href: "/feed", icon: "feed", isPrimary: true },
    { name: "Albums", href: "/albums", icon: "album" },
    { name: "Settings", href: "/settings", icon: "settings" },
  ];

  if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth") || pathname?.startsWith("/signup") || pathname?.startsWith("/profile-setup") || !isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md pb-safe border-t border-stone-200/80 shadow-lg">
        <div className="flex justify-around items-center px-2 py-2.5 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.isPrimary) {
              return (
                <div key={item.name} className="relative -top-5">
                  <Link
                    href={item.href}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 shadow-xl shadow-amber-500/25 transition-all active:scale-90 border-4 border-[#fdfcfa]"
                  >
                    <div className="scale-90 shrink-0">
                      {resolveGlass3DIcon(item.icon)}
                    </div>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center justify-center w-16 h-12 transition-all duration-300 relative",
                  isActive ? "text-amber-600 scale-105" : "text-stone-500 opacity-60 hover:opacity-100"
                )}
              >
                {isActive && (
                  <span className="absolute -top-2.5 w-6 h-1 rounded-full bg-amber-500" />
                )}
                <div className={clsx("transition-transform duration-300 scale-75 -my-2")}>
                  {resolveGlass3DIcon(item.icon)}
                </div>
                <span className="text-[9px] font-black tracking-wide mt-0.5">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* DESKTOP/TABLET SIDEBAR NAVIGATION */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-white border-r border-stone-200/80 z-50 transition-all duration-300">
        
        {/* Brand Logo Header */}
        <div className="p-6 hidden lg:flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 shadow-md flex items-center justify-center text-white font-black text-lg">
            S
          </div>
          <span className="text-lg font-black tracking-tight text-stone-900">Spoken <span className="text-amber-500">Odyssey</span></span>
        </div>
        
        {/* Compact Logo for Tablet */}
        <div className="p-4 lg:hidden flex justify-center mb-4 mt-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-lg shadow-md">
            S
          </div>
        </div>
        
        {/* Nav Link List */}
        <div className="flex flex-col items-center lg:items-start gap-2.5 px-3 lg:px-4 mt-2 flex-1 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.isPrimary) {
              return (
                <div key={item.name} className="w-full my-3">
                  <Link
                    href={item.href}
                    className="w-full flex items-center justify-center lg:justify-start gap-3 p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="scale-75 shrink-0 -ml-1">
                      {resolveGlass3DIcon(item.icon)}
                    </div>
                    <span className="hidden lg:block font-black text-sm">Public Feed</span>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "w-full flex items-center justify-center lg:justify-start gap-3 p-2 rounded-2xl transition-all group relative",
                  isActive 
                    ? "bg-amber-50 text-amber-700 font-extrabold shadow-sm border border-amber-200/50" 
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent"
                )}
              >
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-amber-500 shadow-sm" />}
                <div className="scale-75 shrink-0 group-hover:scale-80 transition-transform -my-1 -ml-1">
                  {resolveGlass3DIcon(item.icon)}
                </div>
                <span className="hidden lg:block font-black text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
        
        {/* User Profile Trigger */}
        <div className="mt-auto p-4 lg:p-6 border-t border-stone-200/80 flex items-center justify-center lg:justify-start gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
          <div className="w-10 h-10 rounded-full border border-stone-200 bg-gradient-to-tr from-amber-300 to-amber-500 shadow-sm shrink-0 flex items-center justify-center text-lg font-bold text-white">
            👤
          </div>
          <div className="hidden lg:flex flex-col overflow-hidden text-left">
            <span className="text-sm font-black text-stone-800 truncate">Alexander</span>
            <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wide truncate">View Profile</span>
          </div>
        </div>
      </nav>
    </>
  );
}
