"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const WAVEFORM_BARS = [
  15, 25, 40, 20, 50, 70, 45, 30, 15, 35, 
  60, 85, 90, 50, 20, 30, 55, 75, 40, 15, 
  25, 45, 65, 80, 50, 30, 20, 40, 70, 85, 
  50, 25, 15, 30, 20
];

export default function VoicePlayer({ memory }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [animFrame, setAnimFrame] = useState(0);

  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  
  // Synthesizer Web Audio API references
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const timeTrackerIdRef = useRef(null);

  // Compute duration in seconds
  const duration = useMemo(() => {
    if (memory.audio?.seconds) return memory.audio.seconds;
    if (memory.duration) {
      const parts = memory.duration.split(":");
      if (parts.length === 2) {
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    }
    return 15; // default fallback seconds
  }, [memory]);

  // Format time (e.g. 0:00)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progressPercent = useMemo(() => {
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  // Audio setup (using user uploaded clip if available)
  useEffect(() => {
    const url = memory.audio?.url || "";
    if (url) {
      const audio = new Audio(url);
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audioRef.current = null;
      };
    }
    return undefined;
  }, [memory]);

  // Web Audio Synth setup
  const startSynth = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime); // base low A
      
      // Extremely low, warm, pleasant hum
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn("Could not start audio synth:", e);
    }
  };

  const stopSynth = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch (e) {}
      gainRef.current = null;
    }
  };

  // Modify pitch based on playback time to sound like speech modulation
  useEffect(() => {
    if (isPlaying && oscRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const notes = [220, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63];
      const index = Math.floor(currentTime * 2.5) % notes.length;
      oscRef.current.frequency.setValueAtTime(notes[index], ctx.currentTime);
    }
  }, [isPlaying, currentTime]);

  // Frame ticker for waveform bounce & mock simulation progress
  useEffect(() => {
    if (!isPlaying) {
      stopSynth();
      cancelAnimationFrame(animFrameIdRef.current);
      clearInterval(timeTrackerIdRef.current);
      return;
    }

    // Start audio synth if there's no real file loaded
    if (!audioRef.current) {
      startSynth();
      let lastTime = performance.now();
      
      timeTrackerIdRef.current = setInterval(() => {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        setCurrentTime(prev => {
          const next = prev + delta;
          if (next >= duration) {
            setIsPlaying(false);
            stopSynth();
            return 0;
          }
          return next;
        });
      }, 50);
    }

    // Waveform bounce animation loop
    const renderLoop = () => {
      setAnimFrame(f => f + 1);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      clearInterval(timeTrackerIdRef.current);
      stopSynth();
    };
  }, [isPlaying, duration]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.warn("Audio element play blocked by autoplay policy:", err);
        });
      }
    }
  };

  const handleSeek = (e) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percent * duration;
    
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-[var(--border)] bg-[var(--brand-soft)] p-3 sm:p-4 text-left shadow-sm">
      {/* Play/Pause Button */}
      <button
        onClick={handleTogglePlay}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-md shadow-black/10 transition duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" className="ml-1" />
        )}
      </button>

      {/* Waveform Visualizer & Seek bar */}
      <div className="flex-1 min-w-0">
        <div 
          ref={waveformRef}
          onClick={handleSeek}
          className="flex h-8 w-full items-center gap-[1.5px] sm:gap-[3px] cursor-pointer select-none group"
          title="Click to seek"
        >
          {WAVEFORM_BARS.map((baseHeight, idx) => {
            const barProgress = (idx / WAVEFORM_BARS.length) * 100;
            const isActive = progressPercent >= barProgress;
            
            // Dynamic amplitude bounce simulation
            let heightPercent = baseHeight;
            if (isPlaying) {
              const pulse = Math.sin(animFrame * 0.18 + idx * 0.45) * 10;
              // Larger bounce on active bars closer to playback cursor
              const activeMod = isActive ? 1.2 : 0.4;
              heightPercent = baseHeight + pulse * activeMod;
              heightPercent = Math.max(12, Math.min(100, heightPercent));
            }

            return (
              <div
                key={idx}
                className={`flex-1 h-full min-w-[2px] max-w-[4px] rounded-full transition-all duration-150 ${
                  isActive 
                    ? "bg-[var(--brand)] shadow-sm opacity-100" 
                    : "bg-stone-300 dark:bg-stone-600 opacity-60 group-hover:opacity-80"
                }`}
                style={{
                  height: `${heightPercent}%`,
                  transformOrigin: "center"
                }}
              />
            );
          })}
        </div>

        {/* Timestamps */}
        <div className="mt-1 flex items-center justify-between text-[10px] font-black text-[var(--brand)] opacity-85 select-none">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
