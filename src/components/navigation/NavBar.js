"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";
import { useAuth } from "@/context/AuthProvider";
import { isPublicRoute } from "@/lib/routes";
import { Plus, Home, Archive, Clock, Image as ImageIcon, Users, Sparkles, Globe, Settings, CreditCard, User, ChevronRight } from "lucide-react";

import { getFamilyInvitations, normalizeMediaUrl } from "@/services/backend";

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, profile, firebaseUser } = useAuth();
  const [pendingFamilyCount, setPendingFamilyCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userName = profile?.displayName || profile?.name || firebaseUser?.displayName || "User";
  const userEmail = profile?.email || firebaseUser?.email || "";
  const rawAvatar = profile?.avatarUrl || profile?.avatar || profile?.photoURL || profile?.image;
  const userAvatar = rawAvatar ? normalizeMediaUrl(rawAvatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4A3AFF&color=fff`;

  useEffect(() => {
    async function loadInvitationsCount() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const invites = await getFamilyInvitations(token);
          if (Array.isArray(invites)) {
            setPendingFamilyCount(invites.length);
          }
        }
      } catch (err) {
        console.warn("Could not load invitations count for NavBar:", err);
      }
    }
    loadInvitationsCount();
  }, [pathname]);

  // Listen for modal open/close events
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    window.addEventListener('modal-open', handleModalOpen);
    window.addEventListener('modal-close', handleModalClose);

    return () => {
      window.removeEventListener('modal-open', handleModalOpen);
      window.removeEventListener('modal-close', handleModalClose);
    };
  }, []);

  const menuItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Odyssey", href: "/memories", icon: Archive },
    { name: "Timeline", href: "/timeline", icon: Clock },
    { name: "Albums", href: "/albums", icon: ImageIcon },
    { name: "Family", href: "/family", icon: Users, badge: pendingFamilyCount > 0 ? pendingFamilyCount : undefined },
    { name: "Discover", href: "/discover", icon: Globe },
    { name: "AI Insights", href: "/insights", icon: Sparkles },
  ];

  const accountItems = [
    { name: "Subscription", href: "/subscription", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "My Profile", href: "/profile", icon: User },
  ];

  // For the mobile bottom nav, we just take the first 4 main items
  const mobileNavItems = menuItems.slice(0, 4);

  if (isPublicRoute(pathname) || !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/90 pb-safe shadow-lg backdrop-blur-md md:hidden">
        <div className="relative flex items-center justify-around px-1 py-2.5">
          {mobileNavItems.map((item) => {
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
      <nav className={clsx(
        "fixed bottom-0 left-0 top-0 hidden w-20 flex-col bg-[#F4F5FF]/15 backdrop-blur-lg border-r border-[#C7D2FE]/30 transition-all duration-300 md:flex lg:w-[260px]",
        isModalOpen ? "opacity-50 pointer-events-none" : ""
      )}>
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
          
          {/* MENU Section */}
          <div className="w-full mb-6">
            <div className="hidden lg:block text-[11px] font-bold text-stone-500 tracking-wider pl-8 mb-3 uppercase">MENU</div>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center justify-center lg:justify-start gap-4 py-2.5 px-4 lg:px-5 lg:mx-3 transition-all mb-1 rounded-[14px] w-[calc(100%-24px)] mx-auto",
                    isActive
                      ? "figma-card text-[var(--brand)] font-bold"
                      : "text-stone-500 hover:bg-[#EAEBFF]/40 font-medium border border-transparent"
                  )}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={clsx(isActive ? "text-[var(--brand)] drop-shadow-sm" : "text-stone-400 group-hover:text-stone-600")} />
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

          {/* ACCOUNT Section */}
          <div className="w-full">
            <div className="hidden lg:block text-[11px] font-bold text-stone-500 tracking-wider pl-8 mb-3 uppercase">ACCOUNT</div>
            {accountItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center justify-center lg:justify-start gap-4 py-2.5 px-4 lg:px-5 lg:mx-3 transition-all mb-1 rounded-[14px] w-[calc(100%-24px)] mx-auto",
                    isActive
                      ? "figma-card text-[var(--brand)] font-bold"
                      : "text-stone-500 hover:bg-[#EAEBFF]/40 font-medium border border-transparent"
                  )}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={clsx(isActive ? "text-[var(--brand)] drop-shadow-sm" : "text-stone-400 group-hover:text-stone-600")} />
                  <span className="hidden text-[14px] lg:block">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Free Plan Card & Bottom User Profile Bar (Pixel Perfect Screenshot Match) */}
        <div className="hidden lg:block px-3 pb-4 pt-2 border-t border-[#C7D2FE]/30 dark:border-slate-800/60 mt-auto">
          {/* Free Plan Card */}
          <div className="bg-[#EAEBFF]/60 dark:bg-slate-800/60 border border-[#C7D2FE]/60 dark:border-slate-700/80 p-3.5 rounded-2xl mb-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#4A3AFF] dark:text-indigo-400">Free Plan</span>
              <Link href="/subscription" className="text-[12px] font-bold text-[#4A3AFF] hover:underline cursor-pointer">
                Upgrade &rarr;
              </Link>
            </div>
            <div className="w-full h-1.5 bg-[#C7D2FE]/60 dark:bg-slate-700 rounded-full my-2 overflow-hidden">
              <div className="h-full bg-[#4A3AFF] rounded-full w-[49%]" />
            </div>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">7.4 GB of 15 GB used</p>
          </div>

          {/* User Profile Bar */}
          <Link 
            href="/profile" 
            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#EAEBFF]/40 dark:hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={userAvatar} 
                alt={userName} 
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4A3AFF&color=fff`;
                }}
                className="w-9 h-9 rounded-full object-cover border border-[#C7D2FE] shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[13px] text-stone-900 dark:text-white truncate leading-tight">{userName}</p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate mt-0.5">{userEmail}</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-stone-400 group-hover:text-stone-600 transition shrink-0 ml-1" />
          </Link>
        </div>

      </nav>
    </>
  );
}

