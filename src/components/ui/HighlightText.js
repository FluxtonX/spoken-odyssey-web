"use client";

import React from "react";

/**
 * High-performance search text highlighting component.
 * Highlights matching query character substrings in text.
 */
export default function HighlightText({ text = "", query = "" }) {
  if (!text || typeof text !== "string") return text || "";
  if (!query || typeof query !== "string" || !query.trim()) return text;

  const trimmedQuery = query.trim();
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
          <mark 
            key={i} 
            className="bg-[#FFD600] text-black font-extrabold px-1 py-0.5 rounded-[4px] shadow-xs inline-block"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
