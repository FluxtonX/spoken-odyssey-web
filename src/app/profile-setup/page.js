/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { updateProfileOnBackend } from "@/services/backend";

export default function ProfileSetup() {
  const router = useRouter();
  const { firebaseUser, profile, loading, refreshProfile, isAuthenticated } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [privacy, setPrivacy] = useState("Family Only");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, loading, router]);

  // Pre-populate fields from current profile or firebase user
  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    } else if (firebaseUser?.displayName) {
      setDisplayName(firebaseUser.displayName);
    }
    
    if (profile?.photoURL) {
      setAvatarPreview(profile.photoURL);
    }
  }, [profile, firebaseUser]);

  // Clean up blob URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving || isSkipping || !firebaseUser) return;
    
    setIsSaving(true);
    setErrorMsg("");

    try {
      const token = await firebaseUser.getIdToken();
      const formData = new FormData();
      formData.append("displayName", displayName.trim() || "User");
      formData.append("defaultEntryPrivacy", privacy);
      formData.append("onboardingCompleted", "true");
      if (avatarFile) {
        formData.append("profileImage", avatarFile);
      }

      await updateProfileOnBackend(token, formData);
      await refreshProfile();
      router.replace("/home");
    } catch (err) {
      console.error("Save Profile Error:", err);
      setErrorMsg(err.message || "Failed to complete profile setup. Please try again.");
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    if (isSaving || isSkipping || !firebaseUser) return;
    
    setIsSkipping(true);
    setErrorMsg("");

    try {
      const token = await firebaseUser.getIdToken();
      const formData = new FormData();
      formData.append("onboardingCompleted", "true");

      await updateProfileOnBackend(token, formData);
      await refreshProfile();
      router.replace("/home");
    } catch (err) {
      console.error("Skip Profile Error:", err);
      setErrorMsg(err.message || "Failed to skip onboarding. Please try again.");
      setIsSkipping(false);
    }
  };

  if (loading || (!isAuthenticated && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
        <Loader2 className="w-8 h-8 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col px-6 py-8 animation-fade-in relative">
      
      <header className="relative z-10 mb-8 pt-4 max-w-sm mx-auto w-full">
        <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="w-full h-full bg-[var(--brand)] rounded-full" />
        </div>
        <p className="mt-4 text-[var(--brand)] font-bold text-sm tracking-wide uppercase">Final Step</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Setup your profile</h1>
      </header>

      <main className="flex-1 flex flex-col max-w-sm mx-auto w-full relative z-10">
        
        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-400 p-4 text-xs font-bold shadow-sm animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex-1 flex flex-col">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              aria-label="Upload profile image"
            >
              <div className="w-32 h-32 rounded-full border-4 border-[var(--surface)] bg-gradient-to-tr from-[var(--border)] to-[var(--surface-hover)] shadow-xl flex items-center justify-center overflow-hidden transition-all group-active:scale-95 group-hover:border-[var(--brand)]/30">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl filter drop-shadow-md">👤</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--brand)] rounded-full border-4 border-[var(--background)] flex items-center justify-center text-white shadow-lg group-hover:bg-[var(--brand-hover)] transition-colors">
                <Camera size={16} strokeWidth={3} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="mt-3 text-xs font-semibold opacity-60">Upload a nice photo of yourself</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-6 w-full mb-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Display Name</label>
              <input 
                type="text" 
                placeholder="e.g. Alexander" 
                required
                className="w-full p-4 rounded-2xl glass border border-[var(--border)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all font-semibold text-[var(--ink)] bg-slate-50 dark:bg-slate-800"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2 pl-2">Default Privacy</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setPrivacy("Family Only")}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all cursor-pointer ${
                    privacy === "Family Only" 
                      ? "border-[var(--brand)] bg-[var(--brand)]/5 shadow-md" 
                      : "glass border-[var(--border)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="text-2xl filter drop-shadow-sm">👨‍👩‍👧‍👦</span>
                  <span className={`font-bold text-sm ${privacy === "Family Only" ? "text-[var(--brand)]" : ""}`}>Family Only</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPrivacy("Public")}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all cursor-pointer ${
                    privacy === "Public" 
                      ? "border-[var(--brand)] bg-[var(--brand)]/5 shadow-md" 
                      : "glass border-[var(--border)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="text-2xl filter drop-shadow-sm grayscale">🌍</span>
                  <span className={`font-bold text-sm ${privacy === "Public" ? "text-[var(--brand)]" : ""}`}>Public</span>
                </button>
              </div>
              <p className="text-xs opacity-50 text-center mt-3 font-medium">You can change this per memory.</p>
            </div>
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <button 
              type="submit"
              disabled={isSaving || isSkipping}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold shadow-lg shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-95 transition-all group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isSaving || isSkipping}
              className="text-stone-500 hover:text-stone-850 dark:hover:text-stone-200 transition-colors font-bold text-sm tracking-wide py-2 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSkipping ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Skipping...
                </span>
              ) : (
                "Skip for now"
              )}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
