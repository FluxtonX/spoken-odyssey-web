"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      router.replace("/home");
    } else {
      router.replace("/auth");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
    </div>
  );
}
