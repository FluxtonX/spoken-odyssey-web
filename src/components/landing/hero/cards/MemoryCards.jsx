"use client";

import { Play } from "lucide-react";

export function PhotoCard({ src, alt, size }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_14px_34px_rgba(79,55,255,0.18)]"
      style={{ width: size.width, height: size.height }}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" draggable={false} />
    </div>
  );
}

export function VideoCard({ src, alt, size }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_14px_34px_rgba(79,55,255,0.18)]"
      style={{ width: size.width, height: size.height }}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" draggable={false} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#4f37ff] shadow-md">
          <Play size={14} fill="currentColor" className="ml-0.5" />
        </span>
      </div>
    </div>
  );
}

export function AudioCard({ label, duration, size }) {
  const bars = [28, 52, 36, 64, 30, 48, 72, 40, 58, 34, 66, 42];
  return (
    <div
      className="rounded-2xl border border-[#ddd5ff]/80 bg-white/88 px-3 py-2.5 shadow-[0_12px_28px_rgba(79,55,255,0.14)] backdrop-blur-md"
      style={{ width: size.width, height: size.height }}
    >
      <div className="flex h-[22px] items-end gap-[3px]">
        {bars.map((height, index) => (
          <span
            key={index}
            className="w-[3px] rounded-full bg-[#4f37ff]"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-bold text-[#211934]">{label}</p>
        <p className="text-[9px] font-semibold text-[#7d748e]">{duration}</p>
      </div>
    </div>
  );
}

export function TextMemoryCard({ title, date, body, size }) {
  return (
    <div
      className="rounded-2xl border border-[#ddd5ff]/80 bg-white/90 p-3 shadow-[0_12px_28px_rgba(79,55,255,0.14)] backdrop-blur-md"
      style={{ width: size.width, height: size.height }}
    >
      <p className="text-[10px] font-black text-[#211934]">{title}</p>
      <p className="mt-0.5 text-[9px] font-semibold text-[#7d748e]">{date}</p>
      <p className="mt-1.5 line-clamp-3 text-[8px] leading-relaxed font-medium text-[#645b78]">{body}</p>
    </div>
  );
}

export function TimestampBadge({ label, time, size }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-3 py-2 shadow-[0_10px_24px_rgba(79,55,255,0.12)] backdrop-blur-md"
      style={{ width: size.width, height: size.height }}
    >
      <span className="h-2 w-2 rounded-full bg-[#4f37ff]" />
      <div className="min-w-0">
        <p className="truncate text-[9px] font-black uppercase tracking-wide text-[#5a42ff]">{label}</p>
        <p className="truncate text-[10px] font-bold text-[#211934]">{time}</p>
      </div>
    </div>
  );
}

export function LocationBadge({ place, date, size }) {
  return (
    <div
      className="rounded-2xl border border-white/70 bg-white/88 px-3 py-2 shadow-[0_10px_24px_rgba(79,55,255,0.12)] backdrop-blur-md"
      style={{ width: size.width, height: size.height }}
    >
      <p className="text-[10px] font-black text-[#211934]">{place}</p>
      <p className="text-[9px] font-semibold text-[#7d748e]">{date}</p>
    </div>
  );
}

export function FamilyBadge({ label, count, size }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/88 px-3 py-2 shadow-[0_10px_24px_rgba(79,55,255,0.12)] backdrop-blur-md"
      style={{ width: size.width, height: size.height }}
    >
      <p className="text-[10px] font-black text-[#211934]">{label}</p>
      <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[9px] font-black text-[#4f37ff]">{count}</span>
    </div>
  );
}
