"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Lock,
  Mic,
  MoreHorizontal,
  Play,
  Plus,
  Type,
  Users,
  Video,
} from "lucide-react";
import { albums, getAlbumById, getAlbumMemories } from "@/data/mockApp";

const typeIcons = {
  Voice: Mic,
  Text: Type,
  Photo: ImagePlus,
  Video,
};

export default function AlbumDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").filter(Boolean).at(-1);
  const album = getAlbumById(id) ?? albums[0];
  const albumMemories = getAlbumMemories(album.id);

  return (
    <div className="w-full pb-24 animation-fade-in">
      <header className="relative -mx-4 -mt-6 overflow-hidden sm:-mx-6 md:-mx-8 md:-mt-10">
        <div className="h-[340px] md:h-[420px]">
          <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/35 to-black/10" />
        </div>

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 md:left-8 md:right-8">
          <Link
            href="/albums"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/85 text-[var(--ink)] shadow-sm backdrop-blur-md transition active:scale-95"
            aria-label="Back to albums"
          >
            <ArrowLeft size={18} />
          </Link>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/85 text-[var(--ink)] shadow-sm backdrop-blur-md transition active:scale-95">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-6 md:px-8">
          <div className="max-w-4xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/25 bg-white/85 px-3 py-1 text-xs font-black text-[var(--ink)] backdrop-blur-md">
                {album.privacy}
              </span>
              <span className="rounded-full border border-white/25 bg-white/85 px-3 py-1 text-xs font-black text-[var(--ink)] backdrop-blur-md">
                Cloud synced
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm md:text-6xl">
              {album.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/90 md:text-base">
              {album.subtitle}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatTile label="Memories" value={albumMemories.length} />
        <StatTile label="Created" value={album.created} />
        <StatTile label="Privacy" value={album.privacy} />
      </section>

      <section className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">Gallery Wall</h2>
            <p className="mt-1 text-sm font-bold text-stone-500">
              Chronological memory cards from this album.
            </p>
          </div>
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white shadow-sm transition active:scale-[0.98]">
            <Plus size={17} />
            Add Memory
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albumMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="text-lg font-black">Album Notes</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-stone-600 dark:text-stone-300">
            Use this space for the album introduction, context, and family-facing notes. In the
            connected version this becomes editable metadata, but the frontend layout is ready now.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="text-lg font-black">Quick Add</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Voice", Mic],
              ["Text", Type],
              ["Photo", ImagePlus],
              ["Video", Video],
            ].map(([label, Icon]) => (
              <Link
                key={label}
                href={`/record?mode=${label}`}
                className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-black transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <p className="text-xl font-black text-[var(--ink)] dark:text-white">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  );
}

function MemoryCard({ memory }) {
  const Icon = typeIcons[memory.type] ?? Type;

  return (
    <Link
      href={`/memories/${memory.id}`}
      className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img src={memory.image} alt={memory.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        {memory.type === "Voice" || memory.type === "Video" ? (
          <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-sm">
            <Play size={16} fill="currentColor" />
          </div>
        ) : null}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-white/80">
            <Icon size={13} />
            {memory.type}
          </div>
          <h3 className="line-clamp-2 text-base font-black leading-tight">{memory.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm font-medium leading-6 text-stone-600 dark:text-stone-300">
          {memory.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-black text-stone-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {memory.date}
          </span>
          <span className="flex items-center gap-1.5">
            {memory.privacy === "Private" ? <Lock size={14} /> : <Users size={14} />}
            {memory.privacy}
          </span>
        </div>
      </div>
    </Link>
  );
}
