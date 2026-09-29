"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { getAuthErrorMessage } from "@/services/firebase";

export default function HeroSignInCard() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const authProfile = await login(email, password);
      if (authProfile?.mfaRequired) {
        // MFA modal will be automatically triggered by RootLayout MfaVerificationModal
        return;
      }
      router.replace("/home");
    } catch (err) {
      console.error("Sign in error:", err);
      setErrorMsg(getAuthErrorMessage(err) || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setErrorMsg("");

    try {
      const authProfile = await loginWithGoogle();
      if (authProfile?.mfaRequired) {
        return;
      }
      router.replace("/home");
    } catch (err) {
      console.error("Google sign in error:", err);
      setErrorMsg(getAuthErrorMessage(err) || "Google sign in failed. Please try again.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleAppleSignIn = () => {
    setErrorMsg("Apple sign-in is coming soon to your platform. Please use Google or email.");
  };

  return (
    <div className="w-full max-w-[370px] rounded-[22px] bg-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.14)] border border-slate-100/90 relative z-20 transition-all">
      {/* Card Header */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-[22px] font-extrabold text-[#0B0E23] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          Sign in to continue your Odyssey.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-rose-50 border border-rose-200/80 p-2.5 text-[11px] font-semibold text-rose-700 animate-fadeIn">
          <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600" />
          <span className="flex-1">{errorMsg}</span>
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Email Field */}
        <div>
          <div className="relative flex items-center rounded-xl border border-slate-200/90 bg-white px-3 py-2 sm:py-2.5 shadow-2xs transition-all focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15">
            <Mail size={16} className="text-[#2563EB] shrink-0 mr-2.5" strokeWidth={2.2} />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="relative flex items-center rounded-xl border border-slate-200/90 bg-white px-3 py-2 sm:py-2.5 shadow-2xs transition-all focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15">
            <Lock size={16} className="text-[#2563EB] shrink-0 mr-2.5" strokeWidth={2.2} />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none pr-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-700 transition shrink-0"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-1 text-right">
            <Link
              href="/auth?mode=reset"
              className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isGoogleSubmitting}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-1.5 shadow-[0_6px_18px_rgba(0,102,255,0.25)] transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #0066FF 0%, #8A2BE2 100%)",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowUpRight size={15} strokeWidth={2.4} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-3.5 flex items-center">
        <div className="flex-1 border-t border-slate-200" />
        <span className="px-2.5 text-[10px] font-medium text-slate-400 tracking-wide">
          or continue with
        </span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleSubmitting}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white py-2 px-2 text-[10px] sm:text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition disabled:opacity-60 cursor-pointer"
        >
          {isGoogleSubmitting ? (
            <Loader2 size={13} className="animate-spin text-slate-500" />
          ) : (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.35 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.65 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
          )}
          <span className="truncate">Sign in with Google</span>
        </button>

        {/* Apple Sign In */}
        <button
          type="button"
          onClick={handleAppleSignIn}
          disabled={isSubmitting || isGoogleSubmitting}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white py-2 px-2 text-[10px] sm:text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 shrink-0 fill-current text-black" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.11.64-2.8 1.45-.6.69-1.13 1.83-.99 2.95 1.07.08 2.15-.55 2.8-1.3" />
          </svg>
          <span className="truncate">Sign in with Apple</span>
        </button>
      </div>

      {/* Card Footer */}
      <div className="mt-3.5 text-center text-[11px] font-medium text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
