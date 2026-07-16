"use client";

import { useState, useEffect } from "react";
import { X, Mic, FileText, Image as ImageIcon, Calendar, Clock, Smile, Globe, Heart, Bookmark, Share2, Download, Edit2, Play, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import clsx from "clsx";

export default function MemoryViewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    const handleOpen = (e) => {
      setMemory(e.detail);
      setIsOpen(true);
    };
    window.addEventListener("openMemoryView", handleOpen);
    return () => window.removeEventListener("openMemoryView", handleOpen);
  }, []);

  if (!isOpen || !memory) return null;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setMemory(null), 300); // clear after animate out
  };

  // Determine type formatting
  const type = memory.type?.toLowerCase() || "voice"; // voice, photo, text/written, video
  
  // Format dates
  const memoryDate = memory.date || "Unknown Date";
  const memoryYear = memory.date ? memory.date.split(", ")[1] || memory.date.split(" ").pop() : "Unknown";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 animate-fade-in p-4 sm:p-6 backdrop-blur-[2px]">
      <div 
        className="w-full max-w-[900px] bg-white rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden animate-scale-up max-h-[90vh] min-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- HEADER SECTION --- */}
        {type === "voice" && (
          <div className="bg-gradient-to-br from-[#4A3AFF] to-[#7b6eff] text-white p-8 relative flex flex-col">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center bg-white text-stone-900 hover:bg-stone-100 rounded-full transition-colors shadow-sm z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Mic size={16} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase opacity-90">VOICE MEMORY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">{memory.title}</h2>
            <p className="text-white/80 text-sm font-medium mb-12">{memoryDate}</p>

            {/* Fake Audio Player UI */}
            <div className="flex items-center gap-6 mt-auto">
              <button className="w-14 h-14 rounded-full bg-white text-[#4A3AFF] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shrink-0">
                <Play size={24} fill="currentColor" className="ml-1" />
              </button>
              <div className="flex-1 flex flex-col gap-2">
                {/* Waveform Visualization */}
                <div className="flex items-center gap-1 h-12 w-full max-w-[500px]">
                  {[...Array(40)].map((_, i) => {
                    const height = Math.random() * 100;
                    return (
                      <div 
                        key={i} 
                        className="flex-1 bg-white/70 rounded-full min-w-[3px]"
                        style={{ height: `${Math.max(10, height)}%`, opacity: i < 15 ? 1 : 0.4 }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs font-bold text-white/70">
                  <span>0:00</span>
                  <span>{memory.duration || "4:32"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(type === "photo" || type === "video" || type === "visual") && (
          <div className="h-[360px] bg-stone-900 relative flex flex-col justify-end group">
            <img 
              src={memory.image || memory.cover || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80"} 
              alt="Memory cover"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center bg-white text-stone-900 hover:bg-stone-100 rounded-full transition-colors shadow-sm z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Carousel Arrows */}
            <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={24} />
            </button>
            <button className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={24} />
            </button>

            <div className="relative z-10 p-8 pt-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 rounded-[6px] bg-[#10b981] flex items-center gap-1.5 text-white">
                  <ImageIcon size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">PHOTO MEMORY</span>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-1 text-white leading-tight">{memory.title}</h2>
              <p className="text-white/80 text-sm font-medium">{memoryDate}</p>
            </div>
          </div>
        )}

        {(type === "text" || type === "written" || type === "milestone") && (
          <div className="bg-white px-8 pt-10 pb-6 relative flex flex-col border-b border-stone-100">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-500 hover:bg-stone-200 rounded-full transition-colors z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            <div className="absolute top-8 right-20 text-xs font-bold text-stone-400 flex items-center gap-1.5">
               <Clock size={14} strokeWidth={2.5}/> 1 min read
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center">
                <FileText size={16} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#f59e0b]">WRITTEN JOURNAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-stone-900 leading-tight">{memory.title}</h2>
            <p className="text-stone-400 text-sm font-medium">{memoryDate}</p>
          </div>
        )}

        {/* --- BODY SECTION --- */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-white">
          
          {/* Main Content (Left) */}
          <div className="flex-1 p-8 border-r border-stone-100">
            
            {type === "voice" && (
              <>
                <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-[#4A3AFF]" /> Transcript
                </h3>
                <p className="text-stone-600 leading-relaxed text-[15px]">
                  {memory.description || "I recorded this on the roof of my new apartment, watching the city lights come on at dusk. I realized in that moment that I'd stopped looking for somewhere else to be."}
                </p>
              </>
            )}

            {(type === "photo" || type === "video" || type === "visual") && (
              <p className="text-stone-600 leading-relaxed text-[15px]">
                {memory.description || "The whole family came together. 43 people in one backyard. It was a day to remember forever."}
              </p>
            )}

            {(type === "text" || type === "written" || type === "milestone") && (
              <>
                <blockquote className="border-l-4 border-[#4A3AFF] pl-5 py-1 my-4 text-[#4A3AFF] italic text-lg font-medium leading-relaxed">
                  "If I could speak to the 22-year-old version of me, sitting in that cheap flat in Hackney, drinking instant coffee and feeling like the world had forgotten me..."
                </blockquote>
                <p className="text-stone-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                  {memory.description || "I would say this... It takes time. You are not falling behind, you are just building the foundation. The things you are worrying about right now won't even cross your mind five years from now. Stay patient."}
                </p>
              </>
            )}

          </div>

          {/* Details Sidebar (Right) */}
          <div className="w-full md:w-[320px] p-8 bg-stone-50/50 flex flex-col gap-6 shrink-0">
            <h4 className="text-[11px] font-bold tracking-widest text-stone-400 uppercase mb-2">DETAILS</h4>
            
            <div className="flex items-start gap-4">
              <Calendar size={18} className="text-stone-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">DATE</p>
                <p className="text-sm font-semibold text-stone-800">{memoryDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={18} className="text-stone-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">YEAR</p>
                <p className="text-sm font-semibold text-stone-800">{memoryYear}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Smile size={18} className="text-[#f59e0b] mt-0.5 fill-[#f59e0b]/20" />
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">MOOD</p>
                <p className="text-sm font-semibold text-stone-800">{memory.mood || "Reflection"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Globe size={18} className="text-stone-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">VISIBILITY</p>
                <p className="text-sm font-semibold text-stone-800">{memory.privacy || "Public"}</p>
              </div>
            </div>

            {memory.duration && (
              <div className="flex items-start gap-4">
                <Clock size={18} className="text-stone-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">DURATION</p>
                  <p className="text-sm font-semibold text-stone-800">{memory.duration}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Bookmark size={12}/> TAGS</p>
              <div className="flex flex-wrap gap-2">
                {(memory.tags || ["reflection", "growth", "advice"]).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#EEF2FF] text-[#4A3AFF] rounded-full text-[11px] font-bold">
                    {tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Reflection Box */}
            <div className="mt-4 p-5 rounded-2xl border border-[#E5E9FF] bg-gradient-to-br from-white to-[#F8F9FF] shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#4A3AFF]">
                <Sparkles size={16} strokeWidth={2.5}/>
                <span className="text-[11px] font-bold tracking-widest uppercase">AI Reflection</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                This memory captures themes of family connection and belonging — recurring in 23% of your stories.
              </p>
            </div>
            
          </div>
        </div>

        {/* --- FOOTER SECTION --- */}
        <div className="p-4 sm:px-8 sm:py-5 border-t border-stone-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-pink-500 transition-colors text-sm font-bold shadow-sm">
              <Heart size={16} /> {memory.likes || 24}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-[#4A3AFF] transition-colors text-sm font-bold shadow-sm">
              <Bookmark size={16} /> Save
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => alert("Share dialog triggered")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-[12px] border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-bold shadow-sm"
            >
              <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
            </button>
            <button 
              onClick={() => alert("Downloading media...")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-[12px] border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-bold shadow-sm"
            >
              <Download size={16} /> <span className="hidden sm:inline">Download</span>
            </button>
            <button 
              onClick={() => alert("Edit mode...")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-[12px] border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-bold shadow-sm"
            >
              <Edit2 size={16} /> <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
