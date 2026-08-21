"use client";
import Link from "next/link";

export default function LandingFooter() {
  const groups = [
    ["Product", "Features", "Voice & Video", "Stories", "AI Insights", "Pricing"],
    ["Company", "About", "Values", "Careers", "Contact"],
    ["Legal", "Privacy Policy", "Terms of Service", "Security", "Accessibility", "Cookie Settings"],
  ];

  return (
    <footer className="bg-[#111111] py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <img src="/odyssey.png" alt="Spoken Odyssey" className="h-9 w-auto brightness-0 invert" />
          <p className="mt-5 max-w-xs text-sm font-semibold leading-6 text-[#aaa6b5]">
            Your life story. Preserved for the people who matter most.
          </p>
          <p className="mt-5 text-xs font-bold text-[#aaa6b5]">&quot;Tell them your voice mattered beyond your lifetime.&quot;</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map(([title, ...items]) => (
            <div key={title}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white">{title}</h3>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <a key={item} href="#" className="block text-xs font-semibold text-[#aaa6b5] transition hover:text-white">
                    {item}
                  </a>
                ))}
                {title === "Product" && (
                  <a href="https://odyssey-store-ten.vercel.app" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20">
                    Buy Glasses <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-white/12 px-5 pt-6 text-xs font-semibold text-[#8b8794] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© 2026 Spoken Odyssey. All rights reserved.</p>
        <div className="flex gap-5">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}
