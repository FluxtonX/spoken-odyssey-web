import { Public_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navigation/NavBar";
import LayoutShell from "@/components/layout/LayoutShell";
import { AuthProvider } from "@/context/AuthProvider";
import { GOOGLE_FONTS_LINK } from "@/data/postFonts";

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "Spoken Odyssey — Preserve Your Family's Voice Forever",
  description: "A private, generational oral history vault to capture, organize, and preserve your family's most precious stories, voices, and memories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_LINK} rel="stylesheet" />
      </head>
      <body className={`${publicSans.className} antialiased bg-[var(--background)]`}>
        <AuthProvider>
          <LayoutShell>
            <NavBar />
            {children}
          </LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
