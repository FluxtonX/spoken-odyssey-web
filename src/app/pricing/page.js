import PricingHeroSection from "@/components/landing/PricingHeroSection";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Pricing — Spoken Odyssey",
  description:
    "Start free. Upgrade anytime. Choose the plan that's right for you.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <PricingHeroSection backgroundImage="/Pricing.png" />
      <LandingFooter />
    </main>
  );
}