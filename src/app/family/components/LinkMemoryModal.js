"use client";

import { useState, useEffect } from "react";
import { X, Link2, Check, Sparkles, Image as ImageIcon, Mic, FileText, Film } from "lucide-react";
import { getMemoriesFromBackend, linkMemoryToFamilyCircle } from "@/services/backend";

export default function LinkMemoryModal({ isOpen, onClose, familyCircleId, onLinkSuccess }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linkingId, setLinkingId] = useState(null);
  const [linkedIds, setLinkedIds] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && familyCircleId) {
      loadUserMemories();
    }
  }, [isOpen, familyCircleId]);

  async function loadUserMemories() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token) {
        const res = await getMemoriesFromBackend(token);
        const list = Array.isArray(res) ? res : res?.data || [];
        setMemories(list.filter((m) => m.status !== "draft"));
      }
    } catch (err) {
      console.error("Failed to load user memories for linking:", err);
      setError("Could not load your memories. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLink(memoryId) {
    setLinkingId(memoryId);
    try {
      const token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (token && familyCircleId) {
        await linkMemoryToFamilyCircle(token, familyCircleId, memoryId);
        setLinkedIds((prev) => new Set(prev).add(memoryId));
        if (onLinkSuccess) onLinkSuccess(memoryId);
      }
    } catch (err) {
      console.error("Link memory error:", err);
      setError(err?.message || "Failed to link memory");
    } finally {
      setLinkingId(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-[#C7D2FE]/70 dark:border-slate-800 rounded-[24px] shadow-2xl p-6 md:p-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-indigo-950 text-[#4A3AFF] dark:text-indigo-300 flex items-center justify-center font-bold">
              <Link2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white leading-tight">
                Link Memory to Family Space
              </h2>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Share a memory without changing its original ownership.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm font-medium text-stone-400">
              Loading your published memories...
            </div>
          ) : memories.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <Sparkles size={32} className="text-[#4A3AFF] mb-2" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                No memories available to link
              </p>
              <p className="text-xs text-stone-400 max-w-xs mt-1">
                Create and publish a memory in your Personal Odyssey first.
              </p>
            </div>
          ) : (
            memories.map((mem) => {
              const isLinked = linkedIds.has(mem.id);
              const isLinking = linkingId === mem.id;

              let FormatIcon = FileText;
              if (mem.type === "Voice") FormatIcon = Mic;
              if (mem.type === "Photo") FormatIcon = ImageIcon;
              if (mem.type === "Video") FormatIcon = Film;

              return (
                <div
                  key={mem.id}
                  className="flex items-center justify-between p-4 bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/60 dark:border-slate-700/50 rounded-[16px] hover:border-[#4A3AFF]/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-stone-200 dark:border-slate-600 flex items-center justify-center shrink-0 text-[#4A3AFF]">
                      <FormatIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                        {mem.title || "Untitled Memory"}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {mem.occurredAt
                          ? new Date(mem.occurredAt).toLocaleDateString()
                          : "Recent"} • {mem.type || "Text"}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={isLinked || isLinking}
                    onClick={() => handleLink(mem.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isLinked
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white shadow-md active:scale-95"
                    }`}
                  >
                    {isLinked ? (
                      <>
                        <Check size={14} /> Linked
                      </>
                    ) : isLinking ? (
                      "Linking..."
                    ) : (
                      <>
                        <Link2 size={14} /> Link to Space
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
