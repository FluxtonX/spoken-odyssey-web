"use client";

import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#211934] flex flex-col justify-between">
      <LandingNav />

      <section className="relative overflow-hidden pt-36 pb-20 px-5 sm:px-8 max-w-5xl mx-auto w-full my-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0066FF]">
            OUR STORY
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#0B0E23] tracking-tight">
            About <span className="text-[#0066FF]">Spoken Odyssey.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Preserving life&apos;s most meaningful memories, stories, and milestones for today and future generations.
          </p>
        </motion.div>
      </section>

      <LandingFooter />
    </main>
  );
}
