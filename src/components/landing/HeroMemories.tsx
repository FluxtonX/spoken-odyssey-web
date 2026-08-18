"use client";

import { useMemo, useState, useEffect } from "react";
import { heroMemoryItems } from "@/lib/heroMemories";
import type { HeroMemoryItem } from "@/lib/heroMemories";
import MemoryItem from "./MemoryItem";

interface HeroMemoriesProps {
  layer: "back" | "front";
  mousePosition: { x: number; y: number };
  isDesktop: boolean;
}

function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

function resolvePosition(item: HeroMemoryItem, bp: "mobile" | "tablet" | "desktop") {
  return item.position[bp];
}

function resolveSize(item: HeroMemoryItem, bp: "mobile" | "tablet" | "desktop") {
  if (!item.size) return undefined;
  return item.size[bp];
}

export default function HeroMemories({ layer, mousePosition, isDesktop }: HeroMemoriesProps) {
  const bp = useBreakpoint();

  const items = useMemo(
    () =>
      heroMemoryItems.filter((item) => {
        if (item.layer !== layer) return false;
        if (item.hiddenOnMobile && bp === "mobile") return false;
        return true;
      }),
    [layer, bp]
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map((item) => (
        <MemoryItem
          key={item.id}
          item={item}
          position={resolvePosition(item, bp)}
          size={resolveSize(item, bp)}
          mousePosition={mousePosition}
          isDesktop={isDesktop}
        />
      ))}
    </div>
  );
}
