import { Outfit } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navigation/NavBar";
import LayoutShell from "@/components/layout/LayoutShell";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "Spoken Odyssey — Preserve Your Family's Voice Forever",
  description: "A private, generational oral history vault to capture, organize, and preserve your family's most precious stories, voices, and memories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-[var(--background)]`}>
        <LayoutShell>
          <NavBar />
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
