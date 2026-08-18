"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroGlassesProps {
  mousePosition: { x: number; y: number };
  isDesktop: boolean;
}

export default function HeroGlasses({ mousePosition, isDesktop }: HeroGlassesProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxX = isDesktop ? mousePosition.x * 12 : 0;
  const parallaxY = isDesktop ? mousePosition.y * 8 : scrollY * 0.1;
  const rotateX = scrollY * 0.05;
  const rotateY = isDesktop ? mousePosition.x * 5 : 0;

  return (
    <motion.div
      className="relative z-30 flex items-center justify-center"
      style={{ perspective: "1200px" }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transform: `translateX(${parallaxX}px) translateY(${parallaxY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6d5cff]/20 to-[#5544ff]/10 blur-3xl -z-10 scale-110" />

        <motion.div
          className="relative w-56 h-44 md:w-72 md:h-52 lg:w-80 lg:h-60 drop-shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/glass.png"
            alt="Odyssey Glasses - Preserve your memories"
            fill
            priority
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
          />
        </motion.div>

        <div className="absolute top-8 left-12 w-24 h-24 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl -z-5 opacity-60" />
        <div className="absolute bottom-12 right-8 w-20 h-20 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-2xl -z-5 opacity-40" />
      </motion.div>
    </motion.div>
  );
}
