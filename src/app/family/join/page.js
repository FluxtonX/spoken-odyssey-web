"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { validateInvitationToken, acceptInvitationViaToken } from "@/services/backend";
import { useAuth } from "@/context/AuthProvider";
import { UserPlus, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function FamilyJoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { profile, jwtToken, isAuthenticated, loading: authLoading } = useAuth();
  
  const [validating, setValidating] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Store token in localStorage for auth flow persistence
  useEffect(() => {
    if (token) {
      localStorage.setItem('pendingInvitationToken', token);
    }
  }, [token]);

  // Validate invitation token against the backend
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError("Invalid invitation link. No token provided.");
        setValidating(false);
        return;
      }

      try {
        const result = await validateInvitationToken(token);
        if (result && result.invitation) {
          setInvitation(result.invitation);
        } else {
          setError("Invalid or expired invitation link.");
        }
      } catch (err) {
        console.error("Validate token error:", err);
        const msg = err?.message || "Invalid or expired invitation link.";
        setError(msg);
      } finally {
        setValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      // Redirect to auth — token is persisted in localStorage
      router.push(`/auth?redirect=${encodeURIComponent(`/family/join?token=${token}`)}`);
      return;
    }

    setAccepting(true);
    try {
      const result = await acceptInvitationViaToken(jwtToken, { invitationToken: token });
      
      if (result) {
        setAccepted(true);
        localStorage.removeItem('pendingInvitationToken');
      }
    } catch (err) {
      console.error("Accept invitation error:", err);
      setError(err.message || "Failed to accept invitation. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  // Show loading while auth is initializing or invitation is validating
  if (authLoading || validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#4A3AFF] mx-auto mb-4" size={48} />
          <p className="text-stone-600 dark:text-stone-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30 text-red-500 flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">Invalid or Expired Invitation</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {error || "This invitation link is invalid or has expired."}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A3AFF] text-white font-semibold rounded-2xl hover:bg-[#3b2dd1] transition"
          >
            Go to Home
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">Invitation Accepted!</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            You've accepted the invitation to join <span className="font-bold text-[#4A3AFF]">{invitation.familyCircleName}</span>.
            The family admin will review your request and add you to the circle.
          </p>
          <a
            href="/family"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A3AFF] text-white font-semibold rounded-2xl hover:bg-[#3b2dd1] transition"
          >
            Go to Family Circle
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/50 text-[#4A3AFF] flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
            Family Circle Invitation
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            You've been invited to join a family circle
          </p>
        </div>

        {/* Invitation Details */}
        <div className="bg-gradient-to-r from-[#EEF2FF] to-[#F4F5FF] dark:from-indigo-950/30 dark:to-slate-800/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {invitation.senderAvatar && (
              <img
                src={invitation.senderAvatar}
                alt={invitation.senderName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700"
              />
            )}
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                Invited by
              </p>
              <p className="font-bold text-stone-900 dark:text-white">{invitation.senderName}</p>
            </div>
          </div>
          <div className="border-t border-indigo-200 dark:border-indigo-800 pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold mb-1">
              Family Circle
            </p>
            <p className="font-bold text-[#4A3AFF] text-lg">{invitation.familyCircleName}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Relationship: {invitation.relationship}
            </p>
          </div>
        </div>

        {/* User Status */}
        {!isAuthenticated ? (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              Please sign in or create an account to accept this invitation.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-6">
            <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
              Signed in as <span className="font-bold">{profile?.displayName || profile?.email}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAcceptInvitation}
            disabled={accepting}
            className="w-full py-4 bg-[#4A3AFF] hover:bg-[#3b2dd1] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accepting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Accepting...</span>
              </>
            ) : !isAuthenticated ? (
              <>
                <ArrowRight size={20} />
                <span>Sign In to Accept</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Accept Invitation</span>
              </>
            )}
          </button>

          {!isAuthenticated && (
            <a
              href={`/auth?mode=signup&redirect=${encodeURIComponent(`/family/join?token=${token}`)}`}
              className="block w-full py-4 bg-stone-100 dark:bg-slate-700 hover:bg-stone-200 dark:hover:bg-slate-600 text-stone-900 dark:text-white font-bold rounded-2xl transition-all text-center"
            >
              Create Account to Accept
            </a>
          )}

          <a
            href="/"
            className="block w-full py-3 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 font-medium text-center text-sm transition"
          >
            Decline and go to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function FamilyJoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-white">
        <Loader2 size={32} className="animate-spin text-purple-500 mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Validating invitation...</span>
      </div>
    }>
      <FamilyJoinContent />
    </Suspense>
  );
}
