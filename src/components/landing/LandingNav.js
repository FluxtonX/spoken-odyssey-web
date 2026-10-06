"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Explore", href: "/explore" },
    { label: "For Families", href: "/for-families" },
    { label: "Store", href: "/store" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="fixed left-0 right-0 top-3 sm:top-4 z-50 px-3 sm:px-6 pointer-events-none">
      {/* ── Main Floating Navbar Bar ── */}
      <div className="mx-auto flex h-[62px] sm:h-[66px] max-w-[1340px] items-center justify-between rounded-2xl border border-slate-200/90 bg-white/95 px-4 sm:px-6 shadow-[0_6px_25px_rgba(0,0,0,0.06)] backdrop-blur-md pointer-events-auto">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/odysseyLogo.png"
            alt="Spoken Odyssey"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden items-center gap-5 lg:gap-7 xl:gap-8 min-[1120px]:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-[13px] lg:text-[14px] font-semibold transition-colors ${
                  isActive
                    ? "text-[#0066FF] font-bold"
                    : "text-[#1E293B] hover:text-[#0066FF]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-[#0066FF] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Divider, Sign In & Get Started */}
        <div className="hidden items-center gap-3 sm:gap-3.5 min-[1120px]:flex">
          {/* Search Icon */}
          <Link
            href="/search"
            className="p-1.5 text-slate-700 hover:text-[#0066FF] transition-colors"
            aria-label="Search"
          >
            <Search size={19} strokeWidth={2.2} />
          </Link>

          {/* Thin Vertical Divider */}
          <span className="h-4 w-[1px] bg-slate-300" aria-hidden="true" />

          {/* Sign In Button */}
          <Link
            href="/auth"
            className="rounded-xl border border-slate-200 bg-white px-4.5 py-2 text-xs sm:text-sm font-semibold text-[#0B0E23] transition-all hover:border-slate-300 hover:bg-slate-50 shadow-2xs"
          >
            Sign In
          </Link>

          {/* Get Started Gradient Button */}
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-[#0055FF] via-[#3346FF] to-[#7C3AED] px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,85,255,0.35)] transition-all hover:opacity-95 hover:shadow-lg active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 min-[1120px]:hidden hover:bg-slate-50"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu Card ── */}
      {open && (
        <div className="mx-auto mt-2 max-w-[1340px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] pointer-events-auto min-[1120px]:hidden">
          <div className="flex flex-col gap-3.5">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? "text-[#0066FF] font-bold" : "text-[#1E293B]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#1E293B] hover:text-[#0066FF]"
              >
                <Search size={16} />
                <span>Search</span>
              </Link>
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0B0E23]"
              >
                Sign In
              </Link>
            </div>

            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-gradient-to-r from-[#0055FF] via-[#3346FF] to-[#7C3AED] px-4 py-2.5 text-center text-xs font-bold text-white shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}