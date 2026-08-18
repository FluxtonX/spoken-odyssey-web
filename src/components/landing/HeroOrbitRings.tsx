"use client";

import { motion } from "framer-motion";

export default function HeroOrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
      <motion.svg
        viewBox="0 0 600 600"
        className="w-[110%] max-w-[680px] h-auto opacity-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        {/* Outer orbit */}
        <motion.ellipse
          cx="300"
          cy="300"
          rx="260"
          ry="180"
          fill="none"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.5"
          transform="rotate(-15 300 300)"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Middle orbit */}
        <motion.ellipse
          cx="300"
          cy="300"
          rx="210"
          ry="145"
          fill="none"
          stroke="url(#orbitGrad2)"
          strokeWidth="1"
          transform="rotate(10 300 300)"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Inner orbit */}
        <motion.ellipse
          cx="300"
          cy="300"
          rx="155"
          ry="105"
          fill="none"
          stroke="url(#orbitGrad1)"
          strokeWidth="0.8"
          transform="rotate(-25 300 300)"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Sparkle dots along orbits */}
        {[
          { cx: 120, cy: 220, r: 2 },
          { cx: 480, cy: 280, r: 1.5 },
          { cx: 200, cy: 420, r: 2 },
          { cx: 420, cy: 150, r: 1.5 },
          { cx: 350, cy: 450, r: 2 },
          { cx: 160, cy: 340, r: 1.5 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#6d5cff"
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}

        <defs>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6d5cff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#6d5cff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6d5cff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5544ff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#5544ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5544ff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
