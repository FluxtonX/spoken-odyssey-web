"use client";

export default function LayoutItem({
  x,
  y,
  scale = 1,
  rotation = 0,
  zIndex = 10,
  className = "",
  children,
}) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-1/2 ${className}`}
      style={{
        zIndex,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
}
