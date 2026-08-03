"use client";

import { ChevronLeft, Lock, KeyRound, ShieldAlert, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function SecuritySettings() {
  const { firebaseUser, getToken } = useAuth();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", message: string }

  const handleSendResetEmail = async () => {
    const emailToUse = firebaseUser?.email;
    if (!emailToUse) {
      setFeedback({ type: "error", message: "No email address found for this account." });
      return;
    }

    setIsSendingEmail(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setFeedback({
          type: "success",
          message: `Password reset email sent to ${emailToUse}! Please check your inbox.`,
        });
      } else {
        setFeedback({
          type: "error",
          message: resData.message || "Could not send password reset email. Please try again.",
        });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to connect to authentication server." });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="w-full max-w-3xl animation-fade-in pb-24">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <Link 
          href="/settings" 
          className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 hover:bg-stone-50 dark:hover:bg-stone-750 flex items-center justify-center transition-colors shadow-sm"
        >
          <ChevronLeft size={20} className="text-stone-600 dark:text-stone-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white tracking-tight">Security & Login</h1>
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">Configure authentication credentials and account protection.</p>
        </div>
      </header>

      {/* Unified Settings Card */}
      <div className="bg-white/95 dark:bg-[#162033]/90 border border-stone-200/80 dark:border-stone-855 rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-md p-6 md:p-8 space-y-8">
        
        {/* Reset Password Form Section */}
        <div className="text-left space-y-6">
          <h2 className="text-base font-extrabold text-stone-850 dark:text-white flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800/60">
            <KeyRound size={18} className="text-[var(--brand)]" />
            Reset Password
          </h2>

          {feedback && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold border ${
              feedback.type === "success" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="p-5 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[var(--brand)] flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Send Password Reset Link</span>
                <span className="text-xs font-semibold text-stone-400 leading-normal block max-w-sm mt-0.5">
                  Receive a secure Brevo email with a link to safely reset your password.
                </span>
              </div>
            </div>
            <button 
              onClick={handleSendResetEmail}
              disabled={isSendingEmail}
              className="px-5 py-3 rounded-xl bg-[var(--brand)] text-white text-xs font-black hover:scale-[1.01] active:scale-95 transition-all shadow-md self-end sm:self-center cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              <span>{isSendingEmail ? "Sending..." : "Send Reset Email"}</span>
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="text-left pt-2">
          <h2 className="text-base font-extrabold text-stone-850 dark:text-white flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800/60 mb-4">
            <Lock size={18} className="text-[var(--brand)]" />
            Two-Factor Authentication
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-stone-150/60 dark:border-stone-800/50 bg-stone-50/10 dark:bg-stone-900/10 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-stone-855 dark:text-stone-200 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[10px] font-semibold text-stone-400 leading-normal block max-w-sm mt-0.5">Secure your legacy archives with an additional verification step.</span>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 text-xs font-black text-stone-750 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors shadow-sm self-end sm:self-center cursor-pointer">
              Enable
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
