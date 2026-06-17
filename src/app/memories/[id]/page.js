"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
import { getMemoryById, getPersonById, memories } from "@/data/mockApp";
import { getStoredAlbums, seedInitialMemoriesIfNeeded } from "@/data/userProfile";
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

  const [memory, setMemory] = useState(null);
  const [album, setAlbum] = useState(null);
  const [owner, setOwner] = useState(null);
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    seedInitialMemoriesIfNeeded();
    
    // Load local memories
    const savedMemories = localStorage.getItem("spokenOdysseyLocalMemories");
    let foundMemory = null;
    if (savedMemories) {
      try {
        const parsed = JSON.parse(savedMemories);
        foundMemory = parsed.find((m) => m.id === id);
      } catch {
        // ignore
      }
    }
    
    // Fallback to mock memories
    if (!foundMemory) {
      foundMemory = getMemoryById(id) || memories[0];
    }
    
    setMemory(foundMemory);

    // Load stored albums to find this memory's album
    const storedAlbums = getStoredAlbums();
    const albumId = (foundMemory.albums && foundMemory.albums[0]) || foundMemory.albumId || "summer-2023";
    const foundAlbum = storedAlbums.find((a) => a.id === albumId) || storedAlbums[0];
    setAlbum(foundAlbum);

    // Set owner
    const foundOwner = getPersonById(foundMemory.ownerId) || {
      id: "alexander",
      name: "Alexander Mitchell",
      role: "Family Archivist",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80"
    };
    setOwner(foundOwner);

    // Load comments
    if (foundMemory) {
      const savedComments = localStorage.getItem(`comments_${foundMemory.id}`);
      if (savedComments) {
        setCommentsList(JSON.parse(savedComments));
      } else {
        const mockComments = [
          { author: "Sarah Mitchell", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", text: "This is a beautiful memory! Thanks for sharing.", time: "2 hours ago" },
          { author: "Robert Mitchell", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80", text: "Wow, brings back so many memories.", time: "1 day ago" }
        ].slice(0, foundMemory.comments || 2);
        setCommentsList(mockComments);
      }
    }
  }, [id]);

  const handleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    
    // Persist likes count change in local storage memory
    const saved = localStorage.getItem("spokenOdysseyLocalMemories");
    if (saved) {
      try {
        const allMemories = JSON.parse(saved);
        const memIndex = allMemories.findIndex(m => m.id === memory.id);
        if (memIndex !== -1) {
          allMemories[memIndex].likes = (allMemories[memIndex].likes || 0) + (nextLiked ? 1 : -1);
          localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(allMemories));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !memory) return;

    const newComment = {
      author: "Alexander Mitchell", // Current User
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
      text: commentInput.trim(),
      time: "Just now"
    };

    const updated = [...commentsList, newComment];
    setCommentsList(updated);
    localStorage.setItem(`comments_${memory.id}`, JSON.stringify(updated));
    setCommentInput("");

    // Also update comments count in local memories list if it is a local memory
    const saved = localStorage.getItem("spokenOdysseyLocalMemories");
    if (saved) {
      try {
        const allMemories = JSON.parse(saved);
        const memIndex = allMemories.findIndex(m => m.id === memory.id);
        if (memIndex !== -1) {
          allMemories[memIndex].comments = (allMemories[memIndex].comments || 0) + 1;
          localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify(allMemories));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  if (!memory || !album) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const Icon = typeIcons[memory.type] ?? Type;

  return (
    <div className="mx-auto w-full max-w-5xl pb-24 animation-fade-in">
      <header className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/albums/${album.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:text-[var(--brand)] transition-colors"
          aria-label="Back to album"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer"
          >
            <Edit3 size={15} />
            Edit
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 shadow-sm cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        
        {/* Main Column */}
        <div className="space-y-6">
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
                    className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-2xl transition active:scale-95 cursor-pointer"
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
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white cursor-pointer"
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
                      <span>{memory.duration || "0:18"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Comments Section */}
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-left">
            <h2 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-[var(--brand)]" />
              Comments ({commentsList.length})
            </h2>
            
            {/* Comments List */}
            <div className="space-y-4 mb-5 max-h-[300px] overflow-y-auto pr-2">
              {commentsList.map((comment, index) => (
                <div key={index} className="flex gap-3 text-sm animate-fade-in">
                  <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover border border-stone-200" />
                  <div className="flex-1 bg-stone-50 dark:bg-stone-850 p-3 rounded-2xl">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-extrabold text-stone-850 dark:text-stone-200">{comment.author}</span>
                      <span className="text-[10px] text-stone-400 font-bold">{comment.time}</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 font-medium leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
              {commentsList.length === 0 && (
                <p className="text-xs font-semibold text-stone-400 text-center py-4">No comments yet. Start the conversation!</p>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-3 items-end">
              <input 
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] outline-none font-semibold"
              />
              <button 
                type="submit"
                className="px-5 py-3 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black rounded-xl text-sm transition active:scale-95 cursor-pointer"
              >
                Post
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-5">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-left">
            <div className="flex items-center gap-3">
              <img src={owner?.avatar} alt={owner?.name} className="h-12 w-12 rounded-full object-cover border border-stone-200" />
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

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-left">
            <h2 className="text-sm font-black uppercase tracking-wide text-stone-500">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {memory.tags && memory.tags.length > 0 ? (
                memory.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-black">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-stone-400">No tags</span>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleLike}
                className={`flex h-12 items-center justify-center gap-2 rounded-lg text-xs font-black transition cursor-pointer ${
                  liked ? "bg-rose-50 text-rose-600 border border-rose-200/50" : "bg-[var(--background)] text-stone-600 border border-transparent hover:border-[var(--brand)]/30"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                {(memory.likes || 0) + (liked ? 1 : 0)}
              </button>
              <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--background)] border border-transparent text-xs font-black text-stone-600">
                <MessageCircle size={16} />
                {commentsList.length}
              </button>
              <button 
                onClick={handleShare}
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--background)] border border-transparent hover:border-[var(--brand)]/30 text-xs font-black text-stone-600 cursor-pointer"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </section>
        </aside>
      </main>

      {editOpen && <EditSheet memory={memory} onClose={() => setEditOpen(false)} />}
      
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 border border-stone-800 text-white p-4 text-xs font-bold shadow-lg animate-fade-in">
          <span>🔗 Memory link copied to clipboard!</span>
        </div>
      )}
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
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background)] cursor-pointer">
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
          <button onClick={onClose} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-sm font-black text-white cursor-pointer">
            <Save size={16} />
            Save Preview
          </button>
        </div>
      </div>
    </div>
  );
}
