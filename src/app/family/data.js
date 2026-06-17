export const initialMembers = [
  {
    id: "rm",
    name: "Robert Mitchell",
    email: "robert.mitchell@email.com",
    relationship: "Father",
    role: "custodian",
    accessLevel: "Legacy Access",
    sharedCount: 34,
    dateLabel: "January 2024",
    initials: "RM",
    avatar: "/avatars/robert.jpg", // We can use image placeholders or fall back to initials
    status: "active",
  },
  {
    id: "em",
    name: "Emily Mitchell",
    email: "emily.mitchell@email.com",
    relationship: "Mother",
    role: "contributor",
    accessLevel: "Legacy Access",
    sharedCount: 42,
    dateLabel: "January 2024",
    initials: "EM",
    avatar: "/avatars/emily.jpg",
    status: "active",
  },
  {
    id: "am",
    name: "Alex Mitchell",
    email: "alex.mitchell@email.com",
    relationship: "Sibling",
    role: "contributor",
    accessLevel: "Legacy Access",
    sharedCount: 28,
    dateLabel: "March 2024",
    initials: "AM",
    avatar: "/avatars/alex.jpg",
    status: "active",
  },
  {
    id: "sm",
    name: "Sophie Mitchell",
    email: "sophie.mitchell@email.com",
    relationship: "Daughter",
    role: "viewer",
    accessLevel: "Public Only",
    sharedCount: 15,
    dateLabel: "June 2024",
    initials: "SM",
    avatar: "/avatars/sophie.jpg",
    status: "active",
  },
];

export const sharedMemories = [
  {
    id: "m1",
    title: "Family Reunion 2023",
    authorName: "Emily Mitchell",
    dateLabel: "July 15, 2023",
    snippet: "Three generations under one roof. Laughter echoing through the halls like music...",
    sharedWith: "Family Circle",
  },
  {
    id: "m2",
    title: "Teaching Dad to Use His Phone",
    authorName: "Sarah Mitchell",
    dateLabel: "November 3, 2024",
    snippet: "Patience tested. Love strengthened. Technology conquered (mostly).",
    sharedWith: "Family Circle",
  },
  {
    id: "m3",
    title: "Mom's Recipe Book",
    authorName: "Robert Mitchell",
    dateLabel: "December 25, 2023",
    snippet: "Found her handwritten notes in the margins. Each stain tells a story of meals shared...",
    sharedWith: "Family Circle",
  },
];

export const treeData = {
  grandparents: [
    { id: "hm", name: "Harold", role: "Paternal Grandfather", years: "1925-2002", initials: "HM", type: "elder" },
    { id: "dm", name: "Dorothy", role: "Paternal Grandmother", years: "1928-2010", initials: "DM", type: "elder" },
    { id: "wm", name: "Walter", role: "Maternal Grandfather", years: "1930-1998", initials: "WH", type: "elder" },
    { id: "em_g", name: "Eleanor", role: "Maternal Grandmother", years: "b. 1933", initials: "EH", type: "elder" },
  ],
  parents: [
    { id: "rm", name: "Robert", role: "Father", years: "b. 1955", initials: "RM", type: "parent" },
    { id: "em", name: "Emily", role: "Mother", years: "b. 1958", initials: "EM", type: "parent" },
  ],
  generation: [
    { id: "sm", name: "Sarah", role: "You", years: "b. 1985", initials: "SM", type: "you" },
    { id: "am", name: "Alex", role: "Sibling", years: "b. 1988", initials: "AX", type: "sibling" },
  ],
  children: [
    { id: "sm_c", name: "Sophie", role: "Daughter", years: "b. 2018", initials: "SM", type: "child" },
  ],
};
