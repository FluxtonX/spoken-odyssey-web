"use client";

import { Bell, ChevronRight, Search, Loader2, BookOpen, Image as ImageIcon, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { getStoredUserProfile } from "@/data/userProfile";
import { searchOnBackend, normalizeMediaUrl } from "@/services/backend";
import { memories as mockMemories } from "@/data/mockApp";
import HighlightText from "@/components/ui/HighlightText";

export default function DashboardHeader({ onSearchChange }) {
  const router = useRouter();
  const { profile, firebaseUser, logout, getToken } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  
  const displayName = profile?.displayName || profile?.name || firebaseUser?.displayName || userProfile?.name || "User";
  const displayEmail = profile?.email || firebaseUser?.email || "";
  const rawAvatar = profile?.avatarUrl || profile?.avatar || profile?.photoURL || profile?.image || userProfile?.avatar;
  const userAvatar = rawAvatar ? normalizeMediaUrl(rawAvatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4A3AFF&color=fff`;
  
  // Search & Auto-complete States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ memories: [], albums: [], people: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close dropdowns on click outside
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchDropdown(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function loadProfile() {
      setUserProfile(getStoredUserProfile());
    }
    loadProfile();
    window.addEventListener("profileUpdated", loadProfile);
    return () => window.removeEventListener("profileUpdated", loadProfile);
  }, []);

  // Debounced Live Search logic across Memories, Albums, and People/Family
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults({ memories: [], albums: [], people: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    const handler = setTimeout(async () => {
      let backendRes = null;
      try {
        const token = await getToken();
        if (token) {
          backendRes = await searchOnBackend(token, q);
        }
      } catch (err) {
        console.warn("Backend live search error, falling back to local search:", err.message);
      }

      // Combine backend results with local client data for 100% smooth coverage
      let localMemories = [];
      try {
        const saved = localStorage.getItem("spokenOdysseyLocalMemories");
        localMemories = saved ? JSON.parse(saved) : mockMemories;
      } catch {
        localMemories = mockMemories;
      }

      const matchedLocalMemories = localMemories.filter((m) => {
        const titleMatch = m.title?.toLowerCase().includes(q);
        const descMatch = m.description?.toLowerCase().includes(q);
        const tagMatch = (m.tags || []).some((t) => t.toLowerCase().includes(q));
        const dateMatch = (m.date || m.createdAt || "").toString().toLowerCase().includes(q);
        return titleMatch || descMatch || tagMatch || dateMatch;
      });

      // Default mock family & people for instant live auto-complete (e.g. Jack, Sarah, Sean)
      const mockPeople = [
        { id: "p1", name: "Jack O'Connor", role: "Brother", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
        { id: "p2", name: "Sarah Mitchell", role: "Cousin", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
        { id: "p3", name: "Brigid O'Brien", role: "Grandmother", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
        { id: "p4", name: "Alexander Mitchell", role: "Uncle", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80" },
      ];

      const matchedPeople = (backendRes?.people || []).length > 0 
        ? backendRes.people 
        : mockPeople.filter(p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));

      const mockAlbums = [
        { id: "a1", title: "Summer Family Trip '24", subtitle: "14 memories" },
        { id: "a2", title: "Grandpa's Stories", subtitle: "8 memories" },
        { id: "a3", title: "Car & Road Trips", subtitle: "22 memories" },
      ];

      const matchedAlbums = (backendRes?.albums || []).length > 0
        ? backendRes.albums
        : mockAlbums.filter(a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));

      const combinedMemories = [
        ...(backendRes?.memories || []),
        ...matchedLocalMemories.map(m => ({
          id: m._id || m.id,
          title: m.title,
          description: m.description,
          type: m.type || "voice",
          date: m.date || "2024"
        }))
      ].filter((item, index, self) => index === self.findIndex((t) => (t.id || t.title) === (item.id || item.title)));

      setSearchResults({
        memories: combinedMemories.slice(0, 5),
        albums: matchedAlbums.slice(0, 3),
        people: matchedPeople.slice(0, 3)
      });

      setIsSearching(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery, getToken]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      const val = searchQuery.trim();
      if (val) {
        setShowSearchDropdown(false);
        router.push(`/search?query=${encodeURIComponent(val)}`);
      }
    }
  };

  const totalResultsCount =
    searchResults.memories.length + searchResults.albums.length + searchResults.people.length;

  return (
    <div className="w-full border-b border-[#C7D2FE]/30 pb-4 mb-8 flex items-center justify-between gap-4">
      {/* Search bar with live auto-complete popover */}
      <div className="relative flex items-center flex-1 max-w-[220px] xs:max-w-xs sm:max-w-md" ref={searchRef}>
        <Search className="absolute left-3.5 text-[#4A3AFF]/80 pointer-events-none" size={16} />
        <input 
          type="text" 
          value={searchQuery}
          placeholder="Search memories, albums, people..." 
          onChange={handleInputChange}
          onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
          onKeyDown={handleSearchKeyPress}
          className="pl-10 pr-8 py-2 w-full rounded-full border border-[#C7D2FE]/60 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 text-sm transition-all text-stone-800 placeholder-stone-400 font-medium"
        />

        {searchQuery && (
          <button 
            onClick={() => { setSearchQuery(""); setShowSearchDropdown(false); if (onSearchChange) onSearchChange(""); }}
            className="absolute right-3 text-stone-400 hover:text-stone-600 transition"
          >
            <X size={14} />
          </button>
        )}

        {/* Live Auto-complete Dropdown Popover */}
        {showSearchDropdown && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2.5 dropdown-menu animate-fade-in z-50 bg-white/95 dark:bg-slate-900/95 border border-[#C7D2FE]/80 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center p-6 gap-2 text-stone-400 text-xs font-semibold">
                <Loader2 size={16} className="animate-spin text-[#4A3AFF]" />
                <span>Searching your Odyssey...</span>
              </div>
            ) : totalResultsCount === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs font-semibold">
                No matching memories, albums, or people found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="py-2 divide-y divide-stone-100 dark:divide-slate-800/60">
                {/* 1. People / Family Section */}
                {searchResults.people.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={12} className="text-[#0ea5e9]" />
                      <span>People & Family</span>
                    </div>
                    {searchResults.people.map((person) => (
                      <div
                        key={person.id || person.email}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          router.push(`/people/${person.id || "p1"}`);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEF2FF]/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
                      >
                        <img 
                          src={person.avatar || person.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"} 
                          alt={person.name} 
                          className="w-8 h-8 rounded-full object-cover border border-[#C7D2FE]/60" 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[13px] text-stone-800 dark:text-white truncate leading-tight">
                            <HighlightText text={person.name} query={searchQuery} />
                          </p>
                          <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate">
                            <HighlightText text={person.role || person.profession || person.location || "Family Member"} query={searchQuery} />
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-stone-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Memories Section */}
                {searchResults.memories.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen size={12} className="text-[#4A3AFF]" />
                      <span>Memories & Timeline</span>
                    </div>
                    {searchResults.memories.map((mem) => (
                      <div
                        key={mem.id || mem.title}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          router.push(`/memories?query=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEF2FF]/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-slate-800 flex items-center justify-center text-[#4A3AFF] shrink-0 font-bold text-xs">
                          {mem.type === "voice" ? "🎙️" : mem.type === "photo" ? "📸" : "📝"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[13px] text-stone-800 dark:text-white truncate leading-tight">
                            <HighlightText text={mem.title} query={searchQuery} />
                          </p>
                          <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate">
                            <HighlightText text={mem.description || mem.date || "Memory"} query={searchQuery} />
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-stone-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Albums Section */}
                {searchResults.albums.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                      <ImageIcon size={12} className="text-[#f59e0b]" />
                      <span>Albums</span>
                    </div>
                    {searchResults.albums.map((album) => (
                      <div
                        key={album.id || album.title}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          router.push(`/album/${album.id || "a1"}`);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEF2FF]/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 flex items-center justify-center text-[#f59e0b] shrink-0 font-bold text-xs">
                          📁
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[13px] text-stone-800 dark:text-white truncate leading-tight">
                            <HighlightText text={album.title} query={searchQuery} />
                          </p>
                          <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate">
                            <HighlightText text={album.subtitle || "Album Collection"} query={searchQuery} />
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-stone-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* View All Link */}
                <Link
                  href={`/search?query=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setShowSearchDropdown(false)}
                  className="block w-full py-2.5 text-center text-xs font-bold text-[#4A3AFF] hover:bg-[#EEF2FF]/50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  View all results for &quot;{searchQuery}&quot; &rarr;
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#C7D2FE]/40 bg-white/40 backdrop-blur-md shadow-sm hover:bg-stone-50 transition active:scale-95" 
            aria-label="Notifications"
          >
            <Bell size={18} className="text-stone-600" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-84 dropdown-menu animate-fade-in z-50 bg-white dark:bg-slate-900 border border-[#C7D2FE]/70 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-stone-900 dark:text-white text-[15px]">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#4A3AFF] dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-stone-100 dark:divide-slate-800/60">
                {[
                  { text: "Sarah shared 3 new memories with your Family Circle", time: "2h ago", unread: true },
                  { text: "Your monthly AI Life Summary is ready to view", time: "Yesterday", unread: true },
                  { text: "Brigid accepted your Family Circle invitation", time: "3 days ago", unread: false }
                ].map((notif, i) => (
                  <div key={i} className="flex gap-3 p-4 hover:bg-stone-50/80 dark:hover:bg-slate-800/60 transition cursor-pointer">
                    <div className="pt-1.5 shrink-0">
                      <div className={`h-2 w-2 rounded-full ${notif.unread ? 'bg-[#4A3AFF]' : 'bg-transparent'}`} />
                    </div>
                    <div>
                      <p className={`text-[13px] leading-snug ${notif.unread ? 'text-stone-800 dark:text-stone-200 font-semibold' : 'text-stone-600 dark:text-stone-400'}`}>{notif.text}</p>
                      <p className="text-[11px] text-stone-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/notifications" 
                onClick={() => setShowNotifications(false)}
                className="block w-full py-3 text-center text-xs font-bold text-[#4A3AFF] hover:text-[#3b2dd1] dark:text-indigo-400 hover:bg-[#EEF2FF]/40 dark:hover:bg-slate-800 border-t border-stone-100 dark:border-slate-800 transition cursor-pointer"
              >
                View all notifications &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2 sm:pr-4 py-1.5 rounded-full border border-[#C7D2FE]/40 bg-white/40 backdrop-blur-md shadow-sm hover:bg-stone-50 transition active:scale-95 cursor-pointer"
          >
            <img 
              src={userAvatar} 
              alt={displayName} 
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4A3AFF&color=fff`;
              }}
              className="h-8 w-8 rounded-full object-cover border border-[#C7D2FE] shrink-0" 
            />
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-200 hidden sm:block truncate max-w-[120px]">{displayName}</span>
            <ChevronRight size={14} className="text-stone-400 rotate-90 ml-0.5" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 dropdown-menu animate-fade-in z-50 py-2 bg-white dark:bg-slate-900 border border-[#C7D2FE]/70 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-100 dark:border-slate-800 flex items-center gap-3">
                <img 
                  src={userAvatar} 
                  alt={displayName} 
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4A3AFF&color=fff`;
                  }}
                  className="h-9 w-9 rounded-full object-cover border border-[#C7D2FE] shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-stone-900 dark:text-white truncate leading-tight">{displayName}</p>
                  {displayEmail && <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5">{displayEmail}</p>}
                </div>
              </div>
              <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center px-4 py-2.5 text-[14px] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 transition font-medium">View Profile</Link>
              <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center px-4 py-2.5 text-[14px] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 transition border-t border-stone-100 dark:border-slate-800/80 font-medium">Settings</Link>
              <Link href="/help" onClick={() => setShowProfileMenu(false)} className="flex items-center px-4 py-2.5 text-[14px] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 transition border-t border-stone-100 dark:border-slate-800/80 font-medium">Help</Link>
              <button onClick={handleSignOut} className="w-full text-left flex items-center px-4 py-2.5 text-[14px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition border-t border-stone-100 dark:border-slate-800/80 font-medium cursor-pointer">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

