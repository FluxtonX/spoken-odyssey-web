"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";
import { getStoredUserProfile } from "@/data/userProfile";
import { useAuth } from "@/context/AuthProvider";
import { isPublicRoute } from "@/lib/routes";

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, profile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    function loadProfile() {
      setUserProfile(getStoredUserProfile());
    }
    loadProfile();
    window.addEventListener("profileUpdated", loadProfile);
    return () => window.removeEventListener("profileUpdated", loadProfile);
  }, [pathname, profile]);

  const navItems = [
    { name: "Home", href: "/home", icon: "home" },
    { name: "Me", href: "/profile", icon: "me" },
    { name: "Discovery", href: "/feed", icon: "feed", isPrimary: true },
    { name: "Albums", href: "/albums", icon: "album" },
    { name: "Family", href: "/family", icon: "family" },
    { name: "Settings", href: "/settings", icon: "settings" },
  ];

  if (isPublicRoute(pathname) || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/90 pb-safe shadow-lg backdrop-blur-md md:hidden">
        <div className="relative flex items-center justify-around px-1 py-2.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            if (item.isPrimary) {
              return (
                <div key={item.name} className="relative -top-5 flex flex-col items-center">
                  <Link
                    href={item.href}
                    className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[var(--background)] bg-[var(--brand)] text-white shadow-xl shadow-black/20 transition-all active:scale-90"
                    aria-label={item.name}
                  >
                    <div className="shrink-0 scale-90">{resolveGlass3DIcon(item.icon)}</div>
                  </Link>
                  <span className="mt-1 text-[8px] font-black tracking-wide text-stone-500 dark:text-stone-400 -mb-5">{item.name}</span>
                </div>
              );
            }

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
                <div className="scale-75 transition-transform duration-300 -my-2">{resolveGlass3DIcon(item.icon)}</div>
                <span className="mt-0.5 text-[8px] font-black tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 top-0 z-50 hidden w-20 flex-col border-r border-[var(--border)] bg-white transition-all duration-300 md:flex lg:w-64">
        <div className="mb-4 hidden items-center gap-3 p-6 lg:flex">
          <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="h-9 w-auto object-contain" />
        </div>

        <div className="mb-4 mt-2 flex justify-center p-4 lg:hidden">
          <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="h-9 w-auto object-contain" />
        </div>

        <div className="mt-2 flex w-full flex-1 flex-col items-center gap-2.5 px-3 lg:items-start lg:px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group relative flex w-full items-center justify-center gap-3 rounded-lg border p-2 transition-all lg:justify-start",
                  isActive
                    ? "border-[var(--border)] bg-[var(--brand-soft)] font-extrabold text-[var(--brand)] shadow-sm"
                    : "border-transparent text-stone-600 hover:bg-stone-50 hover:text-[var(--ink)]"
                )}
              >
                {isActive && <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r-md bg-[var(--brand)] shadow-sm" />}
                <div className="shrink-0 scale-75 transition-transform -my-1 -ml-1">{resolveGlass3DIcon(item.icon)}</div>
                <span className="hidden text-sm font-black lg:block">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/profile"
          className="mt-auto flex items-center justify-center gap-3 border-t border-[var(--border)] p-4 transition-colors hover:bg-stone-50 lg:justify-start lg:p-6"
        >
          {userProfile?.avatar ? (
            <img src={userProfile.avatar} alt={userProfile.name} className="h-10 w-10 shrink-0 rounded-full object-cover border border-stone-200 shadow-sm" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-[var(--brand)] text-lg font-bold text-white shadow-sm">
              {userProfile?.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="hidden flex-col overflow-hidden text-left lg:flex">
            <span className="truncate text-sm font-black text-[var(--ink)]">{userProfile?.name?.split(" ")[0] || "Alexander"}</span>
            <span className="truncate text-[10px] font-extrabold uppercase tracking-wide text-stone-400">View Profile</span>
          </div>
        </Link>
      </nav>
    </>
  );
}
