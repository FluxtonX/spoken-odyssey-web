"use client";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-stone-950 text-stone-400 pt-16 pb-10 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14 text-left">

          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md">S</div>
              <span className="font-extrabold text-white text-lg">Spoken <span className="text-amber-500">Odyssey</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A secure memory platform for saving photos, voice notes, text records, albums, and family moments — with full privacy control.
            </p>
            <div className="flex gap-3 pt-2">
              {["🐦 Twitter", "📸 Instagram", "💼 LinkedIn"].map((s) => (
                <a key={s} href="#" className="text-xs font-bold text-stone-500 hover:text-amber-500 transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest text-stone-300">Product</h4>
            {["Features", "Albums", "Feed", "Family Circle", "Privacy Controls", "Mobile App"].map((l) => (
              <a key={l} href="#" className="block text-sm hover:text-amber-500 transition-colors py-0.5">{l}</a>
            ))}
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest text-stone-300">Company</h4>
            {["About Us", "Blog", "Careers", "Press Kit", "Contact Us"].map((l) => (
              <a key={l} href="#" className="block text-sm hover:text-amber-500 transition-colors py-0.5">{l}</a>
            ))}
          </div>

          {/* Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest text-stone-300">Legal & Support</h4>
            {["Help Center", "Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((l) => (
              <a key={l} href="#" className="block text-sm hover:text-amber-500 transition-colors py-0.5">{l}</a>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-600 font-semibold">
          <span>© 2026 Spoken Odyssey. All rights reserved.</span>
          <span className="flex items-center gap-5">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Support</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
