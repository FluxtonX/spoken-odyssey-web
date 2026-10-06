"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

export default function RicherLifeSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden flex items-center min-h-[440px] sm:min-h-[480px] md:min-h-0 md:aspect-[2170/725] mt-12 sm:mt-16 lg:mt-24 xl:mt-28">
      {/* ── Full Panoramic Background Artwork: rich life.png (Zero Zoom - Fits Natural Proportions) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/rich life.png"
          alt="A richer life with Spoken Odyssey"
          className="w-full h-full object-cover object-[70%_center] md:object-center"
          loading="eager"
        />
        {/* Soft readability wash on small screens so text never clashes with cards on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent sm:from-white/65 sm:via-white/25 sm:to-transparent lg:hidden pointer-events-none" />
      </div>

      {/* ── Foreground Content: Left-aligned Text & Video CTA ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full py-8 md:py-0">
        <motion.div 
          className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[430px] xl:max-w-[470px] space-y-3 sm:space-y-4 lg:space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p className="text-[10px] sm:text-[11px] lg:text-xs font-black uppercase tracking-[0.22em] text-[#1E3A8A]">
            MORE THAN MEMORIES
          </p>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-[44px] xl:text-[52px] font-black leading-[1.06] tracking-tight text-[#0B0E23]">
            A richer{" "}
            <span className="text-[#0055FF]">
              life.
            </span>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm lg:text-[15px] leading-relaxed text-[#334155] font-normal max-w-xs sm:max-w-sm md:max-w-md">
            Spoken Odyssey helps you capture everyday moments and life&apos;s biggest milestones, understand your story, and keep it alive for the people who matter most.
          </p>

          {/* Video CTA Link */}
          <div className="pt-1 sm:pt-2">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="group inline-flex items-center gap-3 text-left transition-all duration-200 active:scale-95"
              aria-label="Watch 1 minute video"
            >
              {/* Vibrant Blue Play Button */}
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full bg-[#0055FF] text-white shadow-[0_6px_18px_rgba(0,85,255,0.4)] transition-transform duration-300 group-hover:scale-108 group-hover:bg-[#0047db]">
                <Play size={16} className="fill-white ml-0.5 text-white" />
              </span>
              <span className="text-xs sm:text-sm lg:text-base font-bold text-[#0055FF] transition-colors group-hover:text-[#0047db]">
                Watch 1 min video
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Spoken Odyssey Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
