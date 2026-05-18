"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const onboardingSteps = [
  {
    id: 1,
    title: "Capture Life",
    subtitle: "Record your memories in any format",
    description: "Voice notes, text, videos, and photos. Your legacy, captured beautifully.",
    icon: "🎙️",
    color: "from-brand-300 to-brand-500",
  },
  {
    id: 2,
    title: "Curate Albums",
    subtitle: "Organize the moments that matter",
    description: "Create stunning editorial timelines of your family's history.",
    icon: "📚",
    color: "from-emerald-300 to-emerald-500",
  },
  {
    id: 3,
    title: "Leave a Legacy",
    subtitle: "Share securely with your Family Circle",
    description: "Ensure your stories live on for generations in a private, ad-free space.",
    icon: "👨‍👩‍👧‍👦",
    color: "from-blue-300 to-blue-500",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--background)] z-[100] flex flex-col overflow-hidden">
      
      {/* Dynamic Background Blob */}
      <div className="absolute top-0 left-0 w-full h-1/2 opacity-30 overflow-hidden pointer-events-none">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={`absolute -top-32 -left-16 w-96 h-96 rounded-full bg-gradient-to-tr blur-3xl ${onboardingSteps[step].color}`}
        />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand)] text-white font-bold flex items-center justify-center shadow-md">S</div>
          <span className="font-bold tracking-tight">SpokenOdyssey</span>
        </div>
        {step < onboardingSteps.length - 1 && (
          <Link href="/" className="text-sm font-semibold opacity-60 hover:opacity-100">
            Skip
          </Link>
        )}
      </div>

      {/* Carousel Content */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Realistic 3D Icon Container */}
            <div className={`w-40 h-40 md:w-56 md:h-56 rounded-[2rem] bg-gradient-to-tr ${onboardingSteps[step].color} flex items-center justify-center shadow-2xl mb-12 ring-8 ring-[var(--background)] shadow-${onboardingSteps[step].color.split('-')[1]}/40`}>
              <span className="text-7xl md:text-8xl filter drop-shadow-xl">{onboardingSteps[step].icon}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{onboardingSteps[step].title}</h1>
            <h2 className="text-lg font-semibold text-[var(--brand)] mb-4">{onboardingSteps[step].subtitle}</h2>
            <p className="opacity-70 leading-relaxed max-w-[280px]">
              {onboardingSteps[step].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-8 glass flex flex-col items-center gap-8 border-t-0 z-20">
        
        {/* Pagination Dots */}
        <div className="flex gap-2">
          {onboardingSteps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-[var(--brand)]" : "w-2 bg-[var(--border)]"}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full max-w-sm flex gap-4">
          {step > 0 && (
            <button 
              onClick={prevStep}
              className="flex-1 py-4 rounded-2xl border-2 border-[var(--border)] font-bold opacity-70 hover:opacity-100 hover:bg-[var(--surface-hover)] transition-all"
            >
              Back
            </button>
          )}
          
          {step < onboardingSteps.length - 1 ? (
            <button 
              onClick={nextStep}
              className="flex-[2] py-4 rounded-2xl bg-[var(--brand)] text-white font-bold shadow-lg shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Continue
            </button>
          ) : (
            <Link 
              href="/auth"
              className="flex-[2] flex justify-center py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 text-white font-bold shadow-xl shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
