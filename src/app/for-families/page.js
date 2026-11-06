import LandingNav from "@/components/landing/LandingNav";
import ForFamiliesHeroSection from "@/components/landing/ForFamiliesHeroSection";

export const metadata = {
  title: "For Families — Spoken Odyssey",
  description: "Create a private Family Space to capture, celebrate and keep your family’s story together — for today and for generations to come.",
};

export default function ForFamiliesPage() {
  return <main><LandingNav /><ForFamiliesHeroSection /></main>;
}
