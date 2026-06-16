"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Share2,
  UserCheck,
  X,
} from "lucide-react";
import { getPersonById, getPersonMemories, people } from "@/data/mockApp";

const reactions = [
  { id: "heart", label: "Heart", icon: "♥", color: "text-rose-600" },
  { id: "like", label: "Like", icon: "👍", color: "text-[var(--brand)]" },
  { id: "wow", label: "Wow", icon: "😮", color: "text-amber-600" },
  { id: "haha", label: "Haha", icon: "😄", color: "text-yellow-600" },
  { id: "angry", label: "Angry", icon: "😡", color: "text-red-600" },
];

export default function PersonDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").filter(Boolean).at(-1);
  const person = getPersonById(id) ?? people[0];
  const personMemories = getPersonMemories(person.id);
  const [viewer, setViewer] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="relative z-0 h-[220px] bg-stone-100 sm:h-[300px] lg:h-[360px]">
          <button onClick={() => setViewer({ type: "Cover photo", src: person.cover })} className="block h-full w-full">
            <img src={person.cover} alt={`${person.name} cover`} className="h-full w-full object-cover" />
          </button>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          <Link
            href="/feed"
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/90 text-[var(--ink)] shadow-sm backdrop-blur-md"
            aria-label="Back to feed"
          >
            <ArrowLeft size={18} />
          </Link>
          <button
            onClick={() => setViewer({ type: "Cover photo", src: person.cover })}
            className="absolute bottom-4 right-4 hidden h-10 items-center gap-2 rounded-lg bg-white/90 px-3 text-xs font-black text-[var(--ink)] shadow-sm backdrop-blur-md sm:flex"
          >
            <Camera size={15} />
            View Cover
          </button>
        </div>

        <div className="relative z-10 bg-[var(--surface)] px-4 pb-5 sm:px-6">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <button
                onClick={() => setViewer({ type: "Profile photo", src: person.avatar })}
                className="relative z-20 -mt-12 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[var(--surface)] bg-[var(--surface)] shadow-xl sm:-mt-14 sm:h-36 sm:w-36"
              >
                <img src={person.avatar} alt={person.name} className="h-full w-full object-cover" />
              </button>

              <div className="relative z-20 min-w-0 pb-1">
                <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">{person.name}</h1>
                <p className="mt-1 text-sm font-black text-[var(--brand)]">{person.role}</p>
                <p className="mt-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
                  <MapPin size={14} />
                  {person.location}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-bold text-stone-500 dark:text-stone-400">
                  <span>
                    <strong className="text-[var(--ink)] dark:text-white font-black">
                      {((person.id === "sarah" ? 1200 : person.id === "robert" ? 980 : 1530) + (isFollowing ? 1 : 0)).toLocaleString()}
                    </strong> followers
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span>
                    <strong className="text-[var(--ink)] dark:text-white font-black">
                      {person.id === "sarah" ? "432" : person.id === "robert" ? "280" : "512"}
                    </strong> following
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 grid grid-cols-[1fr_1fr_auto] gap-2 sm:flex">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition-all cursor-pointer ${
                  isFollowing 
                    ? "bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800" 
                    : "bg-[var(--brand)] text-white hover:scale-[1.01] active:scale-95 shadow-sm"
                }`}
              >
                <UserCheck size={16} />
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-black text-[var(--ink)]">
                <MessageCircle size={16} />
                Message
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="max-w-2xl text-sm font-medium leading-7 text-stone-600 dark:text-stone-300">{person.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Digital Legacy", "Family Archive", "Public Memories"].map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-black text-stone-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Stat label="Memories" value={person.stats.memories} />
              <Stat label="Albums" value={person.stats.albums} />
              <Stat label="Family" value={person.stats.family} />
            </div>
          </div>
        </div>
      </header>

      <main className="mt-6">
        <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm w-full">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[var(--ink)]">Public Memories</h2>
              <p className="mt-1 text-sm font-bold text-stone-500">Preview memories shared by this profile.</p>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--brand)]">
              <Plus size={18} />
            </button>
          </div>

          {personMemories.length === 0 ? (
            <div className="rounded-lg bg-[var(--background)] p-5 text-sm font-bold text-stone-500">No public memories in the preview set yet.</div>
          ) : (
            <div className="space-y-4">
              {personMemories.map((memory) => <ProfileMemoryCard key={memory.id} memory={memory} />)}
            </div>
          )}
        </section>
      </main>

      {viewer && <PhotoViewer viewer={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-center">
      <p className="text-xl font-black text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  );
}

function PhotoViewer({ viewer, onClose }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--ink)]/90 p-4 backdrop-blur-sm">
      <button onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20">
        <X size={20} />
      </button>
      <div className="w-full max-w-5xl">
        <p className="mb-3 text-center text-sm font-black uppercase tracking-wide text-white/70">{viewer.type}</p>
        <img src={viewer.src} alt={viewer.type} className="mx-auto max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-2xl" />
      </div>
    </div>
  );
}

function ProfileMemoryCard({ memory }) {
  const [reaction, setReaction] = useState(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { id: `${memory.id}-profile-c1`, author: "Alexander", text: "This is a beautiful archive piece." },
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
      { id: `${memory.id}-profile-c${Date.now()}`, author: "Alexander", text: cleanComment },
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
    <article className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
      <Link href={`/memories/${memory.id}`} className="block">
        <img src={memory.image} alt={memory.title} className="max-h-72 w-full object-cover" />
        <div className="p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-[var(--brand)]">{memory.type}</p>
          <h3 className="mt-1 text-base font-black text-[var(--ink)]">{memory.title}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-stone-600">{memory.description}</p>
        </div>
      </Link>

      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-stone-400">
          <span className="flex items-center gap-1">
            {reaction && <span className={selectedReaction?.color}>{selectedReaction?.icon}</span>}
            {reactionCount} reactions
          </span>
          <button onClick={() => setCommentsOpen((current) => !current)} className="hover:text-[var(--brand)]">
            {memory.comments + comments.length} comments
          </button>
        </div>

        <div className="relative flex border-t border-[var(--border)] pt-2">
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
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-black transition hover:bg-[var(--surface)] ${
              reaction ? selectedReaction?.color : "text-stone-600 hover:text-[var(--brand)]"
            }`}
          >
            <span className="text-lg leading-none">{reaction ? selectedReaction?.icon : "♥"}</span>
            {reaction ? selectedReaction?.label : "Like"}
          </button>

          <ProfileAction icon={MessageCircle} label="Comment" onClick={() => setCommentsOpen((current) => !current)} />
          <ProfileAction icon={Share2} label={shareNotice || "Share"} onClick={shareMemory} />
        </div>

        {commentsOpen && (
          <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-[var(--surface)] px-3 py-2">
                <p className="text-xs font-black text-[var(--ink)]">{comment.author}</p>
                <p className="mt-1 text-sm font-medium leading-5 text-stone-600">{comment.text}</p>
              </div>
            ))}

            <form onSubmit={addComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment..."
                className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold outline-none focus:border-[var(--brand)]"
              />
              <button className="h-10 rounded-lg bg-[var(--brand)] px-4 text-xs font-black text-white">Post</button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

function ProfileAction({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-black text-stone-600 hover:bg-[var(--surface)] hover:text-[var(--brand)]">
      <Icon size={16} />
      {label}
    </button>
  );
}
