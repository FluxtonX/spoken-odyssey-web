"use client";

import Link from "next/link";
import { CalendarDays, Edit3, ImagePlus, Lock, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { albums, memories, people } from "@/data/mockApp";

export default function ProfilePage() {
  const user = people[0];
  const privateMemories = memories.filter((memory) => memory.privacy !== "Public");

  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="h-52 bg-stone-100 md:h-64">
          <img src={user.cover} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-5 sm:p-6">
          <div className="-mt-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <img src={user.avatar} alt={user.name} className="h-28 w-28 rounded-full border-4 border-[var(--surface)] object-cover shadow-sm" />
              <div className="pb-2">
                <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
                  <UserRound size={14} />
                  My Profile
                </p>
                <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white">Alexander Mitchell</h1>
              </div>
            </div>
            <Link
              href="/settings/profile"
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-black text-white"
            >
              <Edit3 size={16} />
              Edit Profile
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <p className="max-w-2xl text-sm font-medium leading-7 text-stone-600 dark:text-stone-300">
                Building a private archive for family memories, voice notes, and milestones worth preserving.
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
                <MapPin size={14} />
                Seattle, Washington
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Memories" value={memories.length} />
              <Stat label="Albums" value={albums.length} />
              <Stat label="Private" value={privateMemories.length} />
            </div>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="text-lg font-black">Legacy Status</h2>
            <div className="mt-4 space-y-3">
              <StatusRow icon={ShieldCheck} label="Custodian" value="Robert Mitchell" />
              <StatusRow icon={Lock} label="Default privacy" value="Family Circle" />
              <StatusRow icon={CalendarDays} label="Memory streak" value="8 weeks" />
            </div>
          </div>

          <Link
            href="/record"
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-sm font-black text-white shadow-sm"
          >
            <ImagePlus size={18} />
            Add New Memory
          </Link>
        </aside>

        <main className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight">Recent Archive</h2>
            <Link href="/search" className="text-sm font-black text-[var(--brand)]">Search all</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {memories.slice(0, 4).map((memory) => (
              <Link key={memory.id} href={`/memories/${memory.id}`} className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 transition hover:border-[var(--brand)]">
                <img src={memory.image} alt={memory.title} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide text-[var(--brand)]">{memory.type}</p>
                  <h3 className="mt-1 truncate text-sm font-black">{memory.title}</h3>
                  <p className="mt-1 truncate text-xs font-bold text-stone-500">{memory.privacy}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-center">
      <p className="text-xl font-black">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  );
}

function StatusRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-[var(--background)] px-3 py-3">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-stone-500">
        <Icon size={13} />
        {label}
      </p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
