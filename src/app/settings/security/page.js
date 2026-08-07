"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WavesBackground from "@/components/layout/WavesBackground";
import { useAuth } from "@/context/AuthProvider";
import { startRegistration } from "@simplewebauthn/browser";
import {
  getMfaStatus,
  setupTotpOnBackend,
  verifyTotpSetupOnBackend,
  getPasskeyRegisterOptions,
  verifyPasskeyRegister,
  deletePasskeyOnBackend,
  regenerateRecoveryCodesOnBackend,
  disableMfaOnBackend,
  getActiveSessions,
  revokeSessionOnBackend,
  toggleLoginNotificationsOnBackend,
  getBackendErrorMessage,
} from "@/services/backend";
import {
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Fingerprint,
  LifeBuoy,
  Copy,
  Download,
  Trash2,
  Plus,
  X,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
  Lock,
  Laptop,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

function formatRelativeTime(dateVal) {
  if (!dateVal) return "Active now";
  if (typeof dateVal === "string" && (dateVal.includes("Active") || dateVal.includes("ago") || dateVal.includes("Just"))) {
    return dateVal;
  }
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "Active now";

  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 2) return "Active now";
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hr" : "hrs"} ago`;
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { firebaseUser, getToken } = useAuth();

  // Reset password states
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState(null);

  // MFA Status state
  const [mfaStatus, setMfaStatus] = useState(null);
  const [mfaLoading, setMfaLoading] = useState(true);

  // Real Sessions state
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Modal active state: null | "totp_setup" | "recovery_view" | "disable_mfa"
  const [activeModal, setActiveModal] = useState(null);

  // TOTP setup state
  const [totpSetupData, setTotpSetupData] = useState(null);
  const [totpStep, setTotpStep] = useState(1);
  const [totpCode, setTotpCode] = useState("");
  const [newRecoveryCodes, setNewRecoveryCodes] = useState(null);
  const [totpSubmitting, setTotpSubmitting] = useState(false);

  // Passkey state
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  // Recovery codes view/regenerate state
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthCode, setReauthCode] = useState("");
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);

  // Notification toggle state
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Global modal error / feedback
  const [modalError, setModalError] = useState(null);

  const fetchMfaStatus = useCallback(async () => {
    if (!firebaseUser) return;
    setMfaLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      const [mfaData, sessionsData] = await Promise.all([
        getMfaStatus(token),
        getActiveSessions(token),
      ]);

      if (mfaData) setMfaStatus(mfaData);
      if (sessionsData) setSessions(sessionsData || []);
    } catch (err) {
      console.warn("Failed to fetch security status:", err.message);
    } finally {
      setMfaLoading(false);
      setSessionsLoading(false);
    }
  }, [firebaseUser, getToken]);

  useEffect(() => {
    if (firebaseUser) {
      fetchMfaStatus();
    }
  }, [firebaseUser, fetchMfaStatus]);

  // Handle Login Notifications Toggle
  const handleToggleNotifications = async (enabled) => {
    setNotificationsLoading(true);
    try {
      const token = await getToken();
      const res = await toggleLoginNotificationsOnBackend(token, enabled);
      if (res.success) {
        setMfaStatus((prev) => ({ ...prev, loginNotifications: res.loginNotifications }));
      }
    } catch (err) {
      alert("Failed to update notification preferences.");
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Handle Revoke Session
  const handleRevokeSession = async (sessionId) => {
    if (!confirm("Are you sure you want to revoke this active session?")) return;
    try {
      const token = await getToken();
      await revokeSessionOnBackend(token, sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      alert(getBackendErrorMessage(err, "Failed to revoke session."));
    }
  };

  // Password reset handler
  const handleSendResetEmail = async () => {
    const emailToUse = firebaseUser?.email;
    if (!emailToUse) {
      setEmailFeedback({ type: "error", message: "No email address found for this account." });
      return;
    }

    setIsSendingEmail(true);
    setEmailFeedback(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setEmailFeedback({
          type: "success",
          message: `Password reset email sent to ${emailToUse}! Please check your inbox.`,
        });
      } else {
        setEmailFeedback({
          type: "error",
          message: resData.message || "Could not send password reset email. Please try again.",
        });
      }
    } catch (err) {
      setEmailFeedback({ type: "error", message: "Failed to connect to authentication server." });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // 1. TOTP Setup Flow
  const handleStartTotpSetup = async () => {
    setModalError(null);
    setTotpCode("");
    setTotpStep(1);
    setTotpSubmitting(true);

    try {
      const token = await getToken();
      const setupData = await setupTotpOnBackend(token);
      setTotpSetupData(setupData);
      setActiveModal("totp_setup");
    } catch (err) {
      alert(getBackendErrorMessage(err, "Failed to start TOTP setup. Please ensure backend is running."));
    } finally {
      setTotpSubmitting(false);
    }
  };

  const handleVerifyTotpSetup = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.length !== 6) {
      setModalError("Please enter a valid 6-digit code.");
      return;
    }

    setTotpSubmitting(true);
    setModalError(null);

    try {
      const token = await getToken();
      const response = await verifyTotpSetupOnBackend(token, totpCode.trim());
      if (response.success) {
        setNewRecoveryCodes(response.recoveryCodes || []);
        setTotpStep(3);
        setMfaStatus((prev) => ({
          ...prev,
          mfaEnabled: true,
          totpEnabled: true,
          availableMethods: Array.from(new Set([...(prev?.availableMethods || []), "totp"])),
        }));
        fetchMfaStatus();
      } else {
        setModalError(response.message || "Invalid verification code.");
      }
    } catch (err) {
      setModalError(getBackendErrorMessage(err, "Verification failed. Please check code."));
    } finally {
      setTotpSubmitting(false);
    }
  };

  // 2. Passkey Registration Flow
  const handleAddPasskey = async () => {
    setPasskeyLoading(true);
    try {
      const token = await getToken();
      const options = await getPasskeyRegisterOptions(token);
      const attResp = await startRegistration({ optionsJSON: options });
      
      const defaultName = typeof window !== "undefined" && window.navigator?.platform?.includes("Mac") 
        ? "MacBook Touch ID" 
        : "Biometric / Security Key";

      const response = await verifyPasskeyRegister(token, attResp, defaultName);

      if (response.success) {
        alert("Passkey registered successfully!");
        fetchMfaStatus();
      }
    } catch (err) {
      alert(getBackendErrorMessage(err, "Passkey registration cancelled or failed."));
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleDeletePasskey = async (id) => {
    if (!confirm("Are you sure you want to remove this passkey?")) return;
    try {
      const token = await getToken();
      await deletePasskeyOnBackend(token, id);
      fetchMfaStatus();
    } catch (err) {
      alert(getBackendErrorMessage(err, "Failed to delete passkey."));
    }
  };

  // 3. Recovery Codes Flow
  const handleRegenerateCodes = async (e) => {
    e.preventDefault();
    setRecoverySubmitting(true);
    setModalError(null);

    try {
      const token = await getToken();
      const response = await regenerateRecoveryCodesOnBackend(token, reauthPassword, reauthCode);
      if (response.success) {
        setNewRecoveryCodes(response.recoveryCodes);
        fetchMfaStatus();
      } else {
        setModalError(response.message || "Failed to regenerate recovery codes.");
      }
    } catch (err) {
      setModalError(getBackendErrorMessage(err, "Verification failed. Check credentials."));
    } finally {
      setRecoverySubmitting(false);
    }
  };

  // 4. Disable MFA Flow
  const handleDisableMfa = async (e) => {
    e.preventDefault();
    setRecoverySubmitting(true);
    setModalError(null);

    try {
      const token = await getToken();
      const response = await disableMfaOnBackend(token, reauthPassword, reauthCode);
      if (response.success) {
        alert("Multi-Factor Authentication disabled.");
        setActiveModal(null);
        fetchMfaStatus();
      } else {
        setModalError(response.message || "Failed to disable MFA.");
      }
    } catch (err) {
      setModalError(getBackendErrorMessage(err, "Authentication failed. Check credentials."));
    } finally {
      setRecoverySubmitting(false);
    }
  };

  const copyCodesToClipboard = (codes) => {
    if (!codes) return;
    navigator.clipboard.writeText(codes.join("\n"));
    alert("Recovery codes copied to clipboard!");
  };

  const downloadCodesAsTxt = (codes) => {
    if (!codes) return;
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spoken-odyssey-recovery-codes.txt";
    a.click();
  };

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
        <div className="w-full mt-2 md:mt-6 px-4 md:px-8 max-w-5xl mx-auto flex flex-col">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-400 mb-3">
            <Link href="/home" className="hover:text-[#4A3AFF] transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <Link href="/settings" className="hover:text-[#4A3AFF] transition-colors">Settings</Link>
            <ChevronRight size={14} />
            <span className="text-[#4A3AFF] font-bold">Security & 2FA</span>
          </div>

          {/* Page Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-[32px] md:text-[40px] font-extrabold text-stone-900 tracking-tight leading-tight mb-1">
              Security & 2FA Controls
            </h1>
            <p className="text-stone-500 font-medium text-[15px]">
              Protect your oral history archive with Authenticator Apps, Passkeys, and Emergency Recovery
            </p>
          </motion.div>

          <div className="space-y-6">

            {/* Master 2FA Status Banner */}
            <motion.div
              variants={fadeInUp}
              className="p-6 md:p-8 rounded-[24px] bg-gradient-to-r from-[#4A3AFF] to-[#6366F1] text-white shadow-xl shadow-[#4A3AFF]/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-start md:items-center gap-4.5 z-10">
                <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-inner">
                  {mfaStatus?.mfaEnabled ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[20px] tracking-tight">Two-Factor Protection</span>
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {mfaLoading ? "Checking..." : mfaStatus?.mfaEnabled ? "Active & Protected" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-[14px] text-white/90 font-medium leading-relaxed mt-1">
                    {mfaStatus?.mfaEnabled
                      ? `Secured with ${mfaStatus.availableMethods.join(" & ").toUpperCase()} verification.`
                      : "Safeguard your legacy audio & memory archives with multi-factor authentication."}
                  </p>
                </div>
              </div>

              {mfaStatus?.mfaEnabled && (
                <button
                  onClick={() => {
                    setActiveModal("disable_mfa");
                    setReauthPassword("");
                    setReauthCode("");
                    setModalError(null);
                  }}
                  className="z-10 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-[13px] font-bold transition-all cursor-pointer shrink-0"
                >
                  Disable 2FA
                </button>
              )}
            </motion.div>

            {/* 1. Authenticator App Card */}
            <motion.div variants={fadeInUp} className="figma-card w-full rounded-[24px] p-6 md:p-8 border border-[#C7D2FE]/70 bg-white/70 backdrop-blur-md shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center shrink-0">
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[16px] text-stone-900">Authenticator App (TOTP)</h3>
                      {mfaStatus?.totpEnabled ? (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 size={13} /> Active & Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                          Not Configured
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-medium text-stone-500 mt-1 max-w-lg">
                      Google Authenticator, Authy, 1Password, or Bitwarden. Generates 6-digit security codes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartTotpSetup}
                  disabled={totpSubmitting}
                  className="bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white font-bold px-6 py-3 rounded-xl shadow-md text-[13px] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 self-start sm:self-center"
                >
                  {totpSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  <span>{mfaStatus?.totpEnabled ? "Reconfigure" : "Enable Authenticator"}</span>
                </button>
              </div>
            </motion.div>

            {/* 2. Passkeys & Biometrics Card */}
            <motion.div variants={fadeInUp} className="figma-card w-full rounded-[24px] p-6 md:p-8 border border-[#C7D2FE]/70 bg-white/70 backdrop-blur-md shadow-sm">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center shrink-0">
                    <Fingerprint size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[16px] text-stone-900">Passkeys & Biometrics</h3>
                      {mfaStatus?.passkeys && mfaStatus.passkeys.length > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 size={13} /> {mfaStatus.passkeys.length} Registered
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                          Not Registered
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-medium text-stone-500 mt-0.5">
                      Touch ID, Face ID, Windows Hello, or hardware security keys.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {mfaStatus?.passkeys && mfaStatus.passkeys.length > 0 ? (
                  mfaStatus.passkeys.map((pk) => (
                    <div key={pk.id} className="flex items-center justify-between p-4 rounded-xl border border-stone-200/80 bg-white/90">
                      <div className="flex items-center gap-3">
                        <Fingerprint size={18} className="text-[#4A3AFF]" />
                        <div>
                          <span className="font-bold text-[14px] text-stone-900 block">{pk.deviceName || "Passkey Device"}</span>
                          <span className="text-[12px] font-medium text-stone-500 block">
                            Added: {new Date(pk.createdAt).toLocaleDateString()} • Last used: {new Date(pk.lastUsedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePasskey(pk.id)}
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Passkey"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] font-medium text-stone-400 italic py-1">No passkeys registered yet.</p>
                )}

                <button
                  onClick={handleAddPasskey}
                  disabled={passkeyLoading}
                  className="w-full py-3 rounded-xl border border-dashed border-[#C7D2FE] text-[13px] font-bold text-[#4A3AFF] hover:bg-[#4A3AFF]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passkeyLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  <span>{passkeyLoading ? "Connecting to Device..." : "+ Add New Passkey (Touch ID / Face ID)"}</span>
                </button>
              </div>
            </motion.div>

            {/* 3. Emergency Recovery Codes Card */}
            <motion.div variants={fadeInUp} className="figma-card w-full rounded-[24px] p-6 md:p-8 border border-[#C7D2FE]/70 bg-white/70 backdrop-blur-md shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <LifeBuoy size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-stone-900">Backup Recovery Codes</h3>
                    <p className="text-[13px] font-medium text-stone-500 mt-1 max-w-lg">
                      {mfaStatus?.remainingRecoveryCodes || 0} single-use codes remaining for emergency account recovery.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveModal("recovery_view");
                    setNewRecoveryCodes(null);
                    setReauthPassword("");
                    setReauthCode("");
                    setModalError(null);
                  }}
                  className="border border-[#4A3AFF] text-[#4A3AFF] font-bold px-5 py-2.5 rounded-xl text-[13px] hover:bg-[#4A3AFF]/10 transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-center"
                >
                  <RefreshCw size={14} />
                  <span>Regenerate Codes</span>
                </button>
              </div>
            </motion.div>

            {/* 4. Real Password Changed Timestamp & Brevo Reset Email */}
            <motion.div variants={fadeInUp} className="figma-card w-full rounded-[24px] p-6 md:p-8 border border-[#C7D2FE]/70 bg-white/70 backdrop-blur-md shadow-sm">
              <h2 className="text-[18px] font-bold text-stone-900 mb-6 flex items-center gap-2">
                <KeyRound size={18} className="text-[#4A3AFF]" />
                Password & Authentication Security
              </h2>

              <div className="divide-y divide-stone-200/60">
                {/* Real-time Password Changed Timestamp */}
                <div className="pb-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[15px] text-stone-900">Password</h4>
                    <p className="text-[13px] font-medium text-stone-500 mt-0.5">
                      Last changed: <span className="font-bold text-stone-800">{formatRelativeTime(mfaStatus?.passwordChangedAt)}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleSendResetEmail}
                    disabled={isSendingEmail}
                    className="border border-[#4A3AFF] text-[#4A3AFF] font-bold px-5 py-2 rounded-xl text-[13px] hover:bg-[#4A3AFF]/10 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {isSendingEmail ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                    <span>Reset via Email</span>
                  </button>
                </div>

                {/* Real-time New Device Login Notification Toggle */}
                <div className="pt-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[15px] text-stone-900">New Device Sign-In Alerts</h4>
                      <span className="text-[10px] font-extrabold bg-[#4A3AFF]/10 text-[#4A3AFF] px-2 py-0.5 rounded-md">
                        Brevo SMTP
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-stone-500 mt-0.5">
                      Receive an instant security email whenever your account is accessed from a new device or browser.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    disabled={notificationsLoading}
                    onClick={() => handleToggleNotifications(!mfaStatus?.loginNotifications)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      mfaStatus?.loginNotifications ? "bg-[#4A3AFF]" : "bg-stone-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        mfaStatus?.loginNotifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {emailFeedback && (
                <div className={`mt-5 p-4 rounded-xl flex items-center gap-3 text-[13px] font-bold border ${
                  emailFeedback.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {emailFeedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{emailFeedback.message}</span>
                </div>
              )}
            </motion.div>

            {/* 5. Real Active User Sessions (List & Revoke) */}
            <motion.div variants={fadeInUp} className="figma-card w-full rounded-[24px] p-6 md:p-8 border border-[#C7D2FE]/70 bg-white/70 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[18px] font-bold text-stone-900 flex items-center gap-2">
                    <Laptop size={18} className="text-[#4A3AFF]" />
                    Active Devices & Sessions
                  </h2>
                  <p className="text-[13px] font-medium text-stone-500 mt-0.5">
                    Real-time list of all web browsers and mobile apps currently signed into your account.
                  </p>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={async () => {
                      if (!confirm("Revoke all other active sessions except your current device?")) return;
                      try {
                        const token = await getToken();
                        await revokeSessionOnBackend(token, "other");
                        fetchMfaStatus();
                      } catch (err) {
                        alert("Failed to revoke other sessions.");
                      }
                    }}
                    className="border border-red-200 text-red-600 hover:bg-red-50 font-bold px-4 py-2 rounded-xl text-[12px] transition-colors cursor-pointer shrink-0"
                  >
                    Revoke Other Sessions
                  </button>
                )}
              </div>

              <div className="divide-y divide-stone-200/60">
                {sessionsLoading ? (
                  <div className="py-8 text-center text-stone-400 flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-[#4A3AFF]" />
                    <span className="text-[13px] font-medium">Loading active sessions...</span>
                  </div>
                ) : sessions.length > 0 ? (
                  sessions.map((sess) => (
                    <div key={sess.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4A3AFF] flex items-center justify-center shrink-0">
                          {sess.deviceType === "mobile" ? <Smartphone size={20} /> : <Laptop size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[14px] text-stone-900">{sess.deviceName}</h4>
                            {sess.isCurrent && (
                              <span className="bg-emerald-100 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                                Current Session
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-stone-500 mt-0.5">
                            IP: {sess.ipAddress || "Unknown"} • Last active: {formatRelativeTime(sess.lastActive)}
                          </p>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="border border-stone-200 text-stone-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-bold px-4 py-1.5 rounded-xl text-[12px] transition-colors cursor-pointer shrink-0"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-stone-400 text-[13px]">No active sessions found.</div>
                )}
              </div>
            </motion.div>

          </div>

        </div>
      </motion.div>

      {/* --- MODAL 1: TOTP Setup Modal --- */}
      {activeModal === "totp_setup" && totpSetupData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#C7D2FE] rounded-[24px] shadow-2xl p-6 md:p-8 space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-stone-700">
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-[20px] font-extrabold text-stone-900">Set Up Authenticator App</h3>
              <p className="text-[13px] font-medium text-stone-500 mt-1">Step {totpStep} of 3</p>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-[13px] font-bold flex items-center gap-2">
                <AlertCircle size={16} /> <span>{modalError}</span>
              </div>
            )}

            {totpStep === 1 && (
              <div className="text-center space-y-5">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 inline-block shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={totpSetupData.qrCodeDataUrl} alt="TOTP QR Code" className="w-44 h-44 mx-auto" />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Secret Key (Manual Entry)</span>
                  <div className="flex items-center justify-center gap-2 bg-[#F8F9FF] border border-[#D1D9FF] py-2 px-3 rounded-xl font-mono text-xs font-bold text-stone-800">
                    <span>{totpSetupData.secret}</span>
                    <button onClick={() => navigator.clipboard.writeText(totpSetupData.secret)} className="p-1 hover:text-[#4A3AFF]">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setTotpStep(2)}
                  className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white text-[14px] font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Enter 6-Digit Code</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {totpStep === 2 && (
              <form onSubmit={handleVerifyTotpSetup} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-stone-700 mb-2">
                    Enter the 6-digit code shown on your authenticator app
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 px-4 rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={totpSubmitting || totpCode.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-[#4A3AFF] hover:bg-[#3b2ee0] text-white text-[14px] font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {totpSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>Verify & Activate</span>
                </button>
              </form>
            )}

            {totpStep === 3 && newRecoveryCodes && (
              <div className="space-y-5 text-center">
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-[13px] font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Authenticator App activated! Save your backup codes below.</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#F8F9FF] p-4 rounded-xl font-mono text-xs font-extrabold tracking-widest border border-[#D1D9FF]">
                  {newRecoveryCodes.map((c, i) => (
                    <div key={i} className="py-1">{c}</div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyCodesToClipboard(newRecoveryCodes)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-stone-50"
                  >
                    <Copy size={14} /> Copy
                  </button>
                  <button
                    onClick={() => downloadCodesAsTxt(newRecoveryCodes)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-stone-50"
                  >
                    <Download size={14} /> Download TXT
                  </button>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3.5 rounded-xl bg-[#4A3AFF] text-white text-[14px] font-bold shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- MODAL 2: Regenerate Recovery Codes Modal --- */}
      {activeModal === "recovery_view" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#C7D2FE] rounded-[24px] shadow-2xl p-6 md:p-8 space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-stone-700">
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-[20px] font-extrabold text-stone-900">Regenerate Recovery Codes</h3>
              <p className="text-[13px] font-medium text-stone-500 mt-1">Generating new codes will invalidate all existing ones.</p>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-[13px] font-bold flex items-center gap-2">
                <AlertCircle size={16} /> <span>{modalError}</span>
              </div>
            )}

            {newRecoveryCodes ? (
              <div className="space-y-5 text-center">
                <div className="grid grid-cols-2 gap-2 bg-[#F8F9FF] p-4 rounded-xl font-mono text-xs font-extrabold tracking-widest border border-[#D1D9FF]">
                  {newRecoveryCodes.map((c, i) => (
                    <div key={i} className="py-1">{c}</div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => copyCodesToClipboard(newRecoveryCodes)} className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Copy size={14} /> Copy
                  </button>
                  <button onClick={() => downloadCodesAsTxt(newRecoveryCodes)} className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Download size={14} /> Download TXT
                  </button>
                </div>

                <button onClick={() => setActiveModal(null)} className="w-full py-3.5 rounded-xl bg-[#4A3AFF] text-white text-[14px] font-bold cursor-pointer">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegenerateCodes} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-stone-600 uppercase mb-1">Current Password (if set)</label>
                  <input
                    type="password"
                    value={reauthPassword}
                    onChange={(e) => setReauthPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-xs text-stone-850"
                  />
                </div>

                {mfaStatus?.totpEnabled && (
                  <div>
                    <label className="block text-[12px] font-bold text-stone-600 uppercase mb-1">6-Digit Authenticator Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={reauthCode}
                      onChange={(e) => setReauthCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full py-2.5 px-3.5 text-center font-mono text-sm tracking-widest rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-stone-850"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={recoverySubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#4A3AFF] text-white text-[14px] font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {recoverySubmitting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  <span>Generate New Codes</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* --- MODAL 3: Disable 2FA Modal --- */}
      {activeModal === "disable_mfa" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#C7D2FE] rounded-[24px] shadow-2xl p-6 md:p-8 space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-stone-700">
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-[20px] font-extrabold text-red-600">Disable Two-Factor Authentication</h3>
              <p className="text-[13px] font-medium text-stone-500 mt-1">Please re-authenticate to confirm deactivating 2FA protection.</p>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-[13px] font-bold flex items-center gap-2">
                <AlertCircle size={16} /> <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleDisableMfa} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-stone-600 uppercase mb-1">Account Password</label>
                <input
                  type="password"
                  value={reauthPassword}
                  onChange={(e) => setReauthPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-xs text-stone-850"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-stone-600 uppercase mb-1">Current Authenticator or Recovery Code</label>
                <input
                  type="text"
                  value={reauthCode}
                  onChange={(e) => setReauthCode(e.target.value.toUpperCase())}
                  placeholder="6-digit code or XXXX-XXXX"
                  className="w-full py-2.5 px-3.5 text-center font-mono text-sm rounded-xl bg-[#F8F9FF] border border-[#D1D9FF] text-stone-850"
                />
              </div>

              <button
                type="submit"
                disabled={recoverySubmitting}
                className="w-full py-3.5 rounded-xl bg-red-600 text-white text-[14px] font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {recoverySubmitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                <span>Confirm Disable 2FA</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </WavesBackground>
  );
}
