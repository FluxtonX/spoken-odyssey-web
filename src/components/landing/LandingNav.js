"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function CTAButton({ children, dark = false, href = "/signup" }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-extrabold transition duration-300 active:scale-95 ${
        dark
          ? "bg-[#111111] text-white hover:bg-[#2f2a5a]"
          : "bg-[#4f37ff] text-white shadow-[0_16px_34px_rgba(79,55,255,0.28)] hover:-translate-y-0.5 hover:bg-[#3521dc]"
      }`}
    >
      {children}
    </Link>
  );
}

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { label: "Home", href: "/" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Explore", href: "/explore" },
    { label: "For Families", href: "/for-families" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#dad2ff]/70 bg-white/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/odyssey.png" alt="Spoken Odyssey" className="h-8 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-semibold transition-all duration-200 rounded-full px-3 py-1.5 ${
                  isActive
                    ? "bg-[#4f37ff]/10 text-[#4f37ff] font-bold"
                    : "text-[#6f6985] hover:text-[#4f37ff]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a 
            href="https://odyssey-store-ten.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-black uppercase tracking-wider text-white bg-[#4f37ff] hover:bg-[#3521dc] transition-all px-4 py-2 rounded-full flex items-center gap-1.5 shadow-[0_6px_16px_rgba(79,55,255,0.2)] hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Store
          </a>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/auth" className="text-xs font-bold text-[#6f6985] transition hover:text-[#19142b]">
            Sign in
          </Link>
          <CTAButton>Begin Your Journey</CTAButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd5ff] text-[#281a77] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e5ddff] bg-white px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="text-sm font-bold text-[#52496d]">
                {link.label}
              </Link>
            ))}
            <a 
              href="https://odyssey-store-ten.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-[#4f37ff]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Store
            </a>
            <Link href="/auth" className="text-sm font-bold text-[#52496d]">
              Sign in
            </Link>
            <CTAButton>Begin Your Journey</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}