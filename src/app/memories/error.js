"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function MemoriesErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Memories page error caught by Error Boundary:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Something went wrong</h2>
      <p className="text-stone-500 max-w-md text-sm mb-6">
        We couldn't render this page right now. Please try again or return to the main dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-[#4A3AFF] text-white font-bold text-sm hover:bg-[#3b2dd1] transition-all cursor-pointer shadow-md"
        >
          Try Again
        </button>
        <a
          href="/home"
          className="px-6 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-bold text-sm hover:bg-stone-50 transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
