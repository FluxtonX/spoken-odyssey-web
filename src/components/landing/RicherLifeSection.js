"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

export default function RicherLifeSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Text & CTA */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.24em] text-[#0066FF]">
              MORE THAN MEMORIES
            </p>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-black leading-[1.08] tracking-tight text-[#0B0E23]">
              A richer{" "}
              <span className="text-[#0066FF]">
                life.
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-[#475569] max-w-lg font-normal">
              Spoken Odyssey helps you capture everyday moments and life&apos;s biggest milestones, understand your story, and keep it alive for the people who matter most.
            </p>

            {/* Video CTA Link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="group inline-flex items-center gap-3.5 text-left transition-all duration-200 active:scale-95"
                aria-label="Watch 1 minute video"
              >
                {/* Vibrant Blue Play Button */}
                <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-[0_10px_25px_rgba(0,102,255,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0052CC]">
                  <Play size={18} className="fill-white ml-0.5" />
                </span>
                <span className="text-sm sm:text-base font-bold text-[#0B0E23] transition-colors group-hover:text-[#0066FF]">
                  Watch 1 min video
                </span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: rich life.png artwork */}
          <motion.div 
            className="lg:col-span-7 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="relative w-full max-w-[660px]">
              <img
                src="/rich life.png"
                alt="A richer life with Spoken Odyssey"
                className="w-full h-auto object-contain select-none transition-transform duration-500 hover:scale-[1.01]"
                loading="eager"
              />
            </div>
          </motion.div>

        </div>
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
