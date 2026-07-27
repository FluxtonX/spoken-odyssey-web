"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  RotateCw, RotateCcw, MoreVertical, ChevronLeft, ChevronRight, Check
} from "lucide-react";

export default function VideoPlayer({ 
  src, 
  poster, 
  title, 
  onNext, 
  onPrev, 
  hasNext = false, 
  hasPrev = false 
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Ripple feedback for double-click ±10s skip
  const [skipFeedback, setSkipFeedback] = useState(null); // { type: 'forward' | 'rewind', id: number }
  const clickTimeoutRef = useRef(null);

  const speedOptions = [0.75, 1, 1.25, 1.5, 1.75, 2];

  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if video is focused or container is in viewport
      if (!containerRef.current || !document.contains(containerRef.current)) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInViewport) return;

      switch (e.key) {
        case ' ':
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-5);
          triggerSkipFeedback("rewind");
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(5);
          triggerSkipFeedback("forward");
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.min(1, volume + 0.1) } });
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.max(0, volume - 0.1) } });
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, duration]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Double click handling: left side rewinds 10s, right side skips 10s
  const handleVideoContainerClick = (e) => {
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      // Double click detected!
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;

      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      if (clickX > width / 2) {
        // Skip forward 10s
        skipTime(10);
        triggerSkipFeedback("forward");
      } else {
        // Skip backward 10s
        skipTime(-10);
        triggerSkipFeedback("rewind");
      }
    } else {
      // Single click -> toggle play/pause after delay
      clickTimeoutRef.current = setTimeout(() => {
        togglePlay();
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  const skipTime = (amount) => {
    if (!videoRef.current) return;
    const newTime = Math.min(Math.max(0, videoRef.current.currentTime + amount), duration || 100);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const triggerSkipFeedback = (type) => {
    setSkipFeedback({ type, id: Date.now() });
    setTimeout(() => setSkipFeedback(null), 800);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      if (volume === 0) setVolume(0.8);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec === 0) return "0:00";
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full h-full min-h-[260px] bg-black rounded-2xl overflow-hidden group select-none flex items-center justify-center shadow-2xl"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={handleVideoContainerClick}
        className="w-full h-full object-contain cursor-pointer max-h-[75vh]"
        playsInline
      />

      {/* Double click skip ripple visual indicator */}
      {skipFeedback && (
        <div className={`absolute top-0 bottom-0 ${skipFeedback.type === 'forward' ? 'right-0 w-1/2 rounded-r-2xl' : 'left-0 w-1/2 rounded-l-2xl'} bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center animate-ping pointer-events-none z-30`}>
          {skipFeedback.type === 'forward' ? (
            <>
              <RotateCw size={44} className="text-white drop-shadow-lg animate-bounce" />
              <span className="text-white font-black text-lg mt-2">+10s</span>
            </>
          ) : (
            <>
              <RotateCcw size={44} className="text-white drop-shadow-lg animate-bounce" />
              <span className="text-white font-black text-lg mt-2">-10s</span>
            </>
          )}
        </div>
      )}

      {/* Center Big Play/Pause Button on Hover / Pause */}
      {(!isPlaying || showControls) && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-[#4A3AFF] text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all transform hover:scale-110 active:scale-95 z-20 cursor-pointer"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
      )}

      {/* Multi-Video Navigation Controls (Prev / Next) */}
      {(hasPrev || hasNext) && showControls && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-20">
          {hasPrev ? (
            <button
              onClick={onPrev}
              className="pointer-events-auto w-11 h-11 rounded-full bg-black/60 hover:bg-[#4A3AFF] text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          ) : <div />}
          {hasNext ? (
            <button
              onClick={onNext}
              className="pointer-events-auto w-11 h-11 rounded-full bg-black/60 hover:bg-[#4A3AFF] text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          ) : <div />}
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300 z-20 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubbing Timeline Bar */}
        <div className="relative flex items-center group/timeline mb-3">
          <div className="relative w-full h-1.5 bg-white/30 rounded-lg overflow-hidden">
            {/* Watched portion highlight */}
            <div 
              className="absolute top-0 left-0 h-full bg-[#4A3AFF] transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* Range input on top */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 10 }}
            />
            {/* Custom thumb indicator */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-100 pointer-events-none"
              style={{ 
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                transform: `translate(-50%, -50%)`,
                opacity: showControls || !isPlaying ? 1 : 0,
                zIndex: 5
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-white">
          {/* Left Controls: Play/Pause, Skip buttons, Time display */}
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay} 
              className="hover:text-[#4A3AFF] transition cursor-pointer p-1"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            <button 
              onClick={() => skipTime(-10)} 
              className="hover:text-[#4A3AFF] transition cursor-pointer p-1 text-white/80 hover:text-white"
              title="Rewind 10s"
            >
              <RotateCcw size={18} />
            </button>

            <button 
              onClick={() => skipTime(10)} 
              className="hover:text-[#4A3AFF] transition cursor-pointer p-1 text-white/80 hover:text-white"
              title="Skip 10s"
            >
              <RotateCw size={18} />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="hover:text-[#4A3AFF] transition cursor-pointer p-1">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="relative w-16 h-1.5 bg-white/30 rounded-lg overflow-hidden">
                {/* Volume highlight */}
                <div 
                  className="absolute top-0 left-0 h-full bg-[#4A3AFF] transition-all duration-100"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                />
                {/* Volume input */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ zIndex: 10 }}
                />
                {/* Volume percentage indicator */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded opacity-0 group-hover/vol:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>

            {/* Time Indicator */}
            <span className="text-xs font-semibold text-white/90 ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Speed Menu Dropup & Fullscreen */}
          <div className="flex items-center gap-3 relative">
            {/* 3-Dots Speed Dropup Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition active:scale-95 cursor-pointer"
                title="Playback Speed"
              >
                <span>{playbackSpeed}x</span>
                <MoreVertical size={14} />
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-32 bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-white/10 mb-1">
                    Speed
                  </div>
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`w-full px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        playbackSpeed === speed ? "text-[#4A3AFF] font-bold bg-white/10" : "text-white/80 hover:bg-white/5"
                      }`}
                    >
                      <span>{speed}x</span>
                      {playbackSpeed === speed && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen} 
              className="hover:text-[#4A3AFF] transition cursor-pointer p-1 text-white/90"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
