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
  categories: ["Blogger", "Historian"],
  goals: "To preserve all of Grandpa Mitchell's audio letters, compile our yearly family recipes, and write my own memoir chapters.",
  projects: "Spoken Odyssey, Seattle Oral History Archive, Family Genealogy Tree",
  achievements: "Documented 4 generations of family letters; Restored 45 vintage audio tapes; Curated 12 family albums",
  interests: "Genealogy, Sound Archiving, Vintage Radios, Hiking, Creative Writing",
  lessons: "Time moves faster than we think. Capture the voices of the ones you love while they are still here to speak.",
  values: "Authenticity, Generational Connection, Preservation of Truth, Mindfulness",
  causes: "Historical Preservation, Digital Rights & Privacy, Audio Archiving Foundations",
  personalityQs: [
    { q: "What is your happiest memory from childhood?", a: "Building the wooden birdhouse with my grandfather in his backyard workshop on a warm July afternoon." },
    { q: "How would you like to be remembered?", a: "As someone who listened deeply, loved completely, and made sure our stories survived the test of time." }
  ]
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
// Remove any previously seeded static memories from localStorage if present
export function seedInitialMemoriesIfNeeded() {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(LOCAL_MEMORIES_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) {
        const staticTitles = [
          "My Childhood Kitchen",
          "Archiving Grandpa's Journal",
          "The day I knew I'd found home",
          "Grandma's 80th birthday",
          "Why I quit my job",
          "Sunday mornings in Cork"
        ];
        const cleaned = parsed.filter(m => 
          m.id !== "seeded-m1" && 
          m.id !== "seeded-m2" && 
          !staticTitles.includes(m.title)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(LOCAL_MEMORIES_KEY, JSON.stringify(cleaned));
        }
      }
    } catch {}
  }
}

// ── ALBUMS LOCAL STORAGE STATE ──
const LOCAL_ALBUMS_KEY = "spokenOdysseyLocalAlbums";

const DEFAULT_ALBUMS = [];

const STATIC_ALBUM_IDS = [
  "childhood-summers",
  "years-in-london",
  "family-of-my-own",
  "places-that-shaped-me",
  "mum",
  "career-and-craft",
  "career-craft",
  "summer-2023",
  "grandpas-tales",
  "sarah-first-year",
  "family-recipes",
  "europe-trip",
  "letters-keepsakes"
];

export function getStoredAlbums() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(LOCAL_ALBUMS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const userAlbums = parsed.filter(a => a && !STATIC_ALBUM_IDS.includes(a.id));
        return userAlbums;
      }
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

export function saveStoredAlbums(albumsList) {
  if (typeof window === "undefined") return;
  const userAlbums = Array.isArray(albumsList) ? albumsList.filter(a => a && !STATIC_ALBUM_IDS.includes(a.id)) : [];
  localStorage.setItem(LOCAL_ALBUMS_KEY, JSON.stringify(userAlbums));
  window.dispatchEvent(new Event("albumsUpdated"));
}

