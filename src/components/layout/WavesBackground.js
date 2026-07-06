"use client";

import React from "react";

/**
 * WavesBackground is a reusable wrapper component that adds organic, responsive
 * lavender wavy background elements to both sides of the screen.
 */
export default function WavesBackground({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[var(--background)] -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-6 pb-24 text-[var(--foreground)] ${className}`}>
      {/* Organic Left Wavy Blob */}
      <div className="absolute top-0 left-0 w-[30%] sm:w-[24%] md:w-[18%] lg:w-[14%] h-full pointer-events-none z-0 overflow-hidden opacity-90">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#e2deff] dark:fill-[#161a33]">
          <path d="M 0,0 C 35,5 45,15 25,30 C 10,42 40,55 30,70 C 20,82 35,95 0,100 Z" />
        </svg>
      </div>

      {/* Organic Right Wavy Blob */}
      <div className="absolute top-0 right-0 w-[30%] sm:w-[24%] md:w-[18%] lg:w-[14%] h-full pointer-events-none z-0 overflow-hidden opacity-90">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#e2deff] dark:fill-[#161a33]">
          <path d="M 100,0 C 65,8 55,20 75,35 C 90,45 60,60 70,75 C 80,88 65,95 100,100 Z" />
        </svg>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
