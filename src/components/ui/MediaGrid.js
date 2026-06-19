"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function MediaGrid({ memory }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Normalize media items from backend (mediaList) or fallback (media, image)
  const getMediaItems = useCallback(() => {
    if (memory.mediaList && memory.mediaList.length > 0) {
      return memory.mediaList.map((item) => ({
        url: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl || item.mediaUrl,
        type: item.mediaMimeType?.startsWith("video/") ? "video" : "photo",
        name: item.mediaOriginalName || "Media",
      }));
    }

    // Fallbacks
    const items = [];
    
    // Singular media URL
    const primaryUrl = memory.media?.url || memory.image || memory.mediaUrl;
    if (primaryUrl) {
      const isVideo = memory.type === "Video" || memory.mediaMimeType?.startsWith("video/");
      items.push({
        url: primaryUrl,
        thumbnailUrl: memory.thumbnailUrl || primaryUrl,
        type: isVideo ? "video" : "photo",
        name: memory.mediaOriginalName || "Media",
      });
    }

    // Local drafts fallback (if media is an array of strings/objects)
    if (Array.isArray(memory.media) && memory.media.length > 0) {
      memory.media.forEach((item, index) => {
        const url = typeof item === "string" ? item : item.url || item.image;
        if (url) {
          const isVideo = memory.type === "Video" || (typeof item !== "string" && item.type === "video");
          items.push({
            url,
            thumbnailUrl: url,
            type: isVideo ? "video" : "photo",
            name: `Media ${index + 1}`,
          });
        }
      });
    }

    return items;
  }, [memory]);

  const items = getMediaItems();

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === -1) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setLightboxIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, items]);

  if (items.length === 0) return null;

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  // Render layout depending on number of items
  const renderGrid = () => {
    const count = items.length;

    if (count === 1) {
      const item = items[0];
      return (
        <div 
          onClick={() => openLightbox(0)}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
        >
          {item.type === "video" ? (
            <div className="relative flex items-center justify-center bg-black aspect-video max-h-[380px] w-full">
              <video src={item.url} className="h-full w-full object-contain" muted playsInline />
              <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-lg transition group-hover:scale-105">
                <Play fill="currentColor" size={20} className="ml-1" />
              </div>
            </div>
          ) : (
            <img 
              src={item.url} 
              alt={memory.title} 
              className="max-h-[420px] w-full object-cover transition duration-300 group-hover:brightness-95" 
            />
          )}
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl border border-[var(--border)] h-64 sm:h-72">
          {items.slice(0, 2).map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => openLightbox(idx)}
              className="group relative cursor-pointer overflow-hidden bg-stone-100 dark:bg-stone-900 h-full w-full"
            >
              {item.type === "video" ? (
                <div className="relative flex h-full w-full items-center justify-center bg-black">
                  <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                  <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-md transition group-hover:scale-105">
                    <Play fill="currentColor" size={14} className="ml-0.5" />
                  </div>
                </div>
              ) : (
                <img 
                  src={item.url} 
                  alt="" 
                  className="h-full w-full object-cover transition duration-300 group-hover:brightness-95" 
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-xl border border-[var(--border)] h-72 sm:h-80">
          {/* Main item (large left) */}
          <div 
            onClick={() => openLightbox(0)}
            className="group col-span-2 relative cursor-pointer overflow-hidden bg-stone-100 dark:bg-stone-900 h-full w-full"
          >
            {items[0].type === "video" ? (
              <div className="relative flex h-full w-full items-center justify-center bg-black">
                <video src={items[0].url} className="h-full w-full object-cover" muted playsInline />
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-lg transition group-hover:scale-105">
                  <Play fill="currentColor" size={16} className="ml-1" />
                </div>
              </div>
            ) : (
              <img 
                src={items[0].url} 
                alt="" 
                className="h-full w-full object-cover transition duration-300 group-hover:brightness-95" 
              />
            )}
          </div>

          {/* Right stacked items */}
          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
            {items.slice(1, 3).map((item, idx) => {
              const actualIdx = idx + 1;
              return (
                <div 
                  key={actualIdx} 
                  onClick={() => openLightbox(actualIdx)}
                  className="group relative cursor-pointer overflow-hidden bg-stone-100 dark:bg-stone-900 h-full w-full"
                >
                  {item.type === "video" ? (
                    <div className="relative flex h-full w-full items-center justify-center bg-black">
                      <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                      <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-md transition group-hover:scale-105">
                        <Play fill="currentColor" size={10} className="ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.url} 
                      alt="" 
                      className="h-full w-full object-cover transition duration-300 group-hover:brightness-95" 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 4 or more items
    const remaining = count - 4;
    return (
      <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-xl border border-[var(--border)] h-80 sm:h-96">
        {/* Main item (large left) */}
        <div 
          onClick={() => openLightbox(0)}
          className="group col-span-2 relative cursor-pointer overflow-hidden bg-stone-100 dark:bg-stone-900 h-full w-full"
        >
          {items[0].type === "video" ? (
            <div className="relative flex h-full w-full items-center justify-center bg-black">
              <video src={items[0].url} className="h-full w-full object-cover" muted playsInline />
              <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-lg transition group-hover:scale-105">
                <Play fill="currentColor" size={18} className="ml-1" />
              </div>
            </div>
          ) : (
            <img 
              src={items[0].url} 
              alt="" 
              className="h-full w-full object-cover transition duration-300 group-hover:brightness-95" 
            />
          )}
        </div>

        {/* Right stacked items (3 items) */}
        <div className="col-span-1 grid grid-rows-3 gap-1.5 h-full">
          {items.slice(1, 4).map((item, idx) => {
            const actualIdx = idx + 1;
            const isLast = idx === 2;
            return (
              <div 
                key={actualIdx} 
                onClick={() => openLightbox(actualIdx)}
                className="group relative cursor-pointer overflow-hidden bg-stone-100 dark:bg-stone-900 h-full w-full"
              >
                {item.type === "video" ? (
                  <div className="relative flex h-full w-full items-center justify-center bg-black">
                    <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                    <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--brand)] shadow-sm">
                      <Play fill="currentColor" size={10} className="ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.url} 
                    alt="" 
                    className="h-full w-full object-cover transition duration-300 group-hover:brightness-95" 
                  />
                )}
                {isLast && remaining > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition group-hover:bg-black/50">
                    <span className="text-xl sm:text-2xl font-black text-white">+{remaining + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderGrid()}

      {/* Lightbox Modal */}
      {lightboxIndex > -1 && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 select-none animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-sm font-extrabold text-stone-300">
              {lightboxIndex + 1} of {items.length}
            </span>
            <button 
              onClick={() => setLightboxIndex(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/60 text-white hover:bg-stone-850 hover:scale-105 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Content */}
          <div className="relative flex-1 flex items-center justify-center px-4">
            {/* Left Button */}
            {items.length > 1 && (
              <button 
                onClick={prevSlide}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900/60 text-white hover:bg-stone-850 active:scale-95 transition"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Main Media View */}
            <div className="max-w-4xl w-full h-[75vh] flex items-center justify-center">
              {items[lightboxIndex].type === "video" ? (
                <video 
                  key={items[lightboxIndex].url}
                  src={items[lightboxIndex].url} 
                  controls 
                  autoPlay 
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <img 
                  src={items[lightboxIndex].url} 
                  alt="" 
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" 
                />
              )}
            </div>

            {/* Right Button */}
            {items.length > 1 && (
              <button 
                onClick={nextSlide}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900/60 text-white hover:bg-stone-850 active:scale-95 transition"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Bar / Space */}
          <div className="h-16 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
            {items[lightboxIndex].name && (
              <span className="text-xs font-bold text-stone-400">
                {items[lightboxIndex].name}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
