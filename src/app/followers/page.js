"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, UserPlus, Users, ArrowUpRight } from "lucide-react";
import { people } from "@/data/mockApp";

// Mock Followers List
const mockFollowers = [
  {
    id: "mudassir",
    name: "Mudassir Khan",
    role: "Family Historian",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    location: "London, UK",
    status: "followed_you",
  },
  {
    id: "emily",
    name: "Emily Mitchell",
    role: "Memory Collector",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
    location: "Seattle, WA",
    status: "followed_you",
  },
  {
    id: "robert",
    name: "Robert Mitchell",
    role: "Legacy Custodian",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
    location: "Boulder, CO",
    status: "followed_you",
  },
];

export default function FollowersPage() {
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

  // Pre-seed some suggestions not already followed
  const suggestions = people.filter(p => p.id !== "sarah" && p.id !== "robert");

  return (
    <div className="w-full pb-24 animation-fade-in">
      {/* Header */}
      <header className="mb-6 flex items-start gap-4">
        <Link
          href="/feed"
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95"
          aria-label="Back to feed"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
            <Users size={14} />
            Social Network
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white">Followers</h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">Manage connections and discover family storytellers.</p>
        </div>
      </header>

      {/* Followers List */}
      <section className="mt-8">
        <h2 className="text-lg font-black text-[var(--ink)] dark:text-white mb-4 flex items-center gap-2">
          <span>Recent Followers</span>
          <span className="text-xs bg-stone-100 text-stone-600 rounded-full px-2.5 py-0.5 font-bold">
            {mockFollowers.length}
          </span>
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mockFollowers.map((follower) => {
            const isFollowing = followedIds.includes(follower.id);
            return (
              <div key={follower.id} className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-[var(--brand)]/45 transition">
                <div className="flex items-start gap-3 min-w-0 mb-4">
                  <img src={follower.avatar} alt={follower.name} className="h-12 w-12 rounded-full object-cover shrink-0 border border-stone-200/80 shadow-sm" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-sm font-black text-[var(--ink)] dark:text-white">{follower.name}</span>
                      <span className="shrink-0 text-[9px] bg-[var(--brand-soft)] text-[var(--brand)] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Follows
                      </span>
                    </div>
                    <p className="truncate text-xs font-bold text-stone-500">{follower.role}</p>
                    <p className="truncate text-[10px] font-medium text-stone-400">{follower.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(follower.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 border ${
                    isFollowing
                      ? "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200"
                      : "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white border-transparent"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={13} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} />
                      Follow Back
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Suggested to Follow */}
      <section className="mt-10">
        <h2 className="text-lg font-black text-[var(--ink)] dark:text-white mb-4">Suggested for You</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((person) => {
            const isFollowing = followedIds.includes(person.id);
            return (
              <div key={person.id} className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-[var(--brand)]/45 transition">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <Link href={`/people/${person.id}`} className="flex items-center gap-3 min-w-0 hover:opacity-90">
                    <img src={person.avatar} alt={person.name} className="h-12 w-12 rounded-full object-cover border border-stone-200/50 shadow-sm shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[var(--ink)] dark:text-white">{person.name}</p>
                      <p className="truncate text-xs font-semibold text-stone-500">{person.role}</p>
                    </div>
                  </Link>
                  <Link href={`/people/${person.id}`} className="text-stone-400 hover:text-[var(--brand)] transition">
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
                
                <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed mb-4">
                  {person.bio}
                </p>

                <button
                  onClick={() => toggleFollow(person.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 border ${
                    isFollowing
                      ? "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200"
                      : "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white border-transparent shadow-sm"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={14} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
