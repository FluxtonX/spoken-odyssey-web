"use client";

import React, { useState, useMemo } from "react";
import { X, Check } from "lucide-react";
import { postFonts } from "@/data/postFonts";

export default function FontSelectorModal({ isOpen, onClose, selectedId, onSelect }) {
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Serif", "Sans-Serif", "Handwriting", "Monospace", "Display", "Islamic/Arabic"];

  const filteredFonts = useMemo(() => {
    if (activeTab === "All") return postFonts;
    return postFonts.filter((f) => f.category === activeTab);
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer / Modal Container */}
      <div className="relative z-10 flex max-h-[80vh] w-full flex-col rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-300 sm:max-w-md sm:rounded-2xl md:max-h-[70vh]">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h3 className="text-lg font-black text-[var(--ink)] dark:text-white">Select Font Style</h3>
            <p className="text-xs font-semibold text-stone-500">Pick a typography for your text post</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background)] text-stone-500 hover:bg-[var(--border)] transition active:scale-95"
            aria-label="Close font selector"
          >
            <X size={18} />
          </button>
        </header>

        {/* Tab Filters */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-[var(--border)] bg-[var(--background)] px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition ${
                activeTab === cat
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--surface)] text-stone-600 hover:bg-[var(--surface-hover)] border border-[var(--border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fonts List Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredFonts.map((font) => {
              const isSelected = selectedId === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => {
                    onSelect(font.id);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm font-extrabold"
                      : "border-[var(--border)] bg-[var(--surface)] text-stone-700 hover:border-[var(--brand)]/50 hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-400 mb-1">{font.category}</p>
                    <p 
                      className="text-lg truncate leading-relaxed"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.id === "default" ? font.name : "preservation of memories"}
                    </p>
                    {font.id !== "default" && (
                      <p className="text-[10px] text-stone-500 font-medium">{font.name}</p>
                    )}
                  </div>

                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)] text-white shrink-0">
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
