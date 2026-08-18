"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MosaicElement = forwardRef(function MosaicElement(
  { item, globalSlideIndex = 0, parallaxOffset = { x: 0, y: 0 }, className = "" },
  ref
) {
  const { id, images = [], width, height, rotation = 0, zIndex = 1 } = item;

  // Compute current and previous indices for continuous 100% gapless transitions
  const total = images.length;
  const currentIndex = total > 0 ? globalSlideIndex % total : 0;
  const prevIndex = total > 0 ? (globalSlideIndex - 1 + total) % total : 0;

  const currentImage = images[currentIndex] || { src: item.src, alt: item.alt };
  const prevImage = images[prevIndex] || currentImage;

  return (
    <motion.div
      ref={ref}
      data-mosaic-id={id}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 * zIndex }}
      className={`absolute will-change-transform group pointer-events-auto cursor-pointer ${className}`}
      style={{
        zIndex,
        width,
        height,
        transform: `rotate(${rotation}deg) translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[22px] border-2 border-white/90 bg-stone-100 shadow-[0_20px_45px_rgba(0,0,0,0.14)] transition-all duration-500 group-hover:scale-[1.04] group-hover:shadow-[0_30px_60px_rgba(79,55,255,0.25)]">
        
        {/* Layer 1: Underneath Base Image (Prevents any black gap or blank frames) */}
        {prevImage && (
          <img
            src={prevImage.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover z-0"
            draggable={false}
          />
        )}

        {/* Layer 2: Incoming Image Crossfade & Slide (Seamless Overlay) */}
        <AnimatePresence>
          <motion.img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || "Spoken Odyssey Memory"}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 h-full w-full object-cover z-10"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </AnimatePresence>

        {/* Subtle photo sheen overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-50 group-hover:opacity-20 transition-opacity z-20"
          aria-hidden="true"
        />

        {/* Dynamic Category Tag */}
        {currentImage.tag && (
          <div className="absolute bottom-2.5 left-2.5 z-30 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-white/95 border border-white/25 shadow-xs">
            {currentImage.tag}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default MosaicElement;
