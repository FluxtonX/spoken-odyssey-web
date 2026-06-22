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
  Loader2
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

  return (
    <div className="w-full max-w-5xl pb-24 animation-fade-in text-[var(--foreground)]">
      {/* Notice Banner */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/95 text-white px-4 py-3 shadow-xl backdrop-blur-md animate-fade-in font-bold">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Facebook style Header */}
      <header className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
        {/* Cover Photo */}
        <div className="relative h-60 bg-stone-100 sm:h-72 md:h-80 group overflow-hidden">
          <img src={userProfile.coverURL || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"} alt="Cover cover photo" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.01]" />
          <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />
          <button 
            onClick={() => setEditCoverOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 hover:bg-black/80 text-white px-4 py-2 text-xs font-black shadow-lg transition duration-200"
          >
            <Camera size={14} />
            Edit Cover Photo
          </button>
        </div>

        {/* Profile Avatar & Info Row */}
        <div className="px-6 pb-6 text-center sm:text-left">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-5 mb-4 w-full">
            {/* Profile Avatar with Hover camera icon */}
            <UserAvatar
              src={userProfile.photoURL}
              alt={userProfile.displayName || "Alexander Mitchell"}
              isActive={true}
              size="xl"
              className="z-10 -mt-16 sm:-mt-20 self-center sm:self-start border-4 border-[var(--surface)] shadow-xl bg-stone-200 rounded-full group"
            >
              <button
                onClick={() => setEditAvatarOpen(true)}
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <Camera size={20} className="mb-1" />
                <span className="text-[9px] font-black uppercase">Edit Photo</span>
              </button>
            </UserAvatar>
            
            {/* Name, Bio, and Stats Row */}
            <div className="pb-2 pt-2 sm:pt-6 flex-1 min-w-0 w-full">
              {/* Name & Edit Button flex header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                {/* Inline Name Editing */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        className="text-2xl font-black bg-transparent border-b border-[var(--brand)] outline-none text-[var(--ink)] dark:text-white pb-1 w-full max-w-md focus:border-b-2"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mt-0.5 leading-tight">{userProfile.displayName || "Alexander Mitchell"}</h1>
                  )}
                </div>

                {/* Edit Button Container */}
                <div className="flex shrink-0 justify-center md:justify-end">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveInlineInfo}
                        className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 text-sm font-black text-white shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
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
                        className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 px-4 text-sm font-black text-stone-700 transition-all active:scale-95 duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
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
                        setIsEditing(true);
                      }}
                      className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] px-5 text-sm font-black text-white shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                      <Edit2 size={15} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Subtitle / Role & counts */}
              <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold text-stone-500">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Role (e.g. Writer, Historian)"
                    className="text-xs font-bold bg-transparent border-b border-stone-300 outline-none text-stone-600 pb-0.5"
                  />
                ) : (
                  <p className="text-xs font-extrabold text-stone-500">{userProfile.profession || "Family Contributor"}</p>
                )}
                
                <span className="text-stone-300">•</span>
                
                <Link href="/followers" className="flex items-center gap-1 hover:text-[var(--brand)] transition cursor-pointer">
                  <Users size={13} className="text-stone-400" />
                  <span className="text-stone-700 dark:text-stone-200">{followersCount}</span> Followers
                </Link>
                
                <span className="text-stone-300">•</span>
                
                <Link href="/followers" className="flex items-center gap-1 hover:text-[var(--brand)] transition cursor-pointer">
                  <User size={13} className="text-stone-400" />
                  <span className="text-stone-700 dark:text-stone-200">{followingCount}</span> Following
                </Link>
              </div>

              {/* Display active category chips */}
              {!isEditing && userProfile.expertise && userProfile.expertise.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {userProfile.expertise.map(cat => (
                    <span key={cat} className="rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-extrabold px-2.5 py-0.5 border border-stone-200/50">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Integrated Intro & Details Card */}
          <div className="mt-6 pt-5 border-t border-[var(--border)]/55 text-left">
              <div className="flex items-center justify-between pb-3 mb-4">
                <h2 className="text-sm font-black tracking-tight text-[var(--ink)] dark:text-white uppercase">Intro & Details</h2>
                {isEditing && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--brand)]">Editing Details...</span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Bio Block */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Biography</p>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 rounded-lg p-2 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                        placeholder="Short bio..."
                      />
                    ) : (
                      <p className="text-xs font-bold leading-relaxed text-stone-600 dark:text-stone-300">
                        {userProfile.bio || "No biography added yet."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info details Block (Location & Birthday) */}
                <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-x border-stone-100 dark:border-stone-800 px-0 md:px-6 py-3 md:py-0">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                      <MapPin size={10} /> Location
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 rounded-lg p-2 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
                        placeholder="Location"
                      />
                    ) : (
                      <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
                        {userProfile.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                      <CalendarDays size={10} /> Birthday
                    </p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 rounded-lg p-2 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
                      />
                    ) : (
                      <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
                        {formatBirthday(userProfile.birthDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Tags Selector / Settings Block */}
                <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 border-stone-100 dark:border-stone-800 pt-3 md:pt-0">
                  {isEditing ? (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">Category tags</p>
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
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs border-b border-stone-100 dark:border-stone-800 pb-2">
                        <span className="flex items-center gap-1.5 font-bold text-stone-500">
                          <Lock size={12} /> Default privacy
                        </span>
                        <span className="font-extrabold text-stone-700 dark:text-stone-200">Family Circle</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-stone-500">
                          <ShieldCheck size={12} /> Custodian
                        </span>
                        <span className="font-extrabold text-stone-700 dark:text-stone-200">{custodianName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </header>

      {/* Legacy Portrait Section */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-md text-left">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]/55">
          <h2 className="text-base font-black tracking-tight text-[var(--ink)] dark:text-white uppercase flex items-center gap-2">
            <Sparkles className="text-[var(--brand)] animate-pulse" size={18} />
            Legacy Portrait & Life Journey
          </h2>
          {isEditing && (
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--brand)]">Editing Portrait...</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <Target size={12} className="text-sky-550" /> Goals & Aspirations
                </label>
                <textarea
                  rows={2}
                  value={formData.goals}
                  onChange={e => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="What are you working towards or hoping to achieve?"
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <Award size={12} className="text-amber-550" /> Achievements & Milestones
                </label>
                <textarea
                  rows={2}
                  value={formData.achievements}
                  onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="What are your proudest accomplishments?"
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <Briefcase size={12} className="text-purple-555" /> Projects & Ventures
                </label>
                <textarea
                  rows={2}
                  value={formData.projects}
                  onChange={e => setFormData({ ...formData, projects: e.target.value })}
                  placeholder="Describe your creative work, startups, or legacy projects..."
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <Sparkles size={12} className="text-rose-550" /> Interests & Passions
                </label>
                <textarea
                  rows={2}
                  value={formData.interests}
                  onChange={e => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="What are you passionate about?"
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <Lightbulb size={12} className="text-yellow-550" /> Life Lessons Learned
                </label>
                <textarea
                  rows={2}
                  value={formData.lessons}
                  onChange={e => setFormData({ ...formData, lessons: e.target.value })}
                  placeholder="What wisdom would you share with future generations?"
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <Globe size={12} className="text-emerald-550" /> Values & Beliefs
                </label>
                <textarea
                  rows={2}
                  value={formData.values}
                  onChange={e => setFormData({ ...formData, values: e.target.value })}
                  placeholder="What core values guide your decisions?"
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-stone-500 mb-1.5 flex items-center gap-1">
                  <HeartHandshake size={12} className="text-orange-550" /> Causes & Advocacy
                </label>
                <input
                  type="text"
                  value={formData.causes}
                  onChange={e => setFormData({ ...formData, causes: e.target.value })}
                  placeholder="What charity initiatives or issues do you support?"
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-850 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)]/40">
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-3">Personality Questions</p>
              <div className="space-y-4">
                {formData.personalityQs.map((item, idx) => (
                  <div key={idx} className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-[var(--border)]/45">
                    <p className="text-xs font-extrabold text-[var(--ink)] dark:text-white mb-2">{item.q}</p>
                    <textarea
                      rows={2}
                      value={item.a}
                      onChange={e => {
                        const updated = [...formData.personalityQs];
                        updated[idx] = { ...updated[idx], a: e.target.value };
                        setFormData({ ...formData, personalityQs: updated });
                      }}
                      placeholder="Share your reflection..."
                      className="w-full text-xs font-bold bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700 outline-none focus:border-[var(--brand)] resize-none text-[var(--ink)] dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!hasLegacyDetails ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-[var(--border)] rounded-2xl bg-stone-50/30 dark:bg-stone-900/10">
                <Sparkles className="text-[var(--brand)] mb-3 animate-pulse" size={24} />
                <h3 className="text-xs font-black uppercase text-[var(--ink)] dark:text-white tracking-wider">Your Legacy Portrait & Life Journey is Empty</h3>
                <p className="text-xs font-semibold text-stone-500 max-w-sm mt-1.5 leading-relaxed">
                  Share your life lessons, proud achievements, goals, and reflections with your family. Click the <strong>Edit Profile</strong> button above to start your story.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Goals Card */}
                  {userProfile.goals && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-sky-500/5 to-transparent hover:shadow-md transition duration-300">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
                        <Target size={14} /> Goals & Aspirations
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.goals}</p>
                    </div>
                  )}

                  {/* Achievements Card */}
                  {userProfile.achievements && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-amber-500/5 to-transparent hover:shadow-md transition duration-300">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                        <Award size={14} /> Achievements & Milestones
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.achievements}</p>
                    </div>
                  )}

                  {/* Projects Card */}
                  {userProfile.projects && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-purple-500/5 to-transparent hover:shadow-md transition duration-300">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                        <Briefcase size={14} /> Projects & Ventures
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.projects}</p>
                    </div>
                  )}

                  {/* Interests Card */}
                  {userProfile.interests && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-rose-500/5 to-transparent hover:shadow-md transition duration-300">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                        <Sparkles size={14} /> Interests & Passions
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.interests}</p>
                    </div>
                  )}

                  {/* Life Lessons Card */}
                  {userProfile.lessons && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-yellow-500/5 to-transparent hover:shadow-md transition duration-300">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-2">
                        <Lightbulb size={14} /> Life Lessons Learned
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.lessons}</p>
                    </div>
                  )}

                  {/* Values Card */}
                  {userProfile.values && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-emerald-500/5 to-transparent hover:shadow-md transition duration-300">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                        <Globe size={14} /> Values & Beliefs
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.values}</p>
                    </div>
                  )}

                  {/* Causes Card */}
                  {userProfile.causes && (
                    <div className="p-4 rounded-2xl border border-[var(--border)]/40 bg-gradient-to-br from-orange-500/5 to-transparent hover:shadow-md transition duration-300 md:col-span-2 lg:col-span-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
                        <HeartHandshake size={14} /> Causes I Care About
                      </span>
                      <p className="text-xs font-bold leading-relaxed text-stone-650 dark:text-stone-305">{userProfile.causes}</p>
                    </div>
                  )}
                </div>

                {/* Personality Questions Answers */}
                {userProfile.personalityQs && userProfile.personalityQs.some(item => item.a) && (
                  <div className="pt-6 border-t border-[var(--border)]/40">
                    <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-4">Reflections & Personality Q&A</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfile.personalityQs.map((item, idx) => {
                        if (!item.a) return null;
                        return (
                          <div key={idx} className="bg-stone-50 dark:bg-stone-800/40 p-5 rounded-2xl border border-[var(--border)]/45 relative overflow-hidden group hover:-translate-y-0.5 transition duration-300 shadow-sm text-left">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-[var(--brand)] opacity-[0.02] rounded-full blur-xl group-hover:scale-110 transition duration-500" />
                            <p className="text-xs font-extrabold text-[var(--ink)] dark:text-white mb-2 pb-2 border-b border-[var(--border)]/35 flex items-start gap-1.5">
                              <span className="text-[var(--brand)] font-serif italic text-lg leading-none">“</span>
                              {item.q}
                            </p>
                            <p className="text-xs font-bold leading-relaxed text-stone-600 dark:text-stone-300 italic">
                              "{item.a}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* Navigation Tab buttons (All Memories & Albums) */}
      <div className="mt-6 flex items-center gap-4 bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)] shadow-sm">
        <button
          onClick={() => setActiveTab("memories")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black transition cursor-pointer ${
            activeTab === "memories"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "text-stone-600 hover:bg-[var(--background)] hover:text-stone-800"
          }`}
        >
          <FileText size={15} />
          All Memories ({localMemories.length})
        </button>
        
        <button
          onClick={() => setActiveTab("albums")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black transition cursor-pointer ${
            activeTab === "albums"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "text-stone-600 hover:bg-[var(--background)] hover:text-stone-800"
          }`}
        >
          <FolderHeart size={15} />
          Albums ({mockAlbums.length})
        </button>
      </div>

      {/* Main Content Area: Centered, expanding to the full width */}
      <div className="mt-6">
        {activeTab === "memories" && (
          <div className="space-y-6">
            {/* Quick Compose Box */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <div className="mb-4 flex gap-3">
                <UserAvatar
                  src={userProfile.photoURL}
                  alt={userProfile.displayName || "Alexander Mitchell"}
                  isActive={true}
                  size="md"
                />
                <Link
                  href="/record"
                  className="flex flex-1 items-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-left text-xs font-semibold text-stone-500 transition hover:border-[var(--brand)]"
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
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
                <p className="text-sm font-bold text-stone-500">You haven't preserved any memories yet. Start by capturing one!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "albums" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {mockAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}?from=profile`}
                className="group relative h-48 rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm cursor-pointer transition active:scale-[0.98]"
              >
                <img src={album.cover} alt={album.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-black leading-tight">{album.title}</h4>
                  <p className="text-[10px] font-semibold opacity-80 mt-1 uppercase tracking-wider">Open Gallery</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
