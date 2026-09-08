"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Lock,
  Cloud,
  RotateCcw,
  Gift,
  Users,
  GraduationCap,
  Headphones,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const FEATURE_BADGES = [
  {
    icon: Shield,
    title: "Your data is yours",
    subtitle: "We don't sell your data.",
  },
  {
    icon: Lock,
    title: "Bank-level security",
    subtitle: "End-to-end encryption.",
  },
  {
    icon: Cloud,
    title: "Access anywhere",
    subtitle: "Web, iOS, Android.",
  },
  {
    icon: RotateCcw,
    title: "Cancel anytime",
    subtitle: "No hassle, no fees.",
  },
];

const PRICING_PLANS = [
  {
    id: "begin",
    name: "Odyssey Begin",
    tagline: "Start capturing your life",
    image: "/pricing-begin.png",
    nameColor: "text-emerald-700",
    checkColor: "text-emerald-600",
    popular: false,
    price: "Free",
    period: "Forever",
    subPrice1: null,
    subPrice2: null,
    features: [
      "Capture voice, photos & videos",
      "Create moments & albums (3 albums)",
      "Basic timeline",
      "5 GB storage",
      "Access on web & mobile",
      "Standard support",
    ],
    cta: "Get started for free",
    ctaHref: "/signup",
    ctaStyle:
      "border border-gray-300 hover:border-emerald-600 text-gray-800 hover:text-emerald-700 bg-white hover:bg-emerald-50/40",
  },
  {
    id: "journey",
    name: "Odyssey Journey",
    tagline: "Build, understand and explore your personal Odyssey",
    image: "/pricing-journey.png",
    nameColor: "text-blue-600",
    checkColor: "text-blue-600",
    popular: true,
    price: "CHF 9.99",
    period: "/ month",
    subPrice1: "Billed annually (CHF 119.88 / year)",
    subPrice2: "or CHF 9.99 month-to-month",
    features: [
      "Everything in Odyssey Begin",
      "Unlimited storage (100 GB personal)",
      "All life insights & reflections",
      "AI monthly life interview",
      "Advanced search & memories",
      "Export your Odyssey",
      "Priority support",
    ],
    cta: "Start your Journey",
    ctaHref: "/signup?plan=journey",
    ctaStyle:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25",
  },
  {
    id: "together",
    name: "Odyssey Together",
    tagline: "Bring multiple lives and generations together",
    image: "/pricing-together.png",
    nameColor: "text-purple-700",
    checkColor: "text-purple-600",
    popular: false,
    price: "CHF 19.99",
    period: "/ month",
    subPrice1: "Billed annually (CHF 239.88 / year)",
    subPrice2: "or CHF 19.99 month-to-month",
    features: [
      "Everything in Odyssey Journey",
      "Create family spaces",
      "Invite up to 10 members",
      "AI family questions & responses",
      "Generational timeline & lineage",
      "Shared albums & collaborative stories",
      "Role-based privacy controls",
      "Priority support",
    ],
    cta: "Start your Together",
    ctaHref: "/signup?plan=together",
    ctaStyle:
      "bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-600/25",
  },
];

const BOTTOM_FEATURES = [
  {
    icon: Gift,
    title: "Special offer",
    description: "Save 15% with annual billing.",
  },
  {
    icon: Users,
    title: "For larger families",
    description: "Need more than 10 members? Contact us for custom plans.",
  },
  {
    icon: GraduationCap,
    title: "Student discount",
    description: "Students get 20% off all paid plans.",
  },
  {
    icon: Headphones,
    title: "Need help?",
    description: "We're here to help you choose the right plan.",
  },
];

export default function PricingHeroSection({
  backgroundImage = "/Pricing.png",
}) {
  return (
    <div className="relative overflow-hidden min-h-screen text-slate-900 selection:bg-blue-600/10">
      {/* ── Background Image - Clear and sharp without blurry wash ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Pricing background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Main Section Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 min-h-screen flex flex-col justify-between">
        
        {/* Top Split: Left Info + Right 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[28%_1fr] gap-8 lg:gap-8 items-start w-full">
          
          {/* ── LEFT COLUMN ── */}
          <motion.div
            className="flex flex-col justify-start pt-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="italic font-semibold text-xs sm:text-sm text-blue-600 mb-2 flex items-center gap-1"
            >
              It&rsquo;s your journey <span className="not-italic text-sm">♡</span>
            </motion.p>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="text-3xl sm:text-4xl lg:text-[40px] font-black leading-[1.12] tracking-tight text-[#1a0a2e] mb-3"
            >
              Choose the Odyssey<br />
              that fits <span className="text-blue-600">your life.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed mb-6"
            >
              Start capturing today and<br />build a legacy that lasts.
            </motion.p>

            {/* 4 Feature Badges (Icons with filled background, backgroundless text) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="space-y-4 max-w-xs"
            >
              {FEATURE_BADGES.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100/90 shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                    <badge.icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight mt-0.5">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: 3 PRICING CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-4 items-stretch w-full pt-4 lg:pt-0">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 + index * 0.1, ease }}
                className="relative flex flex-col h-full"
              >
                {/* Most Popular Pill Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center z-20">
                    <span className="bg-[#1d4ed8] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div
                  className={`bg-white rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-center h-full transition-all duration-300 ${
                    plan.popular
                      ? "border-2 border-blue-600 shadow-2xl relative z-10 pt-6"
                      : "border border-gray-100 shadow-xl"
                  }`}
                >
                  <div>
                    {/* Circular Planet/Space Artwork Image */}
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-sm border-2 border-white mb-3 bg-slate-900">
                      <img
                        src={plan.image}
                        alt={plan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Plan Name */}
                    <h3 className={`text-base sm:text-lg font-bold ${plan.nameColor}`}>
                      {plan.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 mb-3 leading-tight min-h-[30px] flex items-center justify-center">
                      {plan.tagline}
                    </p>

                    {/* Pricing */}
                    <div className="mb-4">
                      {plan.period === "Forever" ? (
                        <div>
                          <div className="text-3xl sm:text-[32px] font-black text-gray-900 leading-none">
                            {plan.price}
                          </div>
                          <div className="text-xs font-semibold text-gray-400 mt-1">
                            {plan.period}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-2xl sm:text-[28px] font-black text-gray-900 leading-none">
                              {plan.price}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {plan.period}
                            </span>
                          </div>
                          {plan.subPrice1 && (
                            <div className="text-[10px] text-gray-500 font-medium mt-1">
                              {plan.subPrice1}
                            </div>
                          )}
                          {plan.subPrice2 && (
                            <div className="text-[10px] text-gray-400">
                              {plan.subPrice2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-left mb-6">
                      {plan.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-600 font-medium leading-tight"
                        >
                          <CheckCircle2
                            size={14}
                            className={`${plan.checkColor} flex-shrink-0 mt-0.5`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Action Button */}
                  <div className="pt-2">
                    <Link
                      id={`pricing-${plan.id}-btn`}
                      href={plan.ctaHref}
                      className={`w-full rounded-full font-bold text-xs sm:text-sm py-2.5 px-4 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 ${plan.ctaStyle}`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BANNER (4 COLUMNS) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="mt-10 sm:mt-12 w-full"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-lg p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
            {BOTTOM_FEATURES.map((item, bIdx) => (
              <div key={bIdx} className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <item.icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
