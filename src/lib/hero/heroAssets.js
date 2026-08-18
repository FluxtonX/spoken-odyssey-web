const q = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroImages = {
  // Category: Marriage & Wedding (3 unique)
  weddingEmbrace: q("photo-1519741497674-611481863552"),
  weddingRings: q("photo-1515934751635-c81c6bc9a2d8"),
  weddingWalk: q("photo-1583939003579-730e3918a45a"),

  // Category: Old / Vintage & Generations (3 unique)
  oldGrandparents: q("photo-1517486808906-6ca8b3f04846"),
  grandparentsHands: q("photo-1534528741775-53994a69daeb"),
  vintageJournal: q("photo-1455390582262-044cdead277a"),

  // Category: Gifts & Emotional Heirloom (3 unique)
  giftExchange: q("photo-1513151233558-d860c5398176"),
  heirloomLetter: q("photo-1506784983877-45594efa4cbe"),
  emotionalEmbrace: q("photo-1544005313-94ddf0286df2"),

  // Category: Family & Newborns (3 unique)
  familyReunion: q("photo-1511895426328-dc8714191300"),
  babyNewborn: q("photo-1652217627250-0dd21428e0f3"),
  kidsPlaying: q("photo-1583337130417-3346a1be7dee"),

  // Category: Travel & Nature (3 unique)
  mountainSunset: q("photo-1506905925346-21bda4d32df4"),
  oceanCoast: q("photo-1507525428034-b723cf961d3e"),
  hikingForest: q("photo-1551632811-561732d1e306"),

  // Category: Friends & Celebrations (3 unique)
  friendsCampfire: q("photo-1529156069898-49953e39b3ac"),
  cityWalk: q("photo-1449824913935-59a10b8d2000"),
  sunsetToast: q("photo-1510812431401-41d2bd2722f3"),

  // Category: Heritage & Home (3 unique)
  grandparentStory: q("photo-1516035069371-29a1b244cc32"),
  familyDinnerTable: q("photo-1555396273-367ea4eb4db5"),
  cozyHomeMoment: q("photo-1519671482749-fd09be7ccebf"),
};

export const heroPreloadUrls = [
  "/glass.png",
  ...Object.values(heroImages),
];
