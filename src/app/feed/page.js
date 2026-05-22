"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
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
} from "lucide-react";
import { memories, people } from "@/data/mockApp";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

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

  const feedItems = useMemo(() => {
    if (activeTab === "Family") {
      return memories.filter((memory) => memory.privacy === "Family Circle");
    }

    if (activeTab === "Public") {
      return memories.filter((memory) => memory.privacy === "Public");
    }

    if (activeTab === "Themes") {
      return memories.filter((memory) => {
        const haystack = `${memory.title} ${memory.description} ${memory.tags.join(" ")} ${memory.mood}`.toLowerCase();
        return haystack.includes(activeTheme.split(" ")[0].toLowerCase());
      });
    }

    return memories;
  }, [activeTab, activeTheme]);

  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="sticky top-0 z-30 -mx-4 bg-[var(--background)]/95 px-4 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
              <Compass size={14} />
              Feed & Discover
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[var(--ink)]">Community Feed</h1>
            <p className="mt-1 text-sm font-semibold text-stone-500">Browse memories, themes, and public profiles in one place.</p>
          </div>
          <Link
            href="/search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>
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
      </header>

      <main className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          {activeTab !== "People" && (
            <>
              <CreatePostBox />

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
                  feedItems.map((memory) => <FeedCard key={memory.id} memory={memory} />)
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

        <aside className="hidden space-y-5 lg:block">
          <ThemePanel activeTheme={activeTheme} onChange={setActiveTheme} />
          <PeoplePanel />
        </aside>
      </main>
    </div>
  );
}

function CreatePostBox() {
  return (
    <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="mb-4 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)] text-lg font-black text-white shadow-sm">
          A
        </div>
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
            <div className="scale-50 -mx-3 -my-3 shrink-0">{resolveGlass3DIcon(icon)}</div>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeedCard({ memory }) {
  const owner = people.find((person) => person.id === memory.ownerId) ?? people[0];
  const [reaction, setReaction] = useState(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { id: `${memory.id}-c1`, author: "Alexander", text: "Beautiful memory. This feels worth preserving." },
  ]);
  const [shareNotice, setShareNotice] = useState("");
  const holdTimerRef = useRef(null);
  const selectedReaction = reactions.find((item) => item.id === reaction);
  const reactionCount = memory.likes + (reaction ? 1 : 0);

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function startReactionHold() {
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      setReactionPickerOpen(true);
    }, 450);
  }

  function quickReact() {
    clearHoldTimer();
    if (reactionPickerOpen) return;
    setReaction((current) => (current === "heart" ? null : "heart"));
  }

  function chooseReaction(nextReaction) {
    setReaction(nextReaction);
    setReactionPickerOpen(false);
  }

  function addComment(event) {
    event.preventDefault();
    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    setComments((current) => [
      ...current,
      { id: `${memory.id}-c${Date.now()}`, author: "Alexander", text: cleanComment },
    ]);
    setCommentText("");
    setCommentsOpen(true);
  }

  async function shareMemory() {
    const shareUrl = `${window.location.origin}/memories/${memory.id}`;
    const shareData = {
      title: memory.title,
      text: memory.description,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareNotice("Shared");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareNotice("Link copied");
      }
    } catch {
      setShareNotice("Share cancelled");
    }

    window.setTimeout(() => setShareNotice(""), 1800);
  }

  return (
    <article className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex items-center justify-between p-5 text-left">
        <Link href={`/people/${owner.id}`} className="flex min-w-0 items-center gap-3">
          <img src={owner.avatar} alt={owner.name} className="h-10 w-10 rounded-lg object-cover" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold leading-tight text-[var(--ink)]">{owner.name}</h3>
            <span className="text-[10px] font-semibold text-stone-400">{memory.date}</span>
          </div>
        </Link>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-50 hover:text-stone-700">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="px-5 pb-3 text-left">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--brand)]">
            {memory.type}
          </span>
          <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-stone-500">
            {memory.privacy}
          </span>
        </div>
        <Link href={`/memories/${memory.id}`} className="block">
          <h4 className="mb-1 text-base font-extrabold text-[var(--ink)]">{memory.title}</h4>
          <p className="text-sm font-semibold leading-relaxed text-stone-500">{memory.description}</p>
        </Link>
      </div>

      {memory.type === "Photo" || memory.type === "Video" ? (
        <Link href={`/memories/${memory.id}`} className="relative flex w-full items-center justify-center overflow-hidden border-y border-stone-100 bg-stone-50">
          <img src={memory.image} alt={memory.title} className="max-h-[420px] w-full object-cover" />
          {memory.type === "Video" && (
            <span className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-lg">
              <Play fill="currentColor" size={20} className="ml-1" />
            </span>
          )}
        </Link>
      ) : null}

      {memory.type === "Voice" && (
        <div className="mx-5 mb-5 flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--brand-soft)] p-4 text-left">
          <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg shadow-black/10 transition hover:scale-105 active:scale-95">
            <Play fill="currentColor" size={18} className="ml-1" />
          </button>
          <div className="flex-1">
            <div className="flex h-6 w-full items-center gap-1 opacity-70">
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="flex-1 rounded-full bg-[var(--brand)]" style={{ height: `${20 + (index % 4) * 25}%` }} />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-black text-[var(--brand)]">
              <span>0:00</span>
              <span>{memory.duration}</span>
            </div>
          </div>
        </div>
      )}

      {memory.type === "Text" && (
        <Link href={`/memories/${memory.id}`} className="mx-5 mb-5 flex min-h-[140px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--brand-soft)] p-6 text-center">
          <p className="text-base font-extrabold italic leading-relaxed text-[var(--ink)]">"{memory.description}"</p>
        </Link>
      )}

      <div className="border-t border-stone-100 px-5 py-3.5">
        <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold text-stone-400">
          <span className="flex items-center gap-1">
            {reaction && <span className={selectedReaction?.color}>{selectedReaction?.icon}</span>}
            {reactionCount} reactions
          </span>
          <button onClick={() => setCommentsOpen((current) => !current)} className="hover:text-[var(--brand)]">
            {memory.comments + comments.length} comments
          </button>
        </div>

        <div className="relative flex items-center justify-between gap-1.5 border-t border-stone-100 pt-2">
          {reactionPickerOpen && (
            <div className="absolute bottom-full left-0 z-20 mb-2 flex rounded-full border border-[var(--border)] bg-white p-1.5 shadow-xl">
              {reactions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => chooseReaction(item.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:-translate-y-1 hover:bg-[var(--brand-soft)]"
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          )}

          <button
            onMouseDown={startReactionHold}
            onMouseUp={quickReact}
            onMouseLeave={clearHoldTimer}
            onTouchStart={startReactionHold}
            onTouchEnd={quickReact}
            className={`group flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold transition hover:bg-stone-50 ${
              reaction ? selectedReaction?.color : "text-stone-600 hover:text-[var(--brand)]"
            }`}
          >
            <span className="text-lg leading-none">{reaction ? selectedReaction?.icon : "♥"}</span>
            <span className="text-xs">{reaction ? selectedReaction?.label : "Like"}</span>
          </button>
          <ActionButton icon={MessageCircle} label="Comment" onClick={() => setCommentsOpen((current) => !current)} />
          <ActionButton icon={Share2} label={shareNotice || "Share"} onClick={shareMemory} />
        </div>

        {commentsOpen && (
          <div className="mt-3 space-y-3 border-t border-stone-100 pt-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-[var(--background)] px-3 py-2">
                <p className="text-xs font-black text-[var(--ink)]">{comment.author}</p>
                <p className="mt-1 text-sm font-medium leading-5 text-stone-600">{comment.text}</p>
              </div>
            ))}

            <form onSubmit={addComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment..."
                className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
              />
              <button className="h-10 rounded-lg bg-[var(--brand)] px-4 text-xs font-black text-white">
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="group flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold text-stone-600 transition hover:bg-stone-50 hover:text-[var(--brand)]">
      <Icon size={18} className="transition-transform group-active:scale-90" />
      <span className="text-xs">{label}</span>
    </button>
  );
}

function ThemePanel({ activeTheme, onChange }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-black text-[var(--ink)]">
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

function PeoplePanel() {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-black text-[var(--ink)]">Suggested People</h2>
      <div className="space-y-3">
        {people.map((person) => (
          <Link key={person.id} href={`/people/${person.id}`} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 transition hover:border-[var(--brand)]">
            <img src={person.avatar} alt={person.name} className="h-11 w-11 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[var(--ink)]">{person.name}</p>
              <p className="truncate text-xs font-bold text-stone-500">{person.role}</p>
            </div>
            <UserPlus size={16} className="text-[var(--brand)]" />
          </Link>
        ))}
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
