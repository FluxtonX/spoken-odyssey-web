import LandingNav from "@/components/landing/LandingNav";
import StoreHeroSection from "@/components/landing/StoreHeroSection";

export const metadata = {
  title: "Store — Spoken Odyssey",
  description: "See life differently. Capture, remember and share the moments that matter with Spoken Odyssey AI Glasses.",
};

export default function StorePage() {
  return <main><LandingNav /><StoreHeroSection /></main>;
}
