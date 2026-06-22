import React from "react";

export default function UserAvatar({
  src,
  alt = "User Avatar",
  isActive = false,
  size = "md", // "sm", "md", "lg", "xl"
  className = "",
  children,
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-32 w-32",
  };

  const selectedSize = sizeClasses[size] || size || "h-10 w-10";

  const dotSizeClasses = {
    sm: "h-2 w-2 right-0 bottom-0 border",
    md: "h-2.5 w-2.5 right-0.5 bottom-0.5 border-2",
    lg: "h-3 w-3 right-0.5 bottom-0.5 border-2",
    xl: "h-6 w-6 right-2 bottom-2 border-4",
  };

  const selectedDotSize = dotSizeClasses[size] || "h-2.5 w-2.5 right-0.5 bottom-0.5 border-2";

  return (
    <div className={`relative inline-block shrink-0 ${selectedSize} ${className}`}>
      {/* Avatar Image */}
      <img
        src={src || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
        alt={alt}
        className="h-full w-full rounded-full object-cover border border-stone-200/80 dark:border-stone-700/80 shadow-sm"
      />

      {/* Pulsing Active status green dot */}
      {isActive && (
        <span className={`absolute rounded-full bg-emerald-500 border-[var(--surface)] dark:border-stone-900 ${selectedDotSize}`}>
          {/* Inner pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </span>
      )}
      {children}
    </div>
  );
}
