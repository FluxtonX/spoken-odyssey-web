"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, UserPlus, Users, ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  getSuggestedPeople,
  getBackendErrorMessage
} from "@/services/backend";

export default function FollowersPage() {
  const { firebaseUser, isAuthenticated, loading: authLoading } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actioningId, setActioningId] = useState("");
  const [activeTab, setActiveTab] = useState("followers"); // "followers" or "following"

  const loadData = async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = await firebaseUser.getIdToken();
      const [followersList, followingList, suggestionsList] = await Promise.all([
        getFollowers(token),
        getFollowing(token),
        getSuggestedPeople(token)
      ]);
      setFollowers(followersList || []);
      setFollowing(followingList || []);
      setSuggestions(suggestionsList || []);
    } catch (err) {
      console.error("Failed to load followers/following lists:", err);
      setErrorMsg(getBackendErrorMessage(err) || "Failed to load social network data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      loadData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [firebaseUser, authLoading]);

  const followingIds = following.map(u => u.id);
  const isFollowing = (userId) => followingIds.includes(userId);

  const handleToggleFollow = async (targetUid) => {
    if (!firebaseUser) return;
    setActioningId(targetUid);
    try {
      const token = await firebaseUser.getIdToken();
      if (isFollowing(targetUid)) {
        await unfollowUser(token, targetUid);
      } else {
        await followUser(token, targetUid);
      }
      // Refresh lists
      const [followersList, followingList, suggestionsList] = await Promise.all([
        getFollowers(token),
        getFollowing(token),
        getSuggestedPeople(token)
      ]);
      setFollowers(followersList || []);
      setFollowing(followingList || []);
      setSuggestions(suggestionsList || []);
    } catch (err) {
      console.error(err);
      alert(getBackendErrorMessage(err) || "Failed to update follow relationship.");
    } finally {
      setActioningId("");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-stone-400">
        <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
        <p className="text-xs font-black uppercase tracking-widest">Loading Social Network...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-rose-500 border border-rose-100 rounded-2xl bg-rose-50/20 max-w-lg mx-auto p-8 text-center">
        <AlertCircle size={32} />
        <h2 className="text-lg font-black">Something went wrong</h2>
        <p className="text-sm font-bold">{errorMsg}</p>
        <button onClick={loadData} className="mt-3 px-6 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black text-xs transition">Retry</button>
      </div>
    );
  }

  if (!isAuthenticated || !firebaseUser) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-stone-400">
        <Users size={40} className="text-stone-300" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-xs font-semibold text-center max-w-xs">Please sign in to view your followers and following network.</p>
        <Link href="/login" className="mt-3 px-6 py-2.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black text-xs transition active:scale-95">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 animation-fade-in">
      {/* Header */}
      <header className="mb-6 flex items-start gap-4">
        <Link
          href="/feed"
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm transition active:scale-95"
          aria-label="Back to feed"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
            <Users size={14} />
            Social Network
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white">Followers</h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">Manage connections and discover family storytellers.</p>
        </div>
      </header>

      {/* Elegant Tab Switcher */}
      <div className="mt-6 flex items-center gap-4 bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)] shadow-sm">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black transition cursor-pointer ${
            activeTab === "followers"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "text-stone-600 hover:bg-[var(--background)] hover:text-stone-800"
          }`}
        >
          Followers ({followers.length})
        </button>
        
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black transition cursor-pointer ${
            activeTab === "following"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "text-stone-600 hover:bg-[var(--background)] hover:text-stone-800"
          }`}
        >
          Following ({following.length})
        </button>
      </div>

      {/* Followers Tab List */}
      {activeTab === "followers" && (
        <section className="mt-8">
          <h2 className="text-lg font-black text-[var(--ink)] dark:text-white mb-4 flex items-center gap-2">
            <span>Recent Followers</span>
            <span className="text-xs bg-stone-100 dark:bg-stone-805 text-stone-600 dark:text-stone-300 rounded-full px-2.5 py-0.5 font-bold">
              {followers.length}
            </span>
          </h2>
          {followers.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {followers.map((follower) => {
                const followingBack = isFollowing(follower.id);
                const isProcessing = actioningId === follower.id;
                return (
                  <div key={follower.id} className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-[var(--brand)]/45 transition">
                    <div className="flex items-start gap-3 min-w-0 mb-4">
                      <UserAvatar src={follower.avatar} alt={follower.name} isActive={follower.isActive} size="lg" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate text-sm font-black text-[var(--ink)] dark:text-white">{follower.name}</span>
                          <span className="shrink-0 text-[9px] bg-[var(--brand-soft)] text-[var(--brand)] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Follows
                          </span>
                        </div>
                        <p className="truncate text-xs font-bold text-stone-500">{follower.role || "Contributor"}</p>
                        <p className="truncate text-[10px] font-medium text-stone-400">{follower.location || "Earth"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(follower.id)}
                      disabled={isProcessing}
                      className={`w-full py-2.5 rounded-lg text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 border ${
                        followingBack
                          ? "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
                          : "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white border-transparent"
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : followingBack ? (
                        <>
                          <UserCheck size={13} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={13} />
                          Follow Back
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-stone-500">No followers yet. Share your stories to build connections!</p>
            </div>
          )}
        </section>
      )}

      {/* Following Tab List */}
      {activeTab === "following" && (
        <section className="mt-8">
          <h2 className="text-lg font-black text-[var(--ink)] dark:text-white mb-4 flex items-center gap-2">
            <span>People You Follow</span>
            <span className="text-xs bg-stone-100 dark:bg-stone-805 text-stone-600 dark:text-stone-300 rounded-full px-2.5 py-0.5 font-bold">
              {following.length}
            </span>
          </h2>
          {following.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {following.map((followedUser) => {
                const isProcessing = actioningId === followedUser.id;
                return (
                  <div key={followedUser.id} className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-[var(--brand)]/45 transition">
                    <div className="flex items-start gap-3 min-w-0 mb-4">
                      <UserAvatar src={followedUser.avatar} alt={followedUser.name} isActive={followedUser.isActive} size="lg" />
                      <div className="min-w-0">
                        <span className="truncate text-sm font-black text-[var(--ink)] dark:text-white">{followedUser.name}</span>
                        <p className="truncate text-xs font-bold text-stone-500">{followedUser.role || "Contributor"}</p>
                        <p className="truncate text-[10px] font-medium text-stone-400">{followedUser.location || "Earth"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(followedUser.id)}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-lg text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 border bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
                    >
                      {isProcessing ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <>
                          <UserCheck size={13} />
                          Following
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-stone-500">You aren't following anyone yet. Discover people to read their public memories!</p>
            </div>
          )}
        </section>
      )}

      {/* Suggested to Follow */}
      <section className="mt-10">
        <h2 className="text-lg font-black text-[var(--ink)] dark:text-white mb-4">Suggested for You</h2>
        {suggestions.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((person) => {
              const followingPerson = isFollowing(person.id);
              const isProcessing = actioningId === person.id;
              return (
                <div key={person.id} className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-[var(--brand)]/45 transition">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar src={person.avatar} alt={person.name} isActive={person.isActive} size="lg" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[var(--ink)] dark:text-white">{person.name}</p>
                        <p className="truncate text-xs font-semibold text-stone-500">{person.role || "Contributor"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed mb-4">
                    {person.bio || "No biography details shared yet."}
                  </p>

                  <button
                    onClick={() => handleToggleFollow(person.id)}
                    disabled={isProcessing}
                    className={`w-full py-2.5 rounded-lg text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 border ${
                      followingPerson
                        ? "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
                        : "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white border-transparent shadow-sm"
                    }`}
                  >
                    {isProcessing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : followingPerson ? (
                      <>
                        <UserCheck size={14} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm">
            <p className="text-xs font-bold text-stone-500">No suggestions available right now. Check back later!</p>
          </div>
        )}
      </section>
    </div>
  );
}
