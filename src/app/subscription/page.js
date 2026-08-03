"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { 
  Download, Check, Zap, Sparkles, ArrowRight, ShieldCheck, 
  HelpCircle, CreditCard, ChevronRight, FileText, X, ArrowLeft,
  Lock, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function SubscriptionPage() {
  // Billing cycle state: "monthly" | "yearly"
  const [billingCycle, setBillingCycle] = useState("monthly");
  
  // Toast Notice State
  const [exportNotice, setExportNotice] = useState(null);

  // Active User Plan State (Updated dynamically upon checkout)
  const [currentPlan, setCurrentPlan] = useState({
    name: "Free",
    totalStorageGb: 15,
    usedStorageGb: 7.4,
  });

  // Dynamic Billing History State
  const [billingHistory, setBillingHistory] = useState([
    { id: "bh-1", date: "Jun 1, 2024", plan: "Free Plan", amount: "$0.00", status: "Active" },
    { id: "bh-2", date: "May 1, 2024", plan: "Free Plan", amount: "$0.00", status: "Paid" },
    { id: "bh-3", date: "Apr 1, 2024", plan: "Free Plan", amount: "$0.00", status: "Paid" },
  ]);

  // Checkout Modal State: null | { planName: string, price: number, step: 1 | 2 | 3 }
  const [checkoutModal, setCheckoutModal] = useState(null);

  // Payment Form States
  const [paymentForm, setPaymentForm] = useState({
    nameOnCard: "Abc",
    cardNumber: "1234 8746 4748 3838",
    expiry: "12/21",
    cvv: "123",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Handle Export Simulation
  const handleExportData = () => {
    setExportNotice("Preparing your complete memory archive (4.2GB Voice, 2.1GB Photos, 0.8GB Journals)...");
    setTimeout(() => {
      setExportNotice(null);
    }, 4000);
  };

  // Open Checkout Modal for Selected Plan
  const handleOpenCheckout = (planName) => {
    let price = 7;
    let storageGb = 100;
    let features = ["100 GB total storage", "Unlimited recording length", "Photo + video memories", "15 family members"];

    if (planName === "Pro") {
      price = billingCycle === "yearly" ? 12 : 15;
      storageGb = 500;
      features = ["500 GB total storage", "Unlimited recording length", "Photo + video memories", "Unlimited family members"];
    } else if (planName === "Family") {
      price = billingCycle === "yearly" ? 16 : 20;
      storageGb = 1000;
      features = ["1 TB shared family storage", "Everything in Pro", "Up to 10 accounts", "Shared family timeline"];
    } else {
      // Plus Plan default
      price = billingCycle === "yearly" ? 5.60 : 7;
      storageGb = 100;
      features = ["100 GB total storage", "Unlimited recording length", "Photo + video memories", "15 family members"];
    }

    setCheckoutModal({
      planName,
      price,
      storageGb,
      features,
      step: 1,
    });
  };

  // Step 2 -> Execute Payment with Loader Animation
  const handleExecutePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      // Advance to Step 3 (Success State)
      setCheckoutModal(prev => (prev ? { ...prev, step: 3 } : null));
    }, 1800);
  };

  // Step 3 -> Finalize Subscription Upgrade
  const handleCompleteUpgrade = () => {
    if (!checkoutModal) return;

    const { planName, price, storageGb } = checkoutModal;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const formattedPrice = `$${price.toFixed(2)}`;

    // Update User Plan & Storage Capacity
    setCurrentPlan({
      name: planName,
      totalStorageGb: storageGb,
      usedStorageGb: 7.4,
    });

    // Update Billing History: set existing Active rows to Paid, add new Active row
    setBillingHistory(prev => [
      { id: `bh-${Date.now()}`, date: formattedDate, plan: `${planName} Plan`, amount: formattedPrice, status: "Active" },
      ...prev.map(item => item.status === "Active" ? { ...item, status: "Paid" } : item)
    ]);

    // Close Modal
    setCheckoutModal(null);
  };

  const usedPercentage = Math.round((currentPlan.usedStorageGb / currentPlan.totalStorageGb) * 100);

  return (
    <WavesBackground>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full relative pb-24 min-h-screen"
      >
        <DashboardHeader />

        {/* Master Alignment Wrapper */}
        <div className="w-full mt-2 md:mt-6 px-4 md:px-8 max-w-6xl mx-auto flex flex-col">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-400 mb-2">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-[#4A3AFF] font-bold">Subscription</span>
          </div>

          {/* Page Title & Subtitle */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-[32px] md:text-[40px] font-extrabold text-stone-900 tracking-tight leading-tight mb-1">
              Subscription & Storage
            </h1>
            <p className="text-stone-500 font-medium text-[15px]">
              Manage your plan, storage, and billing.
            </p>
          </motion.div>

          {/* Toast Notification Banner for Export */}
          {exportNotice && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-6 p-4 bg-[#4A3AFF] text-white rounded-2xl shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 font-semibold text-[14px]">
                <Download size={18} className="animate-bounce" />
                <span>{exportNotice}</span>
              </div>
              <span className="text-[12px] font-bold bg-white/20 px-3 py-1 rounded-full uppercase">Processing</span>
            </motion.div>
          )}

          {/* ====================================================
              SECTION 1: STORAGE USAGE GLASS CARD
              ==================================================== */}
          <motion.div 
            variants={fadeInUp} 
            className="figma-card w-full rounded-[24px] p-6 md:p-8 mb-10 relative overflow-hidden"
          >
            {/* Top Bar: Title & Export Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-[20px] font-bold text-stone-900 leading-tight">
                  Storage Usage
                </h2>
                <p className="text-[14px] font-medium text-stone-500 mt-1">
                  <span className="font-bold text-stone-800">{currentPlan.usedStorageGb} GB</span> of {currentPlan.totalStorageGb} GB used ({usedPercentage}%)
                </p>
              </div>

              <button
                onClick={handleExportData}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold border border-stone-200/90 rounded-full px-5 py-2.5 text-[13px] shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
              >
                <Download size={15} className="text-[#4A3AFF]" />
                Export Data
              </button>
            </div>

            {/* Combined Storage Multi-Bar */}
            <div className="w-full h-3.5 bg-stone-200/70 rounded-full overflow-hidden flex my-6 p-0.5">
              {/* Voice (4.2GB) */}
              <div className="h-full bg-[#4A3AFF] rounded-l-full transition-all duration-1000" style={{ width: `${(4.2 / currentPlan.totalStorageGb) * 100}%` }} />
              {/* Photos (2.1GB) */}
              <div className="h-full bg-[#10B981] transition-all duration-1000" style={{ width: `${(2.1 / currentPlan.totalStorageGb) * 100}%` }} />
              {/* Written (0.8GB) */}
              <div className="h-full bg-[#F59E0B] transition-all duration-1000" style={{ width: `${(0.8 / currentPlan.totalStorageGb) * 100}%` }} />
              {/* Other (0.3GB) */}
              <div className="h-full bg-[#334155] rounded-r-full transition-all duration-1000" style={{ width: `${(0.3 / currentPlan.totalStorageGb) * 100}%` }} />
            </div>

            {/* 4 Storage Breakdown Columns Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-2">
              {/* Voice */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A3AFF]" />
                  <span className="text-[13px] font-semibold text-stone-600">Voice recordings</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#4A3AFF] rounded-full" style={{ width: "70%" }} />
                </div>
                <span className="text-[14px] font-bold text-stone-900">4.2 GB</span>
              </div>

              {/* Photos */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[13px] font-semibold text-stone-600">Photos</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#10B981] rounded-full" style={{ width: "40%" }} />
                </div>
                <span className="text-[14px] font-bold text-stone-900">2.1 GB</span>
              </div>

              {/* Written */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[13px] font-semibold text-stone-600">Written journals</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "20%" }} />
                </div>
                <span className="text-[14px] font-bold text-stone-900">0.8 GB</span>
              </div>

              {/* Other */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
                  <span className="text-[13px] font-semibold text-stone-600">Other</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#334155] rounded-full" style={{ width: "10%" }} />
                </div>
                <span className="text-[14px] font-bold text-stone-900">0.3 GB</span>
              </div>
            </div>
          </motion.div>

          {/* ====================================================
              SECTION 2: CHOOSE A PLAN HEADER & TOGGLE
              ==================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-[24px] md:text-[28px] font-bold text-stone-900 tracking-tight">
              Choose a Plan
            </h2>

            {/* Monthly / Yearly Toggle Pill Container */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-full p-1 flex items-center shadow-sm shrink-0">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#4A3AFF] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-[#4A3AFF] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>Yearly</span>
                <span className="bg-[#FFD600] text-black font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* ====================================================
              SECTION 2: PRICING CARDS GRID (4 Cards)
              ==================================================== */}
          <motion.div 
            variants={fadeInUp} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* 1. FREE PLAN CARD */}
            <div className="figma-card rounded-[24px] p-6 flex flex-col justify-between border border-[#C7D2FE]/70 h-full relative">
              <div>
                <h3 className="text-[20px] font-bold text-stone-900 mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[40px] font-extrabold text-stone-900 tracking-tight">$0</span>
                  <span className="text-[14px] font-semibold text-stone-500">/mo</span>
                </div>
                <hr className="border-t border-stone-200/80 my-4" />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>15 GB total storage</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Voice recordings (up to 10 min)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Photo memories</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Written journals</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>5 family members</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Basic AI insights</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-stone-100/90 text-stone-800 font-bold border border-stone-300/80 rounded-2xl py-3 text-[14px] cursor-default text-center mt-4">
                {currentPlan.name === "Free" ? "Current Plan" : "Downgrade to Free"}
              </button>
            </div>

            {/* 2. PLUS PLAN CARD (Vibrant Royal Purple Highlight Card) */}
            <div className="relative pt-3 h-full">
              {/* Floating Yellow Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#FFD600] text-black font-extrabold text-[11px] tracking-wider uppercase px-4 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                ⭐ MOST POPULAR
              </div>

              <div className="rounded-[24px] p-6 flex flex-col justify-between bg-gradient-to-b from-[#635BFF] to-[#4A3AFF] text-white border-2 border-indigo-400/80 shadow-2xl shadow-[#4A3AFF]/30 h-full relative overflow-hidden transform hover:-translate-y-1 transition-all">
                <div>
                  <h3 className="text-[20px] font-bold text-white mb-2">Plus</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[40px] font-extrabold text-white tracking-tight">
                      {billingCycle === "yearly" ? "$5.60" : "$7"}
                    </span>
                    <span className="text-[14px] font-semibold text-white/80">/mo</span>
                  </div>
                  <hr className="border-t border-white/20 my-4" />

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>100 GB total storage</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>Unlimited recording length</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>Photo + video memories</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>15 family members</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>Advanced AI insights</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>Custom albums</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>Public profile</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[13px] font-semibold text-white">
                      <Check size={16} className="text-[#FFD600] shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>

                {currentPlan.name === "Plus" ? (
                  <button className="w-full bg-white/20 text-white font-bold rounded-2xl py-3.5 text-[14px] text-center cursor-default mt-4 border border-white/30">
                    Current Active Plan
                  </button>
                ) : (
                  <button 
                    onClick={() => handleOpenCheckout("Plus")}
                    className="w-full bg-white hover:bg-stone-50 text-[#4A3AFF] font-extrabold shadow-lg rounded-2xl py-3.5 text-[14px] text-center transition-all cursor-pointer mt-4"
                  >
                    Upgrade to Plus
                  </button>
                )}
              </div>
            </div>

            {/* 3. PRO PLAN CARD */}
            <div className="figma-card rounded-[24px] p-6 flex flex-col justify-between border border-[#C7D2FE]/70 h-full relative">
              <div>
                <h3 className="text-[20px] font-bold text-stone-900 mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[40px] font-extrabold text-stone-900 tracking-tight">
                    {billingCycle === "yearly" ? "$12" : "$15"}
                  </span>
                  <span className="text-[14px] font-semibold text-stone-500">/mo</span>
                </div>
                <hr className="border-t border-stone-200/80 my-4" />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>500 GB total storage</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Everything in Plus</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Unlimited family members</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Legacy DNA analysis</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>AI biography generation</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Voice cloning & preservation</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Professional export (PDF/video)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </div>

              {currentPlan.name === "Pro" ? (
                <button className="w-full bg-[#4A3AFF]/20 text-[#4A3AFF] font-bold border border-[#4A3AFF]/40 rounded-2xl py-3.5 text-[14px] text-center cursor-default mt-4">
                  Current Active Plan
                </button>
              ) : (
                <button 
                  onClick={() => handleOpenCheckout("Pro")}
                  className="w-full bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white font-bold rounded-2xl py-3.5 text-[14px] text-center shadow-md hover:shadow-lg transition-all cursor-pointer mt-4"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>

            {/* 4. FAMILY PLAN CARD */}
            <div className="figma-card rounded-[24px] p-6 flex flex-col justify-between border border-[#C7D2FE]/70 h-full relative">
              <div>
                <h3 className="text-[20px] font-bold text-stone-900 mb-2">Family</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[40px] font-extrabold text-stone-900 tracking-tight">
                    {billingCycle === "yearly" ? "$16" : "$20"}
                  </span>
                  <span className="text-[14px] font-semibold text-stone-500">/mo</span>
                </div>
                <hr className="border-t border-stone-200/80 my-4" />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>1 TB shared family storage</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Up to 10 accounts</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Shared family timeline</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Family AI reports</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Collaborative albums</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[13px] font-semibold text-stone-700">
                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Family legacy vault</span>
                  </li>
                </ul>
              </div>

              {currentPlan.name === "Family" ? (
                <button className="w-full bg-[#4A3AFF]/20 text-[#4A3AFF] font-bold border border-[#4A3AFF]/40 rounded-2xl py-3.5 text-[14px] text-center cursor-default mt-4">
                  Current Active Plan
                </button>
              ) : (
                <button 
                  onClick={() => handleOpenCheckout("Family")}
                  className="w-full bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white font-bold rounded-2xl py-3.5 text-[14px] text-center shadow-md hover:shadow-lg transition-all cursor-pointer mt-4"
                >
                  Get Family Plan
                </button>
              )}
            </div>
          </motion.div>

          {/* ====================================================
              SECTION 3: BILLING HISTORY TABLE
              ==================================================== */}
          <motion.div 
            variants={fadeInUp} 
            className="figma-card w-full rounded-[24px] overflow-hidden mb-10 border border-[#C7D2FE]/70"
          >
            <div className="p-6 border-b border-stone-200/70">
              <h2 className="text-[20px] font-bold text-stone-900">
                Billing History
              </h2>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider border-b border-stone-200/60">
                    <th className="py-3.5 px-6">DATE</th>
                    <th className="py-3.5 px-6">PLAN</th>
                    <th className="py-3.5 px-6">AMOUNT</th>
                    <th className="py-3.5 px-6">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 text-[14px] font-semibold text-stone-800">
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-4 px-6">{item.date}</td>
                      <td className="py-4 px-6 text-stone-600">{item.plan}</td>
                      <td className="py-4 px-6">{item.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`font-bold px-3 py-1 rounded-full text-[12px] ${
                          item.status === "Active"
                            ? "bg-[#4A3AFF]/15 text-[#4A3AFF]"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ====================================================
              SECTION 4: ENTERPRISE INSTITUTION BANNER
              ==================================================== */}
          <motion.div 
            variants={fadeInUp}
            className="w-full bg-gradient-to-r from-[#4A3AFF] to-[#3b2ee0] rounded-[24px] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden"
          >
            {/* Background Light Effects */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col mb-6 md:mb-0 max-w-xl z-10">
              <div className="flex items-center gap-1.5 text-[#FFD600] font-extrabold text-[12px] uppercase tracking-wider mb-2">
                <Zap size={15} className="fill-[#FFD600]" />
                <span>Enterprise</span>
              </div>
              <h3 className="text-[22px] md:text-[24px] font-bold text-white leading-tight mb-2">
                Preserving family history for institutions?
              </h3>
              <p className="text-[14px] text-white/90 font-medium leading-relaxed">
                We offer custom plans for schools, libraries, and heritage organizations.
              </p>
            </div>

            <button 
              onClick={() => alert("Connecting to Spoken Odyssey Institutional Sales team...")}
              className="bg-white hover:bg-stone-50 text-[#4A3AFF] font-bold text-[14px] px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0 z-10"
            >
              Contact Sales
            </button>
          </motion.div>

        </div>

        {/* ====================================================
            CHECKOUT MODAL FLOW (Exact Figma Screenshots 1, 2, 3)
            ==================================================== */}
        <AnimatePresence>
          {checkoutModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-white rounded-[24px] p-6 md:p-7 max-w-[440px] w-full shadow-2xl relative border border-stone-200 overflow-hidden"
              >
                {/* ----------------------------------------------------
                    STEP 1: REVIEW YOUR PLAN (Figma Screenshot 1)
                    ---------------------------------------------------- */}
                {checkoutModal.step === 1 && (
                  <div className="flex flex-col">
                    {/* Header: Stepper Progress + Title + Close X */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Top Stepper Indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-1 bg-[#4A3AFF] rounded-full" />
                        <span className="w-6 h-1 bg-stone-200 rounded-full" />
                      </div>

                      <button
                        onClick={() => setCheckoutModal(null)}
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <h3 className="text-[20px] font-bold text-stone-900 mb-4">
                      Review your plan
                    </h3>

                    {/* Plan Summary Box */}
                    <div className="bg-[#F4F6FF] rounded-2xl p-5 border border-[#D1D9FF]/70 mb-5 flex items-center justify-between">
                      <div>
                        <h4 className="text-[17px] font-bold text-stone-900 leading-tight">
                          {checkoutModal.planName} Plan
                        </h4>
                        <p className="text-[13px] font-medium text-stone-500 mt-1">
                          {checkoutModal.storageGb} GB storage · Billed {billingCycle}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[22px] font-extrabold text-[#4A3AFF]">${checkoutModal.price}</span>
                        <span className="text-[13px] font-semibold text-stone-500">/mo</span>
                      </div>
                    </div>

                    {/* 2x2 Feature Pills Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-6">
                      {checkoutModal.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 flex items-center gap-2">
                          <Check size={14} className="text-emerald-500 shrink-0" />
                          <span className="text-[12px] font-semibold text-stone-700 leading-tight line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cost Breakdown Lines */}
                    <div className="space-y-2 mb-6 text-[14px]">
                      <div className="flex justify-between font-medium text-stone-600">
                        <span>{checkoutModal.planName} Plan ({billingCycle})</span>
                        <span>${checkoutModal.price.toFixed(2)}/mo</span>
                      </div>
                      <div className="flex justify-between font-medium text-stone-600">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-stone-900 text-[16px] pt-2 border-t border-stone-100">
                        <span>Total today</span>
                        <span className="text-[#4A3AFF]">${checkoutModal.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setCheckoutModal(prev => (prev ? { ...prev, step: 2 } : null))}
                      className="w-full bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white font-bold text-[15px] py-3.5 rounded-2xl text-center shadow-lg transition-all cursor-pointer"
                    >
                      Continue to Payment
                    </button>

                    <p className="text-[12px] font-medium text-stone-400 text-center mt-3">
                      Cancel any time. No hidden fees.
                    </p>
                  </div>
                )}

                {/* ----------------------------------------------------
                    STEP 2: PAYMENT DETAILS (Figma Screenshot 2)
                    ---------------------------------------------------- */}
                {checkoutModal.step === 2 && (
                  <form onSubmit={handleExecutePayment} className="flex flex-col">
                    {/* Header: Back Arrow + Stepper + Title + Close X */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCheckoutModal(prev => (prev ? { ...prev, step: 1 } : null))}
                          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-1 bg-[#4A3AFF] rounded-full" />
                          <span className="w-6 h-1 bg-[#4A3AFF] rounded-full" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCheckoutModal(null)}
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <h3 className="text-[20px] font-bold text-stone-900 mb-4">
                      Payment details
                    </h3>

                    {/* SSL Security Info Banner */}
                    <div className="bg-[#F4F6FF] text-[#4A3AFF] rounded-xl p-3.5 flex items-center gap-2.5 text-[13px] font-bold border border-[#D1D9FF]/70 mb-5">
                      <Lock size={16} className="shrink-0 text-[#4A3AFF]" />
                      <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                          Name on card
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentForm.nameOnCard}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, nameOnCard: e.target.value }))}
                          placeholder="Abc"
                          className="w-full px-4 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-[14px] font-medium text-stone-800 focus:ring-2 focus:ring-[#4A3AFF]/20 focus:bg-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                          Card number
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 8746 4748 3838"
                          className="w-full px-4 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-[14px] font-medium text-stone-800 focus:ring-2 focus:ring-[#4A3AFF]/20 focus:bg-white focus:outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentForm.expiry}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry: e.target.value }))}
                            placeholder="12/21"
                            className="w-full px-4 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-[14px] font-medium text-stone-800 focus:ring-2 focus:ring-[#4A3AFF]/20 focus:bg-white focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                            placeholder="123"
                            className="w-full px-4 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-[14px] font-medium text-stone-800 focus:ring-2 focus:ring-[#4A3AFF]/20 focus:bg-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Total Due Line */}
                    <div className="flex justify-between items-center py-3 text-[14px] font-bold text-stone-800 border-t border-stone-100 mb-5">
                      <span>Total due today</span>
                      <span className="text-[#4A3AFF] text-[16px]">${checkoutModal.price.toFixed(2)}</span>
                    </div>

                    {/* Pay Button with Loader */}
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full bg-[#4A3AFF] hover:bg-[#3b2ee0] disabled:bg-[#4A3AFF]/80 text-white font-bold text-[15px] py-3.5 rounded-2xl text-center shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Processing payment...</span>
                        </>
                      ) : (
                        <span>Pay ${checkoutModal.price.toFixed(2)}</span>
                      )}
                    </button>
                  </form>
                )}

                {/* ----------------------------------------------------
                    STEP 3: SUCCESS STATE (Figma Screenshot 3)
                    ---------------------------------------------------- */}
                {checkoutModal.step === 3 && (
                  <div className="flex flex-col items-center text-center py-2">
                    {/* Large Checkmark Badge */}
                    <div className="w-16 h-16 rounded-full bg-[#635BFF] text-white flex items-center justify-center shadow-xl shadow-[#635BFF]/40 mb-5">
                      <Check size={32} strokeWidth={3} />
                    </div>

                    {/* Title */}
                    <h3 className="text-[24px] font-extrabold text-stone-900 mb-2">
                      You're on {checkoutModal.planName}!
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[14px] font-medium text-stone-500 mb-6 max-w-sm leading-relaxed">
                      Your plan has been upgraded. You now have access to {checkoutModal.storageGb} GB of storage and all {checkoutModal.planName} features.
                    </p>

                    {/* What's next Box */}
                    <div className="w-full bg-[#F4F6FF] rounded-2xl p-5 border border-[#D1D9FF]/70 mb-6 text-left">
                      <h4 className="text-[13px] font-bold text-[#4A3AFF] mb-3 uppercase tracking-wider">
                        What's next?
                      </h4>
                      <ul className="space-y-2.5 text-[13px] font-semibold text-stone-700">
                        <li className="flex items-center gap-2.5">
                          <Check size={15} className="text-[#4A3AFF] shrink-0" />
                          <span>Your new storage is available immediately</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={15} className="text-[#4A3AFF] shrink-0" />
                          <span>All features unlocked in your account</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check size={15} className="text-[#4A3AFF] shrink-0" />
                          <span>Receipt sent to your email</span>
                        </li>
                      </ul>
                    </div>

                    {/* Primary Button */}
                    <button
                      onClick={handleCompleteUpgrade}
                      className="w-full bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white font-bold text-[15px] py-3.5 rounded-2xl text-center shadow-lg transition-all cursor-pointer"
                    >
                      Explore {checkoutModal.planName} Features
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </WavesBackground>
  );
}
