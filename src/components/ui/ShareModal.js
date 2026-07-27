"use client";

import { useState } from "react";
import { X, MessageCircle, Mail, Link as LinkIcon, Check } from "lucide-react";

// Custom Facebook Icon SVG
const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function ShareModal({ album, onClose, onShare }) {
  const [copied, setCopied] = useState(false);
  
  if (!album) return null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/albums/${album.id}`;
  const shareText = `Check out this album: ${album.title}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      color: "#1877F2",
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: "Gmail",
      icon: Mail,
      color: "#EA4335",
      action: () => {
        const url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: "Copy Link",
      icon: LinkIcon,
      color: "#4A3AFF",
      action: handleCopyLink
    }
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-[2rem] bg-white shadow-2xl animate-scale-up overflow-hidden relative">
        <div className="flex items-center justify-between border-b border-[#4f37ff]/20 p-5">
          <h3 className="text-lg font-black text-stone-900">Share Album</h3>
          <button onClick={onClose} className="text-stone-900 hover:text-stone-600 cursor-pointer">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Album Preview */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-[#f8f9ff] rounded-xl">
            <img 
              src={album.cover} 
              alt={album.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-stone-900 truncate">{album.title}</h4>
              <p className="text-xs font-semibold text-stone-500 truncate">{album.subtitle}</p>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#c8c5ff] hover:bg-[#eff0ff]/30 transition cursor-pointer group"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.name === "Copy Link" && copied ? (
                      <Check size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-700">{option.name}</span>
                </button>
              );
            })}
          </div>

          {/* Link Display */}
          <div className="mt-6 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 mb-1">Album Link</p>
            <p className="text-xs font-bold text-stone-700 truncate">{shareUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
