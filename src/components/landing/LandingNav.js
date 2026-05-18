"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/landing";

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#fdfcfa]/95 backdrop-blur-xl shadow-sm border-b border-amber-100/60" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-200 text-white font-extrabold text-xl group-hover:scale-105 transition-transform">S</div>
          <span className="font-extrabold text-lg text-stone-800">Spoken <span className="text-amber-600">Odyssey</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-semibold text-stone-500 hover:text-amber-700 transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth" className="text-sm font-bold text-stone-600 hover:text-amber-700 transition-colors px-3 py-2">Login</Link>
          <Link href="/signup" className="px-5 py-2.5 text-sm font-extrabold bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-xl shadow-md shadow-amber-200 hover:shadow-amber-300 hover:scale-105 active:scale-95 transition-all">
            Get Started Free
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-amber-50 transition-colors text-stone-700">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#fdfcfa] border-t border-amber-100 shadow-lg px-5 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-semibold text-stone-600 hover:text-amber-700 py-3 border-b border-stone-50 transition-colors">{l.label}</a>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/auth" className="text-center text-sm font-bold py-3.5 rounded-2xl border-2 border-stone-200 text-stone-700 hover:border-amber-300 transition-colors">Login</Link>
            <Link href="/signup" className="text-center text-sm font-extrabold py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-md">Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
