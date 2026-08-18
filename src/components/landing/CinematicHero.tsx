"use client";

import HeroAtmosphere from "./HeroAtmosphere";
import HeroTypography from "./HeroTypography";
import HeroGlasses from "./HeroGlasses";
import HeroMemories from "./HeroMemories";
import HeroOrbitRings from "./HeroOrbitRings";
import { heroPreloadUrls } from "@/lib/heroMemories";
import { useState, useEffect, useRef } from "react";

export default function CinematicHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Warm-cache lightweight hero images for faster first paint
  useEffect(() => {
    heroPreloadUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, []);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const x = (e.clientX - rect.left - centerX) / centerX;
      const y = (e.clientY - rect.top - centerY) / centerY;

      setMousePosition({
        x: Math.min(Math.max(x, -1), 1),
        y: Math.min(Math.max(y, -1), 1),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-8 pb-20 md:pt-12 md:pb-24 lg:pt-16 overflow-hidden bg-gradient-to-br from-[#f4f0ff] via-[#eef2ff]/60 to-[#e9e4ff]"
    >
      <HeroAtmosphere />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <HeroTypography mousePosition={mousePosition} isDesktop={isDesktop} />
          </div>

          <div className="lg:col-span-7 relative h-[480px] sm:h-[540px] md:h-[600px] lg:h-[680px] flex items-center justify-center">
            <HeroOrbitRings />

            {/* Back-layer memories (behind glasses) */}
            <HeroMemories layer="back" mousePosition={mousePosition} isDesktop={isDesktop} />

            {/* Glasses — central anchor */}
            <HeroGlasses mousePosition={mousePosition} isDesktop={isDesktop} />

            {/* Front-layer memories (in front of glasses) */}
            <HeroMemories layer="front" mousePosition={mousePosition} isDesktop={isDesktop} />
          </div>
        </div>
      </div>
    </section>
  );
}
