"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { isPublicRoute } from "@/lib/routes";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
    </div>
  );
}

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    // Only redirect unauthenticated users away from protected pages.
    // Authenticated users are allowed to visit /auth freely (e.g. to log out or switch accounts).
    if (!isAuthenticated && !isPublicRoute(pathname)) {
      router.replace("/auth");
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  const publicRoute = isPublicRoute(pathname);
  const shouldRedirect = !isAuthenticated && !publicRoute;

  if (shouldRedirect) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || publicRoute) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)]">
      <main className="flex-1 pb-20 md:pb-0 md:ml-20 lg:ml-64 w-full transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:pt-6 md:pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
