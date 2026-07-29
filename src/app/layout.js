import "./globals.css";
import NavBar from "@/components/navigation/NavBar";
import LayoutShell from "@/components/layout/LayoutShell";
import { AuthProvider } from "@/context/AuthProvider";
import { GOOGLE_FONTS_LINK } from "@/data/postFonts";

export const metadata = {
  title: "Spoken Odyssey — Preserve Your Family's Voice Forever",
  description: "A private, generational oral history vault to capture, organize, and preserve your family's most precious stories, voices, and memories.",
  icons: {
    icon: "/spoken.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/spoken.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Work+Sans:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        <link href={GOOGLE_FONTS_LINK} rel="stylesheet" />
      </head>
      <body className="antialiased bg-[var(--background)] font-sans">
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
