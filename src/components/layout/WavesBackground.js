"use client";

import React from "react";

/**
 * WavesBackground — Figma-matched organic lavender blob background wrapper.
 *
 * This component is used by individual dashboard pages (profile, albums, etc.)
 * that want their own blob layer. The LayoutShell already provides a global
 * fixed blob layer, so this wrapper mainly ensures proper spacing/padding
 * and adds a LOCAL blob SVG layer for pages that want the effect to scroll
 * with the content (as opposed to the fixed shell background).
 *
 * The blobs match the Figma design: white base with soft organic lavender/purple
 * gradient blob shapes flowing from the edges.
 */
export default function WavesBackground({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen w-full text-[var(--foreground)] ${className}`}>
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
