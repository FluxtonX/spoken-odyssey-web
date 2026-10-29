"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, CalendarDays, Camera, ChevronLeft, ChevronRight, FileText, Heart, Loader2, MapPin, MessageSquareText, Mic, Pause, Play, RefreshCw, Repeat2, Sparkles, Trophy, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { useAuth } from "@/context/AuthProvider";
import { getThenNowComparisonFromBackend } from "@/services/backend";

const pad = (value) => String(value).padStart(2, "0");
const dateInput = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function periodOptions() {
  const year = new Date().getFullYear();
  return Array.from({ length: 20 }, (_, index) => {
    const endYear = year - index * 5;
    return { startYear: endYear - 4, endYear };
  });
}

function defaultRanges() {
  const today = new Date();
  const year = today.getFullYear();
  return {
    thenStart: `${year - 9}-01-01`,
    thenEnd: `${year - 5}-12-31`,
    nowStart: `${year - 4}-01-01`,
    nowEnd: dateInput(today),
  };
}

const categories = [
  { id: "highlights", label: "Highlights", icon: Sparkles },
  { id: "people", label: "People", icon: Users },
  { id: "places", label: "Places", icon: MapPin },
  { id: "milestones", label: "Milestones", icon: Trophy },
  { id: "reflections", label: "Beliefs & reflections", icon: MessageSquareText },
  { id: "photos", label: "Photos & moments", icon: Camera },
];

const emptyPeriod = { counts: { memories: 0, people: 0, places: 0, milestones: 0 }, people: [], places: [], memories: [] };

function yearRange(start, end) {
  const first = new Date(`${start}T00:00:00`).getFullYear();
  const last = new Date(`${end}T00:00:00`).getFullYear();
  return first === last ? `${first}` : `${first} – ${last}`;
}

function PeriodSelect({ label, side, start, end, onChange }) {
  const value = `${start.slice(0, 4)}-${end.slice(0, 4)}`;
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
      <span className="flex shrink-0 items-center gap-2"><CalendarDays size={17} className="text-[#4A3AFF]" />{label}</span>
      <select
        aria-label={`${label} period`}
        value={value}
        onChange={(event) => onChange(side, event.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-indigo-100/80 bg-white/70 px-3 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#4A3AFF] focus:ring-2 focus:ring-[#4A3AFF]/15 dark:border-white/10 dark:bg-slate-900/40 dark:text-white"
      >
        {periodOptions().map(({ startYear, endYear }) => <option key={`${startYear}-${endYear}`} value={`${startYear}-${endYear}`}>{startYear} – {endYear}</option>)}
      </select>
    </label>
  );
}

function mediaKind(memory) {
  const type = String(memory.type || "").toLowerCase();
  const mime = String(memory.mediaMimeType || "").toLowerCase();
  if (memory.category === "milestones" || type === "milestone") return "milestone";
  if (mime.startsWith("audio/") || ["voice", "audio"].includes(type)) return "voice";
  if (mime.startsWith("video/") || type === "video") return "video";
  if (mime.startsWith("image/") || ["photo", "visual", "image"].includes(type)) return "image";
  if (["text", "written"].includes(type) || memory.category === "reflections") return "written";
  return "story";
}

function MemoryCarousel({ memories }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const activeMemory = memories[activeIndex];
  const kind = activeMemory ? mediaKind(activeMemory) : "story";

  useEffect(() => { setActiveIndex(0); setPlayingVideoId(null); }, [memories]);
  useEffect(() => {
    if (paused || memories.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % memories.length), 2000);
    return () => window.clearInterval(timer);
  }, [memories.length, paused]);

  if (!activeMemory) return <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/70 bg-white/45 px-6 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/20"><Camera size={24} className="mb-2 text-[#4A3AFF]/60" />No memories in this period yet.</div>;

  const background = kind === "voice" ? "bg-gradient-to-br from-[#171344] via-[#302a70] to-[#4A3AFF] text-white" : kind === "milestone" ? "bg-gradient-to-br from-violet-100 via-white/80 to-fuchsia-100 text-slate-900 dark:from-violet-950/50 dark:to-fuchsia-950/30 dark:text-white" : kind === "written" ? "bg-gradient-to-br from-amber-50 via-white/90 to-indigo-50 text-slate-900 dark:from-slate-800 dark:to-indigo-950/50 dark:text-white" : "bg-slate-950 text-white";
  const mediaUrl = activeMemory.mediaUrl || activeMemory.thumbnailUrl;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/70 shadow-inner dark:border-white/10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.article key={activeMemory.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }} className={`relative min-h-[250px] ${background}`}>
          {kind === "image" && mediaUrl ? <>
            <img src={mediaUrl} alt={activeMemory.title || "Memory photo"} className="absolute inset-0 h-full min-h-[250px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">Photo memory</p><h3 className="mt-1 text-lg font-black text-white">{activeMemory.title || "A moment to remember"}</h3>{activeMemory.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">{activeMemory.description}</p>}</div>
          </> : kind === "video" && mediaUrl ? <>
            {playingVideoId === activeMemory.id ? <video src={activeMemory.mediaUrl} poster={activeMemory.thumbnailUrl || undefined} controls autoPlay muted playsInline className="absolute inset-0 h-full min-h-[250px] w-full bg-black object-contain" /> : <>
              {activeMemory.thumbnailUrl ? <img src={activeMemory.thumbnailUrl} alt={activeMemory.title || "Video memory thumbnail"} className="absolute inset-0 h-full min-h-[250px] w-full object-cover" /> : <video src={activeMemory.mediaUrl} poster={activeMemory.thumbnailUrl || undefined} preload="metadata" muted playsInline className="absolute inset-0 h-full min-h-[250px] w-full bg-black object-cover" />}
              {activeMemory.mediaUrl && <button type="button" onClick={() => { setPaused(true); setPlayingVideoId(activeMemory.id); }} aria-label={`Play ${activeMemory.title || "video memory"}`} className="absolute inset-0 z-[1] flex items-center justify-center bg-slate-950/10 text-white"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/55 shadow-lg backdrop-blur"><Play size={24} fill="currentColor" /></span></button>}
            </>}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">Video memory</p><p className="mt-1 text-sm font-extrabold text-white">{activeMemory.title}</p></div>
          </> : kind === "voice" ? <div className="flex min-h-[250px] flex-col justify-between p-5 sm:p-6">
            <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/65">Spoken memory</span><span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white/80">VOICE</span></div>
            <div className="flex items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25"><Mic size={24} /></span><div className="flex flex-1 items-center justify-center gap-1.5" aria-hidden="true">{[15, 27, 19, 34, 23, 39, 18, 31, 14, 25, 36, 20, 30, 16, 26, 12].map((height, index) => <span key={index} className="w-1 rounded-full bg-white/80" style={{ height }} />)}</div></div>
            <div><h3 className="text-base font-black">{activeMemory.title || "Voice memory"}</h3>{activeMemory.description && <p className="mt-1 line-clamp-1 text-xs text-white/70">{activeMemory.description}</p>}{activeMemory.mediaUrl ? <audio controls preload="none" src={activeMemory.mediaUrl} className="mt-3 h-9 w-full" aria-label={`Play ${activeMemory.title || "voice memory"}`} /> : <p className="mt-3 text-xs text-white/65">Audio playback is unavailable for this memory.</p>}</div>
          </div> : kind === "written" ? <div className="flex min-h-[250px] flex-col justify-center p-6 sm:p-8">
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4A3AFF]/10 text-[#4A3AFF]"><FileText size={21} /></span><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3AFF]">Written memory</p><h3 className="mt-2 text-xl font-black leading-tight">{activeMemory.title || "A thought worth keeping"}</h3><p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{activeMemory.description || "This memory has no written details yet."}</p>
          </div> : kind === "milestone" ? <div className="flex min-h-[250px] flex-col justify-center p-6 sm:p-8">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-300"><Trophy size={23} /></span><p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">Life milestone</p><h3 className="mt-2 text-xl font-black leading-tight">{activeMemory.title || "A meaningful milestone"}</h3><p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 opacity-75">{activeMemory.description || "A moment that marked a new chapter."}</p>
          </div> : <div className="flex min-h-[250px] flex-col justify-center p-6 sm:p-8"><span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4A3AFF]/10 text-[#4A3AFF]"><Heart size={22} /></span><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3AFF]">Memory</p><h3 className="mt-2 text-xl font-black">{activeMemory.title || "A moment to remember"}</h3><p className="mt-3 line-clamp-4 text-sm leading-6 opacity-75">{activeMemory.description || "Open your archive to revisit this moment."}</p></div>}
        </motion.article>
      </AnimatePresence>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/45 p-1 text-white backdrop-blur">
        {memories.length > 1 && <span className="px-2 text-[10px] font-bold">{activeIndex + 1} / {memories.length}</span>}
        {memories.length > 1 && <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume memory slides" : "Pause memory slides"} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20">{paused ? <Play size={13} /> : <Pause size={13} />}</button>}
      </div>
      {memories.length > 1 && <>
        <button type="button" onClick={() => { setActiveIndex((activeIndex - 1 + memories.length) % memories.length); setPlayingVideoId(null); }} aria-label="Previous memory" className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/55 text-white opacity-0 shadow transition-opacity hover:bg-slate-950/75 group-hover:opacity-100 group-focus-within:opacity-100"><ChevronLeft size={19} /></button>
        <button type="button" onClick={() => { setActiveIndex((activeIndex + 1) % memories.length); setPlayingVideoId(null); }} aria-label="Next memory" className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/55 text-white opacity-0 shadow transition-opacity hover:bg-slate-950/75 group-hover:opacity-100 group-focus-within:opacity-100"><ChevronRight size={19} /></button>
      </>}
    </div>
  );
}

function PeriodCard({ period, result, side }) {
  const isThen = side === "then";
  const accent = isThen ? "from-sky-100/90 via-indigo-50/70 to-white/60" : "from-fuchsia-100/70 via-violet-50/80 to-white/60";
  const items = result?.memories || [];

  return (
    <section className={`overflow-hidden rounded-[26px] border border-white/70 bg-gradient-to-br ${accent} p-5 shadow-[0_18px_55px_rgba(56,65,125,0.09)] backdrop-blur-xl dark:border-white/10 sm:p-6`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#4A3AFF]">{isThen ? "Then" : "Now"}</p>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{yearRange(period.start, period.end)}</h2>
        </div>
        <div className="rounded-2xl border border-white/75 bg-white/60 p-3 text-[#4A3AFF] shadow-sm dark:border-white/10 dark:bg-slate-900/40"><Repeat2 size={19} /></div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="rounded-full bg-white/65 px-3 py-1.5">{result?.counts.memories ?? "—"} memories</span>
        <span className="rounded-full bg-white/65 px-3 py-1.5">{result?.counts.people ?? "—"} people</span>
        <span className="rounded-full bg-white/65 px-3 py-1.5">{result?.counts.places ?? "—"} places</span>
        <span className="rounded-full bg-white/65 px-3 py-1.5">{result?.counts.milestones ?? "—"} milestones</span>
      </div>
      <div className="min-h-[250px]">
        {!result ? <div className="flex h-64 items-center justify-center text-sm text-slate-400">Compare periods to see your memories here.</div> : <MemoryCarousel memories={items} />}
      </div>
    </section>
  );
}

function CategoryPanel({ side, result, category }) {
  const isThen = side === "then";
  const title = categories.find((item) => item.id === category)?.label || "Highlights";
  const memories = result?.memories || [];
  const people = result?.people || [];
  const places = result?.places || [];
  const filtered = category === "highlights" ? memories : category === "milestones" ? memories.filter((memory) => mediaKind(memory) === "milestone" || memory.category === "milestones") : category === "reflections" ? memories.filter((memory) => mediaKind(memory) === "written" || memory.category === "reflections") : category === "photos" ? memories.filter((memory) => ["image", "video"].includes(mediaKind(memory))) : [];
  const hasRows = category === "people" ? people.length : category === "places" ? places.length : filtered.length;
  return <section className="min-w-0 overflow-hidden rounded-[22px] border border-white/70 bg-white/65 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
    <header className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3.5 dark:border-white/10 sm:px-5"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4A3AFF]">{isThen ? "Then" : "Now"}</p><h3 className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-white">{title}</h3></div><span className="rounded-full bg-[#4A3AFF]/10 px-2.5 py-1 text-xs font-bold text-[#4A3AFF]">{category === "people" ? people.length : category === "places" ? places.length : filtered.length}</span></header>
    {!hasRows ? <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-5 text-center text-xs text-slate-500"><Sparkles size={20} className="text-[#4A3AFF]/50" />No {title.toLowerCase()} recorded in this period.</div> : category === "people" ? <div className="grid gap-2 p-3 sm:grid-cols-2">{people.map((person) => <article key={person.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/25"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-[#4A3AFF] dark:bg-indigo-950">{person.avatar ? <img src={person.avatar} alt="" className="h-full w-full object-cover" /> : <Users size={19} />}</div><div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{person.name || "Connected person"}</p><p className="truncate text-xs text-slate-500">{person.profession || "Part of your story"}</p></div></article>)}</div> : category === "places" ? <div className="grid gap-2 p-3 sm:grid-cols-2">{places.map((place) => <article key={place} className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/25"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600"><MapPin size={19} /></span><p className="min-w-0 truncate text-sm font-extrabold text-slate-900 dark:text-white">{place}</p></article>)}</div> : <div className="max-h-[420px] space-y-2 overflow-y-auto p-3">{filtered.map((memory) => <article key={memory.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-2.5 dark:border-white/10 dark:bg-slate-950/25">{["image", "video"].includes(mediaKind(memory)) && (memory.thumbnailUrl || memory.mediaUrl) ? <img src={memory.thumbnailUrl || memory.mediaUrl} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4A3AFF]/10 text-[#4A3AFF]">{mediaKind(memory) === "voice" ? <Mic size={19} /> : mediaKind(memory) === "milestone" ? <Trophy size={19} /> : <FileText size={19} />}</span>}<div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{memory.title || (mediaKind(memory) === "voice" ? "Voice memory" : "Untitled memory")}</p><p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{memory.description || title}</p>{memory.occurredAt && <p className="mt-1 text-[10px] font-semibold text-slate-400">{new Date(memory.occurredAt).toLocaleDateString()}</p>}</div></article>)}</div>}
  </section>;
}

export default function ThenNowPage() {
  const { firebaseUser, isAuthenticated, getToken } = useAuth();
  const [ranges, setRanges] = useState(defaultRanges);
  const [comparison, setComparison] = useState(null);
  const [activeCategory, setActiveCategory] = useState("highlights");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compare = useCallback(async (nextRanges) => {
    if (!isAuthenticated || !firebaseUser) return;
    if (nextRanges.thenStart > nextRanges.thenEnd || nextRanges.nowStart > nextRanges.nowEnd) {
      setError("Each period needs an end date on or after its start date.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const data = await getThenNowComparisonFromBackend(token, nextRanges);
      setComparison({ then: data.then || emptyPeriod, now: data.now || emptyPeriod });
    } catch (requestError) {
      setError(requestError?.status === 404
        ? "The backend on this address is running an older version without Then & Now. Restart the local backend from spokenOdessie_backend, then compare again."
        : requestError?.message || "We couldn’t compare these dates. Please try again.");
      setComparison(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, firebaseUser, getToken]);

  useEffect(() => { if (isAuthenticated && firebaseUser) compare(ranges); }, [isAuthenticated, firebaseUser, compare]);

  const updateRange = (side, value) => {
    const [startYear, endYear] = value.split("-").map(Number);
    const today = new Date();
    setRanges((current) => ({
      ...current,
      [`${side}Start`]: `${startYear}-01-01`,
      [`${side}End`]: endYear === today.getFullYear() ? dateInput(today) : `${endYear}-12-31`,
    }));
    setComparison(null);
  };
  const swapRanges = () => {
    setRanges((current) => ({ thenStart: current.nowStart, thenEnd: current.nowEnd, nowStart: current.thenStart, nowEnd: current.thenEnd }));
    setComparison(null);
  };

  const stats = useMemo(() => [
    { id: "memories", label: "Memories", icon: Camera, note: "Moments captured" },
    { id: "people", label: "People", icon: Users, note: "People in your stories" },
    { id: "places", label: "Places", icon: MapPin, note: "Places you recorded" },
    { id: "milestones", label: "Milestones", icon: Trophy, note: "Big moments remembered" },
  ], []);

  return (
    <WavesBackground>
      <div className="min-h-screen pb-28">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#4A3AFF]"><Repeat2 size={15} />Your life, over time</p>
                <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Then &amp; Now</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">Compare the people, places, milestones, and memories from two chapters of your life.</p>
              </div>
              <button type="button" onClick={() => compare(ranges)} disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-[#4A3AFF] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#4A3AFF]/25 transition hover:bg-[#3b2dd1] disabled:opacity-60">
                {loading ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={16} />}{loading ? "Comparing…" : "Compare periods"}
              </button>
            </div>

            <section className="mb-5 rounded-[22px] border border-white/75 bg-white/65 p-3 shadow-[0_16px_50px_rgba(56,65,125,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 sm:p-4">
              <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto]">
                <PeriodSelect label="Then" side="then" start={ranges.thenStart} end={ranges.thenEnd} onChange={updateRange} />
                <button type="button" aria-label="Swap Then and Now periods" title="Swap periods" onClick={swapRanges} className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white/85 text-[#4A3AFF] shadow-sm transition hover:rotate-180 hover:border-[#4A3AFF] dark:border-white/10 dark:bg-slate-800"><ArrowLeftRight size={17} /></button>
                <PeriodSelect label="Now" side="now" start={ranges.nowStart} end={ranges.nowEnd} onChange={updateRange} />
                <button type="button" onClick={() => compare(ranges)} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A3AFF] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#4A3AFF]/20 transition hover:bg-[#3b2dd1] disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={15} />}{loading ? "Comparing…" : "Compare"}
                </button>
              </div>
              {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
            </section>

            <section className="mb-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {stats.map(({ id, label, icon: Icon, note }) => {
                const thenCount = comparison?.then?.counts?.[id] ?? "—";
                const nowCount = comparison?.now?.counts?.[id] ?? "—";
                return <article key={id} className="rounded-[18px] border border-white/75 bg-white/65 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 sm:p-3.5">
                  <div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4A3AFF]/10 text-[#4A3AFF]"><Icon size={18} /></span><div className="min-w-0"><p className="truncate text-base font-black text-slate-950 dark:text-white"><span className="text-[#4A3AFF]">{thenCount}</span><span className="mx-1.5 text-xs font-semibold text-slate-300">vs</span>{nowCount}</p><p className="truncate text-xs font-extrabold text-slate-800 dark:text-slate-100">{label}</p></div></div>
                  <p className="mt-2 hidden text-[11px] text-slate-500 sm:block">{note}</p>
                </article>;
              })}
            </section>

            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              {(["then", "now"]).map((side) => <PeriodCard key={side} side={side} period={{ start: ranges[`${side}Start`], end: ranges[`${side}End`] }} result={comparison?.[side]} />)}
            </div>

            <nav aria-label="Comparison categories" className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-white/70 bg-white/50 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
              {categories.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveCategory(id)} aria-pressed={activeCategory === id} className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition sm:text-sm ${activeCategory === id ? "bg-[#4A3AFF] text-white shadow-md shadow-[#4A3AFF]/20" : "text-slate-600 hover:bg-white/80 dark:text-slate-300 dark:hover:bg-white/10"}`}><Icon size={16} />{label}</button>)}
            </nav>
            <div className="grid gap-4 lg:grid-cols-2">
              {(["then", "now"]).map((side) => <CategoryPanel key={`${side}-${activeCategory}`} side={side} result={comparison?.[side]} category={activeCategory} />)}
            </div>
            {loading && <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-slate-500"><Loader2 size={14} className="animate-spin" />Updating comparison</div>}
          </motion.div>
        </main>
      </div>
    </WavesBackground>
  );
}
