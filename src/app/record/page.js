"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { resolveGlass3DIcon } from "@/components/ui/Glass3DIcons";

export default function RecordMemory() {
  const [activeFormat, setActiveFormat] = useState("Voice");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode && ["Voice", "Text", "Photo", "Video"].includes(mode)) {
      setActiveFormat(mode);
    }
  }, []);

  const formats = [
    { id: "Voice", color: "text-amber-700 bg-amber-50" },
    { id: "Text", color: "text-amber-700 bg-amber-50" },
    { id: "Photo", color: "text-amber-700 bg-amber-50" },
    { id: "Video", color: "text-amber-700 bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-[#fdfcfa] flex flex-col pb-safe animation-fade-in max-w-2xl mx-auto px-4 sm:px-0">
      
      {/* Header */}
      <header className="flex justify-between items-center py-6 sticky top-0 z-20 bg-[#fdfcfa]/90 backdrop-blur-md border-b border-stone-100">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Create Memory</h1>
        <Link href="/" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-stone-250/80 hover:bg-stone-50 transition-all active:scale-95 shadow-sm">
          <X size={18} className="text-stone-600" />
        </Link>
      </header>

      {/* Format Selector (Tabs) */}
      <div className="mb-6 mt-4">
        <div className="flex gap-2 p-1.5 bg-white border border-stone-200/80 rounded-[1.8rem] shadow-sm">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setActiveFormat(format.id)}
              className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 font-black text-xs transition-all duration-300 ${
                activeFormat === format.id 
                  ? `${format.color} border border-amber-200 shadow-sm` 
                  : "text-stone-500 opacity-60 hover:opacity-100 hover:bg-stone-50"
              }`}
            >
              <div className="scale-[0.65] -my-2">
                {resolveGlass3DIcon(format.id)}
              </div>
              <span className="hidden sm:block">{format.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Capture Interface (Dynamic Based on Format) */}
      <main className="flex-1 flex flex-col pb-24">
        
        <div className="flex-1 rounded-[2.5rem] bg-white border border-stone-200/80 relative overflow-hidden flex flex-col mb-6 shadow-sm min-h-[320px]">
          
          {/* ---- VOICE MODE ---- */}
          {activeFormat === "Voice" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animation-fade-in">
              <div className="w-32 h-32 rounded-full bg-amber-500/5 border border-amber-200/20 flex items-center justify-center relative mb-8">
                {/* Ripple Effect Animation */}
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border-2 border-amber-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="scale-125">
                  {resolveGlass3DIcon("voice")}
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-stone-900 mb-2">00:00:00</h2>
              <p className="text-xs font-bold text-stone-400 mb-8 uppercase tracking-wider">Ready to record your story</p>
              
              <button className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white flex items-center justify-center shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all ring-4 ring-red-500/10">
                <div className="w-6 h-6 rounded-sm bg-white" />
              </button>
            </div>
          )}

          {/* ---- TEXT MODE ---- */}
          {activeFormat === "Text" && (
            <div className="flex-1 flex flex-col p-6 animation-fade-in text-left">
              <textarea 
                placeholder="Start typing your legacy memory here..." 
                className="flex-1 w-full bg-transparent resize-none outline-none text-base font-semibold leading-relaxed placeholder:text-stone-300 text-stone-850"
                autoFocus
              />
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-stone-100">
                <button className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-500 hover:scale-110 transition-transform" />
                <button className="w-8 h-8 rounded-full bg-purple-100 hover:scale-110 transition-transform" />
                <button className="w-8 h-8 rounded-full bg-emerald-100 hover:scale-110 transition-transform" />
                <button className="w-8 h-8 rounded-full bg-rose-100 hover:scale-110 transition-transform" />
              </div>
            </div>
          )}

          {/* ---- PHOTO/VIDEO MODE ---- */}
          {(activeFormat === "Photo" || activeFormat === "Video") && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-4 border-dashed border-stone-100 m-5 rounded-[2rem] hover:bg-stone-50 transition-colors cursor-pointer group animation-fade-in">
              <div className="w-20 h-20 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <div className="scale-110">
                  {resolveGlass3DIcon(activeFormat)}
                </div>
              </div>
              <h3 className="font-extrabold text-stone-850 text-lg mb-1">Upload {activeFormat}</h3>
              <p className="text-xs font-semibold text-stone-400">Tap to browse or drop files here</p>
            </div>
          )}
        </div>

        {/* Metadata Settings Box */}
        <div className="bg-white border border-stone-200/80 p-5 rounded-[2.5rem] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <div className="scale-75 shrink-0 -my-2">
              {resolveGlass3DIcon("text")}
            </div>
            <input 
              type="text" 
              placeholder="Give it a title..." 
              className="flex-1 bg-transparent outline-none font-bold text-stone-850 placeholder:text-stone-300" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-black text-stone-700 hover:bg-stone-100 transition-colors shadow-sm">
              <div className="scale-50 -mx-3 -my-3 shrink-0">
                {resolveGlass3DIcon("album")}
              </div>
              Add to Album
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-black text-stone-700 hover:bg-stone-100 transition-colors shadow-sm">
              <div className="scale-50 -mx-3 -my-3 shrink-0">
                {resolveGlass3DIcon("privacy")}
              </div>
              Visibility: Family Circle
            </button>
          </div>
        </div>

        {/* Save CTA */}
        <button className="mt-6 w-full py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-black shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all text-base flex items-center justify-center gap-2">
          Save Memory
        </button>

      </main>
    </div>
  );
}
