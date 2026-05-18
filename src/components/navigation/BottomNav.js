"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mic, Library, Search, UserCircle } from "lucide-react";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Discover", href: "/discover", icon: Search },
    { name: "Record", href: "/record", icon: Mic, isPrimary: true },
    { name: "Albums", href: "/albums", icon: Library },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass pb-safe">
      <div className="flex justify-around items-center px-2 py-3 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <div key={item.name} className="relative -top-5">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/30 transition-transform active:scale-95"
                >
                  <Icon size={28} strokeWidth={2.5} />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-16 h-12 transition-colors",
                isActive ? "text-[var(--brand)]" : "text-[var(--foreground)] opacity-60 hover:opacity-100"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
