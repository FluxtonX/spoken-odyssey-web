"use client";

import React from "react";
import { 
  Home, 
  Mic, 
  FileText, 
  FolderHeart, 
  Compass, 
  Users, 
  Lock, 
  Bell, 
  Settings,
  Image as ImageIcon,
  Video,
  User
} from "lucide-react";

// Centering wrapper to match the exact dimensions (w-14 h-14) of the original 3D icon SVGs
// to prevent any alignment, layout, or padding breakage.
const IconWrapper = ({ children }) => {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center text-current transition-all animate-fade-in">
      {children}
    </div>
  );
};

// 1. Photo Memories: Sleek image icon
export const Photo3D = () => (
  <IconWrapper>
    <ImageIcon size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 2. Voice Records: Sleek microphone icon
export const Voice3D = () => (
  <IconWrapper>
    <Mic size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 3. Text Memories: Sleek document / text journal icon
export const Text3D = () => (
  <IconWrapper>
    <FileText size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 4. Albums: Sleek folder with heart (legacy/memory folder)
export const Albums3D = () => (
  <IconWrapper>
    <FolderHeart size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 5. Feed Sharing: Sleek compass icon representing feed and discovery
export const Feed3D = () => (
  <IconWrapper>
    <Compass size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 6. Family Circle: Sleek users icon representing the family unit
export const Family3D = () => (
  <IconWrapper>
    <Users size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 7. Privacy/Security: Sleek lock icon
export const Privacy3D = () => (
  <IconWrapper>
    <Lock size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 8. Home: Sleek home icon
export const Home3D = () => (
  <IconWrapper>
    <Home size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 9. Settings: Sleek settings gear icon
export const Settings3D = () => (
  <IconWrapper>
    <Settings size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 10. Bell / Notification: Sleek bell icon
export const Bell3D = () => (
  <IconWrapper>
    <Bell size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 11. Video Memory: Sleek video camera icon
export const Video3D = () => (
  <IconWrapper>
    <Video size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// 12. Profile / Me: Sleek user avatar icon
export const Profile3D = () => (
  <IconWrapper>
    <User size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.08} />
  </IconWrapper>
);

// Helper function resolving modern, professional line icons (matching the signatures expected by all consumers)
export const resolveGlass3DIcon = (title) => {
  const norm = title?.toLowerCase() || "";

  if (norm.includes("photo") || norm.includes("image") || norm.includes("upload image") || norm.includes("album curated")) return <Photo3D />;
  if (norm.includes("voice") || norm.includes("audio") || norm.includes("record") || norm.includes("quick audio")) return <Voice3D />;
  if (norm.includes("text") || norm.includes("write") || norm.includes("journal") || norm.includes("journal entry")) return <Text3D />;
  if (norm.includes("album")) return <Albums3D />;
  if (norm.includes("feed") || norm.includes("discover") || norm.includes("search") || norm.includes("public feed")) return <Feed3D />;
  if (norm.includes("family") || norm.includes("members")) return <Family3D />;
  if (norm.includes("privacy") || norm.includes("security") || norm.includes("privacy default")) return <Privacy3D />;
  if (norm.includes("home")) return <Home3D />;
  if (norm.includes("settings")) return <Settings3D />;
  if (norm.includes("notification") || norm.includes("bell") || norm.includes("notifications")) return <Bell3D />;
  if (norm.includes("video") || norm.includes("clip")) return <Video3D />;
  if (norm.includes("profile") || norm.includes("me")) return <Profile3D />;

  return <Privacy3D />;
};
