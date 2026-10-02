"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CHAPTERS = [
  {
    id: "adventures",
    title: "Adventures",
    subtitle: "The places you go",
    image: "/landing/adventure.jpg",
  },
  {
    id: "birthdays",
    title: "Birthdays",
    subtitle: "The milestones you celebrate",
    image: "/landing/birthday.jpg",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtitle: "The moments you cherish",
    image: "/landing/wedding.jpg",
  },
  {
    id: "pets",
    title: "Pets",
    subtitle: "Your loyal companions",
    image: "/landing/pets.jpg",
  },
  {
    id: "family",
    title: "Family",
    subtitle: "The connections that shape you",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "milestones",
    title: "Milestones",
    subtitle: "The achievements that define you",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "celebrations",
    title: "Celebrations",
    subtitle: "Joy that echoes forever",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
  },
];

export default function EverydayExtraordinarySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const gap = 20; // 20px gap

  // 4 steps corresponding to the 4 pagination dots
  const maxIndex = 3;

  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      if (window.innerWidth >= 1024) {
        // Exactly 4 cards in one row on desktop
        setCardWidth((containerWidth - 3 * gap) / 4);
      } else if (window.innerWidth >= 640) {
        // 2 cards in one row on tablet
        setCardWidth((containerWidth - gap) / 2);
      } else {
        // 1 card focused on mobile
        setCardWidth(containerWidth * 0.82);
      }
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.24em] text-[#0066FF] mb-1.5">
              FOR EVERY CHAPTER OF LIFE
            </p>

            {/* Main Heading */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#0B0E23]">
                From the everyday to the extraordinary.
              </h2>
              <p className="text-xs sm:text-[13px] font-medium text-[#64748B] mt-1 sm:mt-0">
                Capture the moments that matter most &mdash; wherever life takes you.
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft size={17} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div className="overflow-hidden" ref={containerRef}>
          <motion.div
            className="flex"
            style={{ gap: `${gap}px` }}
            animate={{
              x: -(currentIndex * (cardWidth + gap)),
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 32,
              mass: 0.7,
            }}
          >
            {CHAPTERS.map((item, index) => (
              <div
                key={item.id}
                style={{
                  width: cardWidth ? `${cardWidth}px` : "23%",
                  flexShrink: 0,
                }}
                className="group cursor-pointer select-none"
                onClick={() => {
                  if (index <= maxIndex) {
                    setCurrentIndex(index);
                  }
                }}
              >
                {/* 4 small compact cards with 16:10 aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-100/80 transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Card Title & Subtitle */}
                <div className="mt-3 pl-0.5">
                  <h3 className="text-[15px] sm:text-[16px] font-bold leading-snug text-[#0B0E23] transition-colors group-hover:text-[#0066FF]">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-[#2563EB]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4 Pagination Dots */}
        <div className="mt-7 flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((dotIndex) => {
            const isActive = currentIndex === dotIndex;
            return (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setCurrentIndex(dotIndex)}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "h-2 w-5 bg-[#0066FF] shadow-[0_2px_6px_rgba(0,102,255,0.35)]"
                    : "h-2 w-2 bg-[#BFDBFE] hover:bg-[#93C5FD]"
                }`}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
