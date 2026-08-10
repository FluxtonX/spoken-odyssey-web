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

export const memories = [];

export const albums = [];

export const notifications = [
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
  if (ALBUM_MEMORIES_MAP[albumId]) {
    return ALBUM_MEMORIES_MAP[albumId];
  }
  return memories.filter((memory) => memory.albumId === albumId);
}

export function getPersonMemories(personId) {
  return memories.filter((memory) => memory.ownerId === personId);
}

export const ALBUM_MEMORIES_MAP = {};

