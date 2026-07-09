"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { isPublicRoute } from "@/lib/routes";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
    </div>
  );
}

/**
 * Continuous Layered Background
 * Recreates the exact Figma organic layers hugging the left and right edges.
 * Uses fixed positioning and preserveAspectRatio="none" within constrained
 * edge containers to prevent full-screen distortion, keeping the waves anchored.
 */
export function ContinuousLayersBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#fefeff] overflow-hidden">
      
      {/* LEFT SIDE CONTINUOUS WAVES */}
      <div className="absolute top-0 left-0 w-[45%] md:w-[35%] lg:w-[28%] h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="left-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e8e5ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d5d0ff" stopOpacity="0.4" />
            </linearGradient>
            
            <linearGradient id="left-mid" x1="0" y1="0.3" x2="1" y2="0.7">
              <stop offset="0%" stopColor="#c5beff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9a8dff" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="left-top" x1="0" y1="0" x2="0.8" y2="0.4">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e8e5ff" stopOpacity="0" />
            </linearGradient>
            
            <linearGradient id="left-dark-accent" x1="0" y1="0.4" x2="1" y2="0.6">
              <stop offset="0%" stopColor="#8774ff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#5544ff" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background broad pale layer */}
          <path 
            d="M 0,0 L 85,0 
               C 105,15 65,25 55,35 
               C 45,45 105,60 85,75 
               C 65,90 95,95 70,100 
               L 0,100 Z" 
            fill="url(#left-base)" 
          />

          {/* Middle deeper purple layer */}
          <path 
            d="M 0,20 
               C 50,25 75,35 45,45 
               C 15,55 90,65 55,80 
               C 20,95 50,98 25,100 
               L 0,100 Z" 
            fill="url(#left-mid)" 
          />

          {/* Dark purple accent blob (middle left) */}
          <path 
            className="hidden md:block"
            d="M 0,35 
               C 40,38 55,45 25,55 
               C -5,65 20,70 0,75 Z" 
            fill="url(#left-dark-accent)" 
          />

          {/* Top light overlapping layer */}
          <path 
            d="M 0,0 L 55,0 
               C 70,10 40,20 20,30 
               C 0,40 10,45 0,50 Z" 
            fill="url(#left-top)" 
          />
        </svg>
      </div>

      {/* RIGHT SIDE CONTINUOUS WAVES */}
      <div className="absolute top-0 right-0 w-[40%] md:w-[30%] lg:w-[25%] h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="right-base" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ebe8ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dcd8ff" stopOpacity="0.4" />
            </linearGradient>
            
            <linearGradient id="right-mid" x1="1" y1="0.2" x2="0" y2="0.6">
              <stop offset="0%" stopColor="#d1cbff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#b5abff" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="right-accent" x1="1" y1="0.6" x2="0" y2="0.9">
              <stop offset="0%" stopColor="#a395ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7a68ff" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background broad pale layer */}
          <path 
            d="M 100,0 L 20,0 
               C 0,15 40,25 50,35 
               C 60,45 0,60 20,75 
               C 40,90 10,95 30,100 
               L 100,100 Z" 
            fill="url(#right-base)" 
          />

          {/* Middle deeper layer */}
          <path 
            d="M 100,10 
               C 50,18 20,30 55,40 
               C 90,50 15,65 45,80 
               C 75,95 40,98 65,100 
               L 100,100 Z" 
            fill="url(#right-mid)" 
          />

          {/* Lower right accent */}
          <path 
            className="hidden md:block"
            d="M 100,55 
               C 60,60 40,70 70,80 
               C 100,90 80,95 100,100 Z" 
            fill="url(#right-accent)" 
          />
        </svg>
      </div>

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
    return <div className="w-full min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-transparent relative">
      {/* Perfected Figma continuous layers background */}
      <ContinuousLayersBackground />

      <main className="flex-1 pb-20 md:pb-0 md:ml-20 lg:ml-64 min-w-0 transition-all duration-300 relative z-10">
        <div className="w-full px-4 sm:px-6 md:px-8 py-6 md:pt-6 md:pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
