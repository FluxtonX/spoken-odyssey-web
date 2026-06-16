export const postFonts = [
  { id: "default", name: "Default (Outfit)", fontFamily: "inherit", category: "Sans-Serif" },
  { id: "playfair", name: "Classic Serif (Playfair)", fontFamily: "'Playfair Display', Georgia, serif", category: "Serif" },
  { id: "montserrat", name: "Modern Bold (Montserrat)", fontFamily: "'Montserrat', sans-serif", category: "Sans-Serif" },
  { id: "bebas", name: "Impact Meme (Bebas Neue)", fontFamily: "'Bebas Neue', sans-serif", category: "Display" },
  { id: "typewriter", name: "Typewriter (Courier Prime)", fontFamily: "'Courier Prime', Courier, monospace", category: "Monospace" },
  { id: "handwriting", name: "Casual Scribble (Caveat)", fontFamily: "'Caveat', cursive", category: "Handwriting" },
  { id: "dancing", name: "Elegant Cursive (Dancing)", fontFamily: "'Dancing Script', cursive", category: "Handwriting" },
  { id: "pacifico", name: "Funky Retro (Pacifico)", fontFamily: "'Pacifico', cursive", category: "Handwriting" },
  { id: "amiri", name: "Traditional Amiri (Amiri)", fontFamily: "'Amiri', serif", category: "Islamic/Arabic" },
  { id: "cinzel", name: "Royal Cinzel (Cinzel)", fontFamily: "'Cinzel', serif", category: "Serif" },
];

export const GOOGLE_FONTS_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@100..900&family=Caveat:wght@400..700&family=Cinzel:wght@400..900&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Bebas+Neue&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Dancing+Script:wght@400..700&family=Pacifico&display=swap";

export function getFontFamily(fontId) {
  const font = postFonts.find((f) => f.id === fontId);
  return font ? font.fontFamily : "inherit";
}
