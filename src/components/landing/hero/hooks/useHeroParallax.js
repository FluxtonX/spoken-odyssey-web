"use client";

import { useEffect, useRef } from "react";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";

export function useHeroParallax(enabled, elementRefs, glassesRef) {
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return undefined;

    const setParallax = (node, x, y) => {
      if (!node) return;
      const inner = node.firstElementChild;
      if (!inner) return;
      inner.style.setProperty("--parallax-x", `${x}px`);
      inner.style.setProperty("--parallax-y", `${y}px`);
    };

    const handleMove = (event) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current = { x: nx, y: ny };

      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const { x, y } = mouseRef.current;
        const max = mosaicConfig.parallax.maxOffset;
        const { depths } = mosaicConfig.parallax;

        elementRefs.current.forEach((node, id) => {
          const depth =
            id.includes("wall")
              ? depths.background
              : id.includes("badge") || id.includes("audio")
                ? depths.front
                : depths.mid;
          setParallax(node, x * max * depth, y * max * depth);
        });

        setParallax(glassesRef.current, x * max * depths.glasses, y * max * depths.glasses);
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, elementRefs, glassesRef]);
}
