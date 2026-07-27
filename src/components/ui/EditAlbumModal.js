"use client";

import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { updateAlbumOnBackend, getBackendErrorMessage } from "@/services/backend";
import { useAuth } from "@/context/AuthProvider";
import { COVER_PRESETS } from "@/data/userProfile";

export default function EditAlbumModal({ album, onClose, onSuccess }) {
  const { firebaseUser, getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [coverMode, setCoverMode] = useState("preset");
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [uploadedCoverName, setUploadedCoverName] = useState("");
  const fileInputRef = useRef(null);

  // Initialize form with album data
  useEffect(() => {
    if (album) {
      setTitle(album.title || "");
      setDescription(album.subtitle || "");
      setCoverPreview(album.cover || "");
      
      // Determine cover mode based on current cover
      if (album.cover && !album.cover.startsWith("http")) {
        setCoverMode("upload");
      } else if (album.cover && album.cover.startsWith("http")) {
        // Check if it's a preset
        const isPreset = COVER_PRESETS.some(preset => preset.url === album.cover);
        if (isPreset) {
          setCoverMode("preset");
        } else {
          setCoverMode("custom");
          setCustomCoverUrl(album.cover);
        }
      }
    }
  }, [album]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setUploadedCoverName(file.name);
      setCoverMode("upload");
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      setErrorMsg("Album name is required.");
      return;
    }
    if (!firebaseUser || !album?.id) return;

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("subtitle", description.trim());
      
      if (coverMode === "upload" && coverFile) {
        formData.append("coverImage", coverFile);
      } else if (coverMode === "custom" && customCoverUrl.trim()) {
        formData.append("coverUrl", customCoverUrl.trim());
      } else if (coverMode === "preset" && coverPreview) {
        formData.append("coverUrl", coverPreview);
      }

      await updateAlbumOnBackend(token, album.id, formData);
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(getBackendErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-[2rem] bg-white shadow-2xl animate-scale-up overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-[#4f37ff]/20 p-5">
          <h3 className="text-lg font-black text-stone-900">Edit Album</h3>
          <button onClick={onClose} className="text-stone-900 hover:text-stone-600 cursor-pointer">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {errorMsg && <p className="text-red-500 text-xs font-bold text-center">{errorMsg}</p>}
          
          {/* Cover Mode Selector */}
          <div className="flex gap-4 text-xs font-bold">
            <button 
              type="button"
              onClick={() => setCoverMode("preset")}
              className={`pb-1 border-b-2 transition-colors cursor-pointer ${coverMode === "preset" ? "border-[#4f37ff] text-[#4f37ff]" : "border-transparent text-stone-500"}`}
            >
              Presets
            </button>
            <button 
              type="button"
              onClick={() => setCoverMode("upload")}
              className={`pb-1 border-b-2 transition-colors cursor-pointer ${coverMode === "upload" ? "border-[#4f37ff] text-[#4f37ff]" : "border-transparent text-stone-500"}`}
            >
              Upload
            </button>
            <button 
              type="button"
              onClick={() => setCoverMode("custom")}
              className={`pb-1 border-b-2 transition-colors cursor-pointer ${coverMode === "custom" ? "border-[#4f37ff] text-[#4f37ff]" : "border-transparent text-stone-500"}`}
            >
              Custom URL
            </button>
          </div>

          {/* Cover Image Section */}
          {coverMode === "preset" ? (
            <div className="grid grid-cols-5 gap-2">
              {COVER_PRESETS.map((preset) => {
                const isSelected = coverPreview === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCoverPreview(preset.url);
                      setUploadedCoverName("");
                    }}
                    className={`aspect-video rounded-xl overflow-hidden relative border-2 transition-all cursor-pointer ${
                      isSelected ? "border-[#4f37ff] scale-[1.03]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                  </button>
                );
              })}
            </div>
          ) : coverMode === "upload" ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-4 rounded-xl border border-[#c8c5ff] p-4 cursor-pointer hover:bg-[#eff0ff]/30 transition"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover Preview" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff0ff] text-[#4f37ff]">
                  <ImageIcon size={20} />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-stone-900">
                  {uploadedCoverName || "Choose from Gallery"}
                </p>
                <p className="text-xs font-semibold text-stone-500">Upload from your device</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2">Cover Image URL</label>
              <input 
                type="url" 
                placeholder="https://example.com/image.jpg"
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value);
                  setCoverPreview(e.target.value);
                }}
                className="w-full rounded-xl border border-[#c8c5ff] p-3 text-sm font-semibold text-stone-700 outline-none focus:border-[#4f37ff]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">Album Name</label>
            <input 
              type="text" 
              placeholder="e.g., Summer 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#c8c5ff] p-3 text-sm font-semibold text-stone-700 outline-none focus:border-[#4f37ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">Description (optional)</label>
            <textarea 
              placeholder="What is this album about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#c8c5ff] p-3 text-sm font-semibold text-stone-700 outline-none focus:border-[#4f37ff] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-[#c8c5ff] py-3 text-sm font-bold text-stone-900 hover:bg-stone-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isSubmitting || !title.trim()}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition cursor-pointer disabled:opacity-50 ${title.trim() ? 'bg-[#4f37ff] text-white hover:bg-[#3b23e0]' : 'bg-stone-100 text-stone-400'}`}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
