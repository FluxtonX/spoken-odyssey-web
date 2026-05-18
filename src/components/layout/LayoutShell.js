"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [pathname]);

  // Prevent flash on mount — use neutral transparent wrapper
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  const isAuthRoute = 
    pathname?.startsWith("/onboarding") || 
    pathname?.startsWith("/auth") || 
    pathname?.startsWith("/signup") || 
    pathname?.startsWith("/profile-setup");

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
