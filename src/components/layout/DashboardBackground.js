"use client";

import React from "react";

/**
 * DashboardBackground - Renders a soft light-lavender base and a single large 
 * white organic blob flowing diagonally from the bottom-left to the upper-right 
 * using smooth Bézier curves and asymmetrical wave geometry.
 */
export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden bg-[#E7E8FF]">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 1000 
             L -100 500 
             C 150 550, 300 520, 450 480 
             C 700 420, 950 250, 1200 200 
             C 1350 170, 1450 120, 1540 80 
             L 1540 480 
             C 1350 550, 1250 620, 1220 720 
             C 1180 850, 1240 1000, 1000 1000 
             Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}
