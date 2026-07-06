"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  Edit2,
  Globe,
  ImagePlus,
  Lock,
  MapPin,
  Save,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
  CheckCircle2,
  Play,
  FileText,
  Mic,
  Camera as CameraIcon,
  Check,
  FolderHeart,
  Target,
  Award,
  Briefcase,
  Sparkles,
  Lightbulb,
  HeartHandshake,
  Loader2,
  Share2,
  Mail,
  Link2,
  Copy,
  Plus
} from "lucide-react";
import {
  AVATAR_PRESETS,
  COVER_PRESETS,
  CATEGORY_PRESETS
} from "@/data/userProfile";
import { albums as mockAlbums } from "@/data/mockApp";
import { getBackgroundStyles, getBackgroundOverlay, getBackgroundTextStyles } from "@/data/postBackgrounds";
import { getFontFamily } from "@/data/postFonts";
import FeedCard from "@/components/ui/FeedCard";
import UserAvatar from "@/components/ui/UserAvatar";
import WavesBackground from "@/components/layout/WavesBackground";
import { useAuth } from "@/context/AuthProvider";
import {
  getProfileFromBackend,
  updateProfileOnBackend,
  getMemoriesFromBackend,
  getFollowers,
  getFollowing,
  getFamilyMembers,
  deleteMemoryOnBackend,
  updateMemoryOnBackend,
  getBackendErrorMessage
} from "@/services/backend";

export default function ProfilePage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [localMemories, setLocalMemories] = useState([]);
  const [activeTab, setActiveTab] = useState("memories"); // "memories", "albums"
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [custodianName, setCustodianName] = useState("None assigned");
  const [loadingData, setLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    bio: "",
    birthDate: "",
    categories: [],
    goals: "",
    projects: "",
    achievements: "",
    interests: "",
    lessons: "",
    values: "",
    causes: "",
    personalityQs: []
  });

  // Avatar/Cover Presets State
  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const [editCoverOpen, setEditCoverOpen] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");
  const [coverInput, setCoverInput] = useState("");

  // Edit memory state
  const [editMemoryOpen, setEditMemoryOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [memoryEditData, setMemoryEditData] = useState({ title: "", description: "", privacy: "" });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState(null);

  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (firebaseUser) {
      loadProfileAndMemories();
    } else if (!authLoading) {
      setLoadingData(false);
    }
  }, [firebaseUser, authLoading]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      if (firebaseUser) loadProfileAndMemories();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, [firebaseUser]);

  async function loadProfileAndMemories() {
    if (!firebaseUser) return;
    setLoadingData(true);
    setErrorMsg("");
    try {
      const token = await firebaseUser.getIdToken();
      const profile = await getProfileFromBackend(token);
      setUserProfile(profile);
      setFormData({
        name: profile.displayName || "",
        role: profile.profession || "",
        location: profile.location || "",
        bio: profile.bio || "",
        birthDate: profile.birthDate ? profile.birthDate.split("T")[0] : "",
        categories: profile.expertise || [],
        goals: profile.goals || "",
        projects: profile.projects || "",
        achievements: profile.achievements || "",
        interests: profile.interests || "",
        lessons: profile.lessons || "",
        values: profile.values || "",
        causes: profile.causes || "",
        personalityQs: profile.personalityQs || [
          { q: "What is your happiest memory from childhood?", a: "" },
          { q: "How would you like to be remembered?", a: "" }
        ]
      });
      setAvatarInput(profile.photoURL || "");
      setCoverInput(profile.coverURL || "");
      setFollowingCount(profile.followingCount || 0);
      setFollowersCount(profile.followersCount || 0);

      // Fetch family members to resolve custodian name
      try {
        const family = await getFamilyMembers(token);
        if (family && family.length > 0) {
          setCustodianName(family[0].name);
        } else {
          setCustodianName("None assigned");
        }
      } catch (err) {
        console.warn("Failed to load family members for custodian name:", err);
        setCustodianName("None assigned");
      }

      const memories = await getMemoriesFromBackend(token, profile.firebaseUid);
      setLocalMemories(memories || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load profile details: " + getBackendErrorMessage(err));
    } finally {
      setLoadingData(false);
    }
  }

  function triggerNotice(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  }

  // Toggle category choice
  function toggleCategory(cat) {
    setFormData(prev => {
      const active = prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: active };
    });
  }

  // Save inline profile info
  async function handleSaveInlineInfo() {
    try {
      const token = await firebaseUser.getIdToken();
      const sendData = new FormData();
      sendData.append("displayName", formData.name.trim());
      sendData.append("profession", formData.role.trim());
      sendData.append("location", formData.location.trim());
      sendData.append("bio", formData.bio.trim());
      sendData.append("birthDate", formData.birthDate);
      sendData.append("expertise", JSON.stringify(formData.categories));
      sendData.append("goals", formData.goals.trim());
      sendData.append("projects", formData.projects.trim());
      sendData.append("achievements", formData.achievements.trim());
      sendData.append("interests", formData.interests.trim());
      sendData.append("lessons", formData.lessons.trim());
      sendData.append("values", formData.values.trim());
      sendData.append("causes", formData.causes.trim());
      sendData.append("personalityQs", JSON.stringify(formData.personalityQs));

      const updatedProfile = await updateProfileOnBackend(token, sendData);
      setUserProfile(updatedProfile);
      
      setFormData({
        name: updatedProfile.displayName || "",
        role: updatedProfile.profession || "",
        location: updatedProfile.location || "",
        bio: updatedProfile.bio || "",
        birthDate: updatedProfile.birthDate ? updatedProfile.birthDate.split("T")[0] : "",
        categories: updatedProfile.expertise || [],
        goals: updatedProfile.goals || "",
        projects: updatedProfile.projects || "",
        achievements: updatedProfile.achievements || "",
        interests: updatedProfile.interests || "",
        lessons: updatedProfile.lessons || "",
        values: updatedProfile.values || "",
        causes: updatedProfile.causes || "",
        personalityQs: updatedProfile.personalityQs || []
      });

      setAvatarInput(updatedProfile.photoURL || "");
      setCoverInput(updatedProfile.coverURL || "");

      setIsEditing(false);
      triggerNotice("Profile updated successfully!");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error(err);
      triggerNotice("Error saving profile: " + getBackendErrorMessage(err));
    }
  }

  // Save Avatar preset/URL
  async function handleSaveAvatar(url) {
    if (!url || !url.trim()) return;
    try {
      const token = await firebaseUser.getIdToken();
      const formDataToSend = new FormData();
      formDataToSend.append("photoURL", url.trim());

      const updatedProfile = await updateProfileOnBackend(token, formDataToSend);
      setUserProfile(updatedProfile);
      setAvatarInput(updatedProfile.photoURL || "");
      setEditAvatarOpen(false);
      triggerNotice("Profile picture updated!");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error(err);
      triggerNotice("Error saving profile picture: " + getBackendErrorMessage(err));
    }
  }

  // Save Cover preset/URL
  async function handleSaveCover(url) {
    if (!url || !url.trim()) return;
    try {
      const token = await firebaseUser.getIdToken();
      const formDataToSend = new FormData();
      formDataToSend.append("coverURL", url.trim());

      const updatedProfile = await updateProfileOnBackend(token, formDataToSend);
      setUserProfile(updatedProfile);
      setCoverInput(updatedProfile.coverURL || "");
      setEditCoverOpen(false);
      triggerNotice("Cover photo updated!");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error(err);
      triggerNotice("Error saving cover photo: " + getBackendErrorMessage(err));
    }
  }

  // Avatar file upload handler
  async function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const token = await firebaseUser.getIdToken();
      const formDataToSend = new FormData();
      formDataToSend.append("profileImage", file);

      const updatedProfile = await updateProfileOnBackend(token, formDataToSend);
      setUserProfile(updatedProfile);
      setAvatarInput(updatedProfile.photoURL || "");
      setEditAvatarOpen(false);
      triggerNotice("Profile picture uploaded successfully!");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error(err);
      triggerNotice("Error uploading avatar: " + getBackendErrorMessage(err));
    }
  }

  // Cover file upload handler
  async function handleCoverFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const token = await firebaseUser.getIdToken();
      const formDataToSend = new FormData();
      formDataToSend.append("coverImage", file);

      const updatedProfile = await updateProfileOnBackend(token, formDataToSend);
      setUserProfile(updatedProfile);
      setCoverInput(updatedProfile.coverURL || "");
      setEditCoverOpen(false);
      triggerNotice("Cover photo uploaded successfully!");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error(err);
      triggerNotice("Error uploading cover: " + getBackendErrorMessage(err));
    }
  }

  // Memory Actions: Delete
  async function handleDeleteMemory(id) {
    if (!confirm("Are you sure you want to delete this memory forever?")) return;
    try {
      const token = await firebaseUser.getIdToken();
      await deleteMemoryOnBackend(token, id);
      await loadProfileAndMemories();
      triggerNotice("Memory deleted.");
    } catch (err) {
      console.error(err);
      triggerNotice("Error deleting memory: " + getBackendErrorMessage(err));
    }
  }

  // Memory Actions: Edit
  function handleStartEditMemory(memory) {
    setEditingMemory(memory);
    setMemoryEditData({
      title: memory.title,
      description: memory.description,
      privacy: memory.audiences?.[0] || memory.privacy?.toLowerCase() || "public"
    });
    setEditMemoryOpen(true);
  }

  async function handleSaveMemoryEdit(e) {
    e.preventDefault();
    if (!editingMemory) return;
    try {
      const token = await firebaseUser.getIdToken();
      const formDataToSend = new FormData();
      formDataToSend.append("title", memoryEditData.title.trim());
      formDataToSend.append("description", memoryEditData.description.trim());
      formDataToSend.append("privacy", memoryEditData.privacy === "public" ? "Public" : memoryEditData.privacy === "family" ? "Family Circle" : "Private");

      await updateMemoryOnBackend(token, editingMemory.id, formDataToSend);
      await loadProfileAndMemories();
      setEditMemoryOpen(false);
      setEditingMemory(null);
      triggerNotice("Memory updated successfully!");
    } catch (err) {
      console.error(err);
      triggerNotice("Error updating memory: " + getBackendErrorMessage(err));
    }
  }

  function formatBirthday(dateStr) {
    if (!dateStr) return "Not set";
    try {
      const options = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
      return new Date(dateStr).toLocaleDateString("en-US", options);
    } catch {
      return dateStr;
    }
  }

  if (authLoading || loadingData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-stone-400">
        <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
        <p className="text-xs font-black uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-rose-500 border border-rose-100 rounded-2xl bg-rose-50/20 max-w-lg mx-auto p-8 text-center">
        <Loader2 className="text-rose-500 animate-pulse" size={32} />
        <h2 className="text-lg font-black">Something went wrong</h2>
        <p className="text-sm font-bold">{errorMsg}</p>
        <button onClick={loadProfileAndMemories} className="mt-3 px-6 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black text-xs transition">Retry</button>
      </div>
    );
  }

  if (!firebaseUser || !userProfile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-stone-400">
        <User size={40} className="text-stone-300" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-xs font-semibold text-center max-w-xs">Please sign in to view your profile and legacy details.</p>
        <Link href="/login" className="mt-3 px-6 py-2.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black text-xs transition active:scale-95">Sign In</Link>
      </div>
    );
  }

  const hasLegacyDetails = !!(
    userProfile.goals ||
    userProfile.achievements ||
    userProfile.projects ||
    userProfile.interests ||
    userProfile.lessons ||
    userProfile.values ||
    userProfile.causes ||
    (userProfile.personalityQs && userProfile.personalityQs.some(item => item.a))
  );

  // Helper to format date cleanly
  function formatBirthDateText(dateStr) {
    if (!dateStr) return "Born March 1985";
    try {
      const date = new Date(dateStr);
      const options = { month: "long", year: "numeric", timeZone: "UTC" };
      return `Born ${date.toLocaleDateString("en-US", options)}`;
    } catch {
      return "Born March 1985";
    }
  }

  const displayName = userProfile.displayName || "Sarah Mitchell";
  const profession = userProfile.profession || "Entrepreneur";
  const location = userProfile.location || "Portland, OR";
  const defaultExpertise = userProfile.expertise && userProfile.expertise.length > 0 ? userProfile.expertise : ["Entrepreneurship", "Parenting", "Wellness", "Writing"];
  const coverURL = userProfile.coverURL || "https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=1200&q=80";
  const avatarURL = userProfile.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80";
  const bio = userProfile.bio || "Documenting my journey from small-town dreamer to business owner, mother, and lifelong learner.";
  const quote = userProfile.values || "Live intentionally, love deeply, leave a legacy of kindness.";

  return (
    <WavesBackground>
      <div className="relative z-10 w-full max-w-xl md:max-w-5xl mx-auto space-y-6">
        {/* Notice Banner */}
        {notice && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/95 text-white px-4 py-3 shadow-xl backdrop-blur-md animate-fade-in font-bold">
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}

        {/* Profile Card Header (Cover Photo & Avatar) */}
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-[#162033] shadow-lg border border-stone-150/40 dark:border-stone-850">
          {/* Cover Photo */}
          <div 
            onClick={() => setViewerImage({ url: coverURL, title: "Cover Photo", onEdit: () => setEditCoverOpen(true) })}
            className="relative h-48 md:h-64 bg-stone-100 group overflow-hidden cursor-pointer"
          >
            <img src={coverURL} alt="Cover" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.01]" />
            <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setEditCoverOpen(true);
              }}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 text-[10px] font-black shadow-lg transition duration-200 cursor-pointer"
            >
              <Camera size={12} />
              Edit Cover
            </button>
          </div>

          {/* Profile Avatar & Details Section */}
          <div className="px-6 pb-6 pt-3 text-center relative flex flex-col items-center">
            {/* Symmetrical iOS-like Rounded Square Avatar */}
            <div className="relative z-10 -mt-16 md:-mt-20 w-28 h-28 md:w-32 md:h-32">
              <div 
                onClick={() => setViewerImage({ url: avatarURL, title: "Profile Picture", onEdit: () => setEditAvatarOpen(true) })}
                className="w-full h-full border-4 border-white dark:border-[#162033] shadow-xl bg-stone-200 rounded-[2rem] overflow-hidden cursor-pointer"
              >
                <img src={avatarURL} alt={displayName} className="w-full h-full object-cover" />
              </div>
              
              {/* Floating Camera Edit Button at bottom-right of avatar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditAvatarOpen(true);
                }}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 z-20"
                title="Edit Profile Picture"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Centered Name */}
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="text-center text-2xl font-black bg-white dark:bg-stone-850 border border-[var(--border)] rounded-xl px-4 py-2 outline-none text-[var(--ink)] dark:text-white max-w-sm mt-3 focus:border-[var(--brand)]"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-stone-850 dark:text-white mt-3 leading-tight">{displayName}</h1>
            )}

            {/* 3 Stacked Icons Details Row */}
            {isEditing ? (
              <div className="flex justify-center items-center gap-4 mt-4 w-full">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#eff0ff] dark:bg-[#25284b] flex items-center justify-center text-[#5e4eff] dark:text-[#8f83ff]">
                    <Briefcase size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Role"
                    className="text-center text-[10px] font-bold bg-white dark:bg-stone-850 border border-[var(--border)] rounded-lg px-1.5 py-1 mt-2 outline-none w-full focus:border-[var(--brand)]"
                  />
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#eff0ff] dark:bg-[#25284b] flex items-center justify-center text-[#5e4eff] dark:text-[#8f83ff]">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Location"
                    className="text-center text-[10px] font-bold bg-white dark:bg-stone-850 border border-[var(--border)] rounded-lg px-1.5 py-1 mt-2 outline-none w-full focus:border-[var(--brand)]"
                  />
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#eff0ff] dark:bg-[#25284b] flex items-center justify-center text-[#5e4eff] dark:text-[#8f83ff]">
                    <CalendarDays size={18} />
                  </div>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="text-center text-[10px] font-bold bg-white dark:bg-stone-850 border border-[var(--border)] rounded-lg px-1 py-0.5 mt-2 outline-none w-full focus:border-[var(--brand)]"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-6 mt-4 w-full px-4">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#eff0ff] dark:bg-[#25284b] flex items-center justify-center text-[#5e4eff] dark:text-[#8f83ff] shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <span className="text-xs font-semibold text-stone-500 mt-2 truncate max-w-full">{profession}</span>
                </div>
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#eff0ff] dark:bg-[#25284b] flex items-center justify-center text-[#5e4eff] dark:text-[#8f83ff] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <span className="text-xs font-semibold text-stone-500 mt-2 truncate max-w-full">{location}</span>
                </div>
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#eff0ff] dark:bg-[#25284b] flex items-center justify-center text-[#5e4eff] dark:text-[#8f83ff] shrink-0">
                    <CalendarDays size={18} />
                  </div>
                  <span className="text-xs font-semibold text-stone-500 mt-2 truncate max-w-full">{formatBirthDateText(userProfile.birthDate)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Grid layout for desktop, sequential stack for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column on Desktop (Bio, Tags, Actions, Quotes, Banner) */}
          <div className="md:col-span-6 space-y-6">
            {/* Bio Card (Outlined Box) */}
            <div className="p-5 rounded-3xl border border-[#c8c5ff] bg-white/70 dark:bg-[#162033]/50 dark:border-[#383c66]/40 shadow-sm">
              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-center text-xs md:text-sm font-semibold bg-white dark:bg-stone-855 rounded-xl p-3 border border-[var(--border)] outline-none focus:border-[var(--brand)] resize-none text-stone-700 dark:text-stone-300"
                  placeholder="Short biography..."
                />
              ) : (
                <p className="text-center text-xs md:text-sm font-semibold leading-relaxed text-stone-700 dark:text-stone-300">
                  {bio}
                </p>
              )}
            </div>

            {/* Areas of Expertise */}
            <div className="text-left space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Areas of Expertise</span>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {CATEGORY_PRESETS.map((cat) => {
                    const selected = formData.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`flex items-center justify-between px-2.5 py-1 rounded-lg border text-[9px] font-black transition cursor-pointer ${
                          selected
                            ? "bg-[var(--brand-soft)] border-[var(--brand)] text-[var(--brand)]"
                            : "bg-[var(--background)] border-[var(--border)] text-stone-500 hover:bg-stone-50"
                        }`}
                      >
                        <span>{cat}</span>
                        {selected && <Check size={8} />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {defaultExpertise.map((badge) => (
                    <span key={badge} className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#e3f2fd] text-[#1e88e5] dark:bg-[#1a237e]/30 dark:text-[#42a5f5] border border-[#bbdefb]/40">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleSaveInlineInfo}
                  className="flex-1 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-750 text-xs font-black text-white shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
                >
                  <Save size={15} />
                  Save Details
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: userProfile.displayName || "",
                      role: userProfile.profession || "",
                      location: userProfile.location || "",
                      bio: userProfile.bio || "",
                      birthDate: userProfile.birthDate ? userProfile.birthDate.split("T")[0] : "",
                      categories: userProfile.expertise || [],
                      goals: userProfile.goals || "",
                      projects: userProfile.projects || "",
                      achievements: userProfile.achievements || "",
                      interests: userProfile.interests || "",
                      lessons: userProfile.lessons || "",
                      values: userProfile.values || "",
                      causes: userProfile.causes || "",
                      personalityQs: userProfile.personalityQs || []
                    });
                  }}
                  className="flex-1 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-black text-stone-700 dark:bg-stone-850 dark:border-stone-750 dark:text-stone-300 transition-all active:scale-95 duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-[#4f37ff] dark:border-[#8f83ff] text-xs font-black text-[#4f37ff] dark:text-[#8f83ff] hover:bg-[#4f37ff]/5 transition-all active:scale-95 duration-200 cursor-pointer bg-white dark:bg-[#162033]"
                >
                  <Edit2 size={13} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex-1 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#4f37ff] hover:bg-[#3b23e0] text-xs font-black text-white shadow-lg shadow-[#4f37ff]/20 transition-all active:scale-95 duration-200 cursor-pointer"
                >
                  Share Legacy
                </button>
              </div>
            )}

            {/* Quotes Card */}
            <div className="p-6 rounded-3xl border border-[#d2d5ff] bg-[#eef0ff]/55 dark:bg-[#1a1d35]/25 dark:border-[#383c66]/30 relative overflow-hidden flex flex-col items-center justify-center shadow-sm min-h-[140px]">
              <span className="absolute top-1 left-4 text-8xl font-serif text-[#c5c8ff]/30 dark:text-[#4a4f80]/15 pointer-events-none select-none">“</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.values}
                  onChange={e => setFormData({ ...formData, values: e.target.value })}
                  className="w-full text-center text-sm md:text-base font-black bg-white dark:bg-stone-850 rounded-xl p-3 border border-[var(--border)] outline-none focus:border-[var(--brand)] resize-none text-[#2a1b94] dark:text-[#8f83ff] italic relative z-10"
                  placeholder="Your core legacy quote/value..."
                />
              ) : (
                <p className="text-center text-base md:text-lg font-black leading-relaxed text-[#2a1b94] dark:text-[#8f83ff] italic relative z-10 max-w-[90%]">
                  "{quote}"
                </p>
              )}
            </div>

            {/* Bottom Preserving Banner */}
            <div className="border border-[#d2d5ff] dark:border-[#383c66]/40 rounded-2xl p-4 bg-white/60 dark:bg-stone-900/30 text-center shadow-sm">
              <p className="text-xs md:text-sm font-bold text-[#4f37ff] dark:text-[#8f83ff] italic tracking-wide">
                "Changing The Way We Preserve Our Legacy"
              </p>
            </div>
          </div>

          {/* Right Column on Desktop (Stats Grid, Life Journey) */}
          <div className="md:col-span-6 space-y-6">
            {/* Stats Grid (2x2) */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { count: localMemories.length || 127, label: "All Memories" },
                { count: mockAlbums.length || 12, label: "Albums" },
                { count: localMemories.filter(m => m.tags?.includes("Milestone")).length || 18, label: "Milestones" },
                { count: followersCount || 342, label: "Followers" }
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl border border-[#d2d5ff] bg-[#eef0ff]/65 dark:bg-[#1a1d35]/40 dark:border-[#383c66]/40 flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-2xl md:text-3xl font-black text-stone-850 dark:text-white leading-none">{stat.count}</span>
                  <span className="text-[10px] font-bold text-stone-500 mt-2 uppercase tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Legacy Portrait & Life Journey Details Section */}
            {hasLegacyDetails || isEditing ? (
              <div className="rounded-3xl border border-[#d2d5ff] bg-white/70 dark:bg-[#162033]/50 p-6 text-left shadow-sm space-y-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-stone-400 pb-3 border-b border-[#4f37ff]/10 flex items-center gap-2">
                  <Sparkles className="text-[var(--brand)] animate-pulse" size={16} />
                  Legacy Portrait & Life Journey
                </h2>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1">
                        <Target size={11} className="text-sky-550" /> Goals & Aspirations
                      </label>
                      <textarea
                        rows={2}
                        value={formData.goals}
                        onChange={e => setFormData({ ...formData, goals: e.target.value })}
                        placeholder="Goals..."
                        className="w-full text-xs font-semibold bg-stone-50 dark:bg-stone-855 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1">
                        <Award size={11} className="text-amber-550" /> Achievements & Milestones
                      </label>
                      <textarea
                        rows={2}
                        value={formData.achievements}
                        onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                        placeholder="Achievements..."
                        className="w-full text-xs font-semibold bg-stone-50 dark:bg-stone-850 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1">
                        <Briefcase size={11} /> Projects & Ventures
                      </label>
                      <textarea
                        rows={2}
                        value={formData.projects}
                        onChange={e => setFormData({ ...formData, projects: e.target.value })}
                        placeholder="Projects..."
                        className="w-full text-xs font-semibold bg-stone-50 dark:bg-stone-850 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1">
                        <Sparkles size={11} /> Interests & Passions
                      </label>
                      <textarea
                        rows={2}
                        value={formData.interests}
                        onChange={e => setFormData({ ...formData, interests: e.target.value })}
                        placeholder="Interests..."
                        className="w-full text-xs font-semibold bg-stone-50 dark:bg-stone-850 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1">
                        <Lightbulb size={11} /> Life Lessons
                      </label>
                      <textarea
                        rows={2}
                        value={formData.lessons}
                        onChange={e => setFormData({ ...formData, lessons: e.target.value })}
                        placeholder="Lessons..."
                        className="w-full text-xs font-semibold bg-stone-50 dark:bg-stone-850 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1">
                        <HeartHandshake size={11} /> Causes & Advocacy
                      </label>
                      <input
                        type="text"
                        value={formData.causes}
                        onChange={e => setFormData({ ...formData, causes: e.target.value })}
                        placeholder="Causes..."
                        className="w-full text-xs font-semibold bg-stone-50 dark:bg-stone-850 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {userProfile.goals && (
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                          <Target size={12} /> Goals & Aspirations
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300">{userProfile.goals}</p>
                      </div>
                    )}
                    {userProfile.achievements && (
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                          <Award size={12} /> Achievements & Milestones
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300">{userProfile.achievements}</p>
                      </div>
                    )}
                    {userProfile.projects && (
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                          <Briefcase size={12} /> Projects & Ventures
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300">{userProfile.projects}</p>
                      </div>
                    )}
                    {userProfile.interests && (
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                          <Sparkles size={12} /> Interests & Passions
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300">{userProfile.interests}</p>
                      </div>
                    )}
                    {userProfile.lessons && (
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1">
                          <Lightbulb size={12} /> Life Lessons Learned
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300">{userProfile.lessons}</p>
                      </div>
                    )}
                    {userProfile.causes && (
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                          <HeartHandshake size={12} /> Causes I Care About
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300">{userProfile.causes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Personality Questions Answers */}
                {userProfile.personalityQs && userProfile.personalityQs.some(item => item.a) && (
                  <div className="pt-5 border-t border-[var(--border)]/45 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400">Reflections & Personality Q&A</h3>
                    <div className="space-y-4">
                      {userProfile.personalityQs.map((item, idx) => {
                        if (!item.a) return null;
                        return (
                          <div key={idx} className="bg-stone-50 dark:bg-[#1a1d35]/15 p-4 rounded-2xl border border-[var(--border)]/45 relative overflow-hidden group shadow-sm text-left">
                            <p className="text-xs font-extrabold text-[var(--ink)] dark:text-white mb-2 pb-2 border-b border-[var(--border)]/35 flex items-start gap-1">
                              <span className="text-[var(--brand)] font-serif italic text-lg leading-none">“</span>
                              {item.q}
                            </p>
                            <p className="text-xs font-semibold leading-relaxed text-stone-600 dark:text-stone-300 italic">
                              "{item.a}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div> {/* Closes Right Column */}
        </div> {/* Closes Split Grid container */}

        {/* Navigation Tab buttons (All Memories & Albums) */}
            <div className="flex items-center gap-4 bg-[var(--surface)] p-2 rounded-2xl border border-[var(--border)] shadow-sm">
              <button
                onClick={() => setActiveTab("memories")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  activeTab === "memories"
                    ? "bg-[var(--brand)] text-white shadow-sm"
                    : "text-stone-600 hover:bg-[var(--background)] hover:text-stone-850"
                }`}
              >
                <FileText size={14} />
                All Memories ({localMemories.length})
              </button>
              
              <button
                onClick={() => setActiveTab("albums")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  activeTab === "albums"
                    ? "bg-[var(--brand)] text-white shadow-sm"
                    : "text-stone-600 hover:bg-[var(--background)] hover:text-stone-850"
                }`}
              >
                <FolderHeart size={14} />
                Albums ({mockAlbums.length})
              </button>
            </div>

            {/* Main Content Area */}
            <div className="text-left">
              {activeTab === "memories" && (
                <div className="space-y-4">
                  {/* Quick Compose Box */}
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                    <div className="mb-3 flex gap-3">
                      <UserAvatar
                        src={userProfile.photoURL}
                        alt={displayName}
                        isActive={true}
                        size="md"
                      />
                      <Link
                        href="/record"
                        className="flex flex-1 items-center rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-left text-xs font-semibold text-stone-500 transition hover:border-[var(--brand)]"
                      >
                        Share a memory with the community...
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-3">
                      {[
                        ["Text", "text"],
                        ["Photo", "photo"],
                        ["Voice", "voice"],
                      ].map(([label, icon]) => (
                        <Link
                          key={label}
                          href={`/record?mode=${label}`}
                          className="flex h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-black text-stone-700 transition hover:bg-[var(--background)]"
                        >
                          <div className="scale-50 -mx-3 -my-3 shrink-0 text-[var(--brand)]">
                            {icon === "text" && <FileText size={24} />}
                            {icon === "photo" && <CameraIcon size={24} />}
                            {icon === "voice" && <Mic size={24} />}
                          </div>
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Memories stream */}
                  {localMemories.length > 0 ? (
                    localMemories.map((memory) => (
                      <FeedCard
                        key={memory.id}
                        memory={memory}
                        onEdit={handleStartEditMemory}
                        onDelete={handleDeleteMemory}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
                      <p className="text-xs font-bold text-stone-500">You haven't preserved any memories yet. Start by capturing one!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "albums" && (
                mockAlbums.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    {mockAlbums.map((album) => (
                      <Link
                        key={album.id}
                        href={`/albums/${album.id}?from=profile`}
                        className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm cursor-pointer transition active:scale-[0.98] block"
                      >
                        <img src={album.cover} alt={album.title} className="h-full w-full object-cover transition duration-505 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <h4 className="text-base font-black leading-tight">{album.title}</h4>
                          <p className="text-[9px] font-semibold opacity-85 mt-1 uppercase tracking-wider">Open Gallery</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
                    <FolderHeart size={64} className="text-stone-400 mb-4" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-stone-850 dark:text-white mb-2">No albums yet</h3>
                    <p className="text-sm text-stone-500 max-w-sm">Create albums in the Albums tab to organize your memories</p>
                  </div>
                )
              )}
            </div>

      </div>

      {/* Fullscreen Image Viewer Modal */}
      {viewerImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setViewerImage(null)}
        >
          {/* Close button */}
          <button 
            onClick={() => setViewerImage(null)}
            className="absolute top-6 right-6 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X size={24} />
          </button>

          {/* Image Container */}
          <div 
            className="w-full max-w-3xl flex flex-col items-center gap-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={viewerImage.url} 
              alt={viewerImage.title} 
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl" 
            />
            
            <div className="flex items-center gap-4 text-white">
              <span className="text-sm font-bold">{viewerImage.title}</span>
              <button
                onClick={() => {
                  viewerImage.onEdit();
                }}
                className="flex items-center gap-1.5 rounded-full bg-[#4f37ff] hover:bg-[#3b23e0] text-white px-4 py-1.5 text-xs font-black shadow-lg transition duration-200 cursor-pointer"
              >
                <Camera size={12} />
                Update Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-[#c8c5ff] bg-white dark:bg-[#162033] p-6 shadow-2xl animate-scale-up text-left relative">
            
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[#4f37ff]/10 pb-3">
              <h3 className="text-base font-extrabold text-[#4f37ff] dark:text-[#8f83ff]">Share Profile</h3>
              <button 
                onClick={() => setShareModalOpen(false)} 
                className="rounded-lg p-1 hover:bg-stone-100 dark:hover:bg-stone-855 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-stone-500 leading-relaxed">
                Share "{displayName}'s Profile" with the world or someone special.
              </p>
            </div>

            {/* Social Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(displayName)}'s legacy profile on Spoken Odyssey!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-black hover:bg-stone-900 text-white text-xs font-bold transition shadow-sm"
              >
                {/* Clean X vector icon */}
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter / X
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://spokenodyssey.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold transition shadow-sm"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
                Facebook
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(displayName + "'s Profile — Spoken Odyssey")}&body=Check out this legacy profile: ${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://spokenodyssey.com')}`}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#ea4335] hover:bg-[#d93025] text-white text-xs font-bold transition shadow-sm"
              >
                <Mail size={16} className="shrink-0" />
                Email
              </a>

              {/* Copy Link */}
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    triggerNotice("Link copied to clipboard!");
                  }
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#eff0ff] hover:bg-[#e0e2ff] text-[#5e4eff] dark:text-[#8f83ff] text-xs font-bold transition cursor-pointer"
              >
                <Link2 size={16} className="shrink-0" />
                Copy Link
              </button>
            </div>

            {/* Copyable Link Field */}
            <div className="border border-[#c8c5ff]/50 rounded-xl p-2 bg-[#eff0ff]/35 dark:bg-[#1f223f]/25 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-stone-500 truncate select-all px-1 max-w-[180px]">
                {typeof window !== 'undefined' ? window.location.hostname + window.location.pathname : 'spokenodyssey.com/profile'}
              </span>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    triggerNotice("Link copied to clipboard!");
                  }
                }}
                className="flex h-8 items-center gap-1 rounded-lg bg-[#4f37ff] hover:bg-[#3b23e0] text-white px-3 text-[10px] font-extrabold shadow-sm transition active:scale-95 cursor-pointer shrink-0"
              >
                <Copy size={11} />
                Copy
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer Modal */}
      {viewerImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setViewerImage(null)}
        >
          {/* Close button */}
          <button 
            onClick={() => setViewerImage(null)}
            className="absolute top-6 right-6 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X size={24} />
          </button>

          {/* Image Container */}
          <div 
            className="w-full max-w-3xl flex flex-col items-center gap-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={viewerImage.url} 
              alt={viewerImage.title} 
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl" 
            />
            
            <div className="flex items-center gap-4 text-white">
              <span className="text-sm font-bold">{viewerImage.title}</span>
              <button
                onClick={() => {
                  viewerImage.onEdit();
                }}
                className="flex items-center gap-1.5 rounded-full bg-[#4f37ff] hover:bg-[#3b23e0] text-white px-4 py-1.5 text-xs font-black shadow-lg transition duration-200 cursor-pointer"
              >
                <Camera size={12} />
                Update Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Avatar Presets Modal */}
      {editAvatarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-scale-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black">Edit Profile Picture</h3>
              <button onClick={() => setEditAvatarOpen(false)} className="rounded-lg p-1.5 hover:bg-[var(--background)] transition cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="text-left mb-5">
              <p className="text-xs font-black uppercase text-stone-500 mb-2.5">Choose Preset</p>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setAvatarInput(preset.url);
                      handleSaveAvatar(preset.url);
                    }}
                    className={`h-16 w-16 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                      avatarInput === preset.url ? "border-[var(--brand)] shadow-md scale-105" : "border-transparent opacity-85 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-left">
              <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Or Paste Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={avatarInput}
                  onChange={e => setAvatarInput(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[var(--brand)] dark:text-white"
                />
                <button
                  onClick={() => handleSaveAvatar(avatarInput)}
                  className="flex h-10 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-xs font-black text-white hover:bg-[var(--brand-hover)] transition cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </div>

            <div className="text-left mt-4 border-t border-[var(--border)] pt-4">
              <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Or Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="w-full text-xs font-bold text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-[var(--brand-soft)] file:text-[var(--brand)] hover:file:bg-[var(--brand-soft)]/80 file:cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Cover Presets Modal */}
      {editCoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-scale-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black">Edit Cover Photo</h3>
              <button onClick={() => setEditCoverOpen(false)} className="rounded-lg p-1.5 hover:bg-[var(--background)] transition cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="text-left mb-5">
              <p className="text-xs font-black uppercase text-stone-500 mb-2.5">Choose Preset</p>
              <div className="grid grid-cols-2 gap-3">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setCoverInput(preset.url);
                      handleSaveCover(preset.url);
                    }}
                    className={`h-20 rounded-lg overflow-hidden border-2 transition relative group cursor-pointer ${
                      coverInput === preset.url ? "border-[var(--brand)] shadow-md scale-[1.02]" : "border-transparent opacity-85 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 left-2 text-[9px] font-black bg-black/50 text-white px-1.5 rounded uppercase tracking-wider">{preset.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-left">
              <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Or Paste Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/cover.jpg"
                  value={coverInput}
                  onChange={e => setCoverInput(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[var(--brand)] dark:text-white"
                />
                <button
                  onClick={() => handleSaveCover(coverInput)}
                  className="flex h-10 items-center justify-center rounded-lg bg-[var(--brand)] px-4 text-xs font-black text-white hover:bg-[var(--brand-hover)] transition cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </div>

            <div className="text-left mt-4 border-t border-[var(--border)] pt-4">
              <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Or Upload Cover File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="w-full text-xs font-bold text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-[var(--brand-soft)] file:text-[var(--brand)] hover:file:bg-[var(--brand-soft)]/80 file:cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Memory Caption/Title Modal (Kept for card content edits) */}
      {editMemoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-scale-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black">Edit Memory Post</h3>
              <button onClick={() => { setEditMemoryOpen(false); setEditingMemory(null); }} className="rounded-lg p-1.5 hover:bg-[var(--background)] transition cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveMemoryEdit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Title</label>
                <input
                  required
                  type="text"
                  value={memoryEditData.title}
                  onChange={e => setMemoryEditData({ ...memoryEditData, title: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] outline-none focus:border-[var(--brand)] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Caption / Description</label>
                <textarea
                  required
                  rows={4}
                  value={memoryEditData.description}
                  onChange={e => setMemoryEditData({ ...memoryEditData, description: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] outline-none focus:border-[var(--brand)] dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5">Privacy Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "private", label: "Private", icon: Lock },
                    { id: "family", label: "Family", icon: Users },
                    { id: "public", label: "Public", icon: Globe }
                  ].map((aud) => {
                    const AudIcon = aud.icon;
                    const isSelected = memoryEditData.privacy === aud.id;
                    return (
                      <button
                        key={aud.id}
                        type="button"
                        onClick={() => setMemoryEditData({ ...memoryEditData, privacy: aud.id })}
                        className={`flex h-11 items-center justify-center gap-1.5 rounded-lg border text-xs font-black transition cursor-pointer ${
                          isSelected
                            ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                            : "border-[var(--border)] bg-[var(--background)] text-stone-500 hover:bg-stone-50"
                        }`}
                      >
                        <AudIcon size={13} />
                        {aud.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-sm font-black text-white transition active:scale-[0.98] cursor-pointer"
              >
                <Save size={16} />
                Update Memory
              </button>
            </form>
          </div>
        </div>
      )}
    </WavesBackground>
  );
}
