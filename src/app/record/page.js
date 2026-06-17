"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Check,
  CheckCircle2,
  Circle,
  Globe,
  ImagePlus,
  Library,
  Lock,
  Mic,
  Pause,
  Play,
  Save,
  Search,
  Square,
  Trash2,
  Type,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { getStoredAlbums } from "@/data/userProfile";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";
import {
  postBackgrounds,
  getBackgroundStyles,
  getBackgroundTextStyles,
  getBackgroundOverlay,
} from "@/data/postBackgrounds";
import { getFontFamily } from "@/data/postFonts";
import FontSelectorModal from "@/components/ui/FontSelectorModal";

const LOCAL_MEMORIES_KEY = "spokenOdysseyLocalMemories";

const formats = [
  { id: "Voice", icon: Mic },
  { id: "Text", icon: Type },
  { id: "Photo", icon: Camera },
  { id: "Video", icon: Video },
];

const audienceOptions = [
  { id: "private", label: "Private", helper: "Only me", icon: Lock },
  { id: "family", label: "Family Circle", helper: "Shared family", icon: Users },
  { id: "public", label: "Public Post", helper: "Community feed", icon: Globe },
];

const waveformBars = [24, 42, 64, 36, 76, 48, 82, 56, 70, 34, 58, 44, 72, 38, 62, 28];

function getInitialFormat() {
  if (typeof window === "undefined") {
    return "Voice";
  }

  const params = new URLSearchParams(window.location.search);
  return resolveFormat(params.get("mode"));
}

function resolveFormat(mode) {
  const normalizedMode = mode?.toLowerCase();
  const aliases = {
    voice: "Voice",
    audio: "Voice",
    record: "Voice",
    text: "Text",
    write: "Text",
    journal: "Text",
    photo: "Photo",
    image: "Photo",
    video: "Video",
  };

  return aliases[normalizedMode] ?? "Voice";
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadLocalMemories() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(LOCAL_MEMORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function RecordMemory() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <RecordMemoryContent />
    </Suspense>
  );
}

function RecordMemoryContent() {
  const searchParams = useSearchParams();
  const [activeFormat, setActiveFormat] = useState(getInitialFormat);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [capturedVoiceSeconds, setCapturedVoiceSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioMimeType, setAudioMimeType] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [mediaDraft, setMediaDraft] = useState(null);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [albumsList, setAlbumsList] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState(["family"]);
  const [notice, setNotice] = useState("");
  const [savedMemories, setSavedMemories] = useState([]);
  const [backgroundId, setBackgroundId] = useState("none");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [fontId, setFontId] = useState("default");
  const [isFontOpen, setIsFontOpen] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    setSavedMemories(loadLocalMemories());
    const list = getStoredAlbums();
    setAlbumsList(list);
    
    const albumParam = searchParams.get("albumId");
    if (albumParam) {
      setSelectedAlbums([albumParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    const nextFormat = resolveFormat(searchParams.get("mode"));
    setActiveFormat(nextFormat);
    setNotice("");
  }, [searchParams]);

  useEffect(() => {
    if (!isRecording) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (activeFormat !== "Voice") return "Ready";
    if (isRecording) return "Recording now";
    if (audioUrl) return `Clip ready: ${formatDuration(capturedVoiceSeconds)}`;
    return "Ready to record";
  }, [activeFormat, audioUrl, capturedVoiceSeconds, isRecording]);

  const selectedSummary = useMemo(() => {
    const albumLabels = selectedAlbums
      .map((albumId) => albumsList.find((album) => album.id === albumId)?.title)
      .filter(Boolean);
    const audienceLabels = selectedAudiences
      .map((audienceId) => audienceOptions.find((option) => option.id === audienceId)?.label)
      .filter(Boolean);

    return [...albumLabels, ...audienceLabels];
  }, [selectedAlbums, selectedAudiences]);

  function selectFormat(format) {
    setActiveFormat(format);
    setNotice("");
    setMediaDraft(null);
    if (format !== "Voice") {
      stopRecordingTracks();
      setIsRecording(false);
    }
  }

  function stopRecordingTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function toggleRecording() {
    setNotice("");

    if (isRecording) {
      recorderRef.current?.stop();
      stopRecordingTracks();
      setIsRecording(false);
      setCapturedVoiceSeconds(Math.max(1, elapsedSeconds));
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setNotice("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const dataUrl = await fileToDataUrl(audioBlob);
        setAudioUrl(dataUrl);
        setAudioMimeType(mimeType);
        setNotice("Voice clip captured. You can play it before saving.");
      };

      setAudioUrl("");
      setAudioMimeType("");
      setElapsedSeconds(0);
      setCapturedVoiceSeconds(0);
      setIsAudioPlaying(false);
      setIsRecording(true);
      recorder.start();
    } catch {
      setNotice("Microphone permission is required to record a voice memory.");
    }
  }

  function toggleAudioPreview() {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (audio.paused) {
      audio.play();
      setIsAudioPlaying(true);
      return;
    }

    audio.pause();
    setIsAudioPlaying(false);
  }

  async function handleMediaFile(file) {
    if (!file) return;

    const expectedType = activeFormat === "Video" ? "video/" : "image/";
    if (!file.type.startsWith(expectedType)) {
      setNotice(`Please choose a valid ${activeFormat.toLowerCase()} file.`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setMediaDraft({
        name: file.name,
        size: file.size,
        type: file.type,
        url: dataUrl,
      });
      setNotice(`${activeFormat} uploaded for preview.`);
    } catch {
      setNotice("Could not read this file. Please try another one.");
    }
  }

  function toggleAlbum(albumId) {
    setSelectedAlbums((current) =>
      current.includes(albumId) ? current.filter((id) => id !== albumId) : [...current, albumId]
    );
  }

  function toggleAudience(audienceId) {
    setSelectedAudiences((current) =>
      current.includes(audienceId) ? current.filter((id) => id !== audienceId) : [...current, audienceId]
    );
  }

  function clearForm() {
    setTitle("");
    setStoryText("");
    setMediaDraft(null);
    setAudioUrl("");
    setAudioMimeType("");
    setCapturedVoiceSeconds(0);
    setElapsedSeconds(0);
    setIsAudioPlaying(false);
    setBackgroundId("none");
    setFontId("default");
  }

  function saveMemory() {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setNotice("Add a title before saving.");
      return;
    }

    if (activeFormat === "Voice" && isRecording) {
      setNotice("Stop recording before saving.");
      return;
    }

    if (activeFormat === "Voice" && !audioUrl) {
      setNotice("Start and stop a voice clip before saving.");
      return;
    }

    if (activeFormat === "Text" && storyText.trim().length < 3) {
      setNotice("Add a short memory before saving.");
      return;
    }

    if ((activeFormat === "Photo" || activeFormat === "Video") && !mediaDraft) {
      setNotice(`Upload a ${activeFormat.toLowerCase()} before saving.`);
      return;
    }

    if (!selectedAlbums.length && !selectedAudiences.length) {
      setNotice("Choose at least one album or audience option.");
      return;
    }

    const localMemory = {
      id: `local-${Date.now()}`,
      title: cleanTitle,
      type: activeFormat,
      description: storyText.trim(),
      createdAt: new Date().toISOString(),
      displayDate: new Date().toLocaleString(),
      albums: selectedAlbums,
      audiences: selectedAudiences,
      privacy: selectedAudiences.includes("public") ? "Public" : selectedAudiences.includes("family") ? "Family Circle" : "Private",
      audio: activeFormat === "Voice" ? { url: audioUrl, mimeType: audioMimeType, seconds: capturedVoiceSeconds } : null,
      media: activeFormat === "Photo" || activeFormat === "Video" ? mediaDraft : null,
      backgroundId: activeFormat === "Text" ? backgroundId : "none",
      fontId: activeFormat === "Text" ? fontId : "default",
      ownerId: "alexander",
    };

    const nextMemories = [localMemory, ...savedMemories].slice(0, 20);

    try {
      localStorage.setItem(LOCAL_MEMORIES_KEY, JSON.stringify(nextMemories));
      setSavedMemories(nextMemories);
      setNotice("Memory successfully created!");
      clearForm();
    } catch {
      setNotice("This file is too large for local storage. Try a smaller video/photo for testing.");
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--background)] pb-28 animation-fade-in">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 py-5 backdrop-blur-md">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[var(--brand)]">Create</p>
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white">Record Memory</h1>
        </div>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95"
          aria-label="Close record screen"
        >
          <X size={18} className="text-stone-600 dark:text-stone-300" />
        </Link>
      </header>

      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm">
        <div className="grid grid-cols-4 gap-1.5">
          {formats.map((format) => {
            const Icon = format.icon;
            const selected = activeFormat === format.id;

            return (
              <button
                key={format.id}
                onClick={() => selectFormat(format.id)}
                className={`flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg text-xs font-black transition ${
                  selected ? "bg-[var(--brand)] text-white shadow-sm" : "text-stone-500 hover:bg-[var(--surface-hover)]"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{format.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {notice && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-4 py-3 text-sm font-bold text-[var(--brand)]">
          <CheckCircle2 size={17} />
          <span>{notice}</span>
        </div>
      )}

      <main className="mt-5 flex flex-1 flex-col gap-5">
        <section className="min-h-[360px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          {activeFormat === "Voice" && (
            <VoiceRecorder
              audioRef={audioRef}
              audioUrl={audioUrl}
              capturedVoiceSeconds={capturedVoiceSeconds}
              elapsedSeconds={elapsedSeconds}
              isAudioPlaying={isAudioPlaying}
              isRecording={isRecording}
              statusLabel={statusLabel}
              onAudioEnded={() => setIsAudioPlaying(false)}
              onDelete={() => {
                setAudioUrl("");
                setCapturedVoiceSeconds(0);
                setIsAudioPlaying(false);
              }}
              onPreview={toggleAudioPreview}
              onToggle={toggleRecording}
            />
          )}

          {activeFormat === "Text" && (
            <TextComposer
              value={storyText}
              onChange={setStoryText}
              backgroundId={backgroundId}
              onOpenCustomizer={() => setIsCustomizerOpen(true)}
              fontId={fontId}
              onOpenFontSelector={() => setIsFontOpen(true)}
            />
          )}

          {(activeFormat === "Photo" || activeFormat === "Video") && (
            <MediaComposer activeFormat={activeFormat} mediaDraft={mediaDraft} onFile={handleMediaFile} onRemove={() => setMediaDraft(null)} />
          )}
        </section>

        <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <label className="block border-b border-[var(--border)] pb-4">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-stone-500">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              placeholder="Give it a title"
              className="w-full bg-transparent text-base font-black text-[var(--ink)] outline-none placeholder:text-stone-400 dark:text-white"
            />
          </label>

          <div className="mt-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
              <Library size={14} />
              Add to Album
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {albumsList.slice(0, 5).map((album) => (
                <SelectableChip key={album.id} selected={selectedAlbums.includes(album.id)} onClick={() => toggleAlbum(album.id)}>
                  {album.title}
                </SelectableChip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-stone-500">Audience</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {audienceOptions.map((option) => (
                <AudienceCard
                  key={option.id}
                  option={option}
                  selected={selectedAudiences.includes(option.id)}
                  onClick={() => toggleAudience(option.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-[var(--background)] p-3">
            <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-stone-500">Selected</p>
            {selectedSummary.length ? (
              <div className="flex flex-wrap gap-2">
                {selectedSummary.map((item) => (
                  <span key={item} className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-black text-white">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-stone-500">No album or audience selected.</p>
            )}
          </div>
        </section>

        <button
          onClick={saveMemory}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-4 text-base font-black text-white shadow-lg shadow-black/10 transition active:scale-[0.98]"
        >
          <Save size={18} />
          Save Memory
        </button>

        <SavedPreview memories={savedMemories} />
      </main>
      </div>

      <BackgroundCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        selectedId={backgroundId}
        onSelect={setBackgroundId}
      />

      <FontSelectorModal
        isOpen={isFontOpen}
        onClose={() => setIsFontOpen(false)}
        selectedId={fontId}
        onSelect={setFontId}
      />

      <style jsx>{`
        @keyframes voice-wave {
          0%,
          100% {
            transform: scaleY(0.35);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function VoiceRecorder({
  audioRef,
  audioUrl,
  capturedVoiceSeconds,
  elapsedSeconds,
  isAudioPlaying,
  isRecording,
  statusLabel,
  onAudioEnded,
  onDelete,
  onPreview,
  onToggle,
}) {
  const displayTime = isRecording
    ? formatDuration(elapsedSeconds)
    : capturedVoiceSeconds > 0
      ? formatDuration(capturedVoiceSeconds)
      : "00:00";

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center p-6 text-center">
      <div
        className={`relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border ${
          isRecording ? "border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)]" : "border-[var(--border)] bg-[var(--background)] text-stone-500"
        }`}
      >
        {isRecording && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full border border-[var(--brand)]/25" />
            <span className="absolute inset-3 animate-ping rounded-full border border-[var(--brand)]/20 [animation-duration:2.4s]" />
          </>
        )}
        <div className="scale-125">{resolveGlass3DIcon("voice")}</div>
      </div>

      <p className={`mb-2 text-xs font-black uppercase tracking-wide ${isRecording ? "text-[var(--brand)]" : "text-stone-500"}`}>
        {statusLabel}
      </p>
      <h2 className="mb-5 text-4xl font-black tabular-nums tracking-tight text-[var(--ink)] dark:text-white">{displayTime}</h2>

      <div className="mb-7 flex h-24 w-full max-w-md items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4">
        {waveformBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={`w-2 origin-center rounded-full ${isRecording || audioUrl ? "bg-[var(--brand)]" : "bg-stone-300 dark:bg-stone-600"}`}
            style={{
              height: `${height}%`,
              animation: isRecording ? `voice-wave ${0.65 + (index % 5) * 0.12}s ease-in-out infinite` : "none",
              animationDelay: `${index * 0.055}s`,
              transform: isRecording || audioUrl ? undefined : "scaleY(0.35)",
            }}
          />
        ))}
      </div>

      {audioUrl && (
        <div className="mb-5 w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
          <audio ref={audioRef} src={audioUrl} onEnded={onAudioEnded} className="hidden" />
          <div className="flex items-center gap-3">
            <button
              onClick={onPreview}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white"
              aria-label={isAudioPlaying ? "Pause voice preview" : "Play voice preview"}
            >
              {isAudioPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-black text-[var(--ink)] dark:text-white">Recorded voice clip</p>
              <p className="text-xs font-bold text-stone-500">{formatDuration(capturedVoiceSeconds)}</p>
            </div>
            <button onClick={onDelete} className="flex h-10 w-10 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50" aria-label="Delete voice preview">
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className={`flex h-18 w-18 items-center justify-center rounded-full text-white shadow-xl transition active:scale-95 ${
          isRecording ? "bg-rose-600 shadow-rose-600/20" : "bg-[var(--brand)] shadow-black/10"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={28} />}
      </button>
      <p className="mt-4 text-xs font-bold text-stone-500">
        {isRecording ? "Tap stop when your memory is complete." : audioUrl ? "Play the clip or record again." : "Tap once to start recording."}
      </p>
    </div>
  );
}

function TextComposer({ value, onChange, backgroundId, onOpenCustomizer, fontId, onOpenFontSelector }) {
  const hasBg = backgroundId && backgroundId !== "none";
  const bgStyle = getBackgroundStyles(backgroundId);
  const textStyle = {
    ...getBackgroundTextStyles(backgroundId),
    fontFamily: getFontFamily(fontId),
  };
  const overlay = getBackgroundOverlay(backgroundId);

  // Determine font classes based on text length
  const textLength = value.length;
  const fontClass = hasBg
    ? textLength < 80
      ? "text-2xl font-black text-center"
      : textLength < 180
        ? "text-lg font-extrabold text-center"
        : "text-base font-semibold text-center"
    : "text-base font-semibold leading-7";

  return (
    <div
      className={`relative flex min-h-[360px] flex-col p-5 transition-all duration-500 ${
        hasBg ? "justify-center items-center rounded-lg" : ""
      }`}
      style={hasBg ? bgStyle : undefined}
    >
      {hasBg && overlay}

      {!hasBg && (
        <label className="mb-3 text-xs font-black uppercase tracking-wide text-stone-500 z-10">
          Your memory
        </label>
      )}

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={hasBg ? "Write your memory here..." : "Write the scene, the people, and why this moment matters."}
        className={`w-full min-h-72 resize-none bg-transparent outline-none placeholder:text-stone-400/80 dark:text-white z-10 transition-all ${fontClass} ${
          hasBg ? "flex items-center justify-center pt-24" : "flex-1"
        }`}
        style={hasBg ? textStyle : undefined}
        autoFocus
      />

      <div className="w-full mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4 z-10">
        <button
          type="button"
          onClick={onOpenCustomizer}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-black text-stone-700 hover:bg-[var(--surface-hover)] hover:border-[var(--brand)] transition active:scale-95"
        >
          🎨 Customize Background
        </button>
        <button
          type="button"
          onClick={onOpenFontSelector}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-black text-stone-700 hover:bg-[var(--surface-hover)] hover:border-[var(--brand)] transition active:scale-95"
        >
          🔤 Fonts
        </button>
      </div>
    </div>
  );
}

function BackgroundCustomizerModal({ isOpen, onClose, selectedId, onSelect }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Islamic", "Funny", "Sad", "Angry", "Aesthetic", "Gradient"];

  const filteredBackgrounds = useMemo(() => {
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      return postBackgrounds.filter(
        (bg) =>
          bg.name.toLowerCase().includes(query) ||
          bg.category.toLowerCase().includes(query) ||
          bg.mood.toLowerCase().includes(query) ||
          bg.keywords.some((kw) => kw.toLowerCase().includes(query))
      );
    }
    if (activeTab === "All") {
      return postBackgrounds.filter((bg) => bg.featured || bg.id === "none");
    }
    return postBackgrounds.filter((bg) => bg.category === activeTab);
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-300 sm:max-w-2xl sm:rounded-2xl md:max-h-[75vh]">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h3 className="text-lg font-black text-[var(--ink)] dark:text-white">Customize Background</h3>
            <p className="text-xs font-semibold text-stone-500">Choose a theme that fits your memory</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background)] text-stone-500 hover:bg-[var(--border)] transition active:scale-95"
            aria-label="Close customizer"
          >
            <X size={18} />
          </button>
        </header>

        {/* Search Box */}
        <div className="px-5 pt-3 pb-1.5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search backgrounds (e.g. happy, rain, gold, dark, sunset)..."
              className="w-full h-10 rounded-full border border-[var(--border)] bg-[var(--background)] pl-10 pr-10 text-xs font-bold outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition"
            />
            <span className="absolute left-3.5 text-stone-400">
              <Search size={14} />
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 h-6 w-6 flex items-center justify-center rounded-full hover:bg-[var(--border)] text-stone-400 hover:text-stone-700 transition"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-[var(--border)] bg-[var(--background)] px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveTab(cat);
                setSearchQuery(""); // Clear search on tab switch
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition ${
                activeTab === cat && !searchQuery
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--surface)] text-stone-600 hover:bg-[var(--surface-hover)] border border-[var(--border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {filteredBackgrounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-bold text-stone-500">No backgrounds match your search.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-black text-[var(--brand)] hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredBackgrounds.map((bg) => {
                const isSelected = selectedId === bg.id;
                return (
                  <button
                    key={bg.id}
                    onClick={() => {
                      onSelect(bg.id);
                      onClose();
                    }}
                    className={`group relative flex h-24 flex-col justify-between overflow-hidden rounded-xl p-3 text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? "ring-4 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--surface)]"
                        : "border border-[var(--border)] hover:border-[var(--brand)]/50 hover:shadow-md"
                    }`}
                    style={bg.id === "none" ? bg.previewStyle : bg.containerStyle}
                  >
                    {bg.id !== "none" && getBackgroundOverlay(bg.id)}
                    
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-white z-20">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}

                    <span className="text-xl font-bold opacity-80 self-end select-none pointer-events-none z-10">
                      {bg.overlayEmoji ? bg.overlayEmoji[0] : ""}
                    </span>
                    
                    <span 
                      className="text-xs font-black truncate max-w-full z-10"
                      style={bg.id === "none" ? undefined : bg.textStyle}
                    >
                      {bg.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaComposer({ activeFormat, mediaDraft, onFile, onRemove }) {
  const isVideo = activeFormat === "Video";

  return (
    <div className="p-4">
      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFile(event.dataTransfer.files?.[0]);
        }}
        className="flex min-h-[328px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-5 text-center transition hover:border-[var(--brand)] hover:bg-[var(--brand)]/5"
      >
        {mediaDraft ? (
          <div className="w-full">
            <div className="mx-auto mb-4 max-h-[280px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--ink)]">
              {isVideo ? (
                <video src={mediaDraft.url} controls className="max-h-[280px] w-full object-contain" />
              ) : (
                <img src={mediaDraft.url} alt={mediaDraft.name} className="max-h-[280px] w-full object-contain" />
              )}
            </div>
            <p className="truncate text-sm font-black text-[var(--ink)] dark:text-white">{mediaDraft.name}</p>
            <p className="mt-1 text-xs font-bold text-stone-500">{Math.max(1, Math.round(mediaDraft.size / 1024))} KB</p>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onRemove();
              }}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-xs font-black text-rose-600"
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              {isVideo ? <Video size={32} className="text-[var(--brand)]" /> : <ImagePlus size={32} className="text-[var(--brand)]" />}
            </div>
            <h3 className="text-lg font-black text-[var(--ink)] dark:text-white">Upload {activeFormat}</h3>
            <p className="mt-1 text-xs font-bold text-stone-500">Tap to browse or drop a file here</p>
            <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-black text-white">
              <Upload size={15} />
              Choose File
            </span>
          </>
        )}
        <input
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          className="hidden"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </label>
    </div>
  );
}

function SelectableChip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition ${
        selected ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
      }`}
    >
      {selected ? <Check size={14} /> : <Circle size={14} />}
      {children}
    </button>
  );
}

function AudienceCard({ option, selected, onClick }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left transition ${
        selected ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)]"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-white/15" : "bg-[var(--brand-soft)] text-[var(--brand)]"}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-black">{option.label}</p>
        <p className={`truncate text-xs font-bold ${selected ? "text-white/70" : "text-stone-500"}`}>{option.helper}</p>
      </div>
    </button>
  );
}

function SavedPreview({ memories }) {
  if (!memories.length) return null;

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black">Local Testing Records</h2>
        <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-black text-stone-500">{memories.length}</span>
      </div>
      <div className="space-y-3">
        {memories.slice(0, 4).map((memory) => (
          <article key={memory.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{memory.title}</p>
                <p className="mt-1 text-xs font-bold text-stone-500">
                  {memory.type} · {memory.displayDate}
                </p>
              </div>
              <span className="rounded-full bg-[var(--brand)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                Local
              </span>
            </div>
            {memory.type === "Text" && (
              <div 
                className="mt-3 p-4 rounded-lg flex flex-col items-center justify-center min-h-[120px] text-center relative overflow-hidden"
                style={getBackgroundStyles(memory.backgroundId)}
              >
                {getBackgroundOverlay(memory.backgroundId)}
                <p 
                  className="text-sm font-extrabold italic leading-relaxed z-10"
                  style={{
                    ...getBackgroundTextStyles(memory.backgroundId),
                    fontFamily: getFontFamily(memory.fontId),
                  }}
                >
                  "{memory.description}"
                </p>
              </div>
            )}
            {memory.audio?.url && <audio src={memory.audio.url} controls className="mt-3 w-full" />}
            {memory.media?.url && memory.type === "Photo" && <img src={memory.media.url} alt={memory.title} className="mt-3 max-h-52 w-full rounded-lg object-cover" />}
            {memory.media?.url && memory.type === "Video" && <video src={memory.media.url} controls className="mt-3 max-h-52 w-full rounded-lg bg-[var(--ink)] object-contain" />}
          </article>
        ))}
      </div>
    </section>
  );
}
