"use client";

import { useState, useEffect, useRef } from "react";
import { UserCheck, X, AtSign, Search, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { getTaggableUsersFromBackend, getSuggestedPeople } from "@/services/backend";

export default function UserTagPicker({ taggedUsers = [], onChange }) {
  const { firebaseUser, isAuthenticated, getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [connections, setConnections] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function loadConnections() {
      if (!isAuthenticated || !firebaseUser) return;
      setIsLoading(true);
      try {
        const token = await getToken();
        const cleanQ = query.replace(/^@/, "").trim();
        let list = await getTaggableUsersFromBackend(token, cleanQ).catch(() => []);
        
        if ((!Array.isArray(list) || list.length === 0) && !cleanQ) {
          list = await getSuggestedPeople(token).catch(() => []);
        }

        if (isMounted && Array.isArray(list) && list.length > 0) {
          const formatted = list.map(u => ({
            id: u.id || u.uid,
            name: u.displayName || u.name || "User Connection",
            displayName: u.displayName || u.name || "User Connection",
            avatar: u.photoURL || u.avatar || u.avatarUrl || "",
            profession: u.profession || u.relation || "Connection",
            relation: u.relation || u.profession || "Connection",
          }));
          setConnections(formatted);
        } else if (isMounted && !cleanQ) {
          // Demo fallback connections if offline/empty
          setConnections([
            { id: "conn-sarah", name: "Sarah Mitchell", displayName: "Sarah Mitchell", avatar: "", profession: "Family Circle", relation: "Family Circle" },
            { id: "conn-mum", name: "Margaret Murphy", displayName: "Margaret Murphy", avatar: "", profession: "Mother", relation: "Family Circle" },
            { id: "conn-robert", name: "Robert Mitchell", displayName: "Robert Mitchell", avatar: "", profession: "Software Engineer", relation: "Follower" },
            { id: "conn-elena", name: "Elena Rostova", displayName: "Elena Rostova", avatar: "", profession: "Product Designer", relation: "Connection" },
            { id: "conn-ciaran", name: "Ciarán Murphy", displayName: "Ciarán Murphy", avatar: "", profession: "Family Circle", relation: "Family Circle" },
          ]);
        }
      } catch (err) {
        console.warn("Failed to load user connections for tag picker:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    const timer = setTimeout(loadConnections, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, isAuthenticated, firebaseUser]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
  };

  const handleSelectUser = (user) => {
    if (!taggedUsers.some(u => u.id === user.id)) {
      const updated = [...taggedUsers, user];
      onChange(updated);
    }
    setQuery("");
    setIsOpen(false);
  };

  const handleRemoveUser = (userId) => {
    const updated = taggedUsers.filter(u => u.id !== userId);
    onChange(updated);
  };

  const filteredConnections = connections.filter(c => {
    const isAlreadyTagged = taggedUsers.some(t => t.id === c.id);
    if (isAlreadyTagged) return false;
    const cleanQuery = query.replace(/^@/, "").toLowerCase().trim();
    if (!cleanQuery) return true;
    return (
      c.name.toLowerCase().includes(cleanQuery) ||
      c.profession.toLowerCase().includes(cleanQuery) ||
      (c.relation && c.relation.toLowerCase().includes(cleanQuery))
    );
  });

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-[13px] font-bold text-stone-700 mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <AtSign size={14} className="text-[#4A3AFF]" /> Tag People & Family
        </span>
        <span className="text-stone-400 text-xs font-normal">Optional</span>
      </label>

      {/* Selected Tag Pills */}
      {taggedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {taggedUsers.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#C7D2FE] text-[#4A3AFF] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-transform hover:scale-105"
            >
              <span className="w-5 h-5 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center text-[10px] font-black uppercase overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </span>
              <span>@{user.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className="hover:text-red-500 transition-colors p-0.5 rounded-full"
              >
                <X size={13} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
          <AtSign size={16} />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Type @ to tag a family member or connection..."
          className="w-full border border-stone-200 rounded-2xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#4A3AFF] focus:ring-2 focus:ring-[#4A3AFF]/20 transition-all font-medium text-stone-800 text-sm shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-stone-400 font-medium">Loading connections...</div>
          ) : filteredConnections.length > 0 ? (
            filteredConnections.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectUser(user)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEF2FF]/60 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-[#4A3AFF] text-white flex items-center justify-center text-xs font-bold shadow-sm overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900 text-sm group-hover:text-[#4A3AFF] transition-colors truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-stone-400 font-medium truncate flex items-center gap-2">
                    <span>{user.profession}</span>
                    {user.relation && user.relation !== user.profession && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-bold text-stone-500">
                        {user.relation}
                      </span>
                    )}
                  </div>
                </div>
                <UserPlus size={16} className="text-stone-400 group-hover:text-[#4A3AFF] transition-colors shrink-0" />
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-stone-400 font-medium">
              No matching connections found. You can type names in the standard Tags field.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
