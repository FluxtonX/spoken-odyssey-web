export const people = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    role: "Family Archivist",
    location: "Portland, Oregon",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    cover:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    bio: "Collecting everyday memories, family recipes, old letters, and the voices that make them feel close.",
    stats: { memories: 48, albums: 6, family: 12 },
  },
  {
    id: "robert",
    name: "Robert Mitchell",
    role: "Legacy Custodian",
    location: "Boulder, Colorado",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
    cover:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    bio: "Preserving family stories across generations with context, dates, and the small details people forget.",
    stats: { memories: 34, albums: 4, family: 9 },
  },
  {
    id: "elena",
    name: "Elena Rodriguez",
    role: "Public Contributor",
    location: "Santa Fe, New Mexico",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    bio: "Sharing reflections, travel notes, and family history prompts for anyone building a personal archive.",
    stats: { memories: 61, albums: 8, family: 15 },
  },
];

export const memories = [
  {
    id: "mountain-trip",
    title: "Trip to the Mountains",
    description:
      "A weekend getaway with the family, quiet mornings, trail dust, and the kind of laughter that fills the car ride home.",
    type: "Photo",
    privacy: "Family Circle",
    date: "April 18, 2026",
    albumId: "summer-2023",
    ownerId: "sarah",
    mood: "Joyful",
    tags: ["Family", "Travel", "Weekend"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    duration: null,
    likes: 42,
    comments: 8,
  },
  {
    id: "grandpa-childhood",
    title: "Grandpa's Childhood Story",
    description:
      "A voice note about the village road, the first bicycle in the family, and the neighbor who fixed everything.",
    type: "Voice",
    privacy: "Private",
    date: "March 29, 2026",
    albumId: "grandpas-tales",
    ownerId: "robert",
    mood: "Nostalgic",
    tags: ["Voice", "Heritage", "Childhood"],
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
    duration: "04:12",
    likes: 128,
    comments: 24,
  },
  {
    id: "graduation-thoughts",
    title: "Graduation Day Thoughts",
    description:
      "Notes from the evening after the ceremony, when the house finally got quiet and the day started to settle in.",
    type: "Text",
    privacy: "Public",
    date: "February 12, 2026",
    albumId: "letters-keepsakes",
    ownerId: "elena",
    mood: "Reflective",
    tags: ["Milestone", "Journal", "Public"],
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=80",
    duration: null,
    likes: 89,
    comments: 12,
    backgroundId: "aesthetic-sunset",
  },
  {
    id: "recipe-book",
    title: "Mom's Recipe Book",
    description:
      "Her handwritten notes in the margins made every stain feel like part of the archive.",
    type: "Video",
    privacy: "Family Circle",
    date: "January 8, 2026",
    albumId: "family-recipes",
    ownerId: "sarah",
    mood: "Warm",
    tags: ["Recipes", "Kitchen", "Family"],
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1000&q=80",
    duration: "02:38",
    likes: 54,
    comments: 6,
  },
  {
    id: "first-performance",
    title: "First School Performance",
    description:
      "A small stage, nervous hands, and sudden confidence before the final note ended.",
    type: "Photo",
    privacy: "Family Circle",
    date: "December 4, 2025",
    albumId: "sarah-first-year",
    ownerId: "sarah",
    mood: "Proud",
    tags: ["Children", "School", "Milestone"],
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80",
    duration: null,
    likes: 31,
    comments: 5,
  },
  {
    id: "europe-train",
    title: "Night Train to Florence",
    description:
      "A travel clip from the old phone, saved because the window reflection caught everyone smiling.",
    type: "Video",
    privacy: "Private",
    date: "October 21, 2025",
    albumId: "europe-trip",
    ownerId: "elena",
    mood: "Adventurous",
    tags: ["Travel", "Europe", "Video"],
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80",
    duration: "01:46",
    likes: 67,
    comments: 9,
  },
];

export const albums = [
  {
    id: "summer-2023",
    title: "Summer 2023",
    subtitle: "Lake weekends, mountain roads, and slow family dinners.",
    privacy: "Family",
    cover:
      "https://images.unsplash.com/photo-1473496169904-658ba37448eb?auto=format&fit=crop&w=1200&q=80",
    created: "June 2023",
  },
  {
    id: "grandpas-tales",
    title: "Grandpa's Tales",
    subtitle: "Voice notes and old-world stories recorded before dinner.",
    privacy: "Private",
    cover:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    created: "March 2026",
  },
  {
    id: "sarah-first-year",
    title: "Sarah's First Year",
    subtitle: "Tiny milestones, first performances, and the little ordinary days.",
    privacy: "Family",
    cover:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    created: "December 2025",
  },
  {
    id: "family-recipes",
    title: "Family Recipes",
    subtitle: "Kitchen stories, recipe cards, and voices around the table.",
    privacy: "Public",
    cover:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80",
    created: "January 2026",
  },
  {
    id: "europe-trip",
    title: "Europe Trip '18",
    subtitle: "Old clips, train tickets, and notes from every city.",
    privacy: "Private",
    cover:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    created: "October 2025",
  },
  {
    id: "letters-keepsakes",
    title: "Letters & Keepsakes",
    subtitle: "Scanned notes, handwritten cards, and important reflections.",
    privacy: "Private",
    cover:
      "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=1200&q=80",
    created: "February 2026",
  },
];

export const notifications = [
  {
    id: "n1",
    title: "Emily added a memory",
    body: "Mom's Recipe Book was shared with the Family Circle.",
    time: "12 min ago",
    type: "family",
    unread: true,
  },
  {
    id: "n5",
    title: "Mudassir posted a memory",
    body: "Mudassir shared a memory 'Childhood Cricket Days' that you might have missed.",
    time: "25 min ago",
    type: "family",
    unread: true,
  },
  {
    id: "n2",
    title: "Robert accepted legacy access",
    body: "Your custodian invitation is now active.",
    time: "2 hours ago",
    type: "legacy",
    unread: true,
  },
  {
    id: "n6",
    title: "Secure Archive Backup",
    body: "Generational oral history vault was successfully synced and encrypted.",
    time: "5 hours ago",
    type: "legacy",
    unread: false,
  },
  {
    id: "n3",
    title: "Public memory got comments",
    body: "Graduation Day Thoughts has 3 new comments.",
    time: "Yesterday",
    type: "community",
    unread: false,
  },
  {
    id: "n4",
    title: "Memory prompt",
    body: "Record a short note about a favorite place from childhood.",
    time: "Monday",
    type: "prompt",
    unread: false,
  },
];

export function getAlbumById(id) {
  return albums.find((album) => album.id === id);
}

export function getMemoryById(id) {
  return memories.find((memory) => memory.id === id);
}

export function getPersonById(id) {
  return people.find((person) => person.id === id);
}

export function getAlbumMemories(albumId) {
  return memories.filter((memory) => memory.albumId === albumId);
}

export function getPersonMemories(personId) {
  return memories.filter((memory) => memory.ownerId === personId);
}
