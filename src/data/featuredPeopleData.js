export const FEATURED_PEOPLE_DATA = {
  "grace-hopper": {
    id: "grace-hopper",
    name: "Admiral Grace Hopper",
    role: "Computer Scientist & Naval Officer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
    bio: "Pioneer of computer programming who developed the first compiler and conceptualized machine-independent programming languages like COBOL.",
    followersCount: 45200,
    storiesCount: 2,
    milestonesCount: 2,
    isFollowing: false,
    stories: [
      {
        id: "gh-story-1",
        title: "The farm. The war. The letters.",
        description: "My grandfather never spoke about the war. After he died, we found 400 letters. I'm reading them all.",
        type: "Text",
        date: "1944 – Present",
        authorName: "Thomas Wren",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        tags: ["war", "heritage"],
        likes: 34100,
        reactions: { heart: 34100 },
        userReaction: null,
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: "gh-story-2",
        title: "From Kyoto to Oslo",
        description: "A graphic novel designer who fell in love with fjords and a Norwegian fisherman.",
        type: "Photo",
        date: "2009 – 2024",
        authorName: "Yuki Tanaka",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        tags: ["love", "travel"],
        likes: 8900,
        reactions: { heart: 8900 },
        userReaction: null,
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: "gh-story-3",
        title: "The classroom that changed everything",
        description: "A teacher in Lagos for forty years. 2,400 students. A few of them changed the world.",
        type: "Text",
        date: "1982 – 2022",
        authorName: "Samuel Achebe",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        tags: ["education", "teaching"],
        likes: 19200,
        reactions: { heart: 19200 },
        userReaction: null,
        image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=800&auto=format&fit=crop",
      }
    ],
    milestones: [
      {
        id: "gh-m1",
        category: "HONOR",
        year: "2016",
        title: "Received the Presidential Medal of Freedom",
        description: "Posthumously awarded by President Barack Obama for her contributions to computing and the Navy. Recognized for her pioneering work in programming languages and her enduring legacy in technology.",
        iconType: "award"
      },
      {
        id: "gh-m2",
        category: "CAREER",
        year: "1985",
        title: "Promoted to Rear Admiral",
        description: "Achieved the rank of Rear Admiral (lower half) in the United States Navy, becoming one of the few female flag officers in naval history and a trailblazer for women in defense and computing.",
        iconType: "star"
      }
    ],
    albums: [
      {
        id: "gh-a1",
        title: "Naval Service Archives",
        subtitle: "Photographs & documents from WWII to 1986",
        entries: 24,
        privacy: "Public",
        coverImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "gh-a2",
        title: "Early Computing Pioneers",
        subtitle: "Harvard Mark I & COBOL development notes",
        entries: 16,
        privacy: "Public",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
      }
    ]
  },
  "nelson-mandela": {
    id: "nelson-mandela",
    name: "Nelson Mandela",
    role: "Revolutionary & President",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1400&auto=format&fit=crop",
    bio: "27 years imprisoned, emerged to lead a nation toward reconciliation. He was South Africa's first black head of state and the first elected in a fully representative democratic election.",
    followersCount: 128000,
    storiesCount: 3,
    milestonesCount: 3,
    isFollowing: false,
    stories: [
      {
        id: "nm-story-1",
        title: "Long Walk to Freedom",
        description: "Reflections on the journey from Robben Island to the inauguration in Pretoria.",
        type: "Text",
        date: "1994",
        authorName: "Nelson Mandela",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        tags: ["freedom", "history"],
        likes: 94200,
        reactions: { heart: 94200 },
        userReaction: null,
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop",
      }
    ],
    milestones: [
      {
        id: "nm-m1",
        category: "HONOR",
        year: "1993",
        title: "Awarded Nobel Peace Prize",
        description: "Jointly awarded the Nobel Peace Prize with F.W. de Klerk for their work for the peaceful termination of the apartheid regime.",
        iconType: "award"
      },
      {
        id: "nm-m2",
        category: "CAREER",
        year: "1994",
        title: "Inaugurated as President of South Africa",
        description: "Became the first democratically elected President of South Africa, ushering in a new era of equality and nation building.",
        iconType: "star"
      }
    ],
    albums: [
      {
        id: "nm-a1",
        title: "Freedom Movement Documents",
        subtitle: "Letters from Robben Island",
        entries: 42,
        privacy: "Public",
        coverImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop"
      }
    ]
  },
  "maya-angelou": {
    id: "maya-angelou",
    name: "Maya Angelou",
    role: "Poet, Memoirist & Civil Rights Activist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=1400&auto=format&fit=crop",
    bio: "An American memoirist, popular poet, and civil rights activist. Author of seven autobiographies, three books of essays, and several books of poetry.",
    followersCount: 89500,
    storiesCount: 2,
    milestonesCount: 2,
    isFollowing: false,
    stories: [
      {
        id: "ma-story-1",
        title: "I Know Why the Caged Bird Sings",
        description: "On courage, voice, and the power of literature to transcend adversity.",
        type: "Text",
        date: "1969",
        authorName: "Maya Angelou",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        tags: ["poetry", "memoir"],
        likes: 67300,
        reactions: { heart: 67300 },
        userReaction: null,
        image: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=800&auto=format&fit=crop",
      }
    ],
    milestones: [
      {
        id: "ma-m1",
        category: "HONOR",
        year: "2010",
        title: "Presidential Medal of Freedom",
        description: "Awarded the highest civilian honor in the United States by President Barack Obama.",
        iconType: "award"
      }
    ],
    albums: [
      {
        id: "ma-a1",
        title: "Literary Keepsakes",
        subtitle: "Manuscripts and poetry drafts",
        entries: 30,
        privacy: "Public",
        coverImage: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=800&auto=format&fit=crop"
      }
    ]
  }
};

export function getFeaturedPersonData(id) {
  if (!id) return null;
  const cleanId = String(id).toLowerCase().trim();

  // Only match explicit featured keys
  if (FEATURED_PEOPLE_DATA[cleanId]) {
    return FEATURED_PEOPLE_DATA[cleanId];
  }

  // Check exact key match
  for (const key of Object.keys(FEATURED_PEOPLE_DATA)) {
    if (cleanId === key) {
      return FEATURED_PEOPLE_DATA[key];
    }
  }

  return null;
}
