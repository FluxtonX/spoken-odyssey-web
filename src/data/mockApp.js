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
  if (ALBUM_MEMORIES_MAP[albumId]) {
    return ALBUM_MEMORIES_MAP[albumId];
  }
  return memories.filter((memory) => memory.albumId === albumId);
}

export function getPersonMemories(personId) {
  return memories.filter((memory) => memory.ownerId === personId);
}

export const ALBUM_MEMORIES_MAP = {
  "career-craft": [
    {
      id: "mem-cc-1",
      type: "Voice",
      title: "The day I knew I'd found home",
      description: "I recorded this on the roof of my new apartment, watching the city lights come on at dusk. I realized in that moment that I'd stopped looking for somewhere else to be....",
      date: "Tuesday, 14 March",
      duration: "4:32",
      tags: ["home", "belonging", "london"],
      privacy: "Private",
      albumId: "career-craft"
    },
    {
      id: "mem-cc-2",
      type: "Photo",
      title: "Grandma's 80th birthday",
      description: "The whole family came together. 43 people in one backyard....",
      date: "Monday, 7 June",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
      tags: ["family", "celebration", "grandma"],
      privacy: "Family",
      albumId: "career-craft"
    },
    {
      id: "mem-cc-3",
      type: "Written",
      title: "Why I quit my job",
      description: "After seven years at the firm, I walked into my manager's office and handed in my notice. What followed was the most terrifying — and clarifying — six months of my adult life. This is that story....",
      date: "Sunday, 12 January",
      tags: ["career", "courage", "change"],
      privacy: "Private",
      albumId: "career-craft"
    },
    {
      id: "mem-cc-4",
      type: "Voice",
      title: "Sunday mornings in Cork",
      description: "I recorded this when I visited my parents. Dad was making bread in the kitchen and I just pressed record....",
      date: "Tuesday, 3 September",
      duration: "7:14",
      tags: ["childhood", "ireland", "nostalgia"],
      privacy: "Family",
      albumId: "career-craft"
    }
  ],
  "career-and-craft": [
    {
      id: "mem-cc-1",
      type: "Voice",
      title: "The day I knew I'd found home",
      description: "I recorded this on the roof of my new apartment, watching the city lights come on at dusk. I realized in that moment that I'd stopped looking for somewhere else to be....",
      date: "Tuesday, 14 March",
      duration: "4:32",
      tags: ["home", "belonging", "london"],
      privacy: "Private",
      albumId: "career-and-craft"
    },
    {
      id: "mem-cc-2",
      type: "Photo",
      title: "Grandma's 80th birthday",
      description: "The whole family came together. 43 people in one backyard....",
      date: "Monday, 7 June",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
      tags: ["family", "celebration", "grandma"],
      privacy: "Family",
      albumId: "career-and-craft"
    },
    {
      id: "mem-cc-3",
      type: "Written",
      title: "Why I quit my job",
      description: "After seven years at the firm, I walked into my manager's office and handed in my notice. What followed was the most terrifying — and clarifying — six months of my adult life. This is that story....",
      date: "Sunday, 12 January",
      tags: ["career", "courage", "change"],
      privacy: "Private",
      albumId: "career-and-craft"
    },
    {
      id: "mem-cc-4",
      type: "Voice",
      title: "Sunday mornings in Cork",
      description: "I recorded this when I visited my parents. Dad was making bread in the kitchen and I just pressed record....",
      date: "Tuesday, 3 September",
      duration: "7:14",
      tags: ["childhood", "ireland", "nostalgia"],
      privacy: "Family",
      albumId: "career-and-craft"
    }
  ],
  "childhood-summers": [
    {
      id: "mem-cs-1",
      type: "Voice",
      title: "July evenings in Cork",
      description: "The long July evenings in Cork. The smell of cut grass and sea air coming off the bay.",
      date: "Friday, 12 July",
      duration: "5:12",
      tags: ["childhood", "cork", "summer"],
      privacy: "Private",
      albumId: "childhood-summers"
    },
    {
      id: "mem-cs-2",
      type: "Photo",
      title: "Dad's Wooden Boat",
      description: "We built this little dinghy in the garage over three months. First sail out near Kinsale.",
      date: "August 15, 2019",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      tags: ["sailing", "father", "summer"],
      privacy: "Family",
      albumId: "childhood-summers"
    },
    {
      id: "mem-cs-3",
      type: "Written",
      title: "First swim in the Atlantic",
      description: "Freezing cold water, but we ran in screaming. Best feeling in the world.",
      date: "June 20, 2018",
      tags: ["swimming", "ocean", "courage"],
      privacy: "Private",
      albumId: "childhood-summers"
    }
  ],
  "years-in-london": [
    {
      id: "mem-yl-1",
      type: "Photo",
      title: "Arriving at Paddington Station",
      description: "Two heavy suitcases and no idea where I was going to live. Rain pouring down outside.",
      date: "September 1, 2015",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
      tags: ["london", "arrival", "newbeginnings"],
      privacy: "Private",
      albumId: "years-in-london"
    },
    {
      id: "mem-yl-2",
      type: "Voice",
      title: "Hackney Studio Session",
      description: "Late night recording session in the cold studio on Mare Street. Pure magic.",
      date: "October 14, 2017",
      duration: "8:45",
      tags: ["music", "hackney", "studio"],
      privacy: "Family",
      albumId: "years-in-london"
    },
    {
      id: "mem-yl-3",
      type: "Written",
      title: "London Fog & Coffee",
      description: "Finding my favorite corner table at the local cafe. London became home that winter.",
      date: "November 5, 2018",
      tags: ["coffee", "winter", "london"],
      privacy: "Private",
      albumId: "years-in-london"
    }
  ],
  "family-of-my-own": [
    {
      id: "mem-fo-1",
      type: "Photo",
      title: "First steps in the garden",
      description: "Sarah took her first three steps towards the apple tree today. We were both crying laughing.",
      date: "May 4, 2022",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      tags: ["baby", "firststeps", "family"],
      privacy: "Family",
      albumId: "family-of-my-own"
    },
    {
      id: "mem-fo-2",
      type: "Voice",
      title: "Sunday Family Dinner Chat",
      description: "Recorded around the kitchen table. Laughter, clinking forks, and stories about Nana.",
      date: "November 18, 2023",
      duration: "12:30",
      tags: ["dinner", "family", "stories"],
      privacy: "Family",
      albumId: "family-of-my-own"
    },
    {
      id: "mem-fo-3",
      type: "Written",
      title: "The Year Everything Changed",
      description: "Reflecting on moving into our forever home and building our family circle.",
      date: "December 31, 2023",
      tags: ["milestone", "home", "gratitude"],
      privacy: "Private",
      albumId: "family-of-my-own"
    }
  ],
  "places-that-shaped-me": [
    {
      id: "mem-ps-1",
      type: "Photo",
      title: "Cliffs of Moher Sunrise",
      description: "Sunrise over the Atlantic ocean. Cold wind, breaking waves, absolute silence.",
      date: "April 10, 2021",
      image: "https://images.unsplash.com/photo-1473496169904-658ba37448eb?auto=format&fit=crop&w=1200&q=80",
      tags: ["ireland", "travel", "cliffs"],
      privacy: "Public",
      albumId: "places-that-shaped-me"
    },
    {
      id: "mem-ps-2",
      type: "Voice",
      title: "Night Market in Bangkok",
      description: "Street food sounds, sizzling woks, and neon signs in Chinatown.",
      date: "January 19, 2023",
      duration: "6:20",
      tags: ["travel", "bangkok", "soundscape"],
      privacy: "Public",
      albumId: "places-that-shaped-me"
    }
  ],
  "mum": [
    {
      id: "mem-mum-1",
      type: "Voice",
      title: "Mum's Soda Bread Recipe",
      description: "Mum explaining her secret trick to getting the crust crispy and soft inside.",
      date: "Mother's Day 2020",
      duration: "3:40",
      tags: ["mum", "recipe", "family"],
      privacy: "Private",
      albumId: "mum"
    },
    {
      id: "mem-mum-2",
      type: "Photo",
      title: "Teatime in the Garden",
      description: "Mum with her favorite teacup under the cherry blossom tree.",
      date: "May 12, 2021",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
      tags: ["mum", "garden", "love"],
      privacy: "Private",
      albumId: "mum"
    }
  ]
};
