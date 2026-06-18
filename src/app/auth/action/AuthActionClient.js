"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Lock, Mail, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import {
  verifyEmailWithCode,
  resetPasswordWithCode,
} from "@/services/firebase";
import { getAuthErrorMessage } from "@/services/firebase";

export default function AuthActionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [verifyHandled, setVerifyHandled] = useState(false);

  useEffect(() => {
    if (mode !== "verifyEmail" || !oobCode || verifyHandled) {
      return;
    }

    let cancelled = false;

    (async () => {
      setIsSubmitting(true);
      setErrorMsg("");
      try {
        await verifyEmailWithCode(oobCode);
        if (!cancelled) {
          setSuccessMsg("Email verified successfully! You can now sign in.");
          setVerifyHandled(true);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMsg(getAuthErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsSubmitting(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, oobCode, verifyHandled]);

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!oobCode) {
      setErrorMsg("Reset link is invalid or missing.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordWithCode(oobCode, password);
      setSuccessMsg("Password updated successfully! Redirecting to sign in...");
      setTimeout(() => router.replace("/auth"), 1800);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isResetMode = mode === "resetPassword";
  const isVerifyMode = mode === "verifyEmail";
  const isInvalidLink = !mode || !oobCode;

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative z-10 py-6">
        <div className="absolute -top-12 left-0">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 shadow-sm hover:border-[var(--brand)] hover:bg-slate-100 transition-all text-stone-750 dark:text-stone-300"
          >
            <ChevronLeft size={18} />
          </Link>
        </div>

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

        {isInvalidLink && (
          <div className="animate-fade-in text-center space-y-4">
            <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white">
              Invalid Link
            </h1>
            <p className="text-sm font-semibold text-stone-500">
              This authentication link is invalid or has expired.
            </p>
            <Link
              href="/auth"
              className="inline-block text-[var(--brand)] font-black hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {isVerifyMode && !isInvalidLink && (
          <div className="animate-fade-in text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mx-auto border border-[var(--brand)]/20 shadow-sm">
              <Mail size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">
                {isSubmitting ? "Verifying Email..." : successMsg ? "Email Verified" : "Verification Failed"}
              </h1>
              <p className="text-sm font-semibold text-stone-500">
                {isSubmitting
                  ? "Please wait while we confirm your email address."
                  : successMsg
                    ? "Your account is ready. Sign in to continue."
                    : "Request a new verification email from the sign-in page."}
              </p>
            </div>
            {!isSubmitting && (
              <Link
                href="/auth"
                className="inline-block w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-black shadow-lg shadow-[var(--brand)]/10 transition-all text-sm"
              >
                Go to Sign In
              </Link>
            )}
          </div>
        )}

        {isResetMode && !isInvalidLink && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4 border border-[var(--brand)]/20 shadow-sm">
                <Lock size={22} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] dark:text-white mb-2">
                Set New Password
              </h1>
              <p className="text-sm font-semibold text-stone-500">
                Choose a strong password for your account.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white transition-all shadow-sm text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-500 uppercase tracking-wider mb-2 pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-stone-200 dark:border-stone-700 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 outline-none font-bold text-[var(--ink)] dark:text-white transition-all shadow-sm text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-[var(--brand)]/10 transition-all text-sm cursor-pointer"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
