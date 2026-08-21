"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function CTAButton({ children, dark = false, href = "/signup" }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-extrabold transition duration-300 active:scale-95 ${
        dark
          ? "bg-[#111111] text-white hover:bg-[#2f2a5a]"
          : "bg-[#4f37ff] text-white shadow-[0_8px_20px_rgba(79,55,255,0.28)] hover:-translate-y-0.5 hover:bg-[#3521dc]"
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
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent border-b border-transparent">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/odyssey.png"
            alt="Spoken Odyssey"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-bold transition-all duration-200 relative py-1 ${
                  isActive
                    ? "text-[#4f37ff]"
                    : "text-[#52496d] hover:text-[#4f37ff]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f37ff] rounded-full" />
                )}
              </Link>
            );
          })}
          <a
            href="https://odyssey-store-ten.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#52496d] hover:text-[#4f37ff] transition-all"
          >
            Store
          </a>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/auth"
            className="text-xs font-bold text-[#6f6985] transition hover:text-[#19142b]"
          >
            Sign in
          </Link>
          <CTAButton href="/signup">Begin Your Journey</CTAButton>
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
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-bold text-[#52496d]"
              >
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
              Store
            </a>
            <Link href="/auth" className="text-sm font-bold text-[#52496d]">
              Sign in
            </Link>
            <CTAButton href="/signup">Begin Your Journey</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}