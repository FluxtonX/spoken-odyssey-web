"use client";

import Link from "next/link";
import { useState } from "react";
import { Compass, Filter, Heart, MessageCircle, Play, Search, Sparkles, TrendingUp, UserPlus } from "lucide-react";
import { memories, people } from "@/data/mockApp";

const topics = ["All", "Family Heritage", "Travel", "Recipes", "Milestones", "Voice Notes"];

export default function DiscoverPage() {
  const [topic, setTopic] = useState("All");
  const featured = memories.filter((memory) => memory.privacy === "Public" || memory.type !== "Text").slice(0, 4);

  return (
    <div className="w-full pb-24 animation-fade-in">
      <header className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
            <Compass size={14} />
            Discover
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white md:text-5xl">
            Explore public memories
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-stone-600 dark:text-stone-300">
            Browse public memories by theme, creator, and format. This mirrors the mobile discover flow with web-friendly scanning.
          </p>

          <div className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                placeholder="Search public memories"
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
              />
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-stone-600">
              <Filter size={17} />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-black">
            <TrendingUp size={18} className="text-[var(--brand)]" />
            Trending Themes
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((item) => (
              <button
                key={item}
                onClick={() => setTopic(item)}
                className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                  topic === item
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">Featured Memories</h2>
          <Link href="/feed" className="text-sm font-black text-[var(--brand)]">Open Feed</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((memory) => (
            <Link key={memory.id} href={`/memories/${memory.id}`} className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={memory.image} alt={memory.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                {(memory.type === "Voice" || memory.type === "Video") && (
                  <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand)]">
                    <Play size={15} fill="currentColor" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] font-black uppercase tracking-wide text-white/75">{memory.type}</p>
                  <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight">{memory.title}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 text-xs font-black text-stone-500">
                <span className="flex items-center gap-1.5"><Heart size={14} />{memory.likes}</span>
                <span className="flex items-center gap-1.5"><MessageCircle size={14} />{memory.comments}</span>
                <span>{memory.mood}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">Public Profiles</h2>
          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
            <Sparkles size={14} />
            Suggested
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {people.map((person) => (
            <Link key={person.id} href={`/people/${person.id}`} className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-[var(--brand)]">
              <div className="h-28 bg-stone-100">
                <img src={person.cover} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="-mt-11 mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <img src={person.avatar} alt={person.name} className="h-16 w-16 shrink-0 rounded-lg border-4 border-[var(--surface)] object-cover" />
                  <div className="min-w-0 pt-10">
                    <h3 className="truncate text-base font-black text-[var(--ink)]">{person.name}</h3>
                    <p className="mt-1 truncate text-xs font-bold text-stone-500">{person.role}</p>
                  </div>
                  <span className="mt-9 flex h-9 items-center gap-2 rounded-lg bg-[var(--brand)] px-3 text-xs font-black text-white">
                    <UserPlus size={14} />
                    Follow
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-stone-600 dark:text-stone-300">{person.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
