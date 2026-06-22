"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Album, ArrowLeft, CalendarDays, FileText, Search, SlidersHorizontal, UserRound, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import {
  searchOnBackend,
  followUser,
  unfollowUser,
  getFollowing
} from "@/services/backend";

const tabs = ["All", "Memories", "Albums", "People"];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPage = searchParams.get("from");
  const { firebaseUser, isAuthenticated } = useAuth();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [followedIds, setFollowedIds] = useState([]);
  const [results, setResults] = useState({ memories: [], albums: [], people: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBack = (e) => {
    e.preventDefault();
    if (fromPage) {
      router.push(fromPage.startsWith("/") ? fromPage : `/${fromPage}`);
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/feed");
      }
    }
  };

  const loadFollowing = async () => {
    if (isAuthenticated && firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        const followingList = await getFollowing(token);
        setFollowedIds(followingList.map(f => f.id || f.firebaseUid));
      } catch (err) {
        console.warn("Failed to load following list:", err);
      }
    }
  };

  useEffect(() => {
    loadFollowing();
  }, [isAuthenticated, firebaseUser]);

  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) return;

    let active = true;
    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const token = await firebaseUser.getIdToken();
        const data = await searchOnBackend(token, query);
        if (active) {
          setResults({
            memories: data.memories || [],
            albums: data.albums || [],
            people: data.people || []
          });
        }
      } catch (err) {
        console.error("Search failed:", err);
        if (active) {
          setErrorMsg("Failed to search archive.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [query, isAuthenticated, firebaseUser]);

  const toggleFollow = async (targetUid) => {
    if (!isAuthenticated || !firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const isFollowing = followedIds.includes(targetUid);
      if (isFollowing) {
        await unfollowUser(token, targetUid);
        setFollowedIds(prev => prev.filter(id => id !== targetUid));
      } else {
        await followUser(token, targetUid);
        setFollowedIds(prev => [...prev, targetUid]);
      }
      window.dispatchEvent(new Event("followStatusUpdated"));
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
    }
  };

  const total = results.memories.length + results.albums.length + results.people.length;

  return (
    <div className="w-full max-w-5xl pb-24 animation-fade-in text-left">
      <header className="sticky top-0 z-20 -mx-4 border-b border-[var(--border)] bg-[var(--background)]/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm cursor-pointer transition active:scale-95 text-[var(--ink)] dark:text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Search Archive</h1>
            <p className="text-xs font-bold text-stone-500">{total} matching items</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search memories, albums, people..."
              className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
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
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] text-stone-600 dark:text-stone-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <main className="mt-5 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-400">
            <Loader2 className="animate-spin text-[var(--brand)]" size={28} />
            <p className="text-xs font-black uppercase tracking-widest">Searching...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-12 text-rose-500 font-bold">{errorMsg}</div>
        ) : total === 0 ? (
          <div className="text-center py-12 text-stone-400 font-bold">
            No matching items found. Try typing a query or adjusting filters.
          </div>
        ) : (
          <>
            {(tab === "All" || tab === "Memories") && results.memories.length > 0 && (
              <ResultSection title="Memories" count={results.memories.length} icon={FileText}>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.memories.map((memory) => (
                    <Link
                      key={memory.id}
                      href={`/memories/${memory.id}?from=search`}
                      className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition hover:border-[var(--brand)] text-left"
                    >
                      <img
                        src={memory.thumbnailUrl || memory.mediaUrl || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80"}
                        alt={memory.title}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover bg-stone-100 border border-stone-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[var(--brand)]">
                          <CalendarDays size={12} />
                          {memory.date ? new Date(memory.date).toLocaleDateString() : ""}
                        </div>
                        <h3 className="mt-1 truncate text-sm font-black text-[var(--ink)] dark:text-white">{memory.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-stone-500">{memory.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </ResultSection>
            )}

            {(tab === "All" || tab === "Albums") && results.albums.length > 0 && (
              <ResultSection title="Albums" count={results.albums.length} icon={Album}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.albums.map((album) => (
                    <Link
                      key={album.id}
                      href={`/albums/${album.id}?from=search`}
                      className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-[var(--brand)] text-left flex flex-col justify-between"
                    >
                      <img
                        src={album.coverImageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"}
                        alt={album.title}
                        className="h-36 w-full object-cover bg-stone-100"
                      />
                      <div className="p-4 flex-1">
                        <h3 className="text-sm font-black text-[var(--ink)] dark:text-white">{album.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-stone-505 dark:text-stone-300">{album.subtitle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </ResultSection>
            )}

            {(tab === "All" || tab === "People") && results.people.length > 0 && (
              <ResultSection title="People" count={results.people.length} icon={UserRound}>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.people.map((person) => {
                    const isFollowing = followedIds.includes(person.id);
                    return (
                      <div key={person.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm text-left">
                        <Link href={`/people/${person.id}?from=search`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90">
                          <img
                            src={person.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}`}
                            alt={person.name}
                            className="h-14 w-14 rounded-full object-cover shrink-0 border border-stone-205"
                          />
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-black text-[var(--ink)] dark:text-white leading-tight">{person.name}</h3>
                            <p className="truncate text-xs font-bold text-stone-500">{person.role}</p>
                            <p className="mt-1 truncate text-xs font-medium text-stone-400">{person.location}</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFollow(person.id)}
                          className={`ml-4 shrink-0 px-4 py-1.5 rounded-full text-xs font-black transition active:scale-95 cursor-pointer ${
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
          </>
        )}
      </main>
    </div>
  );
}

function ResultSection({ title, count, icon: Icon, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-black text-[var(--ink)] dark:text-white">
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
