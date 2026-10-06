"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Columns grouped into 2-row pairs:
// [Row 1 Item, Row 2 Item]
// Initially visible 4 columns display the exact 8 cards from the screenshot:
// Row 1: Family, Achievements, Travel, Concerts
// Row 2: Pets, Sports, Together, Journeys
const CHAPTER_PAIRS = [
  [
    {
      id: "family",
      title: "Family",
      subtitle: "The people who matter most",
      image: "/landing/chapters/chapter-family.jpg",
    },
    {
      id: "pets",
      title: "Pets",
      subtitle: "The companions by your side",
      image: "/landing/chapters/chapter-pets.jpg",
    },
  ],
  [
    {
      id: "achievements",
      title: "Achievements",
      subtitle: "The moments you worked for",
      image: "/landing/chapters/chapter-achievements.jpg",
    },
    {
      id: "sports",
      title: "Sports",
      subtitle: "The passions that make you feel alive",
      image: "/landing/chapters/chapter-sports.jpg",
    },
  ],
  [
    {
      id: "travel",
      title: "Travel",
      subtitle: "The places that stay with you",
      image: "/landing/chapters/chapter-travel.jpg",
    },
    {
      id: "together",
      title: "Together",
      subtitle: "The moments shared around the table",
      image: "/landing/chapters/chapter-together.jpg",
    },
  ],
  [
    {
      id: "concerts",
      title: "Concerts",
      subtitle: "The experiences you never forget",
      image: "/landing/chapters/chapter-concerts.jpg",
    },
    {
      id: "journeys",
      title: "Journeys",
      subtitle: "The memories made along the way",
      image: "/landing/chapters/chapter-journeys.jpg",
    },
  ],
  [
    {
      id: "adventures",
      title: "Adventures",
      subtitle: "The places you explore",
      image: "/landing/adventure.jpg",
    },
    {
      id: "birthdays",
      title: "Birthdays",
      subtitle: "The milestones you celebrate",
      image: "/landing/birthday.jpg",
    },
  ],
  [
    {
      id: "weddings",
      title: "Weddings",
      subtitle: "The moments you cherish",
      image: "/landing/wedding.jpg",
    },
    {
      id: "celebrations",
      title: "Celebrations",
      subtitle: "Joy that echoes forever",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
    },
  ],
];

export default function EverydayExtraordinarySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [columnWidth, setColumnWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const gap = 24;

  const totalColumns = CHAPTER_PAIRS.length;
  const maxIndex = Math.max(0, totalColumns - visibleCount);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      let count = 4;
      if (window.innerWidth < 640) {
        count = 1;
        setColumnWidth(containerWidth * 0.86);
      } else if (window.innerWidth < 1024) {
        count = 2;
        setColumnWidth((containerWidth - gap) / 2);
      } else {
        count = 4;
        setColumnWidth((containerWidth - 3 * gap) / 4);
      }
      setVisibleCount(count);
    }
  }, [gap]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-18">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        
        {/* Header Block with Prev / Next Navigation Controls */}
        <div className="mb-8 sm:mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.24em] text-[#0066FF] mb-1.5">
              FOR EVERY CHAPTER OF LIFE
            </p>

            {/* Main Heading & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black leading-tight tracking-tight text-[#0B0E23]">
                From the everyday to the extraordinary.
              </h2>
              <p className="text-xs sm:text-[13px] font-medium text-[#64748B] mt-1 sm:mt-0">
                Capture the moments that matter most &mdash; wherever life takes you.
              </p>
            </div>
          </div>

          {/* Next & Prev Arrows */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all duration-200 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-slate-50 active:scale-95 cursor-pointer"
              aria-label="Previous cards"
            >
              <ChevronLeft size={18} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all duration-200 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-slate-50 active:scale-95 cursor-pointer"
              aria-label="Next cards"
            >
              <ChevronRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* 2-Row Carousel Viewport */}
        <div className="overflow-hidden" ref={containerRef}>
          <motion.div
            className="flex"
            style={{ gap: `${gap}px` }}
            animate={{
              x: -(currentIndex * (columnWidth + gap)),
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
              mass: 0.7,
            }}
          >
            {CHAPTER_PAIRS.map((pair, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: columnWidth ? `${columnWidth}px` : "23%",
                  flexShrink: 0,
                }}
                className="flex flex-col gap-6 sm:gap-7"
              >
                {/* Row 1 Card */}
                {pair[0] && (
                  <div className="group cursor-pointer select-none flex flex-col">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100/90 transition-all duration-300 group-hover:shadow-[0_10px_25px_rgba(0,102,255,0.14)] group-hover:-translate-y-0.5">
                      <img
                        src={pair[0].image}
                        alt={pair[0].title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="mt-3 pl-0.5">
                      <h3 className="text-[16px] sm:text-[17px] font-bold leading-snug text-[#0B0E23] transition-colors group-hover:text-[#0066FF]">
                        {pair[0].title}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-[#0066FF]">
                        {pair[0].subtitle}
                      </p>
                    </div>
                  </div>
                )}

                {/* Row 2 Card */}
                {pair[1] && (
                  <div className="group cursor-pointer select-none flex flex-col">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100/90 transition-all duration-300 group-hover:shadow-[0_10px_25px_rgba(0,102,255,0.14)] group-hover:-translate-y-0.5">
                      <img
                        src={pair[1].image}
                        alt={pair[1].title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="mt-3 pl-0.5">
                      <h3 className="text-[16px] sm:text-[17px] font-bold leading-snug text-[#0B0E23] transition-colors group-hover:text-[#0066FF]">
                        {pair[1].title}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-[#0066FF]">
                        {pair[1].subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => {
            const isActive = currentIndex === dotIndex;
            return (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setCurrentIndex(dotIndex)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "h-2 w-6 bg-[#0066FF] shadow-[0_2px_6px_rgba(0,102,255,0.35)]"
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
