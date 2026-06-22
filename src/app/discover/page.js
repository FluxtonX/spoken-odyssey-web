"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Compass,
  Filter,
  Heart,
  MessageCircle,
  Play,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Check,
  UserCheck,
  UserMinus,
  Loader2,
  AlertCircle
} from "lucide-react";
import FeedCard from "@/components/ui/FeedCard";
import { useAuth } from "@/context/AuthProvider";
import {
  getDiscoveryMemories,
  getSuggestedPeople,
  getFamilyMembers,
  connectFamilyMember,
  disconnectFamilyMember,
  getBackendErrorMessage
} from "@/services/backend";

const filterTabs = ["For You", "Family", "Public", "Themes", "People"];
const topics = ["All", "Family Heritage", "Travel", "Recipes", "Milestones", "Voice Notes"];

export default function DiscoverPage() {
  const { firebaseUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("For You");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data states
  const [memories, setMemories] = useState([]);
  const [suggestedPeople, setSuggestedPeople] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actioningId, setActioningId] = useState(""); // tracks which connection button is processing

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    
    if (!isAuthenticated || !firebaseUser) {
      setIsLoading(false);
      return;
    }

    try {
      const token = await firebaseUser.getIdToken();

      if (activeTab === "People") {
        const [suggestions, family] = await Promise.all([
          getSuggestedPeople(token),
          getFamilyMembers(token)
        ]);
        setSuggestedPeople(suggestions);
        setFamilyMembers(family);
      } else {
        const backendFilter = activeTab.toLowerCase().replace(" ", "-");
        const themeFilter = activeTab === "Themes" ? selectedTheme : "";
        const data = await getDiscoveryMemories(token, backendFilter, themeFilter);
        setMemories(data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(getBackendErrorMessage(err) || "Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedTheme, isAuthenticated, firebaseUser]);

  const handleConnect = async (targetUid) => {
    if (!isAuthenticated || !firebaseUser) return;
    setActioningId(targetUid);
    try {
      const token = await firebaseUser.getIdToken();
      await connectFamilyMember(token, targetUid);
      // Reload people & family
      const [suggestions, family] = await Promise.all([
        getSuggestedPeople(token),
        getFamilyMembers(token)
      ]);
      setSuggestedPeople(suggestions);
      setFamilyMembers(family);
    } catch (err) {
      console.error("Connection error:", err);
      alert(getBackendErrorMessage(err) || "Failed to establish family connection.");
    } finally {
      setActioningId("");
    }
  };

  const handleDisconnect = async (targetUid) => {
    if (!isAuthenticated || !firebaseUser) return;
    if (!confirm("Are you sure you want to remove this family member?")) return;
    setActioningId(targetUid);
    try {
      const token = await firebaseUser.getIdToken();
      await disconnectFamilyMember(token, targetUid);
      // Reload people & family
      const [suggestions, family] = await Promise.all([
        getSuggestedPeople(token),
        getFamilyMembers(token)
      ]);
      setSuggestedPeople(suggestions);
      setFamilyMembers(family);
    } catch (err) {
      console.error("Disconnection error:", err);
      alert(getBackendErrorMessage(err) || "Failed to remove family connection.");
    } finally {
      setActioningId("");
    }
  };

  const filteredMemories = useMemo(() => {
    if (!searchQuery.trim()) return memories;
    const query = searchQuery.toLowerCase().trim();
    return memories.filter(m => 
      m.title?.toLowerCase().includes(query) || 
      m.description?.toLowerCase().includes(query) ||
      m.ownerDisplayName?.toLowerCase().includes(query) ||
      m.tags?.some(t => t.toLowerCase().includes(query))
    );
  }, [memories, searchQuery]);

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return suggestedPeople;
    const query = searchQuery.toLowerCase().trim();
    return suggestedPeople.filter(p => 
      p.name?.toLowerCase().includes(query) || 
      p.role?.toLowerCase().includes(query) ||
      p.bio?.toLowerCase().includes(query)
    );
  }, [suggestedPeople, searchQuery]);

  return (
    <div className="w-full pb-24 animation-fade-in">
      <header className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6 text-left">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
            <Compass size={14} />
            Discover
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white md:text-5xl">
            Explore Odyssey
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-stone-600 dark:text-stone-300">
            Browse public memories, family archives, and suggested connections. Experience heritage through voice and story.
          </p>

          <div className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                placeholder={activeTab === "People" ? "Search suggested profiles" : "Search public memories"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)] text-[var(--ink)] dark:text-white"
              />
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-stone-600 dark:text-stone-300">
              <Filter size={17} />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-left flex flex-col justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-[var(--ink)] dark:text-white">
              <TrendingUp size={18} className="text-[var(--brand)]" />
              Trending Themes
            </h2>
            <p className="mt-1 text-xs text-stone-500 font-semibold">Filter public posts by topic.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelectedTheme(item);
                  setActiveTab("Themes");
                }}
                className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                  selectedTheme === item && activeTab === "Themes"
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand)] text-stone-600 dark:text-stone-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Elegant Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 border-b border-[var(--border)]/35 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-5 py-3 text-sm font-black transition-all ${
              activeTab === tab
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-transparent text-stone-500 hover:text-[var(--brand)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Section */}
      <main className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-400">
            <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
            <p className="text-xs font-black uppercase tracking-widest">Loading content...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-rose-500 border border-rose-100 rounded-2xl bg-rose-50/20 max-w-lg mx-auto">
            <AlertCircle size={32} />
            <p className="text-sm font-bold text-center px-4">{errorMsg}</p>
            <button onClick={loadData} className="mt-2 h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition">Retry</button>
          </div>
        ) : activeTab === "People" ? (
          <div className="space-y-8">
            {/* Suggested Connections */}
            <section className="text-left">
              <h2 className="text-xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-1">Suggested Connections</h2>
              <p className="text-xs text-stone-500 font-semibold mb-5">Connect with other family members and archivists on Spoken Odyssey.</p>
              
              {filteredPeople.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPeople.map((person) => (
                    <div key={person.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm flex flex-col justify-between p-5">
                      <div className="flex items-start gap-4 mb-4">
                        <img src={person.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}`} alt={person.name} className="h-14 w-14 rounded-xl border border-stone-200 object-cover shrink-0" />
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-[var(--ink)] dark:text-white leading-tight">{person.name}</h3>
                          <p className="mt-0.5 truncate text-xs font-bold text-[var(--brand)]">{person.role}</p>
                          <p className="mt-2 text-xs font-medium text-stone-500 line-clamp-2 leading-relaxed">{person.bio || "No bio added yet."}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnect(person.id)}
                        disabled={actioningId === person.id}
                        className="w-full h-10 rounded-xl bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] transition-all font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {actioningId === person.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserPlus size={14} />
                        )}
                        Connect Family
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-stone-400">
                  <Sparkles className="mx-auto mb-2 text-stone-300" size={24} />
                  <p className="text-xs font-bold">No suggested connections found.</p>
                </div>
              )}
            </section>

            {/* Connected Family */}
            <section className="text-left mt-8">
              <h2 className="text-xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-1">Your Connected Family</h2>
              <p className="text-xs text-stone-500 font-semibold mb-5">Members in your circle who can access family-only memories.</p>

              {familyMembers.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {familyMembers.map((person) => (
                    <div key={person.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm flex flex-col justify-between p-5">
                      <div className="flex items-start gap-4 mb-4">
                        <img src={person.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}`} alt={person.name} className="h-14 w-14 rounded-xl border border-stone-200 object-cover shrink-0" />
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-[var(--ink)] dark:text-white leading-tight">{person.name}</h3>
                          <p className="mt-0.5 truncate text-xs font-bold text-stone-500 flex items-center gap-1">
                            <UserCheck size={12} className="text-green-600" /> Connected Member
                          </p>
                          <p className="mt-2 text-xs font-medium text-stone-500 line-clamp-2 leading-relaxed">{person.bio || "No bio added yet."}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDisconnect(person.id)}
                        disabled={actioningId === person.id}
                        className="w-full h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:hover:bg-stone-750 dark:text-stone-300 transition-all font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {actioningId === person.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserMinus size={14} className="text-rose-600" />
                        )}
                        Disconnect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-stone-400">
                  <Users className="mx-auto mb-2 text-stone-300" size={24} />
                  <p className="text-xs font-bold">You haven't connected with any family members yet.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-left max-w-3xl mx-auto">
            {filteredMemories.length > 0 ? (
              filteredMemories.map((memory) => (
                <FeedCard key={memory.id} memory={memory} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--border)] p-16 text-center text-stone-400">
                <Compass className="mx-auto mb-2 text-stone-300" size={32} />
                <p className="text-sm font-bold">No memories found matching this filter.</p>
                <p className="text-xs text-stone-500 mt-1 font-semibold">Try switching filters or adjusting your search.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
