"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  Loader2,
  Calendar,
  BookOpen,
  ChevronDown,
  Tag,
  Award,
  FolderHeart,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { getStoredAlbums } from "@/data/userProfile";
import { useAuth } from "@/context/AuthProvider";
import WavesBackground from "@/components/layout/WavesBackground";
import { getAlbumsFromBackend, createMemoryOnBackend, getBackendErrorMessage } from "@/services/backend";
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

const toneEmojis = {
  Joyful: "😊",
  Nostalgic: "😌",
  Grateful: "🙏",
  Reflective: "🤔",
  Solemn: "🙏",
  Excited: "🎉"
};

const formats = [
  { id: "Voice", label: "Spoken", icon: Mic },
  { id: "Visual", label: "Visual", icon: Camera },
  { id: "Text", label: "Written", icon: Type },
  { id: "Milestone", label: "Milestone", icon: Award },
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
    spoken: "Voice",
    text: "Text",
    write: "Text",
    journal: "Text",
    written: "Text",
    photo: "Visual",
    image: "Visual",
    video: "Visual",
    visual: "Visual",
    milestone: "Milestone",
    award: "Milestone",
    achievement: "Milestone",
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
  const router = useRouter();
  const [activeFormat, setActiveFormat] = useState(getInitialFormat);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [capturedVoiceSeconds, setCapturedVoiceSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioMimeType, setAudioMimeType] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [photoDrafts, setPhotoDrafts] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoDrafts, setVideoDrafts] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [albumsList, setAlbumsList] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState("family");
  const [mediaFile, setMediaFile] = useState(null);
  const [notice, setNotice] = useState("");

  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [lifeChapter, setLifeChapter] = useState("");
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [mood, setMood] = useState("Joyful");
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const [tags, setTags] = useState("");
  
  const handleClose = (e) => {
    e.preventDefault();
    const albumParam = searchParams.get("albumId");
    if (albumParam) {
      router.push(`/albums/${albumParam}`);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/feed");
    }
  };
  const [savedMemories, setSavedMemories] = useState([]);
  const [backgroundId, setBackgroundId] = useState("none");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [fontId, setFontId] = useState("default");
  const [isFontOpen, setIsFontOpen] = useState(false);

  const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { firebaseUser, isAuthenticated } = useAuth();

  const albumDropdownRef = useRef(null);
  const audienceDropdownRef = useRef(null);
  const chapterDropdownRef = useRef(null);
  const toneDropdownRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (albumDropdownRef.current && !albumDropdownRef.current.contains(event.target)) {
        setIsAlbumDropdownOpen(false);
      }
      if (audienceDropdownRef.current && !audienceDropdownRef.current.contains(event.target)) {
        setIsAudienceDropdownOpen(false);
      }
      if (chapterDropdownRef.current && !chapterDropdownRef.current.contains(event.target)) {
        setIsChapterDropdownOpen(false);
      }
      if (toneDropdownRef.current && !toneDropdownRef.current.contains(event.target)) {
        setIsToneDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSavedMemories(loadLocalMemories());
    
    const albumParam = searchParams.get("albumId");
    if (albumParam) {
      setSelectedAlbumId(albumParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (isAuthenticated && firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const backendAlbums = await getAlbumsFromBackend(token);
          const mapped = backendAlbums.map(album => ({
            id: album.id,
            title: album.title,
            privacy: album.privacy || "Private",
          }));
          setAlbumsList(mapped);
        } catch (error) {
          console.warn("Failed to load albums for record page, using local fallback:", getBackendErrorMessage(error));
          setAlbumsList(getStoredAlbums());
        }
      } else {
        setAlbumsList(getStoredAlbums());
      }
    };
    fetchAlbums();
  }, [isAuthenticated, firebaseUser]);

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
    const summary = [];
    if (selectedAlbumId) {
      const albumTitle = albumsList.find((album) => album.id === selectedAlbumId)?.title;
      if (albumTitle) summary.push(albumTitle);
    }
    const audOpt = audienceOptions.find((opt) => opt.id === selectedAudience);
    if (audOpt) summary.push(audOpt.label);
    return summary;
  }, [selectedAlbumId, selectedAudience, albumsList]);

  function selectFormat(format) {
    setActiveFormat(format);
    setNotice("");
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

  async function handleMultipleMediaFiles(files) {
    if (!files || files.length === 0) return;

    const validFiles = [];
    const validDrafts = [];

    for (const file of files) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setNotice("Please choose only valid image or video files.");
        continue;
      }
      validFiles.push(file);

      try {
        const dataUrl = await fileToDataUrl(file);
        validDrafts.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: dataUrl,
        });
      } catch {
        setNotice("Could not read one or more files. Please try again.");
      }
    }

    setPhotoFiles(prev => [...prev, ...validFiles]);
    setPhotoDrafts(prev => [...prev, ...validDrafts]);
    setNotice(`${validFiles.length} file(s) added.`);
  }

  function clearForm() {
    setTitle("");
    setStoryText("");
    setPhotoDrafts([]);
    setPhotoFiles([]);
    setVideoDrafts([]);
    setVideoFiles([]);
    setAudioUrl("");
    setAudioMimeType("");
    setCapturedVoiceSeconds(0);
    setElapsedSeconds(0);
    setIsAudioPlaying(false);
    setBackgroundId("none");
    setFontId("default");
    setSelectedAlbumId("");
    setSelectedAudience("family");
    setDate(new Date().toISOString().substring(0, 10));
    setLifeChapter("");
    setMood("Joyful");
    setTags("");
    setIsSaving(false);
  }

  async function saveMemory() {
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

    if (activeFormat === "Visual" && photoFiles.length === 0) {
      setNotice("Upload a photo or video before saving.");
      return;
    }

    if (!selectedAlbumId && !selectedAudience) {
      setNotice("Choose an album or audience option.");
      return;
    }

    setIsSaving(true);
    setNotice("Saving memory...");

    const privacyMap = {
      private: "Private",
      family: "Family Circle",
      public: "Public"
    };
    const mappedPrivacy = privacyMap[selectedAudience] || "Private";

    // Map unified format to backend format types safely
    const backendType = activeFormat === "Visual" ? (photoFiles.some(f => f.type?.startsWith("video")) ? "Video" : "Photo") : activeFormat === "Milestone" ? "Text" : activeFormat;

    if (isAuthenticated && firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        const formData = new FormData();
        formData.append("title", cleanTitle);
        formData.append("description", storyText.trim());
        formData.append("privacy", mappedPrivacy);
        formData.append("type", backendType);
        formData.append("status", "published");
        if (selectedAlbumId) {
          formData.append("albumId", selectedAlbumId);
        }
        formData.append("occurredAt", date ? new Date(date).toISOString() : new Date().toISOString());

        // Custom metadata fields
        formData.append("mood", mood);
        if (lifeChapter) {
          formData.append("chapter", lifeChapter);
        }
        if (tags) {
          formData.append("tags", tags);
        }
        
        if (activeFormat === "Text") {
          formData.append("backgroundId", backgroundId);
          formData.append("fontId", fontId);
        }

        if (activeFormat === "Voice" && audioUrl) {
          const audioFile = dataURLtoFile(audioUrl, `recording-${Date.now()}.webm`);
          formData.append("media", audioFile);
        } else if (activeFormat === "Visual" && photoFiles.length > 0) {
          photoFiles.forEach(file => {
            formData.append("media", file);
          });
        }

        await createMemoryOnBackend(token, formData);
        setNotice("Memory successfully saved to cloud!");
        clearForm();
        setIsSaving(false);
        return;
      } catch (error) {
        console.error("Failed to save memory to backend:", error);
        setNotice(`Cloud save failed: ${getBackendErrorMessage(error)}. Attempting local fallback.`);
      }
    }

    const localMemory = {
      id: `local-${Date.now()}`,
      title: cleanTitle,
      type: activeFormat,
      description: storyText.trim(),
      createdAt: new Date().toISOString(),
      displayDate: new Date().toLocaleString(),
      occurredAt: date,
      mood: mood,
      chapter: lifeChapter,
      tags: tags,
      albums: selectedAlbumId ? [selectedAlbumId] : [],
      albumId: selectedAlbumId || null,
      audiences: [selectedAudience],
      privacy: mappedPrivacy,
      audio: activeFormat === "Voice" ? { url: audioUrl, mimeType: audioMimeType, seconds: capturedVoiceSeconds } : null,
      media: activeFormat === "Visual" ? photoDrafts : null,
      backgroundId: activeFormat === "Text" ? backgroundId : "none",
      fontId: activeFormat === "Text" ? fontId : "default",
      ownerId: "alexander",
    };

    const nextMemories = [localMemory, ...savedMemories].slice(0, 20);

    try {
      localStorage.setItem(LOCAL_MEMORIES_KEY, JSON.stringify(nextMemories));
      setSavedMemories(nextMemories);
      setNotice("Memory saved locally!");
      clearForm();
    } catch {
      setNotice("This file is too large for local storage. Try a smaller video/photo for testing.");
    }
    setIsSaving(false);
  }

  return (
    <WavesBackground>
      <div className="flex w-full max-w-none mx-auto flex-col pb-28">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 py-4 px-4 sm:px-6 backdrop-blur-md">
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-stone-100 dark:hover:bg-stone-850 transition active:scale-95 cursor-pointer text-stone-600 dark:text-stone-300"
            aria-label="Close record screen"
          >
            <X size={24} />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-black tracking-tight text-[var(--ink)] dark:text-white leading-none">New Memory</h1>
            <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 mt-1">Preserve this moment forever</p>
          </div>
          <div className="w-10 h-10" />
        </header>

         <div className="w-full max-w-5xl flex-1 flex flex-col px-4 sm:px-6 mx-auto mt-6 space-y-6">
          
          {notice && (
            <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-bold ${
              notice.toLowerCase().includes("success") || notice.toLowerCase().includes("saved locally")
                ? "border-emerald-250 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-400"
                : "border-[var(--brand)]/25 bg-[var(--brand)]/10 text-[var(--brand)]"
            }`}>
              <CheckCircle2 size={17} />
              <span>{notice}</span>
            </div>
          )}

          {/* Top Form Preview Card (Voice / Media) */}
          {(activeFormat === "Voice" || activeFormat === "Visual") && (
            <div className="glass-panel overflow-hidden rounded-[2rem] shadow-xl backdrop-blur-xl">
              {activeFormat === "Voice" && (
                <VoiceRecorder
                  audioRef={audioRef}
                  audioUrl={audioUrl}
                  capturedVoiceSeconds={capturedVoiceSeconds}
                  elapsedSeconds={elapsedSeconds}
                  isAudioPlaying={isAudioPlaying}
                  isRecording={isRecording}
                  statusLabel={isRecording ? "Recording your memory..." : audioUrl ? "Voice clip ready" : "Tap to start recording"}
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

              {activeFormat === "Visual" && (
                <MediaComposer
                  activeFormat={activeFormat}
                  mediaDrafts={photoDrafts}
                  onFiles={handleMultipleMediaFiles}
                  onRemoveItem={(index) => {
                    setPhotoDrafts(prev => prev.filter((_, i) => i !== index));
                    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  onClearAll={() => {
                    setPhotoDrafts([]);
                    setPhotoFiles([]);
                  }}
                />
              )}
            </div>
          )}

          {/* Tell Us About This Moment Card */}
          <div className="glass-panel p-6 space-y-6 text-left rounded-[2rem] shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-black text-[var(--ink)] dark:text-white leading-none">Tell us about this moment</h2>
            
            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wide text-stone-500">Title</label>
              <div className="glass-input p-4">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  type="text"
                  placeholder="The Day Everything Changed"
                  className="w-full bg-transparent text-sm font-bold text-stone-850 dark:text-white outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wide text-stone-500">Description</label>
              <div className="glass-input p-4 relative">
                <textarea
                  value={storyText}
                  onChange={(event) => setStoryText(event.target.value)}
                  placeholder="Describe the significant moment..."
                  className="w-full min-h-[120px] bg-transparent text-sm font-semibold text-stone-750 dark:text-stone-300 outline-none resize-none placeholder:text-stone-400/80 leading-relaxed"
                />
                <div className="border-t border-[#eff0ff] dark:border-stone-800 mt-2 pt-2 flex justify-between text-[10px] text-stone-400 dark:text-stone-500 font-bold">
                  <span>{storyText.length} characters</span>
                  <span>{Math.ceil(storyText.split(/\s+/).filter(Boolean).length / 200)} min read</span>
                </div>
              </div>
            </div>

            {/* Date Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wide text-stone-500">Date</label>
              <div className="flex items-center gap-3 glass-input p-4">
                <span className="text-stone-400 shrink-0"><Calendar size={18} /></span>
                <input
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  type="date"
                  className="w-full bg-transparent text-sm font-bold text-stone-800 dark:text-white outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Life Chapter Dropdown */}
            <div className="space-y-1.5 relative" ref={chapterDropdownRef}>
              <label className="text-xs font-black uppercase tracking-wide text-stone-500">Life Chapter</label>
              <button
                type="button"
                onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                className="w-full flex items-center justify-between p-4 glass-input hover:border-[var(--brand)] transition-all text-sm font-bold text-stone-750 dark:text-stone-300 cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={18} className="text-stone-400" />
                  <span>{lifeChapter || "Select Chapter..."}</span>
                </div>
                <ChevronDown size={18} className="opacity-50" />
              </button>
              {isChapterDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#162033] border border-stone-200 dark:border-stone-850 p-2 shadow-2xl z-50 max-h-56 overflow-y-auto">
                  {["Childhood", "Education & Youth", "Career Path", "Love & Family", "Adventures & Travel", "Reflections & Wisdom", "Milestones"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setLifeChapter(cat);
                        setIsChapterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${
                        lifeChapter === cat 
                          ? "bg-[var(--brand-soft)] text-[var(--brand)]" 
                          : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tone & Privacy Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tone Selector */}
            <div className="relative" ref={toneDropdownRef}>
              <button
                type="button"
                onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                className="w-full flex items-center justify-between p-4 glass-panel hover:border-[var(--brand)] transition-all text-sm font-bold text-stone-700 dark:text-stone-300 cursor-pointer shadow-sm rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  <span>{toneEmojis[mood] || "😊"}</span>
                  <span>{mood}</span>
                </div>
                <ChevronDown size={16} className="opacity-50" />
              </button>
              {isToneDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#162033] border border-stone-250 dark:border-stone-850 p-2 shadow-2xl z-50">
                  {Object.keys(toneEmojis).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setMood(t);
                        setIsToneDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 ${
                        mood === t 
                          ? "bg-[var(--brand-soft)] text-[var(--brand)]" 
                          : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{toneEmojis[t]}</span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Selector */}
            <div className="relative" ref={audienceDropdownRef}>
              <button
                type="button"
                onClick={() => setIsAudienceDropdownOpen(!isAudienceDropdownOpen)}
                className="w-full flex items-center justify-between p-4 glass-panel hover:border-[var(--brand)] transition-all text-sm font-bold text-stone-700 dark:text-stone-300 cursor-pointer shadow-sm rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const opt = audienceOptions.find((o) => o.id === selectedAudience);
                    const Icon = opt?.icon || Lock;
                    return (
                      <>
                        <Icon size={16} className="text-stone-400" />
                        <span>{opt?.label || "Private"}</span>
                      </>
                    );
                  })()}
                </div>
                <ChevronDown size={16} className="opacity-50" />
              </button>
              {isAudienceDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#162033] border border-stone-250 dark:border-stone-850 p-2 shadow-2xl z-50">
                  {audienceOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedAudience(opt.id);
                          setIsAudienceDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-3 ${
                          selectedAudience === opt.id
                            ? "bg-[var(--brand-soft)] text-[var(--brand)] font-bold"
                            : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon size={16} className="text-stone-400" />
                        <div className="flex-1 text-left">
                          <span className="text-sm font-bold block leading-none">{opt.label}</span>
                          <span className="text-[10px] opacity-60 font-medium block mt-0.5">{opt.helper}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Select Albums Dropdown */}
          <div className="relative" ref={albumDropdownRef}>
            <button
              type="button"
              onClick={() => setIsAlbumDropdownOpen(!isAlbumDropdownOpen)}
              className="w-full flex items-center justify-between p-4 glass-panel hover:border-[var(--brand)] transition-all text-sm font-bold text-stone-750 dark:text-stone-300 cursor-pointer shadow-sm rounded-2xl"
            >
              <div className="flex items-center gap-2.5">
                <FolderHeart size={18} className="text-stone-400" />
                <span>
                  {selectedAlbumId
                    ? albumsList.find((a) => a.id === selectedAlbumId)?.title || "Selected Album"
                    : "Select Albums"}
                </span>
              </div>
              <ChevronDown size={18} className={`opacity-50 transition-transform ${isAlbumDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isAlbumDropdownOpen && (
              <div className="rounded-2xl border border-[#d6d4ff] bg-white/60 dark:bg-stone-900/60 mt-2 overflow-hidden shadow-xl divide-y divide-[#eff0ff] dark:divide-stone-800 text-left z-50">
                {albumsList.map((alb) => (
                  <button
                    key={alb.id}
                    type="button"
                    onClick={() => {
                      setSelectedAlbumId(alb.id);
                      setIsAlbumDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 text-sm font-bold transition cursor-pointer ${
                      selectedAlbumId === alb.id
                        ? "bg-[#5e4eff]/10 text-[#5e4eff]"
                        : "text-stone-750 dark:text-stone-300 hover:bg-[#eff0ff]/40"
                    }`}
                  >
                    {alb.title}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbumId("abc");
                    setIsAlbumDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-sm font-bold transition cursor-pointer ${
                    selectedAlbumId === "abc" ? "bg-[#5e4eff]/10 text-[#5e4eff]" : "text-stone-750 dark:text-stone-300 hover:bg-[#eff0ff]/40"
                  }`}
                >
                  Abc
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbumId("xyz");
                    setIsAlbumDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-sm font-bold transition cursor-pointer ${
                    selectedAlbumId === "xyz" ? "bg-[#5e4eff]/10 text-[#5e4eff]" : "text-stone-750 dark:text-stone-300 hover:bg-[#eff0ff]/40"
                  }`}
                >
                  Xyz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbumId("123");
                    setIsAlbumDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-sm font-bold transition cursor-pointer ${
                    selectedAlbumId === "123" ? "bg-[#5e4eff]/10 text-[#5e4eff]" : "text-stone-750 dark:text-stone-300 hover:bg-[#eff0ff]/40"
                  }`}
                >
                  123
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbumId("");
                    setIsAlbumDropdownOpen(false);
                  }}
                  className="w-full text-left px-5 py-3.5 text-sm font-bold text-stone-500 hover:bg-[#eff0ff]/40 transition cursor-pointer"
                >
                  None
                </button>
              </div>
            )}
          </div>

          {/* Tags Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-black uppercase tracking-wide text-stone-500">Tags</label>
            <div className="flex items-center gap-2.5 glass-input p-4">
              <span className="text-stone-400"><Tag size={16} /></span>
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                type="text"
                placeholder="Tags..."
                className="w-full bg-transparent text-sm font-bold text-stone-850 dark:text-white outline-none placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Preserve & Archive Bottom Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={saveMemory}
              disabled={isSaving}
              className="flex-1 flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#5e4eff] dark:bg-[#6366f1] text-white shadow-lg shadow-[#5e4eff]/25 hover:bg-[#4b3ae6] active:scale-[0.98] transition font-black cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Preserving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Preserve
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 flex h-13 items-center justify-center gap-2 rounded-2xl border border-stone-200/60 dark:border-stone-800/60 bg-white/40 dark:bg-stone-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-50 active:scale-[0.98] transition font-black cursor-pointer"
            >
              Archive
            </button>
          </div>

          {/* Local testing preview list */}
          <SavedPreview memories={savedMemories} />
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

        {/* CSS Keyframes for voice-wave */}
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
    </WavesBackground>
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
  const [currentTime, setCurrentTime] = useState(0);

  const displayTime = isRecording
    ? formatDuration(elapsedSeconds)
    : isAudioPlaying
      ? formatDuration(Math.max(0, Math.ceil(capturedVoiceSeconds - currentTime)))
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
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => {
              onAudioEnded();
              setCurrentTime(0);
            }} 
            onTimeUpdate={(e) => {
              setCurrentTime(e.currentTarget.currentTime);
            }}
            className="hidden" 
          />
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
              <p className="text-xs font-bold text-stone-550">
                {isAudioPlaying 
                  ? `${formatDuration(Math.max(0, Math.ceil(capturedVoiceSeconds - currentTime)))} remaining`
                  : formatDuration(capturedVoiceSeconds)}
              </p>
            </div>
            <button 
              onClick={() => {
                setCurrentTime(0);
                onDelete();
              }} 
              className="flex h-10 w-10 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50" 
              aria-label="Delete voice preview"
            >
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

function MediaComposer({ activeFormat, mediaDrafts, onFiles, onRemoveItem, onClearAll }) {
  const fileInputRef = useRef(null);

  return (
    <div className="p-4">
      {mediaDrafts && mediaDrafts.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mediaDrafts.map((draft, idx) => {
              const isDraftVideo = draft.type?.startsWith("video/") || draft.url?.startsWith("data:video/") || draft.name?.endsWith(".mp4") || draft.name?.endsWith(".mov") || draft.name?.endsWith(".webm");
              return (
                <div key={idx} className="relative group rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden shadow-sm aspect-[4/3] sm:aspect-square flex flex-col justify-between">
                  <div className="flex-1 w-full bg-[var(--ink)] flex items-center justify-center overflow-hidden relative">
                    {isDraftVideo ? (
                      <video src={draft.url} controls className="h-full w-full object-contain" />
                    ) : (
                      <img src={draft.url} alt={draft.name} className="h-full w-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        onRemoveItem(idx);
                      }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-rose-600 text-white transition z-10"
                      aria-label="Remove item"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-2 border-t border-[var(--border)] bg-[var(--surface)] text-left">
                    <p className="truncate text-xs font-bold text-[var(--ink)] dark:text-white">{draft.name}</p>
                    <p className="text-[10px] font-medium text-stone-500">{Math.max(1, Math.round(draft.size / 1024))} KB</p>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[4/3] sm:aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mb-2">
                <ImagePlus size={20} />
              </div>
              <span className="text-xs font-bold text-stone-550">Add More</span>
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-250 bg-white dark:bg-stone-850 px-3.5 text-xs font-black text-stone-600 dark:text-stone-300 hover:bg-stone-50 transition active:scale-95"
            >
              Clear All
            </button>
          </div>
        </div>
      ) : (
        <label
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const files = Array.from(event.dataTransfer.files || []);
            onFiles(files);
          }}
          className="flex min-h-[328px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-5 text-center transition hover:border-[var(--brand)] hover:bg-[var(--brand)]/5"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <ImagePlus size={32} className="text-[var(--brand)]" />
          </div>
          <h3 className="text-lg font-black text-[var(--ink)] dark:text-white">Upload Photos / Videos</h3>
          <p className="mt-1 text-xs font-bold text-stone-550">Tap to browse or drop files here (multiple supported)</p>
          <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-xs font-black text-white">
            <Upload size={15} />
            Choose Files
          </span>
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        multiple
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          onFiles(files);
        }}
      />
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

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
