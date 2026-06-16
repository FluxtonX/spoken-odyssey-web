"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const isAuth = 
      pathname?.startsWith("/onboarding") || 
      pathname?.startsWith("/auth") || 
      pathname?.startsWith("/signup") || 
      pathname?.startsWith("/profile-setup");

    if (!loggedIn && !isAuth) {
      router.replace("/auth");
    }
  }, [pathname, router]);

  // Prevent flash on mount — use neutral loading wrapper
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const isAuthRoute = 
    pathname?.startsWith("/onboarding") || 
    pathname?.startsWith("/auth") || 
    pathname?.startsWith("/signup") || 
    pathname?.startsWith("/profile-setup");

  // If not logged in and not on an auth route, show loading spinner while redirecting
  if (!isLoggedIn && !isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Full-bleed layout — landing page & auth pages control their own bg
  if (!isLoggedIn || isAuthRoute) {
    return (
      <div className="w-full min-h-screen">
        {children}
      </div>
    );
  }

  // Show authenticated Layout (Sidebar margin + dashboard padding)
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)]">
      <main className="flex-1 pb-20 md:pb-0 md:ml-20 lg:ml-64 w-full transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
