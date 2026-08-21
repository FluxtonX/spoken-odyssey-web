"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ease = [0.22, 1, 0.36, 1];

export default function HeroSection({
  backgroundImage = "/howitworks.png",
  heading = "How Spoken Odyssey works.",
  description = "Discover the simple steps to preserve your family's stories forever.",
  cardHeading = "Your story. Your rules. Your legacy.",
  cardDescription = "Enterprise-grade security to protect what matters most.",
  buttonText = "See all features",
  buttonLink = "/",
  profileImages = [],
  showRealStories = true,
}) {
  const bulletPoints = [
    "Capture what matters. Hold on to what truly counts.",
    "Give your story meaning. Turn moments into milestones.",
    "Leave a legacy that lives. Inspire today. Echo tomorrow.",
  ];

  // Default profile images if none provided
  const defaultProfiles = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=85",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=85",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=85",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=85",
  ];

  const profiles = profileImages.length > 0 ? profileImages : defaultProfiles;

  return (
    <section className="relative overflow-hidden pt-16" style={{ minHeight: '80vh' }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Content */}
          <motion.div 
            className="space-y-6 max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-[#1a0a2e]">How</span>{" "}
                <span className="text-[#4f37ff]">Spoken Odyssey</span>{" "}
                <span className="text-[#1a0a2e]">works.</span>
              </h1>
              
              {/* Bullet Points */}
              <div className="space-y-3 mt-6">
                {bulletPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#4f37ff] flex-shrink-0" />
                    <p className="text-base md:text-lg text-gray-900 font-medium leading-relaxed">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Real Stories Section */}
              {showRealStories && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="pt-4"
                >
                  <p className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                    Real Stories
                  </p>
                  <div className="flex items-center gap-3">
                    {profiles.map((profile, index) => (
                      <motion.div
                        key={index}
                        className="relative w-12 h-12"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={profile}
                          alt={`Profile ${index + 1}`}
                          className="w-full h-full rounded-full border-2 border-white/50 object-cover shadow-md"
                        />
                      </motion.div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-white/50 bg-white/80 flex items-center justify-center shadow-md">
                      <span className="text-gray-800 text-xs font-bold">+2k</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Bottom Card with Lock Icon */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-6"
            >
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 md:p-6 shadow-lg max-w-md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Lock className="text-gray-700" size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {cardHeading}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {cardDescription}
                    </p>
                  </div>
                </div>
                <Link
                  href={buttonLink}
                  className="inline-flex items-center gap-2 bg-[#4f37ff] hover:bg-[#3521dc] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
                >
                  {buttonText}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Empty as background image has the 4 cards */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}