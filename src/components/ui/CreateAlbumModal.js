"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { createAlbumOnBackend, getBackendErrorMessage } from "@/services/backend";
import { useAuth } from "@/context/AuthProvider";

export default function CreateAlbumModal({ onClose, onSuccess }) {
  const { firebaseUser, getToken} = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setErrorMsg("Album name is required.");
      return;
    }
    if (!firebaseUser) return;

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("privacy", "Private"); // Default privacy
      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      await createAlbumOnBackend(token, formData);
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
          <h3 className="text-lg font-black text-stone-900">Create New Album</h3>
          <button onClick={onClose} className="text-stone-900 hover:text-stone-600 cursor-pointer">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {errorMsg && <p className="text-red-500 text-xs font-bold text-center">{errorMsg}</p>}
          
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
              <p className="text-sm font-bold text-stone-900">Choose from Gallery</p>
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
              onClick={handleCreate}
              disabled={isSubmitting || !title.trim()}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition cursor-pointer disabled:opacity-50 ${title.trim() ? 'bg-[#4f37ff] text-white hover:bg-[#3b23e0]' : 'bg-stone-100 text-stone-400'}`}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Create Album
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
