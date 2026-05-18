"use client";

import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import {
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  PrivacySection,
  HowItWorksSection,
  UseCasesSection,
  SecuritySection,
  FAQSection,
  MobileAppSection,
  FinalCTASection,
} from "@/components/landing/Sections";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <PrivacySection />
      <HowItWorksSection />
      <UseCasesSection />
      <SecuritySection />
      <MobileAppSection />
      <FAQSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}
