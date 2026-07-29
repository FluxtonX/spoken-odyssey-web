"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CardMediaSlider({ mediaItems = [], title = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaItems || mediaItems.length === 0) return null;

  const currentMedia = mediaItems[currentIndex];
  const isVideo = currentMedia?.type === "video";

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const goToSlide = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (mediaItems.length === 1) {
    return (
      <div className="bg-stone-900 relative overflow-hidden h-52 md:h-56 w-full rounded-2xl shrink-0 flex items-center justify-center">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video src={currentMedia.url} className="w-full h-full object-cover opacity-85" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-xl group-hover:scale-110 transition-transform">
                <Play size={22} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={currentMedia.url}
            alt={title || "Memory media"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-stone-900 relative overflow-hidden h-52 md:h-56 w-full rounded-2xl shrink-0 group/slider select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          {isVideo ? (
            <div className="relative w-full h-full">
              <video src={currentMedia.url} className="w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-xl">
                  <Play size={22} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt={`${title} slide ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Counter Badge */}
      <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md z-10 border border-white/20 shadow-xs">
        {currentIndex + 1} / {mediaItems.length}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 z-10 backdrop-blur-md border border-white/20 shadow-md cursor-pointer hover:scale-110"
        title="Previous media"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 z-10 backdrop-blur-md border border-white/20 shadow-md cursor-pointer hover:scale-110"
        title="Next media"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {mediaItems.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => goToSlide(e, idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-5 bg-white shadow-xs"
                : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
