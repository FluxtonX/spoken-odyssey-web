/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Lock, User, RefreshCw, CheckCircle2, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthProvider";
import { getAuthErrorMessage } from "@/services/firebase";
import { getPostAuthRoute } from "@/lib/routes";
import { verifyMockEmailOnBackend } from "@/services/backend";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, loginWithGoogle, sendResetEmail, resendVerification, firebaseUser, refreshProfile } = useAuth();

  const [view, setView] = useState("login"); // "login" | "signup" | "verify" | "reset"
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(59);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const profile = await login(email, password);
      setSuccessMsg("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.replace(getPostAuthRoute(profile));
      }, 800);
    } catch (error) {
      if (error?.code === "auth/email-not-verified") {
        setView("verify");
      }
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await signup({ name, email, password });
      setView("verify");
      setTimer(59);
      setSuccessMsg("Verification link sent to your email!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await sendResetEmail(email);
      setSuccessMsg("Password reset instructions have been sent to your email.");
      setTimeout(() => {
        setSuccessMsg("");
        setView("login");
      }, 1800);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await loginWithGoogle();
      setSuccessMsg("Signed in successfully! Redirecting...");
      // Always go to /profile after Google sign-in;
      // profile-setup will be prompted from /profile if the profile is incomplete.
      setTimeout(() => {
        router.replace("/home");
      }, 800);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (timer > 0 || !email || !password) return;

    setIsResending(true);
    setErrorMsg("");

    try {
      await resendVerification(email, password);
      setTimer(59);
      setSuccessMsg("A new verification link has been sent!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    if (verificationCode.length !== 6) return;
    if (!firebaseUser) {
      setErrorMsg("No active session found. Please try logging in again.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = await firebaseUser.getIdToken(true);
      if (verificationCode !== "555555") {
        await verifyMockEmailOnBackend(token, verificationCode);
      }
      
      setSuccessMsg("Email verified successfully! Redirecting...");
      
      // Reload Firebase user state to update emailVerified status client-side
      await firebaseUser.reload();
      
      const updatedProfile = await refreshProfile();
      
      setTimeout(() => {
        router.replace(getPostAuthRoute(updatedProfile));
      }, 1000);
    } catch (error) {
      console.error("Verification code error:", error);
      setErrorMsg(getAuthErrorMessage(error, "Invalid verification code. Please try 555555."));
    } finally {
      setIsVerifying(false);
    }
  };

  if (isSubmitting || isVerifying) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white relative animate-fade-in">
        {/* Skip button in top right */}
        <button 
          onClick={() => {
            setIsSubmitting(false);
            setIsVerifying(false);
          }}
          className="absolute top-6 right-8 text-stone-400 font-semibold text-sm hover:text-stone-600 transition cursor-pointer"
        >
          Skip &times;
        </button>

        {/* 5-bar Soundwave logo animation */}
        <div className="flex items-end justify-center gap-2 h-16 mb-8">
          <span className="w-2.5 bg-[#4A3AFF] rounded-full animate-soundwave-1" />
          <span className="w-2.5 bg-[#4A3AFF] rounded-full animate-soundwave-2" />
          <span className="w-2.5 bg-[#4A3AFF] rounded-full animate-soundwave-3" />
          <span className="w-2.5 bg-[#4A3AFF] rounded-full animate-soundwave-4" />
          <span className="w-2.5 bg-[#4A3AFF] rounded-full animate-soundwave-5" />
        </div>

        {/* Spoken Odyssey brand */}
        <h2 className="text-[#4A3AFF] font-black text-3xl tracking-tight mb-20">
          Spoken Odyssey
        </h2>

        {/* Tagline */}
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.25em] text-stone-500 uppercase mb-4">
            Preserving your legacy...
          </p>
          <div className="w-64 h-[1.5px] bg-gradient-to-r from-transparent via-[#4A3AFF]/60 to-transparent mx-auto" />
        </div>
      </div>
    );
  }

  const renderTabSelector = (current) => (
    <div className="flex p-1 bg-stone-100/70 rounded-[14px] w-full mb-8">
      <button
        type="button"
        onClick={() => {
          setErrorMsg("");
          setSuccessMsg("");
          setView("login");
        }}
        className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition-all cursor-pointer ${
          current === "login"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-400 hover:text-stone-600"
        }`}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => {
          setErrorMsg("");
          setSuccessMsg("");
          setView("signup");
        }}
        className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition-all cursor-pointer ${
          current === "signup"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-400 hover:text-stone-600"
        }`}
      >
        Create Account
      </button>
    </div>
  );

  return (
    <AuthLayout view={view}>
      <div className="w-full max-w-sm mx-auto relative z-10 py-6">
        
        {/* Back Button */}
        {view !== "login" && view !== "signup" && view !== "reset" && (
          <div className="absolute -top-12 left-0">
            <button
              onClick={() => setView("login")}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 shadow-sm hover:border-[var(--brand)] hover:bg-slate-100 transition-all text-stone-750 dark:text-stone-300 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

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
            {renderTabSelector("login")}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">Email address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3 pl-0.5">
                  <label className="block text-xs font-bold text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setSuccessMsg("");
                      setView("reset");
                    }}
                    className="text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-60 text-white font-bold transition-all text-center flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
              >
                <span>Sign In</span>
                <span className="text-base font-medium">&rarr;</span>
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <span className="relative px-3 bg-white text-xs font-semibold text-stone-400">or continue with</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 transition-all active:scale-[0.98] shadow-sm text-sm cursor-pointer"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
              <span className="font-bold text-stone-750">Continue with Google</span>
            </button>
          </div>
        )}

        {/* 1b. RESET PASSWORD VIEW */}
        {view === "reset" && (
          <div className="animate-fade-in">
            {/* Top Back Link */}
            <button
              onClick={() => {
                setErrorMsg("");
                setSuccessMsg("");
                setView("login");
              }}
              className="text-stone-400 hover:text-stone-600 transition text-sm font-semibold flex items-center gap-1.5 mb-6 cursor-pointer"
            >
              &larr; Back
            </button>

            <div className="mb-6">
              <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white mb-2 font-sans">Reset password</h1>
              <p className="text-xs lg:text-[13px] font-semibold text-stone-400 leading-relaxed max-w-xs">Enter your email and we'll send you instructions to reset your password.</p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-60 text-white font-bold transition-all text-center text-sm cursor-pointer shadow-sm active:scale-[0.99] font-sans"
              >
                Send reset link
              </button>
            </form>
          </div>
        )}

        {/* 2. SIGNUP VIEW */}
        {view === "signup" && (
          <div className="animate-fade-in">
            {renderTabSelector("signup")}

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">Full name</label>
                <input 
                  type="text" 
                  placeholder="Your full name" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">Email address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  required 
                  id="terms"
                  className="rounded border-stone-300 text-[var(--brand)] focus:ring-[var(--brand)] h-4 w-4 cursor-pointer" 
                />
                <label htmlFor="terms" className="text-xs font-medium text-stone-500 leading-normal cursor-pointer select-none">
                  I agree to the <Link href="/terms" className="text-[var(--brand)] font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[var(--brand)] font-semibold hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-60 text-white font-bold transition-all text-center flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
              >
                <span>Create Account</span>
                <span className="text-base font-medium">&rarr;</span>
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <span className="relative px-3 bg-white text-xs font-semibold text-stone-400">or continue with</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 transition-all active:scale-[0.98] shadow-sm text-sm cursor-pointer"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
              <span className="font-bold text-stone-750">Continue with Google</span>
            </button>
          </div>
        )}

        {/* 3. EMAIL VERIFICATION VIEW */}
        {view === "verify" && (
          <div className="animate-fade-in">
            <div className="mb-6 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4 border border-[var(--brand)]/20 shadow-sm">
                <Mail size={22} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">Verify Your Email</h1>
              <p className="text-sm font-semibold text-stone-500">
                To activate your account, enter the 6-digit verification code below. Use code <span className="text-stone-800 dark:text-stone-200 font-extrabold">555555</span> for instant testing.
              </p>
            </div>

            {/* Code Verification Input Form */}
            <form onSubmit={handleVerifyCode} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">
                  6-Digit Code
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="555555" 
                  required
                  className="w-full p-3 text-center tracking-[0.5em] font-mono text-xl rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-bold text-stone-800 placeholder-stone-300 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-60 text-white font-bold transition-all text-center flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Verify Code</span>
                <span className="text-base font-medium">&rarr;</span>
              </button>
            </form>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs font-semibold text-stone-600">
              Or verify by checking your email inbox for the verification link we sent.
            </div>

            <div className="mt-8 text-center text-xs">
              <p className="text-stone-500 font-semibold mb-2">Didn&apos;t receive the link?</p>
              <button 
                type="button"
                onClick={handleResendVerification}
                disabled={timer > 0 || isResending || !password}
                className={`inline-flex items-center gap-1.5 font-black text-sm cursor-pointer ${
                  timer > 0 || !password
                    ? "text-stone-400" 
                    : "text-[var(--brand)] hover:underline"
                }`}
              >
                {isResending ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Resending...
                  </>
                ) : timer > 0 ? (
                  `Resend Link in ${timer}s`
                ) : !password ? (
                  "Enter password on sign up to enable resend"
                ) : (
                  "Resend Verification Link"
                )}
              </button>
            </div>

            <div className="mt-8 text-center text-sm border-t border-stone-100 pt-6">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[var(--brand)] font-black hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
