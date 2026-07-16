"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { isPublicRoute } from "@/lib/routes";
import DashboardBackground from "@/components/layout/DashboardBackground";
import PublishWizard from "@/components/modals/PublishWizard";
import MemoryViewModal from "@/components/modals/MemoryViewModal";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
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
    return <div className="w-full min-h-screen bg-[var(--background)]">{children}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative text-[var(--foreground)] overflow-hidden">
      {/* Reusable Dashboard Background */}
      <DashboardBackground />

      <main className="flex-1 w-full pb-20 md:pb-0 md:pl-24 lg:pl-64 min-w-0 transition-all duration-300 relative z-10">
        <div className="w-full px-4 sm:px-6 md:px-8 py-6 md:pt-8 md:pb-12 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      
      {/* Global Modals */}
      <PublishWizard />
      <MemoryViewModal />
    </div>
  );
}
