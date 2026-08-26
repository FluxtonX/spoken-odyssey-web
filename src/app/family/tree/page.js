"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { getFamilyCircleDetails } from "@/services/backend";
import FamilyTreeCanvas from "../components/FamilyTreeCanvas";

export default function FamilyTreePage() {
  const auth = useAuth();
  const [userToken, setUserToken] = useState(null);
  const [currentCircleId, setCurrentCircleId] = useState(null);

  useEffect(() => {
    async function initTokenAndCircle() {
      let token = null;
      if (auth.getToken) {
        try { token = await auth.getToken(); } catch (_) {}
      }
      if (!token) token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");

      if (token) {
        setUserToken(token);
        const circleDetails = await getFamilyCircleDetails(token).catch(() => null);
        const cId = circleDetails?.id || circleDetails?.data?.id || circleDetails?.familyCircleId;
        if (cId) setCurrentCircleId(cId);
      }
    }
    initTokenAndCircle();
  }, [auth.isAuthenticated]);

  return (
    <div className="w-full max-w-5xl pb-24 animation-fade-in relative min-h-screen px-4 py-8">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-serif">
            Family Tree Canvas
          </h1>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            Explore generational layers and connect family memories across generations.
          </p>
        </div>
        <Link href="/family" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
          <ArrowLeft size={20} />
        </Link>
      </header>

      {/* Main Tree Card */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <FamilyTreeCanvas
          circleId={currentCircleId}
          userToken={userToken}
          currentUserId={auth.user?.id || auth.user?.uid}
        />
      </section>
    </div>
  );
}
