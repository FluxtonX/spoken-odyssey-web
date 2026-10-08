"use client";

import Link from "next/link";
import { ArrowRight, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function LandingFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  const navColumns = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/how-it-works" },
        { label: "Explore", href: "/explore" },
        { label: "For Families", href: "/for-families" },
        { label: "Store", href: "/store" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Mission", href: "/about" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Centre", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "FAQs", href: "#" },
        { label: "System Status", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden w-full bg-[#030712] text-white pt-16 sm:pt-20 pb-8 sm:pb-10">
      {/* ── Panoramic Space Earth Background: footer.png ── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/footer.png"
          alt="Spoken Odyssey Footer Background"
          className="w-full h-full object-cover object-[center_top] sm:object-center"
        />
        {/* Subtle bottom dark gradient for clean text readability on rocky surface */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020510]/95 via-[#020510]/30 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full">
        {/* ── Main Top Row: Left Brand, Middle Nav Columns, Right Newsletter ── */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-6">
          
          {/* Left Column: Brand Logo & Tagline */}
          <div className="max-w-xs space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              {/* Glowing circular icon extracted cleanly */}
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 overflow-hidden shrink-0">
                <img
                  src="/odysseyLogo.png"
                  alt="Spoken Odyssey"
                  className="absolute top-0 left-0 h-full w-auto max-w-none"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/90">
                  S P O K E N
                </span>
                <span className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                  ODYSSEY
                </span>
              </div>
            </Link>

            <div className="pt-2 space-y-0.5">
              <p className="text-base sm:text-lg font-medium text-white tracking-tight leading-snug">
                Every life is an Odyssey.
              </p>
              <p className="text-base sm:text-lg font-medium text-slate-400 tracking-tight leading-snug">
                Start capturing yours.
              </p>
            </div>
          </div>

          {/* Middle Nav Columns with Vertical Borders */}
          <div className="flex items-center gap-6 xl:gap-8 w-full lg:w-auto justify-between lg:justify-start">
            <div className="hidden lg:block w-px h-36 bg-white/15" aria-hidden="true" />
            
            <div className="grid grid-cols-3 gap-6 sm:gap-10 xl:gap-12">
              {navColumns.map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-bold text-white mb-3 sm:mb-4">
                    {col.title}
                  </h4>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-xs sm:text-[13px] text-slate-300 transition-colors hover:text-white font-medium"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="hidden lg:block w-px h-36 bg-white/15" aria-hidden="true" />
          </div>

          {/* Right Column: Newsletter Subscription */}
          <div className="max-w-md w-full lg:w-auto space-y-2.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Stay in the <span className="text-[#3B82F6]">journey</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-sm">
              Get product updates, new features and inspiring stories straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full sm:w-60 xl:w-68 rounded-xl border border-slate-700/70 bg-[#081226]/80 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#0055FF] backdrop-blur-sm shadow-inner"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0055FF] via-[#3346FF] to-[#7C3AED] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,85,255,0.4)] transition-all hover:opacity-95 active:scale-95 shrink-0"
              >
                <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </form>
          </div>

        </div>

        {/* ── Horizontal Divider ── */}
        <div className="border-t border-white/15 my-6 sm:my-8" />

        {/* ── Bottom Bar: Copyright, Legal Links, Badges & Language ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-xs text-slate-400">
          
          {/* Copyright */}
          <p className="font-normal text-slate-400 text-center lg:text-left">
            &copy; 2026 Spoken Odyssey. All rights reserved.
          </p>

          {/* Legal Links with Pipe Separators */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 font-normal text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-white transition-colors">Legal</Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>

          {/* Store Badges & Language Dropdown */}
          <div className="flex items-center gap-3">
            {/* Google Play Badge */}
            <a
              href="#"
              aria-label="Get Spoken Odyssey on Google Play"
              className="inline-flex h-9 transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/play-store-badge.svg"
                alt="Google Play"
                className="h-full w-auto object-contain"
              />
            </a>

            {/* App Store Badge */}
            <a
              href="#"
              aria-label="Download Spoken Odyssey on the App Store"
              className="inline-flex h-9 transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/app-store-badge.svg"
                alt="App Store"
                className="h-full w-auto object-contain"
              />
            </a>

            {/* Language Dropdown Selector */}
            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Globe size={15} className="text-slate-300" />
              <span>English</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
