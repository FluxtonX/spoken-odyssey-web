"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Camera,
  Compass,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Search,
  Share2,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { memories, people, notifications } from "@/data/mockApp";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";
import { getStoredUserProfile, seedInitialMemoriesIfNeeded } from "@/data/userProfile";
import FeedCard from "@/components/ui/FeedCard";
import {
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
} from "@/data/postBackgrounds";
import { getFontFamily } from "@/data/postFonts";

const feedTabs = ["For You", "Family", "Public", "Themes", "People"];
const themes = ["Family Heritage", "Travel", "Recipes", "Milestones", "Voice Notes", "Reflection"];
const reactions = [
  { id: "heart", label: "Heart", icon: "♥", color: "text-rose-600" },
  { id: "like", label: "Like", icon: "👍", color: "text-[var(--brand)]" },
  { id: "wow", label: "Wow", icon: "😮", color: "text-amber-600" },
  { id: "haha", label: "Haha", icon: "😄", color: "text-yellow-600" },
  { id: "angry", label: "Angry", icon: "😡", color: "text-red-600" },
];

export default function Feed() {
  const [activeTab, setActiveTab] = useState("For You");
  const [activeTheme, setActiveTheme] = useState("Family Heritage");
  const [showThemes, setShowThemes] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [localMemories, setLocalMemories] = useState([]);

  useEffect(() => {
    seedInitialMemoriesIfNeeded();
    
    function loadProfile() {
      setUserProfile(getStoredUserProfile());
    }
    function loadLocalMemories() {
      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
      if (saved) {
        try {
          setLocalMemories(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
    
    loadProfile();
    loadLocalMemories();
    window.addEventListener("profileUpdated", loadProfile);
    return () => window.removeEventListener("profileUpdated", loadProfile);
  }, []);

  const combinedMemories = useMemo(() => {
    const sortedLocal = [...localMemories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...sortedLocal, ...memories];
  }, [localMemories]);

  const feedItems = useMemo(() => {
    if (activeTab === "Family") {
      return combinedMemories.filter((memory) => memory.privacy === "Family Circle" || memory.audiences?.includes("family"));
    }

    if (activeTab === "Public") {
      return combinedMemories.filter((memory) => memory.privacy === "Public" || memory.audiences?.includes("public"));
    }

    if (activeTab === "Themes") {
      return combinedMemories.filter((memory) => {
        const tagsList = memory.tags || [];
        const haystack = `${memory.title} ${memory.description} ${tagsList.join(" ")} ${memory.mood || ""}`.toLowerCase();
        return haystack.includes(activeTheme.split(" ")[0].toLowerCase());
      });
    }

    return combinedMemories;
  }, [activeTab, activeTheme, combinedMemories]);

  return (
    <div className="w-full pb-24 animation-fade-in">
      <header className="sticky top-0 z-30 bg-[var(--background)]/95 pt-2 pb-3 backdrop-blur-md">
        <div className="max-w-4xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex h-10 items-center justify-start">
              <Link href="/" className="flex shrink-0 items-center transition hover:opacity-95">
                <img src="/odyssey.png" alt="Spoken Odyssey Logo" className="h-8 w-auto object-contain md:h-9 -ml-1.5" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/followers"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95 hover:text-[var(--brand)]"
                aria-label="Followers"
              >
                <Users size={17} />
              </Link>
              <Link
                href="/search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95 hover:text-[var(--brand)]"
                aria-label="Search"
              >
                <Search size={17} />
              </Link>
              <Link
                href="/notifications"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95"
                aria-label="Notifications"
              >
                <Bell size={17} />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[var(--surface)]" />
                )}
              </Link>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {feedTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                  activeTab === tab
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--border)] bg-[var(--surface)] text-stone-600 hover:border-[var(--brand)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mt-5 w-full max-w-4xl">
        <section className="min-w-0">
          {activeTab !== "People" && (
            <>
              <CreatePostBox userProfile={userProfile} />

              {activeTab === "Themes" && (
                <div className="mb-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-stone-500">
                      <Filter size={15} />
                      Explore by theme
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setActiveTheme(theme)}
                        className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                          activeTheme === theme
                            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                            : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {feedItems.length ? (
                  feedItems.map((memory, index) => (
                    <div key={memory.id} className="space-y-6">
                      <FeedCard memory={memory} />
                      
                      {/* Inline Themes Panel after 2nd post */}
                      {index === 1 && showThemes && (
                        <div className="my-6 animate-fade-in">
                          <ThemePanel activeTheme={activeTheme} onChange={setActiveTheme} onClose={() => setShowThemes(false)} />
                        </div>
                      )}
                      
                      {/* Inline Suggested People after 4th post */}
                      {index === 3 && showPeople && (
                        <div className="my-6 animate-fade-in">
                          <PeoplePanel onClose={() => setShowPeople(false)} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm">
                    <p className="text-sm font-bold text-stone-500">No memories match this filter yet.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "People" && <PeopleDiscover />}
        </section>
      </main>
    </div>
  );
}

function CreatePostBox({ userProfile }) {
  return (
    <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="mb-4 flex gap-3">
        <Link href="/profile" className="shrink-0 transition hover:opacity-90">
          {userProfile?.avatar ? (
            <img src={userProfile.avatar} alt={userProfile.name} className="h-10 w-10 rounded-lg object-cover border border-stone-200/50 shadow-sm" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand)] text-lg font-bold text-white shadow-sm">
              {userProfile?.name?.charAt(0) || "A"}
            </div>
          )}
        </Link>
        <Link
          href="/record"
          className="flex flex-1 items-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-left text-xs font-semibold text-stone-500 transition hover:border-[var(--brand)]"
        >
          Share a memory with the community...
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-3">
        {[
          ["Text", "text"],
          ["Photo", "photo"],
          ["Voice", "voice"],
        ].map(([label, icon]) => (
          <Link
            key={label}
            href={`/record?mode=${label}`}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-black text-stone-700 transition hover:bg-[var(--background)]"
          >
            <div className="scale-50 -mx-3 -my-3 shrink-0 text-[var(--brand)]">{resolveGlass3DIcon(icon)}</div>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}


function ThemePanel({ activeTheme, onChange, onClose }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm relative">
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-250 transition-colors p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
        aria-label="Dismiss themes panel"
      >
        <X size={14} />
      </button>
      <h2 className="flex items-center gap-2 text-lg font-black text-[var(--ink)] pr-6">
        <Sparkles size={18} className="text-[var(--brand)]" />
        Discover Themes
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => onChange(theme)}
            className={`rounded-full border px-3 py-2 text-xs font-black transition ${
              activeTheme === theme
                ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>
    </section>
  );
}

function PeoplePanel({ onClose }) {
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

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm relative text-left">
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-250 transition-colors p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer z-10"
        aria-label="Dismiss suggested people panel"
      >
        <X size={14} />
      </button>
      <h2 className="mb-4 text-lg font-black text-[var(--ink)] pr-6">Suggested People</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {people.map((person) => {
          const isFollowing = followedIds.includes(person.id);
          return (
            <div key={person.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 transition hover:border-[var(--brand)]">
              <Link href={`/people/${person.id}`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90">
                <img src={person.avatar} alt={person.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[var(--ink)]">{person.name}</p>
                  <p className="truncate text-xs font-bold text-stone-500">{person.role}</p>
                </div>
              </Link>
              <button
                onClick={() => toggleFollow(person.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black transition active:scale-95 ${
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
    </section>
  );
}

function PeopleDiscover() {
  return (
    <section>
      <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <h2 className="text-xl font-black text-[var(--ink)]">People to Follow</h2>
        <p className="mt-1 text-sm font-semibold text-stone-500">Discover public profiles and their memory archives.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {people.map((person) => (
          <Link key={person.id} href={`/people/${person.id}`} className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-[var(--brand)]">
            <div className="h-32 bg-stone-100">
              <img src={person.cover} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="-mt-12 mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                <img src={person.avatar} alt={person.name} className="h-16 w-16 shrink-0 rounded-lg border-4 border-[var(--surface)] object-cover" />
                <div className="min-w-0 pt-11">
                  <h3 className="truncate text-base font-black text-[var(--ink)]">{person.name}</h3>
                  <p className="mt-1 truncate text-xs font-bold text-stone-500">{person.role}</p>
                </div>
                <span className="mt-10 flex h-9 items-center gap-2 rounded-lg bg-[var(--brand)] px-3 text-xs font-black text-white">
                  <UserPlus size={14} />
                  Follow
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-stone-600">{person.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
