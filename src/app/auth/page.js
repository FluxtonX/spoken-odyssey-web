"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Lock, User, RefreshCw, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthProvider";
import { getAuthErrorMessage } from "@/services/firebase";
import { getPostAuthRoute } from "@/lib/routes";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, loginWithGoogle, sendResetEmail, resendVerification } = useAuth();

  const [view, setView] = useState("login"); // "login" | "signup" | "verify" | "reset"
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(59);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      // Always go to /home after Google sign-in;
      // profile-setup will be prompted from /home if the profile is incomplete.
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
                <div className="mb-2 flex items-center justify-between gap-3 pl-1">
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setSuccessMsg("");
                      setView("reset");
                    }}
                    className="text-xs font-black text-[var(--brand)] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
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
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all text-center block text-sm cursor-pointer"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-[#0f172a] text-xs font-bold text-stone-400">OR</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-stone-300 dark:border-stone-700 hover:border-[var(--brand)] hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 group shadow-sm text-sm"
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

        {/* 1b. RESET PASSWORD VIEW */}
        {view === "reset" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">Reset Password</h1>
              <p className="text-sm font-semibold text-stone-500">Enter your email and we'll send reset instructions.</p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all text-center block text-sm cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <button
                onClick={() => {
                  setErrorMsg("");
                  setSuccessMsg("");
                  setView("login");
                }}
                className="text-stone-500 dark:text-stone-400 font-bold hover:underline cursor-pointer"
              >
                Back to Login
              </button>
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
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-[var(--brand)]/10 hover:scale-[1.01] active:scale-95 transition-all text-center block text-sm cursor-pointer"
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-stone-500 dark:text-stone-400 font-semibold">Already have an account? </span>
              <button onClick={() => setView("login")} className="text-[var(--brand)] font-black hover:underline cursor-pointer">Login</button>
            </div>
          </div>
        )}

        {/* 3. EMAIL VERIFICATION VIEW */}
        {view === "verify" && (
          <div className="animate-fade-in">
            <div className="mb-8 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4 border border-[var(--brand)]/20 shadow-sm">
                <Mail size={22} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">Verify Your Email</h1>
              <p className="text-sm font-semibold text-stone-500">
                We sent a verification link to{" "}
                <span className="text-stone-800 dark:text-stone-200 font-extrabold">{email}</span>.
                Open the link in your inbox to activate your account, then return here to sign in.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-slate-50 dark:bg-slate-800 p-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
              After verifying, use the same email and password on the login screen.
            </div>

            <div className="mt-8 text-center text-xs">
              <p className="text-stone-500 font-semibold mb-2">Didn&apos;t receive the email?</p>
              <button 
                type="button"
                onClick={handleResendVerification}
                disabled={timer > 0 || isResending || !password}
                className={`inline-flex items-center gap-1.5 font-black text-sm cursor-pointer ${
                  timer > 0 || !password
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
                  `Resend Link in ${timer}s`
                ) : !password ? (
                  "Enter password on sign up to enable resend"
                ) : (
                  "Resend Verification Link"
                )}
              </button>
            </div>

            <div className="mt-8 text-center text-sm border-t border-stone-100 dark:border-stone-800 pt-6">
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
