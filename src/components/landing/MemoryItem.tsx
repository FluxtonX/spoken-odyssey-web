"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, MapPin, Play, PenLine } from "lucide-react";
import type { HeroMemoryItem } from "@/lib/heroMemories";
import { animationConfig } from "@/lib/heroMemories";

interface MemoryItemProps {
  item: HeroMemoryItem;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  mousePosition: { x: number; y: number };
  isDesktop: boolean;
}

function Waveform({ bars = 18 }: { bars?: number }) {
  const heights = [4, 8, 12, 16, 10, 14, 8, 16, 12, 6, 14, 10, 16, 8, 12, 6, 10, 14];
  return (
    <div className="flex items-center gap-[2px] h-4">
      {heights.slice(0, bars).map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full bg-[#6d5cff]/70"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function PhotoCard({
  src,
  alt,
  size,
  priority,
  overlay,
}: {
  src: string;
  alt: string;
  size: { width: number; height: number };
  priority?: boolean;
  overlay?: "video";
}) {
  return (
    <div
      className="relative rounded-xl shadow-lg overflow-hidden ring-1 ring-white/40"
      style={{ width: size.width, height: size.height }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size.width}px`}
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      {overlay === "video" && (
        <>
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Play size={14} className="text-[#4f37ff] ml-0.5" fill="currentColor" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function MemoryItem({
  item,
  position,
  size,
  mousePosition,
  isDesktop,
}: MemoryItemProps) {
  const depth = item.parallaxDepth ?? 0.06;
  const parallaxX = isDesktop ? mousePosition.x * depth * 100 : 0;
  const parallaxOffsetY = isDesktop ? mousePosition.y * depth * 30 : 0;
  const floatDuration = item.floatDuration ?? 5;
  const floatDelay = item.floatDelay ?? 0;
  const entranceDelay = item.entranceDelay ?? 0.5;

  const renderContent = () => {
    switch (item.type) {
      case "photo":
        if (!item.src || !size) return null;
        return (
          <PhotoCard
            src={item.src}
            alt={item.alt ?? ""}
            size={size}
            priority={item.priority}
          />
        );

      case "video":
        if (!item.src || !size) return null;
        return (
          <PhotoCard
            src={item.src}
            alt={item.alt ?? ""}
            size={size}
            priority={item.priority}
            overlay="video"
          />
        );

      case "audio":
        return (
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-white/60"
            style={{ width: size!.width, height: size!.height }}
          >
            <div className="w-7 h-7 rounded-full bg-[#4f37ff] flex items-center justify-center shrink-0">
              <Play size={10} className="text-white ml-0.5" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <Waveform />
              <p className="text-[9px] font-bold text-[#4f37ff] mt-0.5 truncate">
                {item.label} · {item.duration}
              </p>
            </div>
          </div>
        );

      case "text":
        return (
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-white/60"
            style={{ width: size!.width, height: size!.height }}
          >
            <div className="w-6 h-6 rounded-lg bg-[#4f37ff]/10 flex items-center justify-center shrink-0 mt-0.5">
              <PenLine size={11} className="text-[#4f37ff]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold text-[#211934] leading-tight">{item.title}</p>
              <p className="text-[8px] text-[#6f6985] font-medium">{item.date}</p>
              <p className="text-[8px] text-[#645b78] mt-0.5 leading-snug">{item.body}</p>
            </div>
          </div>
        );

      case "badge":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md ring-1 ring-white/60 whitespace-nowrap">
            {item.sublabel ? (
              <MapPin size={10} className="text-[#4f37ff] shrink-0" />
            ) : (
              <Camera size={10} className="text-[#4f37ff] shrink-0" />
            )}
            <div>
              <p className="text-[9px] font-bold text-[#211934] leading-none">{item.label}</p>
              {item.sublabel && (
                <p className="text-[8px] text-[#6f6985] font-medium mt-0.5">{item.sublabel}</p>
              )}
            </div>
          </div>
        );

      case "family":
        return (
          <div
            className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-white/60"
            style={{ width: size!.width, height: size!.height }}
          >
            <div className="flex -space-x-2">
              {item.avatars?.slice(0, 4).map((src, i) => (
                <div key={i} className="relative w-5 h-5 rounded-full ring-2 ring-white overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" sizes="20px" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-[#211934] leading-none">{item.label}</p>
              <p className="text-[8px] text-[#6f6985] font-medium">{item.memberCount} Members</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${50 + position.x}%`,
        top: `${50 + position.y}%`,
        zIndex: item.zIndex,
        x: parallaxX,
        y: parallaxOffsetY,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.7, delay: entranceDelay, ease: "easeOut" },
        scale: { duration: 0.7, delay: entranceDelay, ease: "easeOut" },
      }}
    >
      <motion.div
        animate={{ y: [0, -animationConfig.floatAmplitude, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
