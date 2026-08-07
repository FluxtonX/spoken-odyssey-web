"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { startAuthentication } from "@simplewebauthn/browser";
import {
  verifyTotpLoginOnBackend,
  verifyRecoveryLoginOnBackend,
  getPasskeyLoginOptions,
  verifyPasskeyLogin,
  getBackendErrorMessage,
} from "@/services/backend";
import { ShieldCheck, KeyRound, Fingerprint, LifeBuoy, AlertCircle, Loader2, X, ArrowRight } from "lucide-react";

export default function MfaVerificationModal() {
  const { mfaPendingState, completeMfa, clearMfaPending } = useAuth();
  
  const [activeTab, setActiveTab] = useState("totp"); // "totp" | "passkey" | "recovery"
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!mfaPendingState) return null;

  const mfaToken = mfaPendingState.mfaToken;
  const availableMethods = mfaPendingState.availableMethods || ["totp"];

  const handleVerifyTotp = async (e) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setError("Please enter the 6-digit verification code from your authenticator app.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await verifyTotpLoginOnBackend(mfaToken, code.trim());
      if (response.success && response.token) {
        completeMfa(response.token, response.data);
      } else {
        setError(response.message || "Invalid verification code.");
      }
    } catch (err) {
      setError(getBackendErrorMessage(err, "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRecovery = async (e) => {
    e.preventDefault();
    if (!recoveryCode || recoveryCode.trim().length < 8) {
      setError("Please enter a valid emergency recovery code (e.g. XXXX-XXXX).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await verifyRecoveryLoginOnBackend(mfaToken, recoveryCode.trim());
      if (response.success && response.token) {
        completeMfa(response.token, response.data);
      } else {
        setError(response.message || "Invalid or already used recovery code.");
      }
    } catch (err) {
      setError(getBackendErrorMessage(err, "Recovery code verification failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPasskey = async () => {
    setLoading(true);
    setError(null);

    try {
      const options = await getPasskeyLoginOptions(mfaToken);
      const asseResp = await startAuthentication({ optionsJSON: options });
      const response = await verifyPasskeyLogin(mfaToken, asseResp);

      if (response.success && response.token) {
        completeMfa(response.token, response.data);
      } else {
        setError(response.message || "Passkey verification failed.");
      }
    } catch (err) {
      setError(getBackendErrorMessage(err, "Passkey authentication was cancelled or failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#C7D2FE] rounded-[24px] shadow-2xl overflow-hidden p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={clearMfaPending}
          className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-[22px] font-extrabold text-stone-900 tracking-tight">Two-Factor Authentication</h2>
          <p className="text-[13px] font-medium text-stone-500 leading-relaxed">
            Your account is protected with 2FA. Please verify your secondary factor to complete sign-in.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2.5 border border-red-200">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Verification Method Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-[#F8F9FF] border border-[#D1D9FF] rounded-xl mb-6">
          {availableMethods.includes("totp") && (
            <button
              onClick={() => { setActiveTab("totp"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "totp"
                  ? "bg-[#4A3AFF] text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <KeyRound size={14} />
              <span>TOTP</span>
            </button>
          )}

          {availableMethods.includes("passkey") && (
            <button
              onClick={() => { setActiveTab("passkey"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "passkey"
                  ? "bg-[#4A3AFF] text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Fingerprint size={14} />
              <span>Passkey</span>
            </button>
          )}

          <button
            onClick={() => { setActiveTab("recovery"); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "recovery"
                ? "bg-[#4A3AFF] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <LifeBuoy size={14} />
            <span>Recovery</span>
          </button>
        </div>

        {/* Tab 1: TOTP Code */}
        {activeTab === "totp" && (
          <form onSubmit={handleVerifyTotp} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-stone-700 mb-2">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-3.5 px-4 rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] transition-all"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white text-[14px] font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Passkey */}
        {activeTab === "passkey" && (
          <div className="text-center space-y-6 py-2">
            <p className="text-[13px] font-medium text-stone-500">
              Use Touch ID, Face ID, or a hardware security key to confirm your identity.
            </p>

            <button
              onClick={handleVerifyPasskey}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white text-[14px] font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Fingerprint size={20} />}
              <span>{loading ? "Waiting for Passkey..." : "Authenticate with Passkey"}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Recovery Code */}
        {activeTab === "recovery" && (
          <form onSubmit={handleVerifyRecovery} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-stone-700 mb-2">
                One-Time Emergency Recovery Code
              </label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX"
                className="w-full text-center text-lg font-black py-3.5 px-4 rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] transition-all uppercase"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || recoveryCode.length < 8}
              className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white text-[14px] font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LifeBuoy size={18} />}
              <span>{loading ? "Verifying..." : "Use Recovery Code"}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

