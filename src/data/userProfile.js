"use client";

export const AVATAR_PRESETS = [
  {
    name: "Alexander (Default)",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80",
  },
  {
    name: "Classic Archivist",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  },
  {
    name: "Retro Historian",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  },
  {
    name: "Casual Storyteller",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
  },
];

export const COVER_PRESETS = [
  {
    name: "Ocean Shores (Default)",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Mountain Ridges",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Quiet Woodlands",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Vintage Library",
    url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
  },
];

export const CATEGORY_PRESETS = [
  "Blogger",
  "Artist",
  "Actor",
  "Musician",
  "Writer",
  "Photographer",
  "Historian",
  "Archivist"
];

const DEFAULT_PROFILE = {
  name: "Alexander Mitchell",
  role: "Family Archivist",
  location: "Seattle, WA",
  bio: "Preserving our family voice recordings, digital letters, and milestones so they live on for generations.",
  avatar: AVATAR_PRESETS[0].url,
  cover: COVER_PRESETS[0].url,
  birthday: "1990-06-15",
  categories: ["Blogger", "Historian"]
};

const USER_PROFILE_KEY = "spokenOdysseyUserProfile";
const LOCAL_MEMORIES_KEY = "spokenOdysseyLocalMemories";

export function getStoredUserProfile() {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const saved = localStorage.getItem(USER_PROFILE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_PROFILE;
    }
  }
  // Initialize with default profile on first load
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
  return DEFAULT_PROFILE;
}

export function saveStoredUserProfile(profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  // Dispatch custom event to notify NavBar and other active panels
  window.dispatchEvent(new Event("profileUpdated"));
}

// Preseed some nice user memories so the profile page isn't blank at first load
export function seedInitialMemoriesIfNeeded() {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(LOCAL_MEMORIES_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed && parsed.length > 0) return; // Already seeded or user created
    } catch {
      // ignore and overwrite
    }
  }

  const initialMemories = [
    {
      id: "seeded-m1",
      title: "My Childhood Kitchen",
      type: "Text",
      description: "I still remember the smell of fresh warm bread on Sunday mornings and the soft humming of the old vintage radio on the counter. Simple times.",
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
      displayDate: "3 days ago",
      albums: [],
      audiences: ["public"],
      audio: null,
      media: null,
      backgroundId: "aesthetic-sunset",
      fontId: "satisfy",
      ownerId: "alexander", // Alexander owns this
    },
    {
      id: "seeded-m2",
      title: "Archiving Grandpa's Journal",
      type: "Photo",
      description: "Finally went through the box in the attic. Found grandpa's leather pocketbook diary from 1952. His handwriting is elegant but so hard to scan!",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      displayDate: "1 day ago",
      albums: [],
      audiences: ["family"],
      audio: null,
      media: {
        url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80",
        type: "image/jpeg",
        name: "grandpas_diary.jpg"
      },
      backgroundId: "none",
      fontId: "default",
      ownerId: "alexander",
    }
  ];

  localStorage.setItem(LOCAL_MEMORIES_KEY, JSON.stringify(initialMemories));
}
