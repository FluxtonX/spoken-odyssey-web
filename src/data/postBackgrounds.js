import React from "react";

export const postBackgrounds = [
  {
    id: "none",
    name: "Plain Paper",
    category: "Classic",
    mood: "neutral",
    keywords: ["none", "plain", "classic", "simple", "clean"],
    featured: true,
    previewStyle: { background: "#f5f3ef", border: "2px solid #e7e5e0" },
    containerStyle: { background: "var(--background)", color: "var(--ink)" },
    textStyle: {},
  },
  // Islamic presets
  {
    id: "islamic-green-gold",
    name: "Emerald & Gold",
    category: "Islamic",
    mood: "peaceful",
    keywords: ["islamic", "emerald", "gold", "border", "stars", "ramadan", "peaceful"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #062f17 0%, #124d29 100%)", border: "2px dashed #d4af37" },
    containerStyle: {
      background: "linear-gradient(135deg, #052613 0%, #0d381f 50%, #174f2f 100%)",
      color: "#f3e1b7",
      boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.6)",
      border: "6px double #d4af37",
    },
    textStyle: { fontFamily: "Georgia, serif", fontWeight: "700" },
    overlayEmoji: "🕌✨🌙",
  },
  {
    id: "islamic-twilight",
    name: "Twilight Prayer",
    category: "Islamic",
    mood: "peaceful",
    keywords: ["islamic", "purple", "twilight", "stars", "night", "dua"],
    featured: false,
    previewStyle: { background: "linear-gradient(135deg, #200f3c 0%, #3e1b5b 100%)", border: "2px solid #b388ff" },
    containerStyle: {
      background: "linear-gradient(135deg, #160a2b 0%, #2f1345 50%, #461c66 100%)",
      color: "#ffffff",
      boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
      border: "3px solid #8e2de2",
    },
    textStyle: { fontFamily: "Georgia, serif" },
    overlayEmoji: "🌙⭐️✨",
  },
  {
    id: "islamic-lanterns",
    name: "Swaying Lanterns",
    category: "Islamic",
    mood: "peaceful",
    keywords: ["lantern", "islamic", "sway", "celebration", "gold", "ramadan", "eid"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #0d353a 0%, #1c5e66 100%)", border: "1px solid #d4af37" },
    containerStyle: {
      background: "linear-gradient(135deg, #092629 0%, #134950 50%, #206d77 100%)",
      color: "#f9e0b8",
      border: "2px solid #d4af37",
    },
    textStyle: { fontFamily: "Georgia, serif", fontWeight: "600" },
    overlayEmoji: "🏮✨🕯️",
  },
  // Funny / Happy presets
  {
    id: "funny-party",
    name: "Celebration Blow",
    category: "Funny",
    mood: "happy",
    keywords: ["party", "happy", "balloons", "confetti", "funny", "joy", "smile"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      color: "#5c1b26",
    },
    textStyle: { fontWeight: "900" },
    overlayEmoji: "🎈🎉🥳",
  },
  {
    id: "funny-joy",
    name: "Laughter Cloud",
    category: "Funny",
    mood: "happy",
    keywords: ["smile", "laughter", "happy", "joy", "funny", "emoji", "giggle"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #ff930f 0%, #ffdf00 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #ff930f 0%, #ffdf00 100%)",
      color: "#3d2000",
    },
    textStyle: { fontWeight: "900" },
    overlayEmoji: "😂😸✨",
  },
  {
    id: "funny-memes",
    name: "Comic Strip",
    category: "Funny",
    mood: "happy",
    keywords: ["comic", "funny", "meme", "dots", "pop", "bright", "cartoon"],
    featured: false,
    previewStyle: { background: "#ffeb3b", border: "3px solid #000" },
    containerStyle: {
      background: "#ffeb3b",
      color: "#000000",
      border: "5px solid #000000",
      boxShadow: "8px 8px 0px #000000",
    },
    textStyle: { fontFamily: "Impact, Arial Black, sans-serif", fontWeight: "900", textTransform: "uppercase" },
    overlayEmoji: "💥💬👻",
  },
  // Sad presets
  {
    id: "sad-rain",
    name: "Rainy Melancholy",
    category: "Sad",
    mood: "sad",
    keywords: ["rain", "sad", "tears", "melancholy", "grey", "storm", "crying"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #2d3c5b 0%, #151f33 100%)",
      color: "#cbd5e1",
      border: "1px solid #3b4d70",
    },
    textStyle: { fontStyle: "italic", fontWeight: "500" },
    overlayEmoji: "😢🌧️💔",
  },
  {
    id: "sad-darkness",
    name: "Drifting Solitude",
    category: "Sad",
    mood: "sad",
    keywords: ["sad", "dark", "solitude", "lonely", "clouds", "blue", "gloom"],
    featured: false,
    previewStyle: { background: "linear-gradient(135deg, #0f2027 0%, #203a43 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #091317 0%, #122228 50%, #1c323a 100%)",
      color: "#94a3b8",
    },
    textStyle: { fontWeight: "400", letterSpacing: "0.04em" },
    overlayEmoji: "☁️🕸️🌌",
  },
  {
    id: "sad-heartbreak",
    name: "Broken Heart",
    category: "Sad",
    mood: "sad",
    keywords: ["heartbreak", "sad", "broken", "tears", "separation", "purple"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #3d2a6b 0%, #875e7a 100%)",
      color: "#ffe4e6",
    },
    textStyle: { fontWeight: "600", fontStyle: "italic" },
    overlayEmoji: "💔🥀😭",
  },
  // Angry presets
  {
    id: "angry-burn",
    name: "Fierce Ember",
    category: "Angry",
    mood: "angry",
    keywords: ["angry", "fire", "burn", "embers", "red", "hot", "mad", "fury"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #870000 0%, #190000 100%)" },
    containerStyle: {
      background: "radial-gradient(circle, #5e0202 0%, #190000 100%)",
      color: "#ff9900",
      border: "2px solid #870000",
      boxShadow: "0 0 20px rgba(135,0,0,0.5)",
    },
    textStyle: { fontWeight: "900", letterSpacing: "0.05em", textTransform: "uppercase" },
    overlayEmoji: "🔥😡💥",
  },
  {
    id: "angry-storm",
    name: "Thunder Shock",
    category: "Angry",
    mood: "angry",
    keywords: ["angry", "lightning", "storm", "shock", "thunder", "dark", "strike"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #130cb7 0%, #520066 100%)", border: "1px solid #e20074" },
    containerStyle: {
      background: "linear-gradient(135deg, #070449 0%, #2f013d 100%)",
      color: "#e20074",
      textShadow: "0 0 10px rgba(226, 0, 116, 0.8)",
      border: "2px solid #e20074",
    },
    textStyle: { fontWeight: "950" },
    overlayEmoji: "⚡✊⛈️",
  },
  {
    id: "angry-fury",
    name: "Intense Red Warning",
    category: "Angry",
    mood: "angry",
    keywords: ["angry", "red", "warning", "heat", "fury", "danger", "fuming"],
    featured: false,
    previewStyle: { background: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #bf1515 0%, #4a0303 100%)",
      color: "#ffffff",
      border: "3px solid #ff3333",
    },
    textStyle: { fontWeight: "800", textShadow: "2px 2px 4px rgba(0,0,0,0.6)" },
    overlayEmoji: "👺💢🚨",
  },
  // Aesthetic presets
  {
    id: "aesthetic-sunset",
    name: "Sunset Reflections",
    category: "Aesthetic",
    mood: "warm",
    keywords: ["sunset", "aesthetic", "orange", "warm", "peach", "retro"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
      color: "#ffffff",
    },
    textStyle: { fontFamily: "Georgia, serif", fontWeight: "700", fontStyle: "italic" },
    overlayEmoji: "🌅🌴🧡",
  },
  {
    id: "aesthetic-lavender",
    name: "Lavender Dreams",
    category: "Aesthetic",
    mood: "dreamy",
    keywords: ["lavender", "aesthetic", "pastel", "clouds", "dreamy", "soft"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      color: "#2c3e50",
    },
    textStyle: { fontWeight: "600" },
    overlayEmoji: "🌸☁️✨",
  },
  {
    id: "aesthetic-linen",
    name: "Minimalist Linen",
    category: "Aesthetic",
    mood: "calm",
    keywords: ["linen", "beige", "aesthetic", "minimalist", "calm", "vintage", "clean"],
    featured: false,
    previewStyle: { background: "#f4efe6", border: "2px solid #d4cbb5" },
    containerStyle: {
      background: "#fdfbf7",
      color: "#4a4133",
      border: "3px solid #ebdcc5",
    },
    textStyle: { fontFamily: "Georgia, serif", fontStyle: "italic" },
    overlayEmoji: "🌿🕯️📔",
  },
  // Gradients presets
  {
    id: "gradient-aurora",
    name: "Aurora Borealis",
    category: "Gradient",
    mood: "peaceful",
    keywords: ["aurora", "green", "gradient", "teal", "space", "sky", "northern"],
    featured: true,
    previewStyle: { background: "linear-gradient(135deg, #0575e6 0%, #00f260 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #033a75 0%, #007234 100%)",
      color: "#e2ffe9",
    },
    textStyle: { fontWeight: "800" },
    overlayEmoji: "🌲🌌💚",
  },
  {
    id: "gradient-cosmic",
    name: "Cosmic Glow",
    category: "Gradient",
    mood: "dreamy",
    keywords: ["cosmic", "space", "gradient", "galaxy", "purple", "glow", "stars"],
    featured: false,
    previewStyle: { background: "linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #4a154b 0%, #7e1b38 50%, #9e3612 100%)",
      color: "#ffffff",
    },
    textStyle: { fontWeight: "800" },
    overlayEmoji: "🌌🚀🪐",
  },
  {
    id: "gradient-ocean",
    name: "Ocean Breeze",
    category: "Gradient",
    mood: "calm",
    keywords: ["ocean", "breeze", "cyan", "blue", "calm", "water", "gradient"],
    featured: false,
    previewStyle: { background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" },
    containerStyle: {
      background: "linear-gradient(135deg, #008eb7 0%, #00459a 100%)",
      color: "#e0f7ff",
    },
    textStyle: { fontWeight: "700" },
    overlayEmoji: "🌊⛵🐠",
  },
];

// Helper to get background container style object
export function getBackgroundStyles(id) {
  const bg = postBackgrounds.find((item) => item.id === id);
  if (!bg) return postBackgrounds[0].containerStyle;
  return bg.containerStyle;
}

// Helper to get background text style object
export function getBackgroundTextStyles(id) {
  const bg = postBackgrounds.find((item) => item.id === id);
  if (!bg) return postBackgrounds[0].textStyle;
  return bg.textStyle;
}

// Helper to render high-fidelity premium animated overlays
export function getBackgroundOverlay(id) {
  const bg = postBackgrounds.find((item) => item.id === id);
  if (!bg) return null;

  // Render specific rich animations for custom backgrounds
  if (id === "sad-rain") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
        <style>{`
          @keyframes rain-fall {
            0% { transform: translateY(-120%) rotate(15deg); }
            100% { transform: translateY(380px) rotate(15deg); }
          }
          .raindrop {
            position: absolute;
            width: 1.5px;
            height: 18px;
            background: linear-gradient(transparent, rgba(200, 220, 255, 0.45));
            animation: rain-fall 0.9s linear infinite;
          }
        `}</style>
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="raindrop"
            style={{
              left: `${(i * 7) % 95}%`,
              animationDelay: `${(i * 0.13).toFixed(2)}s`,
              animationDuration: `${0.8 + (i % 4) * 0.12}s`,
            }}
          />
        ))}
        <div className="absolute top-4 left-4 text-xl opacity-20">🌧️</div>
        <div className="absolute bottom-4 right-4 text-xl opacity-20">😢</div>
      </div>
    );
  }

  if (id === "angry-burn") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
        <style>{`
          @keyframes spark-rise {
            0% { transform: translateY(110%) scale(0.6) rotate(0deg); opacity: 0; }
            30% { opacity: 0.8; }
            100% { transform: translateY(-110%) scale(1.4) rotate(180deg); opacity: 0; }
          }
          @keyframes angry-pulse {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.6; }
          }
          .spark {
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #ff5722;
            box-shadow: 0 0 8px #ff2a00, 0 0 16px #ffc107;
            animation: spark-rise 2.1s ease-in infinite;
          }
          .pulse-glow {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, rgba(180, 0, 0, 0.3) 0%, transparent 70%);
            animation: angry-pulse 2.5s ease-in-out infinite;
          }
        `}</style>
        <div className="pulse-glow" />
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="spark"
            style={{
              left: `${10 + (i * 9) % 80}%`,
              bottom: "0",
              animationDelay: `${(i * 0.25).toFixed(2)}s`,
              animationDuration: `${1.7 + (i % 3) * 0.3}s`,
            }}
          />
        ))}
        <div className="absolute top-4 right-4 text-xl opacity-20">🔥</div>
      </div>
    );
  }

  if (id === "funny-party") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
        <style>{`
          @keyframes float-balloon {
            0% { transform: translateY(110%) rotate(0deg); opacity: 0; }
            15% { opacity: 0.75; }
            85% { opacity: 0.75; }
            100% { transform: translateY(-120%) rotate(15deg); opacity: 0; }
          }
          .balloon-emoji {
            position: absolute;
            animation: float-balloon 5s linear infinite;
            font-size: 1.5rem;
          }
        `}</style>
        {["🎈", "🥳", "🎉", "✨"].map((emoji, i) => (
          <span
            key={i}
            className="balloon-emoji"
            style={{
              left: `${15 + i * 22}%`,
              bottom: "0",
              animationDelay: `${i * 1.25}s`,
              animationDuration: `${4.5 + i * 0.8}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    );
  }

  if (id === "funny-joy") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
        <style>{`
          @keyframes float-smiley {
            0% { transform: translateY(110%) scale(0.7) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-110%) scale(1.3) rotate(360deg); opacity: 0; }
          }
          .smiley-item {
            position: absolute;
            animation: float-smiley 6s ease-in-out infinite;
            font-size: 1.6rem;
          }
        `}</style>
        {["😂", "😸", "✨", "😊"].map((emoji, i) => (
          <span
            key={i}
            className="smiley-item"
            style={{
              left: `${12 + i * 23}%`,
              bottom: "0",
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${5.5 + i * 0.5}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    );
  }

  if (id === "islamic-lanterns") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
        <style>{`
          @keyframes sway-lantern {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
          }
          @keyframes stars-twinkle {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 1; }
          }
          .hanging-lantern {
            position: absolute;
            top: 0;
            transform-origin: top center;
            animation: sway-lantern 3.5s ease-in-out infinite;
            font-size: 1.8rem;
          }
          .twinkling-star {
            position: absolute;
            color: #d4af37;
            font-size: 0.8rem;
            animation: stars-twinkle 2s ease-in-out infinite;
          }
        `}</style>
        {/* Hanging Lanterns */}
        <span className="hanging-lantern" style={{ left: "20%", animationDelay: "0s" }}>🏮</span>
        <span className="hanging-lantern" style={{ right: "20%", animationDelay: "0.8s" }}>🏮</span>
        
        {/* Twinkling Star Background */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="twinkling-star"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i * 11) % 40}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  if (id === "islamic-green-gold") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
        <style>{`
          @keyframes border-glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.95; }
          }
          .mosque-dome-svg {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 160px;
            height: auto;
            opacity: 0.08;
            fill: #d4af37;
          }
          .glowing-star {
            position: absolute;
            animation: border-glow 3s ease-in-out infinite;
            color: #d4af37;
          }
        `}</style>
        {/* Traditional Geometric Dome silhouette representation */}
        <svg viewBox="0 0 100 80" className="mosque-dome-svg">
          <path d="M50 0 C40 15, 30 25, 30 40 L70 40 C70 25, 60 15, 50 0 Z M20 40 L80 40 L80 80 L20 80 Z" />
        </svg>
        <span className="glowing-star text-base" style={{ top: "10%", left: "48%", animationDelay: "0s" }}>🌙</span>
        <span className="glowing-star text-xs" style={{ top: "18%", left: "54%", animationDelay: "1s" }}>✨</span>
      </div>
    );
  }

  // Fallback for general templates with simple emojis
  if (bg.overlayEmoji) {
    return (
      <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 opacity-15 z-0">
        <div className="flex justify-between text-2xl">
          <span>{bg.overlayEmoji[0] || ""}</span>
          <span>{bg.overlayEmoji[1] || ""}</span>
        </div>
        <div className="flex justify-between text-2xl">
          <span>{bg.overlayEmoji[2] || ""}</span>
          <span>{bg.overlayEmoji[0] || ""}</span>
        </div>
      </div>
    );
  }

  return null;
}
