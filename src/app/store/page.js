import StoreHeroSection from "@/components/landing/StoreHeroSection";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Store — Spoken Odyssey",
  description:
    "Explore AI-powered glasses, memory preservation keepsake boxes, and smart accessories.",
};

export default function StorePage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <StoreHeroSection />
      <LandingFooter />
    </main>
  );
}
