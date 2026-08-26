"use client";

import { useState } from "react";
import { X, FolderHeart, FolderPlus, Image as ImageIcon, Upload, Loader2, Check } from "lucide-react";
import { createAlbumOnBackend } from "@/services/backend";

const COVER_PRESETS = [
  "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
];

export default function CreateFamilyAlbumModal({ isOpen, onClose, familyCircleId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedCover, setSelectedCover] = useState(COVER_PRESETS[0]);
  const [coverFile, setCoverFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setCoverFile(file);
      setFilePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleRemoveFile = () => {
    setCoverFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for the Family Album.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let token = localStorage.getItem("spokenOdysseyToken") || localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing.");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("subtitle", subtitle.trim());
      formData.append("privacy", "Family");
      if (familyCircleId) {
        formData.append("familyCircleId", familyCircleId);
      }

      if (coverFile) {
        formData.append("file", coverFile);
      } else if (selectedCover) {
        formData.append("coverUrl", selectedCover);
      }

      await createAlbumOnBackend(token, formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Create Family Album Error:", err);
      setError(err?.message || "Failed to create Family Album. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-slate-800/80 bg-gradient-to-r from-[#EEF2FF] to-white dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4A3AFF] text-white flex items-center justify-center shadow-md">
              <FolderHeart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Create Family Space Album</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Bound directly to your connected Family Space.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Album Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Family Trip 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 outline-none focus:border-[#4A3AFF] transition"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Subtitle / Description
            </label>
            <textarea
              placeholder="Short description of memories in this album..."
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-medium rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 outline-none focus:border-[#4A3AFF] transition resize-none"
            />
          </div>

          {/* Custom Cover File Upload Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-300 block">
              Cover Photo
            </label>

            {filePreview ? (
              <div className="relative aspect-[16/7] w-full rounded-2xl overflow-hidden border border-indigo-200 dark:border-slate-700 group">
                <img src={filePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700 transition"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition">
                  <Upload size={18} className="text-[#4A3AFF]" />
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Upload Custom Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Preset Themes Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Or choose a theme preset:</span>
                  <div className="grid grid-cols-4 gap-2.5">
                    {COVER_PRESETS.map((presetUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedCover(presetUrl)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                          !coverFile && selectedCover === presetUrl ? "border-[#4A3AFF] ring-2 ring-[#4A3AFF]/30 scale-105" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                        {!coverFile && selectedCover === presetUrl && (
                          <div className="absolute inset-0 bg-[#4A3AFF]/30 flex items-center justify-center">
                            <Check size={16} className="text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t border-stone-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-slate-800 rounded-2xl hover:bg-stone-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 text-xs font-bold text-white bg-[#4A3AFF] hover:bg-[#3b2dd1] rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating Album...</span>
                </>
              ) : (
                <>
                  <FolderPlus size={16} />
                  <span>Create Family Album</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
