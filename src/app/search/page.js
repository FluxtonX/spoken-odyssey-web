"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Album, ArrowLeft, CalendarDays, FileText, Search, SlidersHorizontal, UserRound } from "lucide-react";
import { albums, memories, people } from "@/data/mockApp";

const tabs = ["All", "Memories", "Albums", "People"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [followedIds, setFollowedIds] = useState(["sarah"]);

  useEffect(() => {
    const saved = localStorage.getItem("followedPeople");
    if (saved) {
      setFollowedIds(JSON.parse(saved));
    }
  }, []);

  const toggleFollow = (id) => {
    setFollowedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("followedPeople", JSON.stringify(next));
      return next;
    });
  };

  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    const match = (value) => !normalized || value.toLowerCase().includes(normalized);
    return {
      memories: memories.filter((memory) =>
        match(`${memory.title} ${memory.description} ${memory.tags.join(" ")} ${memory.mood}`)
      ),
      albums: albums.filter((album) => match(`${album.title} ${album.subtitle} ${album.privacy}`)),
      people: people.filter((person) => match(`${person.name} ${person.role} ${person.location} ${person.bio}`)),
    };
  }, [normalized]);

  const total = results.memories.length + results.albums.length + results.people.length;

  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="sticky top-0 z-20 -mx-4 border-b border-[var(--border)] bg-[var(--background)]/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm"
            aria-label="Back home"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Search Archive</h1>
            <p className="text-xs font-bold text-stone-500">{total} matching items in preview data</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search memories, albums, people..."
              className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
              autoFocus
            />
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-stone-600 shadow-sm">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                tab === item
                  ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <main className="mt-5 space-y-6">
        {(tab === "All" || tab === "Memories") && (
          <ResultSection title="Memories" count={results.memories.length} icon={FileText}>
            <div className="grid gap-3 md:grid-cols-2">
              {results.memories.map((memory) => (
                <Link key={memory.id} href={`/memories/${memory.id}`} className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition hover:border-[var(--brand)]">
                  <img src={memory.image} alt={memory.title} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[var(--brand)]">
                      <CalendarDays size={12} />
                      {memory.date}
                    </div>
                    <h3 className="mt-1 truncate text-sm font-black">{memory.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-stone-500">{memory.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </ResultSection>
        )}

        {(tab === "All" || tab === "Albums") && (
          <ResultSection title="Albums" count={results.albums.length} icon={Album}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.albums.map((album) => (
                <Link key={album.id} href={`/albums/${album.id}`} className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-[var(--brand)]">
                  <img src={album.cover} alt={album.title} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-sm font-black">{album.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-stone-500">{album.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </ResultSection>
        )}

        {(tab === "All" || tab === "People") && (
          <ResultSection title="People" count={results.people.length} icon={UserRound}>
            <div className="grid gap-3 md:grid-cols-2">
              {results.people.map((person) => {
                const isFollowing = followedIds.includes(person.id);
                return (
                  <div key={person.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                    <Link href={`/people/${person.id}`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90">
                      <img src={person.avatar} alt={person.name} className="h-14 w-14 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black">{person.name}</h3>
                        <p className="truncate text-xs font-bold text-stone-500">{person.role}</p>
                        <p className="mt-1 truncate text-xs font-medium text-stone-400">{person.location}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleFollow(person.id)}
                      className={`ml-4 shrink-0 px-4 py-1.5 rounded-full text-xs font-black transition active:scale-95 ${
                        isFollowing
                          ? "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200"
                          : "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </ResultSection>
        )}
      </main>
    </div>
  );
}

function ResultSection({ title, count, icon: Icon, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-black">
          <Icon size={18} className="text-[var(--brand)]" />
          {title}
        </h2>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black text-stone-500">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}
