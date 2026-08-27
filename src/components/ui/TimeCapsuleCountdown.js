"use client";

import { useState, useEffect } from "react";
import { Lock, CheckCircle2 } from "lucide-react";

export default function TimeCapsuleCountdown({ unlockAt }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false
  });

  useEffect(() => {
    if (!unlockAt) return;

    const calculateRemaining = () => {
      const targetTime = new Date(unlockAt).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isUnlocked: false });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [unlockAt]);

  if (!unlockAt) return null;

  if (timeLeft.isUnlocked) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[9px] border border-emerald-200/80 dark:border-emerald-800/60 whitespace-nowrap shadow-xs">
        <CheckCircle2 size={9} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Unlocked</span>
      </span>
    );
  }

  const timeStr = `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}${String(timeLeft.hours).padStart(2, "0")}h ${String(timeLeft.minutes).padStart(2, "0")}m ${String(timeLeft.seconds).padStart(2, "0")}s`;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[9px] tracking-tight border border-emerald-200/80 dark:border-emerald-800/60 whitespace-nowrap shadow-xs">
      <Lock size={9} className="shrink-0 animate-pulse text-emerald-600 dark:text-emerald-400" />
      <span className="tabular-nums font-mono">{timeStr}</span>
    </span>
  );
}
