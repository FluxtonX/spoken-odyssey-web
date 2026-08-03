"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!token || !emailParam) {
      setErrorMsg("Invalid or expired password reset link. Please request a new link.");
    }
  }, [token, emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token || !emailParam) {
      setErrorMsg("Invalid or missing password reset token.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: emailParam,
          password,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSuccessMsg("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.replace("/auth");
        }, 1800);
      } else {
        setErrorMsg(resData.message || "Failed to reset password. Link may be expired.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to authentication server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 py-6">
      {/* Top Back Link */}
      <Link
        href="/auth"
        className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-600 transition text-sm font-semibold mb-6"
      >
        <ChevronLeft size={16} />
        Back to Sign In
      </Link>

      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center mb-4 border border-[#C7D2FE]/60 shadow-sm">
          <Lock size={22} />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white mb-2 font-sans">
          Set New Password
        </h1>
        <p className="text-xs lg:text-[13px] font-semibold text-stone-400 leading-relaxed">
          Please enter your new password for account <strong className="text-stone-700 dark:text-stone-200">{emailParam || ""}</strong>.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password Input */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition cursor-pointer p-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 pl-0.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-[#C7D2FE]/70 bg-[#F0F1FF]/30 focus:bg-white focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none font-medium text-stone-800 placeholder-stone-400 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition cursor-pointer p-1"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2dd1] disabled:opacity-60 text-white font-bold transition-all text-center flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm active:scale-[0.99] font-sans mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#4A3AFF]" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
