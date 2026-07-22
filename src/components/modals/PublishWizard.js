"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mic, PenTool, Image as ImageIcon, Award, Check, Lock, Users, Globe, Smile, Frown, Heart, Cloud, Clock, Eye, Zap, ArrowLeft, Star, Upload, Loader2, Play, Pause, Square, RotateCcw, Volume2 } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthProvider";
import { createMemoryOnBackend } from "@/services/backend";

const MOODS = [
  { label: "Happy", icon: Smile },
  { label: "Peaceful", icon: Cloud },
  { label: "Grateful", icon: Heart },
  { label: "Nostalgic", icon: Clock },
  { label: "Reflective", icon: Eye },
  { label: "Proud", icon: Award },
  { label: "Sad", icon: Frown },
  { label: "Excited", icon: Zap },
];

export default function PublishWizard() {
  const { firebaseUser, getToken} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [memoryType, setMemoryType] = useState(""); // "voice", "written", "visual", "milestone"
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [tags, setTags] = useState(""); // Simple string for now
  const [shares, setShares] = useState({ family: true, friends: true, self: false });
  
  // Voice Recording & Playback States
  const [recordingState, setRecordingState] = useState("idle"); // "idle" | "recording" | "paused" | "stopped"
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1, 1.25, 1.5, 1.75, 2
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  
  // Written specific state
  const [writtenContent, setWrittenContent] = useState("");

  // Milestone specific state
  const [significance, setSignificance] = useState(0);
  const [lifeChapter, setLifeChapter] = useState("");

  // Visual specific state
  const [visualFiles, setVisualFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);

  // Voice recording handlers using MediaRecorder API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingState("recording");

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone. Please enable microphone permissions in your browser.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
      clearInterval(recordingTimerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState === "recording" || recordingState === "paused")) {
      mediaRecorderRef.current.stop();
      setRecordingState("stopped");
      clearInterval(recordingTimerRef.current);
    }
  };

  const resetRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
    clearInterval(recordingTimerRef.current);
    setRecordingState("idle");
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.playbackRate = playbackSpeed;
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setVisualFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setVisualFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };
  const removeFile = (indexToRemove) => {
    setVisualFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  useEffect(() => {
    const handleOpen = () => {
      setStep(1);
      setMemoryType("");
      setTitle("");
      setWrittenContent("");
      setMood("");
      setVisibility("Private");
      setTags("");
      setVisualFiles([]);
      resetRecording();
      setIsOpen(true);
    };
    window.addEventListener("openPublishModal", handleOpen);
    return () => window.removeEventListener("openPublishModal", handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => setIsOpen(false);
  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const getStepTitle = () => {
    if (step === 1) return "Record a Memory";
    if (step === 2) return "Capture";
    if (step === 3) return "Add Details";
    if (step === 4) return "Review & Publish";
    return "";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 animate-fade-in p-4 sm:p-6 backdrop-blur-none">
      <div 
        className="w-full max-w-[700px] bg-white rounded-3xl shadow-2xl flex flex-col relative overflow-hidden animate-scale-up max-h-[90vh] min-h-[min(500px,90vh)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {step !== 5 && (
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-stone-100 text-stone-500 hover:bg-stone-200 rounded-full transition-colors z-10"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        )}

        {/* Header & Stepper */}
        {step !== 5 && (
          <div className="px-8 pt-8 pb-4 flex flex-col items-center relative border-b border-stone-100">
            <div className="w-full flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-bold text-stone-900">{getStepTitle()}</h2>
                <p className="text-[13px] font-medium text-stone-400">Step {step} of 4</p>
              </div>
            </div>
            
            {/* Stepper Dots (Absolute centered) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={clsx(
                    "rounded-full transition-all duration-300",
                    s === step ? "w-6 h-1.5 bg-[#4A3AFF]" : 
                    s < step ? "w-1.5 h-1.5 bg-[#4A3AFF]/40" : 
                    "w-1.5 h-1.5 bg-stone-200"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          
          {/* STEP 1: SELECT TYPE */}
          {step === 1 && (
            <div className="animate-fade-in h-full flex flex-col">
              <p className="text-stone-500 mb-6 font-medium">What kind of memory would you like to capture?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                
                {/* Option 1 */}
                <button
                  onClick={() => setMemoryType("voice")}
                  className={clsx(
                    "text-left p-6 rounded-[20px] border-2 transition-all flex flex-col relative overflow-hidden",
                    memoryType === "voice" ? "border-[#4A3AFF] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(240,242,255,0.8)_100%)] shadow-[inset_18px_0_26px_rgba(145,137,255,0.12),_0_8px_20px_-4px_rgba(74,58,255,0.15)] ring-1 ring-[#4A3AFF]" : "border-stone-100 hover:border-[#A5B4FC] bg-white shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] hover:shadow-[inset_18px_0_26px_rgba(145,137,255,0.05)]"
                  )}
                >
                  <div className="w-12 h-12 rounded-[14px] bg-[#4A3AFF] text-white flex items-center justify-center mb-4">
                    <Mic size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Voice Recording</h3>
                  <p className="text-[13px] text-stone-500 mb-6">Record your story in your own voice</p>
                  <div className={clsx("flex items-center gap-1 text-[#4A3AFF] font-bold text-xs mt-auto transition-opacity", memoryType === "voice" ? "opacity-100" : "opacity-0")}>
                    <Check size={14} strokeWidth={3} /> Selected
                  </div>
                </button>

                {/* Option 2 */}
                <button
                  onClick={() => setMemoryType("written")}
                  className={clsx(
                    "text-left p-6 rounded-[20px] border-2 transition-all flex flex-col relative overflow-hidden",
                    memoryType === "written" ? "border-[#4A3AFF] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(240,242,255,0.8)_100%)] shadow-[inset_18px_0_26px_rgba(145,137,255,0.12),_0_8px_20px_-4px_rgba(74,58,255,0.15)] ring-1 ring-[#4A3AFF]" : "border-stone-100 hover:border-[#A5B4FC] bg-white shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] hover:shadow-[inset_18px_0_26px_rgba(145,137,255,0.05)]"
                  )}
                >
                  <div className="w-12 h-12 rounded-[14px] bg-[#4A3AFF] text-white flex items-center justify-center mb-4">
                    <PenTool size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Written Journal</h3>
                  <p className="text-[13px] text-stone-500 mb-6">Write your thoughts and memories</p>
                  <div className={clsx("flex items-center gap-1 text-[#4A3AFF] font-bold text-xs mt-auto transition-opacity", memoryType === "written" ? "opacity-100" : "opacity-0")}>
                    <Check size={14} strokeWidth={3} /> Selected
                  </div>
                </button>

                {/* Option 3 */}
                <button
                  onClick={() => setMemoryType("visual")}
                  className={clsx(
                    "text-left p-6 rounded-[20px] border-2 transition-all flex flex-col relative overflow-hidden",
                    memoryType === "visual" ? "border-[#4A3AFF] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(240,242,255,0.8)_100%)] shadow-[inset_18px_0_26px_rgba(145,137,255,0.12),_0_8px_20px_-4px_rgba(74,58,255,0.15)] ring-1 ring-[#4A3AFF]" : "border-stone-100 hover:border-[#A5B4FC] bg-white shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] hover:shadow-[inset_18px_0_26px_rgba(145,137,255,0.05)]"
                  )}
                >
                  <div className="w-12 h-12 rounded-[14px] bg-[#4A3AFF] text-white flex items-center justify-center mb-4">
                    <ImageIcon size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Visual Memory</h3>
                  <p className="text-[13px] text-stone-500 mb-6">Upload photos with captions</p>
                  <div className={clsx("flex items-center gap-1 text-[#4A3AFF] font-bold text-xs mt-auto transition-opacity", memoryType === "visual" ? "opacity-100" : "opacity-0")}>
                    <Check size={14} strokeWidth={3} /> Selected
                  </div>
                </button>

                {/* Option 4 */}
                <button
                  onClick={() => setMemoryType("milestone")}
                  className={clsx(
                    "text-left p-6 rounded-[20px] border-2 transition-all flex flex-col relative overflow-hidden",
                    memoryType === "milestone" ? "border-[#4A3AFF] bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(240,242,255,0.8)_100%)] shadow-[inset_18px_0_26px_rgba(145,137,255,0.12),_0_8px_20px_-4px_rgba(74,58,255,0.15)] ring-1 ring-[#4A3AFF]" : "border-stone-100 hover:border-[#A5B4FC] bg-white shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] hover:shadow-[inset_18px_0_26px_rgba(145,137,255,0.05)]"
                  )}
                >
                  <div className="w-12 h-12 rounded-[14px] bg-[#4A3AFF] text-white flex items-center justify-center mb-4">
                    <Award size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Life Milestone</h3>
                  <p className="text-[13px] text-stone-500 mb-6">Mark a significant life moment</p>
                  <div className={clsx("flex items-center gap-1 text-[#4A3AFF] font-bold text-xs mt-auto transition-opacity", memoryType === "milestone" ? "opacity-100" : "opacity-0")}>
                    <Check size={14} strokeWidth={3} /> Selected
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* STEP 2: CAPTURE (VOICE) */}
          {step === 2 && memoryType === "voice" && (
            <div className="animate-fade-in flex flex-col items-center justify-center h-full py-8">
              {recordingState === "idle" && (
                <>
                  <p className="text-stone-500 font-medium mb-10">
                    Click the microphone to start recording your story in your voice.
                  </p>
                  <div className="w-full max-w-[300px] border-t-2 border-dashed border-stone-200 mb-12"></div>
                  <h1 className="text-5xl font-black tracking-tight mb-8 text-stone-900">00:00</h1>
                  <button 
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white shadow-[0_8px_20px_-4px_rgba(74,58,255,0.4)] flex items-center justify-center transition-all mb-4 active:scale-95 cursor-pointer"
                  >
                    <Mic size={32} strokeWidth={2.5} />
                  </button>
                  <p className="text-stone-400 font-medium text-sm">Tap to start recording</p>
                </>
              )}

              {(recordingState === "recording" || recordingState === "paused") && (
                <>
                  <p className="text-stone-500 font-medium mb-8">
                    {recordingState === "recording" ? "Recording in progress..." : "Recording paused"}
                  </p>
                  
                  <div className="flex items-center justify-center gap-1.5 h-10 mb-8 min-w-[220px]">
                    {[...Array(18)].map((_, i) => (
                      <div 
                        key={i} 
                        className={clsx(
                          "w-1.5 rounded-full transition-all duration-200",
                          recordingState === "recording" ? "bg-[#4A3AFF] animate-pulse" : "bg-amber-400"
                        )}
                        style={{ 
                          height: recordingState === "recording" ? `${Math.max(10, Math.random() * 45)}px` : "12px", 
                          animationDelay: `${i * 0.1}s` 
                        }}
                      />
                    ))}
                  </div>

                  <h1 className={clsx("text-5xl font-black tracking-tight mb-8 transition-colors", recordingState === "recording" ? "text-[#4A3AFF]" : "text-amber-500")}>
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {recordingState === "recording" ? (
                      <button 
                        onClick={pauseRecording}
                        className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center justify-center transition-all active:scale-95"
                        title="Pause Recording"
                      >
                        <Pause size={24} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button 
                        onClick={resumeRecording}
                        className="w-14 h-14 rounded-full bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white shadow-md flex items-center justify-center transition-all active:scale-95"
                        title="Resume Recording"
                      >
                        <Play size={24} fill="currentColor" />
                      </button>
                    )}

                    <button 
                      onClick={stopRecording}
                      className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md flex items-center justify-center transition-all active:scale-95"
                      title="Stop Recording"
                    >
                      <Square size={22} fill="currentColor" />
                    </button>
                  </div>

                  <p className="text-stone-400 font-medium text-xs">
                    {recordingState === "recording" ? "Tap pause or stop when finished" : "Tap play to resume or stop to complete"}
                  </p>
                </>
              )}

              {recordingState === "stopped" && audioUrl && (
                <div className="w-full max-w-md bg-white border border-[#C7D2FE]/60 rounded-3xl p-6 shadow-md flex flex-col items-center">
                  <audio 
                    ref={audioPlayerRef} 
                    src={audioUrl} 
                    onEnded={() => setIsPlayingAudio(false)} 
                    onTimeUpdate={(e) => setAudioCurrentTime(e.target.currentTime)} 
                    onLoadedMetadata={(e) => setAudioDuration(e.target.duration)} 
                  />

                  <div className="flex items-center gap-2 text-[#10b981] font-bold text-xs uppercase tracking-widest mb-4">
                    <Check size={14} strokeWidth={3} /> Recording Ready
                  </div>

                  <h2 className="text-3xl font-black text-stone-900 mb-6">
                    {Math.floor(audioCurrentTime / 60)}:{(Math.floor(audioCurrentTime) % 60).toString().padStart(2, '0')} / {Math.floor((audioDuration || recordingTime) / 60)}:{(Math.floor(audioDuration || recordingTime) % 60).toString().padStart(2, '0')}
                  </h2>

                  {/* Dynamic Playback Waveform */}
                  <div className="w-full flex items-center gap-1 h-12 bg-[#EEF2FF] rounded-2xl px-4 mb-6 overflow-hidden">
                    {[...Array(24)].map((_, i) => (
                      <div 
                        key={i} 
                        className={clsx(
                          "flex-1 rounded-full transition-all duration-300",
                          (i / 24) <= (audioCurrentTime / (audioDuration || recordingTime || 1))
                            ? "bg-[#4A3AFF]"
                            : "bg-[#C7D2FE]"
                        )}
                        style={{ height: `${Math.max(20, (Math.sin(i) * 0.5 + 0.5) * 100)}%` }}
                      />
                    ))}
                  </div>

                  {/* Play & Speed Controls */}
                  <div className="flex items-center justify-between w-full mb-6 gap-4">
                    <button 
                      onClick={togglePlayAudio}
                      className="h-12 w-12 rounded-2xl bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                    </button>

                    {/* Speed Selector (1x, 1.25x, 1.5x, 1.75x, 2x) */}
                    <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
                      {[1, 1.25, 1.5, 1.75, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={clsx(
                            "px-2.5 py-1 rounded-xl text-xs font-bold transition-all",
                            playbackSpeed === spd
                              ? "bg-[#4A3AFF] text-white shadow-xs"
                              : "text-stone-600 hover:text-stone-900"
                          )}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={resetRecording}
                      className="h-10 w-10 rounded-2xl border border-stone-200 text-stone-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
                      title="Re-record Audio"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  <p className="text-stone-400 text-xs font-medium text-center">
                    Listen back or adjust playback speed. Click continue when ready.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CAPTURE (WRITTEN) */}
          {step === 2 && memoryType === "written" && (
            <div className="animate-fade-in flex flex-col h-full">
              <div className="flex justify-between items-end mb-4">
                <p className="text-stone-500 font-medium text-[15px]">Write your memory freely — don&apos;t worry about perfection.</p>
                <span className="text-stone-400 text-xs font-bold whitespace-nowrap">5 words</span>
              </div>
              <textarea 
                className="flex-1 w-full border-2 border-[#4A3AFF] rounded-3xl p-6 text-stone-700 resize-none focus:outline-none focus:ring-4 focus:ring-[#4A3AFF]/10 shadow-[0_4px_20px_-4px_rgba(74,58,255,0.08)] transition-all min-h-[240px]"
                placeholder="Start writing your memory here..."
              ></textarea>
            </div>
          )}

          {/* STEP 2: CAPTURE (VISUAL) */}
          {step === 2 && memoryType === "visual" && (
            <div className="animate-fade-in flex flex-col h-full py-2">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                  "w-full rounded-[32px] flex flex-col transition-all relative overflow-hidden",
                  visualFiles.length === 0 ? "h-full min-h-[300px] border-2 border-dashed flex-col items-center justify-center p-8 cursor-pointer" : "min-h-[120px] border-2 border-dashed p-6 items-center justify-center mb-6",
                  isDragging ? "border-[#4A3AFF] bg-[#EEF2FF] scale-[1.02]" : "border-[#C7D2FE] bg-white hover:border-[#4A3AFF] hover:bg-[#F8F9FF]"
                )}
                onClick={() => visualFiles.length === 0 && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  multiple 
                  accept="image/*,video/*,image/heic" 
                  className="hidden" 
                />
                
                {visualFiles.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-[#4A3AFF] rounded-[18px] flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(74,58,255,0.4)] mb-6 transition-transform">
                      <ImageIcon size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Drop photos or videos here</h3>
                    <p className="text-[15px] text-stone-400 font-medium mb-8">or click to browse your files</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-6 py-2.5 rounded-[14px] font-bold text-[#4A3AFF] border-2 border-[#4A3AFF] hover:bg-[#EEF2FF] transition-all bg-white shadow-sm flex items-center gap-2"
                    >
                      <Upload size={16} strokeWidth={3} /> Browse Files
                    </button>
                    <p className="text-[11px] font-bold text-stone-300 mt-8 uppercase tracking-widest">JPEG, PNG, HEIC, MP4 up to 50MB each</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#EEF2FF] text-[#4A3AFF] rounded-full flex items-center justify-center mb-3">
                      <Upload size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 mb-1">Add more files</h3>
                    <p className="text-xs font-medium text-stone-400 mb-4">Drag and drop or click below</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl font-bold text-[#4A3AFF] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all text-xs flex items-center gap-2"
                    >
                      <Upload size={14} strokeWidth={3} /> Browse Files
                    </button>
                  </div>
                )}
              </div>

              {visualFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pb-4 px-1">
                  {visualFiles.map((file, idx) => {
                    const isVideo = file.type.startsWith('video/');
                    const previewUrl = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-stone-200 shadow-sm bg-stone-100">
                        {isVideo ? (
                          <video src={previewUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => removeFile(idx)}
                            className="w-8 h-8 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                          >
                            <X size={16} strokeWidth={3} />
                          </button>
                        </div>
                        {isVideo && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                            Video
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CAPTURE (MILESTONE) */}
          {step === 2 && memoryType === "milestone" && (
            <div className="animate-fade-in space-y-8 py-2">
              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-2">Milestone Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Graduated College, Bought a House..."
                  className="w-full border border-stone-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-[#4A3AFF] focus:ring-2 focus:ring-[#4A3AFF]/20 transition-all font-medium text-stone-700 shadow-sm placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-3 flex items-center">
                  Significance <span className="text-stone-400 ml-1">({significance}/5)</span>
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => setSignificance(star)}
                      className={clsx(
                        "w-12 h-12 rounded-[14px] flex items-center justify-center border-2 transition-all",
                        significance >= star 
                          ? "border-[#F59E0B] text-[#F59E0B] bg-amber-50" 
                          : "border-stone-100 text-stone-300 hover:border-stone-200"
                      )}
                    >
                      <Star size={24} fill={significance >= star ? "currentColor" : "none"} strokeWidth={significance >= star ? 0 : 2} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-3">Life Chapter</label>
                <div className="flex flex-wrap gap-2.5">
                  {["Early Childhood", "School Years", "Young Adult", "Career", "Family Life", "Later Years"].map((chapter) => (
                    <button
                      key={chapter}
                      onClick={() => setLifeChapter(chapter)}
                      className={clsx(
                        "px-4 py-2 rounded-full border text-[13px] font-bold transition-all",
                        lifeChapter === chapter 
                          ? "border-[#4A3AFF] text-[#4A3AFF] bg-[#EEF2FF] shadow-sm" 
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      )}
                    >
                      {chapter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              
              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-2">Memory Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your memory a name..."
                  className="w-full border border-stone-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-[#4A3AFF] focus:ring-2 focus:ring-[#4A3AFF]/20 transition-all font-medium text-stone-700 shadow-sm placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-3">Mood</label>
                <div className="flex flex-wrap gap-2.5">
                  {MOODS.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setMood(m.label)}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-bold transition-all",
                        mood === m.label 
                          ? "border-[#4A3AFF] bg-white text-stone-900 shadow-sm ring-1 ring-[#4A3AFF]" 
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      )}
                    >
                      <m.icon size={16} strokeWidth={2.5} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-3">Visibility</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "Private", icon: Lock, label: "Private", sub: "Only you" },
                    { id: "Family", icon: Users, label: "Family", sub: "Your circle" },
                    { id: "Public", icon: Globe, label: "Public", sub: "Everyone" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVisibility(v.id)}
                      className={clsx(
                        "flex flex-col items-center justify-center p-4 rounded-[20px] border-2 transition-all",
                        visibility === v.id 
                          ? "border-[#4A3AFF] bg-[#EEF2FF] text-[#4A3AFF] shadow-sm" 
                          : "border-stone-100 bg-white text-stone-500 hover:border-stone-200"
                      )}
                    >
                      <v.icon size={24} strokeWidth={2.5} className="mb-2" />
                      <span className="font-bold text-stone-900 mb-0.5 text-[15px]">{v.label}</span>
                      <span className="text-xs font-medium opacity-80">{v.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-stone-500 mb-2">Tags</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add a tag, press Enter..."
                  className="w-full border border-stone-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-[#4A3AFF] focus:ring-2 focus:ring-[#4A3AFF]/20 transition-all font-medium text-stone-700 shadow-sm placeholder:font-normal"
                />
              </div>

            </div>
          )}

          {/* STEP 4: REVIEW & PUBLISH */}
          {step === 4 && (
            <div className="animate-fade-in flex flex-col h-full">
              <p className="text-stone-500 mb-6 font-medium text-[15px]">Review your memory before publishing.</p>
              
              {/* Preview Card */}
              <div className="border border-[#C7D2FE] rounded-[24px] p-6 mb-8 bg-white shadow-[0_4px_20px_-4px_rgba(74,58,255,0.08)] relative overflow-hidden flex-1">
                <div className="flex items-center gap-2 mb-4 text-[#4A3AFF]">
                  {memoryType === "written" ? <PenTool size={18} strokeWidth={2.5}/> : 
                   memoryType === "voice" ? <Mic size={18} strokeWidth={2.5} /> :
                   memoryType === "visual" ? <ImageIcon size={18} strokeWidth={2.5} /> :
                   <Award size={18} strokeWidth={2.5} />}
                  <span className="text-[11px] font-bold tracking-widest uppercase">{memoryType || "VOICE"} MEMORY</span>
                </div>
                
                <h3 className="text-2xl font-bold text-stone-900 mb-6">
                  {title || "Untitled Memory"}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3">
                  {mood && (
                    <span className="px-4 py-2 rounded-full border border-[#4A3AFF]/30 bg-white text-[#4A3AFF] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Smile size={14} strokeWidth={2.5} /> {mood}
                    </span>
                  )}
                  <span className="px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-600 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    {visibility === "Private" ? <Lock size={14} /> : visibility === "Family" ? <Users size={14} /> : <Globe size={14} />} 
                    {visibility}
                  </span>
                  {tags && tags.split(" ").map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className="text-[#4A3AFF] text-[13px] font-bold">#{tag.replace('#', '')}</span>
                  ))}
                </div>
              </div>

              {/* Share Options */}
              <div className="bg-[#F8F9FF] border-t border-b sm:border border-[#E5E9FF] sm:rounded-2xl p-6 -mx-8 sm:mx-0">
                <p className="font-bold text-stone-900 mb-4 text-[15px]">After publishing, share with:</p>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={shares.family} onChange={(e) => setShares({...shares, family: e.target.checked})} className="peer w-5 h-5 appearance-none rounded-[6px] border-2 border-[#4A3AFF] bg-[#4A3AFF] checked:bg-[#4A3AFF] transition-all" />
                      <Check size={14} strokeWidth={3.5} className="absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-stone-700 font-bold text-sm">Family Circle</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={shares.friends} onChange={(e) => setShares({...shares, friends: e.target.checked})} className="peer w-5 h-5 appearance-none rounded-[6px] border-2 border-[#4A3AFF] bg-[#4A3AFF] checked:bg-[#4A3AFF] transition-all" />
                      <Check size={14} strokeWidth={3.5} className="absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-stone-700 font-bold text-sm">Close Friends</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={shares.self} onChange={(e) => setShares({...shares, self: e.target.checked})} className="peer w-5 h-5 appearance-none rounded-[6px] border-2 border-[#4A3AFF] bg-[#4A3AFF] checked:bg-[#4A3AFF] transition-all" />
                      <Check size={14} strokeWidth={3.5} className="absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-stone-700 font-bold text-sm">Keep to myself</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <div className="animate-scale-up flex flex-col items-center justify-center h-full py-12 text-center">
              
              {/* Green Checkmark Graphic */}
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-pulse-slow">
                  <Check size={48} strokeWidth={3.5} className="text-white" />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-2 right-0 text-pink-400 animate-float"><Heart size={20} fill="currentColor" /></div>
                <div className="absolute top-6 -left-3 text-amber-400 animate-float" style={{ animationDelay: '0.5s' }}><Star size={20} fill="currentColor" /></div>
              </div>

              {/* Status Header */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-xs mb-3 border border-emerald-200 shadow-xs">
                <Check size={14} strokeWidth={3} />
                <span>New memory successfully created!</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Memory Saved & Published</h3>
              <p className="text-stone-500 text-sm font-medium max-w-md mb-8">
                Your memory has been added to your album, archive, and family timeline.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleClose}
                  className="px-6 py-3 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white rounded-[14px] font-bold transition-all shadow-md active:scale-95 text-xs cursor-pointer"
                >
                  Done
                </button>
                <button 
                  onClick={() => {
                    setStep(1);
                    setMemoryType("");
                    setTitle("");
                    setMood("");
                  }}
                  className="px-6 py-3 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-[14px] font-bold transition-all active:scale-95 shadow-sm text-xs cursor-pointer"
                >
                  Publish Another
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer (Not shown on Step 5) */}
        {step !== 5 && (
          <div className="px-8 py-5 flex items-center justify-between bg-white rounded-b-3xl">
            {step === 1 ? (
              <button 
                onClick={handleClose}
                className="px-6 py-2.5 rounded-[14px] font-bold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-all active:scale-95 shadow-sm"
              >
                Cancel
              </button>
            ) : (
              <button 
                onClick={handleBack}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-[14px] font-bold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft size={16} strokeWidth={2.5} /> Back
              </button>
            )}

            <div className="flex items-center gap-4">
              {step === 3 && <span className="text-[13px] font-bold text-[#10b981] flex items-center gap-1"><Check size={14} strokeWidth={3}/> Draft saved</span>}
              
              {step === 4 ? (
                <button 
                  onClick={async () => {
                    setIsPublishing(true);
                    
                    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
                    const pathAlbumId = currentPath.startsWith("/albums/") ? currentPath.split("/")[2] : "";
                    const targetAlbum = pathAlbumId || "career-craft";
                    const formattedDuration = recordingTime > 0 
                      ? `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}` 
                      : "01:30";

                    const newMem = {
                      id: `mem-${Date.now()}`,
                      title: title.trim() || (memoryType === "voice" ? "Voice Note Memory" : "Untitled Memory"),
                      description: writtenContent?.trim() || (memoryType === "written" ? "Written memory reflection" : "Voice recording memory"),
                      type: memoryType === "visual" ? "Photo" : memoryType === "written" ? "Written" : "Voice",
                      date: new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                      albumId: targetAlbum,
                      albums: [targetAlbum],
                      privacy: visibility || "Private",
                      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : ["memory"],
                      duration: formattedDuration,
                      audioUrl: audioUrl || undefined,
                      image: visualFiles.length > 0 ? URL.createObjectURL(visualFiles[0]) : undefined
                    };

                    try {
                      // Save local memory
                      const saved = localStorage.getItem("spokenOdysseyLocalMemories");
                      const existing = saved ? JSON.parse(saved) : [];
                      localStorage.setItem("spokenOdysseyLocalMemories", JSON.stringify([newMem, ...existing]));

                      if (firebaseUser) {
                        const token = await getToken();
                        const formData = new FormData();
                        formData.append("type", memoryType);
                        if (title) formData.append("title", title);
                        if (writtenContent) formData.append("description", writtenContent);
                        if (mood) formData.append("mood", mood);
                        if (visibility) formData.append("visibility", visibility);
                        if (tags) formData.append("tags", tags);
                        
                        if (memoryType === "voice" && audioBlob) {
                          formData.append("audio", audioBlob, `voice_recording_${Date.now()}.webm`);
                        }
                        if (memoryType === "visual" && visualFiles.length > 0) {
                          visualFiles.forEach((file) => formData.append("media", file));
                        }
                        await createMemoryOnBackend(token, formData).catch(() => null);
                      }
                    } catch (err) {
                      console.error("Failed to publish memory", err);
                    } finally {
                      setIsPublishing(false);
                      window.dispatchEvent(new CustomEvent("memoryPublished", { detail: { memory: newMem } }));
                      setStep(5);
                    }
                  }}
                  disabled={isPublishing}
                  className="px-8 py-2.5 rounded-[14px] font-bold text-white bg-[#4A3AFF] hover:bg-[#3b2dd1] shadow-md shadow-[#4A3AFF]/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPublishing ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : "Publish Memory"}
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  disabled={step === 1 && !memoryType}
                  className={clsx(
                    "px-8 py-2.5 rounded-[14px] font-bold text-white transition-all active:scale-95 flex items-center gap-1.5",
                    (step === 1 && !memoryType) ? "bg-[#A5B4FC] cursor-not-allowed" : "bg-[#4A3AFF] hover:bg-[#3b2dd1] shadow-md shadow-[#4A3AFF]/30"
                  )}
                >
                  Continue <ArrowLeft size={16} strokeWidth={2.5} className="rotate-180" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
