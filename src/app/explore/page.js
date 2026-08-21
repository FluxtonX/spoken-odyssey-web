import ExploreHeroSection from "@/components/landing/ExploreHeroSection";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Explore — Spoken Odyssey",
  description:
    "Be inspired by stories from people who've lived fully and left a legacy worth remembering.",
};

export default function ExplorePage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <ExploreHeroSection backgroundImage="/explore.png" />
      <LandingFooter />
    </main>
  );
}