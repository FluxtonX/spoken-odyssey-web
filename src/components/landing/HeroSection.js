"use client";

import { useEffect, useState } from "react";

const IMAGE_POOL = [
  [
    "/Hiking.jpg",
    "/lion.jpg",
    "/family5th.jpg",
    "/newYork Street.jpg",
    "/friends night sky.jpg",
    "/herofourth.jpg",
    "/mountain.jpg",
    "/family steps.jpg",
  ],
  [
    "/family steps.jpg",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=85",
    "/herofourth.jpg",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=85",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=85",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=85",
    "/Hiking.jpg",
  ],
  [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
    "https://images.unsplash.com/photo-1464349153459-f0199f4a3f8b?w=1200&q=85",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=85",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=85",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=85",
    "/lion.jpg",
    "/friends night sky.jpg",
    "/mountain.jpg",
  ],
];

export default function HeroSection() {
  const [currentImageSet, setCurrentImageSet] = useState(IMAGE_POOL[0]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => {
        const nextIndex = (prev + 1) % IMAGE_POOL.length;
        setCurrentImageSet(IMAGE_POOL[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black pt-16">
      <div
        className="grid grid-cols-2 sm:grid-cols-4 grid-rows-4 sm:grid-rows-2 w-full gap-0"
        style={{
          height: "calc(100vh - 64px)",
          minHeight: "700px",
          maxHeight: "1200px",
        }}
      >
        {currentImageSet.map((src, cellIdx) => (
          <div
            key={`${cellIdx}-${src}`}
            className="relative w-full h-full overflow-hidden bg-stone-900"
          >
            <img
              src={src}
              alt={`Image ${cellIdx + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
              style={{ animation: "fadeIn 0.5s ease-in-out" }}
              draggable={false}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
