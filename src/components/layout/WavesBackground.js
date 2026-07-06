"use client";

import React from "react";

/**
 * WavesBackground is a reusable wrapper component that adds organic, responsive
 * lavender wavy background elements to both sides of the screen.
 */
export default function WavesBackground({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[var(--background)] -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-6 pb-24 text-[var(--foreground)] ${className}`}>
      {/* Layered Organic Left Wavy Blobs */}
      <div className="absolute top-0 left-0 w-[30%] sm:w-[24%] md:w-[18%] lg:w-[14%] h-full pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#e2deff] dark:fill-[#161a33]">
          {/* Deep wave */}
          <path d="M 0,0 C 45,8 55,20 30,40 C 10,55 50,70 35,85 C 20,95 30,98 0,100 Z" className="opacity-30" />
          {/* Middle wave */}
          <path d="M 0,0 C 35,5 45,15 25,30 C 10,42 40,55 30,70 C 20,82 35,95 0,100 Z" className="opacity-60" />
          {/* Foreground wave */}
          <path d="M 0,0 C 25,3 35,10 15,20 C 5,28 30,40 20,55 C 10,68 25,85 0,100 Z" className="opacity-90" />
        </svg>
      </div>

      {/* Layered Organic Right Wavy Blobs */}
      <div className="absolute top-0 right-0 w-[30%] sm:w-[24%] md:w-[18%] lg:w-[14%] h-full pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#e2deff] dark:fill-[#161a33]">
          {/* Deep wave */}
          <path d="M 100,0 C 55,10 45,25 70,45 C 90,58 50,75 65,90 C 80,98 70,99 100,100 Z" className="opacity-30" />
          {/* Middle wave */}
          <path d="M 100,0 C 65,8 55,20 75,35 C 90,45 60,60 70,75 C 80,88 65,95 100,100 Z" className="opacity-60" />
          {/* Foreground wave */}
          <path d="M 100,0 C 75,3 65,10 85,20 C 95,28 70,40 80,55 C 90,68 75,85 100,100 Z" className="opacity-90" />
        </svg>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
