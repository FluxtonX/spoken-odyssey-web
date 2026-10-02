"use client";

import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, Users, Infinity as InfinityIcon, Globe, ChevronDown } from "lucide-react";
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
        { label: "How it works", href: "#how-it-works" },
        { label: "Explore", href: "/discover" },
        { label: "For Families", href: "#families" },
        { label: "Store", href: "https://odyssey-store-ten.vercel.app" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Features",
      links: [
        { label: "Memory Anchors", href: "#" },
        { label: "AI Interviewer", href: "#" },
        { label: "AI Historian", href: "#" },
        { label: "Keepsake Gifts", href: "#" },
        { label: "AI Glasses", href: "https://odyssey-store-ten.vercel.app" },
        { label: "Translation", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Our Mission", href: "#" },
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

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "Your data, your story",
      desc: "Built with privacy and security in mind.",
    },
    {
      icon: Users,
      title: "For every generation",
      desc: "Capture today. Share tomorrow.",
    },
    {
      icon: InfinityIcon,
      title: "More than life moments",
      desc: "Meaningful stories, stronger connections.",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-white pt-16 sm:pt-20 pb-8 sm:pb-12 border-t border-slate-100">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        
        {/* Top Grid: 4 Nav Columns (Left) + Newsletter & Earth (Right) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* 4 Nav Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {navColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-[13px] sm:text-sm font-bold text-[#0B0E23] mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-[13px] font-medium text-[#64748B] transition-colors hover:text-[#0066FF]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Box with 3D Earth */}
          <div className="lg:col-span-5 lg:border-l lg:border-slate-100 lg:pl-10">
            <div className="relative">
              {/* Floating Earth Icon on Top Right of Newsletter */}
              <div className="absolute -top-3 right-0 sm:right-2 select-none pointer-events-none">
                <img
                  src="/earth.png"
                  alt="Earth"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-md"
                />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-base sm:text-lg font-bold text-[#0B0E23] pr-20">
                Stay in the journey
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] text-[#64748B] leading-relaxed max-w-xs sm:max-w-sm">
                Get product updates, new features and inspiring stories straight to your inbox.
              </p>

              {/* Form Input & Button */}
              <form onSubmit={handleSubscribe} className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-2xs transition-colors focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#1E40AF] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,102,255,0.25)] transition-all duration-200 hover:opacity-95 active:scale-95 shrink-0"
                >
                  <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Middle Trust Badges Bar */}
        <div className="mt-12 sm:mt-16 rounded-[20px] sm:rounded-[24px] border border-slate-100 bg-[#FAFAFE]/90 px-6 sm:px-8 py-4 sm:py-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-slate-200/70 items-center">
            {trustBadges.map((badge, index) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 px-2 lg:px-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#0066FF] shadow-2xs">
                    <IconComp size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="text-[13.5px] sm:text-sm font-bold text-[#0B0E23] leading-snug">
                      {badge.title}
                    </h5>
                    <p className="mt-0.5 text-xs text-[#64748B] font-medium leading-tight">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links, Store Badges & Language Selector */}
        <div className="mt-10 sm:mt-12 flex flex-col md:flex-row items-center justify-between gap-5 border-t border-slate-100 pt-6 sm:pt-8 text-xs text-[#64748B]">
          
          {/* Copyright */}
          <p className="font-normal text-slate-500">
            &copy; 2026 Spoken Odyssey. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 font-medium text-slate-600">
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Terms of Service</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Cookies</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Legal</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Sitemap</Link>
          </div>

          {/* Store Badges & Language Pill */}
          <div className="flex items-center gap-3">
            {/* Google Play */}
            <a
              href="#"
              aria-label="Get Spoken Odyssey on Google Play"
              className="inline-flex h-8 transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/play-store-badge.svg"
                alt="Google Play"
                className="h-full w-auto object-contain"
              />
            </a>

            {/* App Store */}
            <a
              href="#"
              aria-label="Download Spoken Odyssey on the App Store"
              className="inline-flex h-8 transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/app-store-badge.svg"
                alt="App Store"
                className="h-full w-auto object-contain"
              />
            </a>

            {/* Language Dropdown Selector */}
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
            >
              <Globe size={14} className="text-[#0066FF]" />
              <span>English</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
