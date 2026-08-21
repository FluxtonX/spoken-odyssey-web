import HowItWorksHeroSection from "@/components/landing/HowItWorksHeroSection";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "How It Works — Spoken Odyssey",
  description:
    "Discover the simple steps to preserve your family's stories forever.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <HowItWorksHeroSection backgroundImage="/howitworks.png" />
      <LandingFooter />
    </main>
  );
}