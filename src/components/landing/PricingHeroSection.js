"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ArrowUpRight,
  Shield,
  Send,
  Star,
  Gem,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const PLANS = [
  {
    icon: Send,
    name: "Free",
    price: "$0",
    period: "Forever",
    features: [
      "Record voice notes and stories",
      "Add photos",
      "Basic timeline",
      "Up to 5 GB storage",
    ],
    cta: "Get started",
    ctaHref: "/signup",
    popular: false,
  },
  {
    icon: Star,
    name: "Premium",
    price: "$7.99",
    period: "/month",
    features: [
      "Everything in Free",
      "Unlimited stories",
      "AI highlights",
      "50 GB storage",
      "Priority support",
    ],
    cta: "Get Premium",
    ctaHref: "/signup?plan=premium",
    popular: true,
  },
  {
    icon: Gem,
    name: "Legacy",
    price: "$19.99",
    period: "/month",
    features: [
      "Everything in Premium",
      "Advanced privacy controls",
      "1 TB storage",
      "Family sharing",
      "Priority support",
    ],
    cta: "Get Legacy",
    ctaHref: "/signup?plan=legacy",
    popular: false,
  },
];

export default function PricingHeroSection({
  backgroundImage = "/Pricing.png",
}) {
  return (
    <div>
      {/* ════════════════════════════════════════════════
          HERO  +  PRICING CARDS
      ════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt="Pricing background"
            className="w-full h-full object-cover object-center"
          />
          {/* Left white gradient so text stays readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.30) 52%, transparent 70%)",
            }}
          />
        </div>

        {/* Content grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[33%_1fr] gap-8 lg:gap-10 py-28 items-stretch">

            {/* ── LEFT: Text ── */}
            <motion.div
              className="space-y-6 max-w-md flex flex-col justify-center"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                className="space-y-0.5"
              >
                <p
                  className="italic font-semibold text-base md:text-lg"
                  style={{ color: "#4f37ff" }}
                >
                  Simple plans.
                </p>
                <p
                  className="italic font-semibold text-base md:text-lg"
                  style={{ color: "#4f37ff" }}
                >
                  A lifetime of impact.{" "}
                  <span className="not-italic" aria-hidden="true">♡</span>
                </p>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              >
                <h1
                  className="font-extrabold leading-[1.08] tracking-tight"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                >
                  <span style={{ color: "#1a0a2e" }}>Choose the plan</span>
                  <br />
                  <span style={{ color: "#1a0a2e" }}>that&rsquo;s</span>{" "}
                  <span style={{ color: "#4f37ff" }}>right for you.</span>
                </h1>
              </motion.div>

              {/* Sub-description */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "#52496d" }}
              >
                Start free. Upgrade anytime.
                <br />
                Your story is always worth it.
              </motion.p>
            </motion.div>

            {/* ── RIGHT: Pricing cards ── */}
            <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-5 w-full">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  className="relative flex flex-col w-full sm:flex-1 rounded-3xl overflow-visible"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.3 + i * 0.12, ease }}
                >
                  {/* Most Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                      <span
                        className="text-xs font-bold text-white rounded-full px-4 py-1.5 shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, #3521dc 0%, #4f37ff 100%)",
                          boxShadow: "0 4px 14px -2px rgba(79,55,255,0.45)",
                        }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Card body */}
                  <div
                    className={`flex flex-col h-full rounded-3xl p-6 pt-8 ${
                      plan.popular
                        ? "ring-2 ring-[#4f37ff]/70 shadow-2xl shadow-[#4f37ff]/15"
                        : "border border-gray-200/80 shadow-lg shadow-black/5"
                    }`}
                    style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4"
                      style={{
                        borderColor: plan.popular ? "#4f37ff" : "#d1d5db",
                        color: plan.popular ? "#4f37ff" : "#6b7280",
                      }}
                    >
                      <plan.icon size={20} strokeWidth={1.8} />
                    </div>

                    {/* Plan name */}
                    <p className="text-base font-bold text-gray-900 mb-2">{plan.name}</p>

                    {/* Price */}
                    <div className="flex items-end gap-1 mb-5">
                      <span
                        className="font-extrabold leading-none"
                        style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)", color: "#1a0a2e" }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500 mb-1 font-medium">
                        {plan.period}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1 mb-7">
                      {plan.features.map((feat, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <Check
                            size={14}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: "#4f37ff" }}
                            strokeWidth={2.5}
                          />
                          <span className="text-sm text-gray-700 leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      id={`pricing-${plan.name.toLowerCase()}-btn`}
                      href={plan.ctaHref}
                      className={`w-full text-center rounded-full font-bold text-sm py-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                        plan.popular
                          ? "text-white shadow-lg"
                          : "border border-gray-300 text-gray-900 hover:border-[#4f37ff] hover:text-[#4f37ff]"
                      }`}
                      style={
                        plan.popular
                          ? {
                              background: "linear-gradient(135deg, #3521dc 0%, #4f37ff 100%)",
                              boxShadow: "0 8px 22px -4px rgba(79,55,255,0.4)",
                            }
                          : {}
                      }
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM PRIVACY BANNER (inside section, floating over bg) ── */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 z-10 px-6 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease }}
        >
          <div
            className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl px-6 py-5"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,55,255,0.09)" }}
              >
                <Shield size={18} style={{ color: "#4f37ff" }} strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-sm md:text-base leading-tight">
                  Your privacy. Your control. Your legacy.
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bank-level security to keep your story safe, always.
                </p>
              </div>
            </div>

            {/* Right */}
            <Link
              id="pricing-security-btn"
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-full border font-bold text-sm px-5 py-2.5 whitespace-nowrap transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5 flex-shrink-0"
              style={{
                borderColor: "rgba(79,55,255,0.3)",
                color: "#1a0a2e",
              }}
            >
              See all features
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
