"use client";

import Link from "next/link";
import { CalendarDays, FileText, Image as ImageIcon, Mic2, Play, Video } from "lucide-react";

export const familyMemoryTypeConfig = {
  Photo: { icon: ImageIcon, label: "Photo", className: "bg-sky-50 text-sky-700 border-sky-100" },
  Video: { icon: Video, label: "Video", className: "bg-rose-50 text-rose-700 border-rose-100" },
  Voice: { icon: Mic2, label: "Voice", className: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  Text: { icon: FileText, label: "Text", className: "bg-amber-50 text-amber-700 border-amber-100" },
};

export default function FamilyMemoryCard({ memory }) {
  const config = familyMemoryTypeConfig[memory.type] || familyMemoryTypeConfig.Text;
  const TypeIcon = config.icon;
  const href = memory.linkedMemoryId ? `/memories/${memory.linkedMemoryId}?from=family` : null;
  const isPlayable = memory.type === "Voice" || memory.type === "Video";

  const content = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img src={memory.image} alt={memory.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${config.className}`}>
          <TypeIcon size={12} />
          {config.label}
        </span>

        {isPlayable && (
          <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-lg">
            <Play size={15} fill="currentColor" className="ml-0.5" />
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h2 className="line-clamp-2 text-lg font-black leading-tight">{memory.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-white/80">
            <CalendarDays size={12} />
            {memory.dateLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[var(--brand)]">{memory.sharedWith}</span>
          {memory.duration && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-500">{memory.duration}</span>}
        </div>

        <p className="line-clamp-3 text-sm font-semibold leading-6 text-stone-600">{memory.snippet}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {memory.tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-bold text-stone-500">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <p className="text-[10px] font-black uppercase tracking-wide text-stone-400">Shared by</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[var(--ink)]">{memory.authorName}</p>
              <p className="truncate text-xs font-semibold text-stone-500">With {memory.recipients?.join(", ") || "Family Circle"}</p>
            </div>
            <span className="shrink-0 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-black text-[var(--brand)]">
              View
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    <div className="h-full">{content}</div>
  );
}
