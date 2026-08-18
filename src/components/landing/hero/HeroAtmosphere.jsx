"use client";

export default function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#f8f6ff_0%,#eef2ff_42%,#e9e4ff_100%)]" />
      <div className="absolute -right-[10%] top-[-8%] h-[55vh] w-[55vh] rounded-full bg-[#c4b5fd]/18 blur-[110px]" />
      <div className="absolute -left-[8%] bottom-[-10%] h-[45vh] w-[45vh] rounded-full bg-[#ddd6fe]/22 blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,rgba(244,240,255,0.4)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
