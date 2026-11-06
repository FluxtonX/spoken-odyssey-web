import LandingNav from "@/components/landing/LandingNav";
import AboutPageContent from "@/components/landing/AboutPageContent";

export const metadata = {
  title: "About — Spoken Odyssey",
  description: "Real lives. Lasting impact. Meet the people building a world where every story is captured, understood and never forgotten.",
};

export default function AboutPage() {
  return <main><LandingNav /><AboutPageContent /></main>;
}
