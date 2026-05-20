"use client";

import React from "react";

const useScopedIconIds = () => {
  const reactId = React.useId().replace(/:/g, "");

  return {
    gold3d: `glass3d-${reactId}-gold`,
    purple3d: `glass3d-${reactId}-purple`,
    rose3d: `glass3d-${reactId}-rose`,
    glassReflection: `glass3d-${reactId}-reflection`,
    glassFrosted: `glass3d-${reactId}-frosted`,
    shadow3d: `glass3d-${reactId}-shadow`,
    glowGold: `glass3d-${reactId}-glow`,
  };
};

const IconDefs = ({ ids }) => (
  <defs>
    <linearGradient id={ids.gold3d} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f59e0b" />
      <stop offset="50%" stopColor="#d97706" />
      <stop offset="100%" stopColor="#b45309" />
    </linearGradient>
    <linearGradient id={ids.purple3d} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#818cf8" />
      <stop offset="50%" stopColor="#6366f1" />
      <stop offset="100%" stopColor="#4f46e5" />
    </linearGradient>
    <linearGradient id={ids.rose3d} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fb7185" />
      <stop offset="100%" stopColor="#e11d48" />
    </linearGradient>
    <linearGradient id={ids.glassReflection} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
      <stop offset="30%" stopColor="#ffffff" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <linearGradient id={ids.glassFrosted} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
    </linearGradient>
    <filter id={ids.shadow3d} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
    </filter>
    <filter id={ids.glowGold} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

const IconSvg = ({ children }) => {
  const ids = useScopedIconIds();
  const paint = (name) => `url(#${ids[name]})`;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" filter={paint("shadow3d")}>
        <IconDefs ids={ids} />
        {children(paint)}
      </svg>
    </div>
  );
};

// 1. Photo Memories: Stacked 3D realistic photos with golden frame and glass layer
export const Photo3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <rect x="8" y="12" width="28" height="28" rx="6" transform="rotate(-8 22 26)" fill={paint("purple3d")} opacity="0.4" />
        <rect x="10" y="8" width="28" height="28" rx="6" fill="#ffffff" stroke={paint("gold3d")} strokeWidth="1.5" />
        <rect x="13" y="11" width="22" height="16" rx="4" fill={paint("purple3d")} />
        <path d="M13 23L18 16L24 23H13Z" fill={paint("gold3d")} opacity="0.9" />
        <path d="M19 23L23 18L27 23H19Z" fill="#fb7185" opacity="0.8" />
        <circle cx="30" cy="15" r="3" fill={paint("gold3d")} />
        <rect x="8" y="18" width="32" height="20" rx="8" fill={paint("glassFrosted")} stroke="#ffffff" strokeWidth="1" />
        <rect x="8" y="18" width="32" height="20" rx="8" fill={paint("glassReflection")} />
      </>
    )}
  </IconSvg>
);

// 2. Voice Records: 3D microphone with golden wave and glass reflection
export const Voice3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <path d="M6 24C6 24 10 12 24 12C38 12 42 24 42 24" stroke={paint("gold3d")} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <path d="M10 24C10 24 14 16 24 16C34 16 38 24 38 24" stroke={paint("purple3d")} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <rect x="19" y="8" width="10" height="20" rx="5" fill={paint("purple3d")} stroke="#ffffff" strokeWidth="1.5" />
        <path d="M14 18V23C14 28.5228 18.4772 33 24 33C29.5228 33 34 28.5228 34 23V18" stroke={paint("gold3d")} strokeWidth="3" strokeLinecap="round" />
        <path d="M24 33V39" stroke={paint("gold3d")} strokeWidth="3" strokeLinecap="round" />
        <path d="M18 39H30" stroke={paint("gold3d")} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="16" fill={paint("glassFrosted")} stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
        <path d="M12 20C18 10 30 10 36 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </>
    )}
  </IconSvg>
);

// 3. Text Memories: 3D elegant notebook/document with gold spirals
export const Text3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <rect x="12" y="10" width="26" height="30" rx="4" fill={paint("purple3d")} opacity="0.3" transform="rotate(3 25 25)" />
        <rect x="10" y="8" width="28" height="32" rx="4" fill="#ffffff" stroke={paint("purple3d")} strokeWidth="1" />
        <path d="M8 12H12M8 18H12M8 24H12M8 30H12" stroke={paint("gold3d")} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="14" x2="32" y2="14" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="20" x2="30" y2="20" stroke={paint("gold3d")} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="16" y1="26" x2="32" y2="26" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="32" x2="26" y2="32" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="8" width="28" height="32" rx="4" fill={paint("glassReflection")} pointerEvents="none" />
      </>
    )}
  </IconSvg>
);

// 4. Albums: 3D premium golden binder / folders
export const Albums3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <path d="M6 14C6 11.7909 7.79086 10 10 10H18L22 14H38C40.2091 14 42 15.7909 42 18V38C42 40.2091 40.2091 42 38 42H10C7.79086 42 6 40.2091 6 38V14Z" fill={paint("purple3d")} opacity="0.3" />
        <path d="M8 16C8 13.7909 9.79086 12 12 12H19L23 16H36C38.2091 16 40 17.7909 40 20V38C40 40.2091 38.2091 42 36 42H12C9.79086 42 8 40.2091 8 38V16Z" fill="#ffffff" stroke={paint("gold3d")} strokeWidth="1.5" />
        <circle cx="14" cy="28" r="3" fill={paint("purple3d")} />
        <circle cx="24" cy="28" r="3" fill={paint("purple3d")} />
        <circle cx="34" cy="28" r="3" fill={paint("purple3d")} />
        <path d="M8 28H40V38C40 40.2091 38.2091 42 36 42H12C9.79086 42 8 40.2091 8 38V28Z" fill={paint("glassFrosted")} stroke="#ffffff" strokeWidth="1" />
        <path d="M8 28H40V38C40 40.2091 38.2091 42 36 42H12C9.79086 42 8 40.2091 8 38V28Z" fill={paint("glassReflection")} />
      </>
    )}
  </IconSvg>
);

// 5. Feed Sharing: 3D chat bubble card with golden heart like badge
export const Feed3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <rect x="22" y="20" width="20" height="16" rx="6" fill={paint("purple3d")} opacity="0.4" />
        <path d="M38 36L42 40V36H38Z" fill={paint("purple3d")} opacity="0.4" />
        <rect x="6" y="8" width="28" height="24" rx="8" fill="#ffffff" stroke={paint("gold3d")} strokeWidth="1.5" />
        <line x1="12" y1="15" x2="28" y2="15" stroke={paint("purple3d")} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="12" y1="21" x2="24" y2="21" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="28" r="8" fill={paint("rose3d")} stroke="#ffffff" strokeWidth="1.5" />
        <path d="M32 26.5C31.5 25.5 30 25.5 29.5 26.5C29 27.5 30.5 29.5 32 30.5C33.5 29.5 35 27.5 34.5 26.5C34 25.5 32.5 25.5 32 26.5Z" fill="#ffffff" />
        <rect x="6" y="8" width="28" height="24" rx="8" fill={paint("glassReflection")} />
      </>
    )}
  </IconSvg>
);

// 6. Family Circle: Elegant interlocking 3D rings with spherical group representation
export const Family3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <circle cx="24" cy="24" r="18" fill="none" stroke={paint("gold3d")} strokeWidth="1.5" opacity="0.3" />
        <circle cx="19" cy="26" r="10" fill="none" stroke={paint("purple3d")} strokeWidth="3.5" />
        <circle cx="29" cy="26" r="10" fill="none" stroke={paint("gold3d")} strokeWidth="3.5" />
        <circle cx="19" cy="16" r="5" fill={paint("purple3d")} stroke="#ffffff" strokeWidth="1" />
        <circle cx="29" cy="16" r="5" fill={paint("gold3d")} stroke="#ffffff" strokeWidth="1" />
        <circle cx="24" cy="24" r="4" fill={paint("rose3d")} stroke="#ffffff" strokeWidth="1" />
        <circle cx="24" cy="24" r="15" fill={paint("glassFrosted")} opacity="0.4" />
      </>
    )}
  </IconSvg>
);

// 7. Privacy/Security: Chamfered 3D gold shield with pad lock
export const Privacy3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <path d="M24 4L38 10V22C38 31 32 39 24 42C16 39 10 31 10 22V10L24 4Z" fill={paint("purple3d")} opacity="0.2" />
        <path d="M24 6L36 11.2V22C36 29.8 31 36.8 24 39.5C17 36.8 12 29.8 12 22V11.2L24 6Z" fill="#ffffff" stroke={paint("gold3d")} strokeWidth="2" />
        <path d="M20 22V18C20 15.7909 21.7909 14 24 14C26.2091 14 28 15.7909 28 18V22" stroke={paint("purple3d")} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="17" y="21" width="14" height="10" rx="3" fill={paint("gold3d")} stroke="#ffffff" strokeWidth="1" />
        <circle cx="24" cy="25" r="1.5" fill="#ffffff" />
        <line x1="24" y1="26.5" x2="24" y2="29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 6L36 11.2V22C36 29.8 31 36.8 24 39.5V6Z" fill={paint("glassReflection")} opacity="0.6" />
      </>
    )}
  </IconSvg>
);

// 8. Home: 3D premium glowing cottage/house icon with gold roof
export const Home3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <path d="M24 8L8 22V40H40V22L24 8Z" fill={paint("purple3d")} opacity="0.15" />
        <path d="M24 6L6 22H11V40H37V22H42L24 6Z" fill="#ffffff" stroke={paint("gold3d")} strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 22H36V38H12V22Z" fill={paint("purple3d")} opacity="0.1" />
        <rect x="20" y="28" width="8" height="11" rx="2" fill={paint("gold3d")} stroke="#ffffff" strokeWidth="1" />
        <circle cx="22.5" cy="33.5" r="0.8" fill="#ffffff" />
        <rect x="15" y="16" width="6" height="6" rx="1.5" fill="#ffffff" stroke={paint("purple3d")} strokeWidth="1" />
        <rect x="27" y="16" width="6" height="6" rx="1.5" fill="#ffffff" stroke={paint("purple3d")} strokeWidth="1" />
        <path d="M24 6L6 22H42L24 6Z" fill={paint("glassReflection")} opacity="0.5" />
        <rect x="10" y="22" width="28" height="17" rx="4" fill={paint("glassFrosted")} opacity="0.3" />
      </>
    )}
  </IconSvg>
);

// 9. Settings: 3D premium glowing dual gears/cogs
export const Settings3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <circle cx="24" cy="24" r="14" fill={paint("purple3d")} opacity="0.15" />
        <path
          d="M24 6C25.1 6 26 6.9 26 8V9.1C27.4 9.4 28.7 10 29.9 10.8L30.7 10C31.5 9.2 32.8 9.2 33.6 10L35 11.4C35.8 12.2 35.8 13.5 35 14.3L34.2 15.1C35 16.3 35.6 17.6 35.9 19H37C38.1 19 39 19.9 39 21V23C39 24.1 38.1 25 37 25H35.9C35.6 26.4 35 27.7 34.2 28.9L35 29.7C35.8 30.5 35.8 31.8 35 32.6L33.6 34C32.8 34.8 31.5 34.8 30.7 34L29.9 34.8C28.7 35.6 27.4 36.2 26 36.5V37.6C26 38.7 25.1 39.6 24 39.6H22C20.9 39.6 20 38.7 20 37.6V36.5C18.6 36.2 17.3 35.6 16.1 34.8L15.3 35.6C14.5 36.4 13.2 36.4 12.4 35.6L11 34.2C10.2 33.4 10.2 32.1 11 31.3L11.8 30.5C11 29.3 10.4 28 10.1 26.6H9C7.9 26.6 7 25.7 7 24.6V22.6C7 21.5 7.9 20.6 9 20.6H10.1C10.4 19.2 11 17.9 11.8 16.7L11 15.9C10.2 15.1 10.2 13.8 11 13L12.4 11.6C13.2 10.8 14.5 10.8 15.3 11.6L16.1 12.4C17.3 11.6 18.6 11 20 10.7V9.6C20 8.5 20.9 7.6 22 7.6H24V6Z"
          fill="#ffffff"
          stroke={paint("gold3d")}
          strokeWidth="1.5"
        />
        <circle cx="24" cy="24" r="8" fill={paint("purple3d")} stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="3" fill="#ffffff" />
        <circle cx="24" cy="24" r="12" fill={paint("glassFrosted")} stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
      </>
    )}
  </IconSvg>
);

// 10. Bell / Notification: 3D premium glowing bell
export const Bell3D = () => (
  <IconSvg>
    {(paint) => (
      <>
        <path d="M24 6C18.4772 6 14 10.4772 14 16V28L10 32V35H38V32L34 28V16C34 10.4772 29.5228 6 24 6Z" fill={paint("purple3d")} opacity="0.15" />
        <path d="M24 4C23.2 4 22.5 4.5 22.2 5.2C17.2 6.5 13.5 11 13.5 16.5V27.5L10 31V34H38L34.5 27.5V16.5C34.5 11 30.8 6.5 25.8 5.2C25.5 4.5 24.8 4 24 4Z" fill="#ffffff" stroke={paint("gold3d")} strokeWidth="1.5" />
        <path d="M20 34C20 36.2 21.8 38 24 38C26.2 38 28 36.2 28 34" fill={paint("purple3d")} stroke="#ffffff" strokeWidth="1" />
        <circle cx="24" cy="18" r="8" fill={paint("glassFrosted")} stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
      </>
    )}
  </IconSvg>
);

// Helper function to resolve the correct premium 3D Glassmorphism Icon component
export const resolveGlass3DIcon = (title) => {
  const norm = title?.toLowerCase() || "";

  if (norm.includes("photo") || norm.includes("image") || norm.includes("album curated")) return <Photo3D />;
  if (norm.includes("voice") || norm.includes("audio") || norm.includes("record")) return <Voice3D />;
  if (norm.includes("text") || norm.includes("write") || norm.includes("journal")) return <Text3D />;
  if (norm.includes("album")) return <Albums3D />;
  if (norm.includes("feed")) return <Feed3D />;
  if (norm.includes("family")) return <Family3D />;
  if (norm.includes("privacy") || norm.includes("security")) return <Privacy3D />;
  if (norm.includes("home")) return <Home3D />;
  if (norm.includes("settings")) return <Settings3D />;
  if (norm.includes("notification") || norm.includes("bell")) return <Bell3D />;

  return <Privacy3D />;
};
