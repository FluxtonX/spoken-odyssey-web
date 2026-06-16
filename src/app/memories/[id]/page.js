"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Heart,
  Lock,
  MessageCircle,
  Mic,
  Pause,
  Play,
  Save,
  Share2,
  Tag,
  Trash2,
  Type,
  Users,
  Video,
  X,
} from "lucide-react";
import { albums, getAlbumById, getMemoryById, getPersonById, memories } from "@/data/mockApp";
import {
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
} from "@/data/postBackgrounds";
import { getFontFamily } from "@/data/postFonts";

const typeIcons = {
  Voice: Mic,
  Text: Type,
  Photo: Tag,
  Video,
};

export default function MemoryDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").filter(Boolean).at(-1);
  const memory = getMemoryById(id) ?? memories[0];
  const album = getAlbumById(memory.albumId) ?? albums[0];
  const owner = getPersonById(memory.ownerId);
  const Icon = typeIcons[memory.type] ?? Type;
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/albums/${album.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm"
          aria-label="Back to album"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            <Edit3 size={15} />
            Edit
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 shadow-sm">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          {memory.type === "Text" ? (
            <div
              className="relative min-h-[360px] flex flex-col items-center justify-center p-6 text-center overflow-hidden"
              style={getBackgroundStyles(memory.backgroundId)}
            >
              {getBackgroundOverlay(memory.backgroundId)}
              <div className="z-10 max-w-2xl">
                <div className="mb-4 flex justify-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-current/25 bg-current/10 px-3 py-1 text-xs font-black backdrop-blur-sm">
                    <Icon size={14} />
                    {memory.type}
                  </span>
                  <span className="rounded-full border border-current/25 bg-current/10 px-3 py-1 text-xs font-black backdrop-blur-sm">
                    {memory.mood}
                  </span>
                </div>
                <h1 
                  className="text-3xl font-black tracking-tight sm:text-4xl mb-4" 
                  style={{
                    ...getBackgroundTextStyles(memory.backgroundId),
                    fontFamily: getFontFamily(memory.fontId),
                  }}
                >
                  {memory.title}
                </h1>
                <p 
                  className="text-lg font-bold leading-relaxed italic" 
                  style={{
                    ...getBackgroundTextStyles(memory.backgroundId),
                    fontFamily: getFontFamily(memory.fontId),
                  }}
                >
                  "{memory.description}"
                </p>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[360px] bg-stone-100">
              <img src={memory.image} alt={memory.title} className="h-full min-h-[360px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {(memory.type === "Voice" || memory.type === "Video") && (
                <button
                  onClick={() => setPlaying((current) => !current)}
                  className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-2xl transition active:scale-95"
                  aria-label={playing ? "Pause media preview" : "Play media preview"}
                >
                  {playing ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
                </button>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-black backdrop-blur-md">
                    <Icon size={14} />
                    {memory.type}
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-black backdrop-blur-md">
                    {memory.mood}
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{memory.title}</h1>
                <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/85 sm:text-base">
                  {memory.description}
                </p>
              </div>
            </div>
          )}

          {memory.type === "Voice" && (
            <div className="border-t border-[var(--border)] bg-[var(--background)] p-5">
              <div className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                <button
                  onClick={() => setPlaying((current) => !current)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white"
                >
                  {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex h-8 items-center gap-1">
                    {Array.from({ length: 30 }).map((_, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-full bg-[var(--brand)]/70"
                        style={{ height: `${24 + (index % 6) * 10}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-black text-stone-500">
                    <span>{playing ? "0:18" : "0:00"}</span>
                    <span>{memory.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={owner?.avatar} alt={owner?.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0">
                <Link href={`/people/${owner?.id}`} className="block truncate text-sm font-black hover:text-[var(--brand)]">
                  {owner?.name}
                </Link>
                <p className="truncate text-xs font-bold text-stone-500">{owner?.role}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow icon={CalendarDays} label="Occurred" value={memory.date} />
              <InfoRow icon={memory.privacy === "Private" ? Lock : Users} label="Privacy" value={memory.privacy} />
              <InfoRow icon={Tag} label="Album" value={album.title} />
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wide text-stone-500">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-black">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setLiked((current) => !current)}
                className={`flex h-12 items-center justify-center gap-2 rounded-lg text-xs font-black transition ${
                  liked ? "bg-rose-50 text-rose-600" : "bg-[var(--background)] text-stone-600"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                {memory.likes + (liked ? 1 : 0)}
              </button>
              <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--background)] text-xs font-black text-stone-600">
                <MessageCircle size={16} />
                {memory.comments}
              </button>
              <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--background)] text-xs font-black text-stone-600">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </section>
        </aside>
      </main>

      {editOpen && <EditSheet memory={memory} onClose={() => setEditOpen(false)} />}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--background)] px-3 py-3">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
        <Icon size={14} />
        {label}
      </span>
      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}

function EditSheet({ memory, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl sm:max-w-xl sm:rounded-lg">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Edit Memory</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-stone-500">Frontend draft only for now.</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-stone-500">Title</span>
            <input defaultValue={memory.title} className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold outline-none focus:border-[var(--brand)]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-stone-500">Description</span>
            <textarea defaultValue={memory.description} rows={5} className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm font-medium leading-6 outline-none focus:border-[var(--brand)]" />
          </label>
          <button onClick={onClose} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-sm font-black text-white">
            <Save size={16} />
            Save Preview
          </button>
        </div>
      </div>
    </div>
  );
}
