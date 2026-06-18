"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
} from "lucide-react";
import { sharedMemories } from "../data";
import FamilyMemoryCard, { familyMemoryTypeConfig } from "../components/FamilyMemoryCard";

const filters = ["All", "Photo", "Video", "Voice", "Text"];

export default function FamilySharedMemoriesPage() {
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");

  const visibleMemories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sharedMemories.filter((memory) => {
      const typeMatches = activeType === "All" || memory.type === activeType;
      const queryMatches =
        !normalized ||
        `${memory.title} ${memory.authorName} ${memory.snippet} ${memory.tags?.join(" ") || ""} ${memory.sharedWith}`
          .toLowerCase()
          .includes(normalized);
      return typeMatches && queryMatches;
    });
  }, [activeType, query]);

  const stats = filters.slice(1).map((type) => ({
    type,
    count: sharedMemories.filter((memory) => memory.type === type).length,
  }));

  return (
    <div className="w-full max-w-6xl pb-24 animation-fade-in">
      <header className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <Link
              href="/family"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] transition hover:border-[var(--brand)]"
              aria-label="Back to family"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--brand)]">
                <Users size={13} />
                Family Circle
              </p>
              <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">Shared Memories</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-stone-500">
                Photos, videos, text notes, and voice memories shared with your family circle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:w-[320px]">
            {stats.map(({ type, count }) => {
              const Icon = familyMemoryTypeConfig[type].icon;
              return (
                <div key={type} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center">
                  <Icon className="mx-auto mb-1 text-[var(--brand)]" size={16} />
                  <p className="text-lg font-black leading-none text-[var(--ink)]">{count}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-wide text-stone-400">{type}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search family memories..."
              className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-10 pr-4 text-sm font-bold outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveType(filter)}
                className={`h-12 shrink-0 rounded-xl border px-4 text-xs font-black transition ${
                  activeType === filter
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--border)] bg-[var(--background)] text-stone-600 hover:border-[var(--brand)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {visibleMemories.length ? (
        <main className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleMemories.map((memory) => (
            <FamilyMemoryCard key={memory.id} memory={memory} />
          ))}
        </main>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-lg font-black text-[var(--ink)]">No shared memories found</p>
          <p className="mt-2 text-sm font-semibold text-stone-500">Try another search term or media type.</p>
        </div>
      )}
    </div>
  );
}
