"use client";

import { Bell, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { getStoredUserProfile } from "@/data/userProfile";

export default function DashboardHeader({ onSearchChange }) {
  const router = useRouter();
  const { profile, firebaseUser, logout } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  
  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close dropdowns on click outside
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
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

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && !onSearchChange) {
      const val = e.target.value.trim();
      if (val) {
        router.push(`/search?query=${encodeURIComponent(val)}`);
      }
    }
  };

  const displayName = firebaseUser?.displayName?.split(" ")[0] || profile?.displayName?.split(" ")[0] || firebaseUser?.email?.split("@")[0] || profile?.email?.split("@")[0] || userProfile?.name?.split(" ")[0] || "Explorer";

  return (
    <div className="w-full border-b border-[#C7D2FE]/30 pb-4 mb-8 flex items-center justify-between gap-4">
      {/* Search bar */}
      <div className="relative flex items-center flex-1 max-w-[200px] xs:max-w-xs sm:max-w-md">
        <Search className="absolute left-3 text-[#5e4eff]/80" size={16} />
        <input 
          type="text" 
          placeholder="Search memories, albums, people..." 
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          className="pl-9 pr-3 py-2 w-full rounded-full border border-[#C7D2FE]/50 bg-white/40 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-sm transition-all text-stone-700 placeholder-stone-400"
        />
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
            <div className="absolute right-0 mt-2 w-80 dropdown-menu animate-fade-in z-50">
              <div className="p-4 border-b border-stone-100">
                <h3 className="font-bold text-stone-800 text-[15px]">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {[
                  { text: "Sarah shared 3 new memories with your Family Circle", time: "2h ago", unread: true },
                  { text: "Your monthly AI Life Summary is ready", time: "Yesterday", unread: true },
                  { text: "Brigid accepted your Family Circle invitation", time: "3 days ago", unread: false }
                ].map((notif, i) => (
                  <div key={i} className="flex gap-3 p-4 border-b border-stone-100/50 hover:bg-stone-50 transition cursor-pointer">
                    <div className="pt-1.5 shrink-0">
                      <div className={`h-2 w-2 rounded-full ${notif.unread ? 'bg-[var(--brand)]' : 'bg-transparent'}`} />
                    </div>
                    <div>
                      <p className={`text-[13px] leading-snug ${notif.unread ? 'text-stone-700 font-medium' : 'text-stone-600'}`}>{notif.text}</p>
                      <p className="text-[11px] text-stone-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2 sm:pr-4 py-1.5 rounded-full border border-[#C7D2FE]/40 bg-white/40 backdrop-blur-md shadow-sm hover:bg-stone-50 transition active:scale-95"
          >
            {userProfile?.avatar ? (
              <img src={userProfile.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[var(--brand)] text-white flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0)}
              </div>
            )}
            <span className="text-sm font-semibold text-stone-700 hidden sm:block">{displayName}</span>
            <ChevronRight size={14} className="text-stone-400 rotate-90 ml-0.5" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 dropdown-menu animate-fade-in z-50 py-1">
              <Link href="/profile" className="flex items-center px-4 py-3 text-[14px] text-stone-700 hover:bg-stone-50 transition font-medium">View Profile</Link>
              <Link href="/settings" className="flex items-center px-4 py-3 text-[14px] text-stone-700 hover:bg-stone-50 transition border-t border-stone-100 font-medium">Settings</Link>
              <Link href="/help" className="flex items-center px-4 py-3 text-[14px] text-stone-700 hover:bg-stone-50 transition border-t border-stone-100 font-medium">Help</Link>
              <button onClick={handleSignOut} className="w-full text-left flex items-center px-4 py-3 text-[14px] text-red-500 hover:bg-red-50 transition border-t border-stone-100 font-medium cursor-pointer">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
