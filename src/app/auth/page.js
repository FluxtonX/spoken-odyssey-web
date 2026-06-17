"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, KeyRound, Mail, Lock, User, RefreshCw, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function AuthPage() {
  const [view, setView] = useState("login"); // "login" | "signup" | "verify"
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const otpRefs = useRef([]);

  // Check URL query parameters on mount to check if user clicked "signup"
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      if (mode === "signup") {
        setView("signup");
      }
    }
  }, []);

  // Timer countdown for Resend OTP
  useEffect(() => {
    let interval = null;
    if (view === "verify" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Simulate successful authentication
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userName", email.split("@")[0]);
    setSuccessMsg("Logged in successfully! Redirecting...");
    setTimeout(() => {
      window.location.href = "/home";
    }, 1000);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    // Simulate OTP sent
    setView("verify");
    setTimer(59);
    setSuccessMsg("Verification code sent to your email!");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow numbers only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Backspace to focus previous input
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const enteredCode = otp.join("");
    if (enteredCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    // Mock verification check: any 6 digits works
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userName", name || email.split("@")[0]);
    setSuccessMsg("Account verified successfully! Redirecting...");
    setTimeout(() => {
      window.location.href = "/home";
    }, 1500);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setIsResending(true);
    setTimeout(() => {
      setTimer(59);
      setIsResending(false);
      setSuccessMsg("A new verification code has been sent!");
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10 py-6">
        
        {/* Back Button */}
        <div className="absolute -top-12 left-0">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 shadow-sm hover:border-[var(--brand)] hover:bg-slate-100 transition-all text-stone-750 dark:text-stone-300">
            <ChevronLeft size={18} />
          </Link>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400 p-4 text-xs font-bold shadow-sm animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-400 p-4 text-xs font-bold shadow-sm animate-fade-in">
            <span className="shrink-0 text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. LOGIN VIEW */}
        {view === "login" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">Welcome Back</h1>
              <p className="text-sm font-semibold text-stone-500">Sign in to continue your legacy story.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white placeholder-stone-400 transition-all shadow-sm text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white placeholder-stone-400 transition-all shadow-sm text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all text-center block text-sm cursor-pointer"
              >
                Login
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-[#0f172a] text-xs font-bold text-stone-400">OR</span>
            </div>

            <button 
              onClick={() => {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("userEmail", "google-user@example.com");
                sessionStorage.setItem("userName", "Alexander");
                window.location.href = "/home";
              }} 
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-stone-300 dark:border-stone-700 hover:border-[var(--brand)] hover:bg-slate-50 transition-all active:scale-95 group shadow-sm text-sm"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-stone-700 dark:text-stone-200">Continue with Google</span>
            </button>

            <div className="mt-8 text-center text-sm">
              <span className="text-stone-500 dark:text-stone-400 font-semibold">Don't have an account? </span>
              <button onClick={() => setView("signup")} className="text-[var(--brand)] font-black hover:underline cursor-pointer">Sign Up</button>
            </div>
          </div>
        )}

        {/* 2. SIGNUP VIEW */}
        {view === "signup" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">Create Account</h1>
              <p className="text-sm font-semibold text-stone-500">Begin your legacy journey today.</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Alexander Mitchell" 
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white placeholder-stone-400 transition-all shadow-sm text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white placeholder-stone-400 transition-all shadow-sm text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white placeholder-stone-400 transition-all shadow-sm text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all text-center block text-sm cursor-pointer"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-stone-500 dark:text-stone-400 font-semibold">Already have an account? </span>
              <button onClick={() => setView("login")} className="text-[var(--brand)] font-black hover:underline cursor-pointer">Login</button>
            </div>
          </div>
        )}

        {/* 3. VERIFICATION (OTP) VIEW */}
        {view === "verify" && (
          <div className="animate-fade-in">
            <div className="mb-8 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4 border border-[var(--brand)]/20 shadow-sm">
                <KeyRound size={22} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">Verify Your Account</h1>
              <p className="text-sm font-semibold text-stone-500">
                We've sent a 6-digit code to <span className="text-stone-800 dark:text-stone-200 font-extrabold">{email}</span>. Please enter it below.
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="flex justify-between gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-full aspect-square text-center text-xl font-black rounded-xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none text-[var(--ink)] dark:text-white shadow-sm"
                  />
                ))}
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all text-center block text-sm cursor-pointer"
              >
                Verify Code
              </button>
            </form>

            <div className="mt-8 text-center text-xs">
              <p className="text-stone-500 font-semibold mb-2">Didn't receive the code?</p>
              <button 
                onClick={handleResendOtp}
                disabled={timer > 0 || isResending}
                className={`inline-flex items-center gap-1.5 font-black text-sm cursor-pointer ${
                  timer > 0 
                    ? "text-stone-400 dark:text-stone-600" 
                    : "text-[var(--brand)] hover:underline"
                }`}
              >
                {isResending ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Resending...
                  </>
                ) : timer > 0 ? (
                  `Resend Code in ${timer}s`
                ) : (
                  "Resend Code Now"
                )}
              </button>
            </div>

            <div className="mt-8 text-center text-sm border-t border-stone-100 dark:border-stone-800 pt-6">
              <button onClick={() => setView("signup")} className="text-stone-500 dark:text-stone-400 font-bold hover:underline cursor-pointer">
                Back to Sign Up
              </button>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
