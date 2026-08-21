import ForFamiliesHeroSection from "@/components/landing/ForFamiliesHeroSection";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "For Families — Spoken Odyssey",
  description:
    "Capture the moments that matter. Cherish your memories together. Pass them on forever.",
};

export default function ForFamiliesPage() {
  return (
    <main className="min-h-screen bg-[#fcfbfe]">
      <LandingNav />
      <ForFamiliesHeroSection backgroundImage="/family.png" />
      <LandingFooter />
    </main>
  );
}