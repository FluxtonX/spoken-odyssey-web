"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { syncUserWithBackend } from "@/services/backend";
import { BackendError } from "@/services/backend";
import {
  getFirebaseAuth,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  sendPasswordReset,
  resendVerificationEmail,
} from "@/services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const syncInFlight = useRef(null);

  const syncProfile = useCallback(async (user, forceRefresh = false) => {
    if (!user) {
      setProfile(null);
      return null;
    }
    if (syncInFlight.current) return syncInFlight.current;

    const task = (async () => {
      setSyncing(true);
      try {
        const token = await user.getIdToken(forceRefresh);
        const syncedProfile = await syncUserWithBackend(token);
        setProfile(syncedProfile);
        return syncedProfile;
      } catch (error) {
        if (error instanceof BackendError && error.status === 401) {
          await signOutUser();
          setFirebaseUser(null);
          setProfile(null);
        }
        throw error;
      } finally {
        setSyncing(false);
        syncInFlight.current = null;
      }
    })();

    syncInFlight.current = task;
    return task;
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        await syncProfile(user);
      } catch {
        // Handled in login actions.
      } finally {
        setLoading(false);
      }
    });
  }, [syncProfile]);

  const login = useCallback(
    async (email, password) => {
      const user = await signInWithEmail(email.trim(), password);
      setFirebaseUser(user);
      return syncProfile(user, true);
    },
    [syncProfile]
  );

  const signup = useCallback(async ({ name, email, password }) => {
    return signUpWithEmail({ name, email: email.trim(), password });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const user = await signInWithGoogle();
    setFirebaseUser(user);
    return syncProfile(user, true);
  }, [syncProfile]);

  const logout = useCallback(async () => {
    await signOutUser();
    setFirebaseUser(null);
    setProfile(null);
  }, []);

  const sendResetEmail = useCallback(async (email) => {
    await sendPasswordReset(email.trim());
  }, []);

  const resendVerification = useCallback(async (email, password) => {
    await resendVerificationEmail(email.trim(), password);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return null;
    return syncProfile(firebaseUser, true);
  }, [firebaseUser, syncProfile]);

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      loading,
      syncing,
      isAuthenticated: !!firebaseUser,
      login,
      signup,
      loginWithGoogle,
      logout,
      sendResetEmail,
      resendVerification,
      refreshProfile,
    }),
    [
      firebaseUser,
      profile,
      loading,
      syncing,
      login,
      signup,
      loginWithGoogle,
      logout,
      sendResetEmail,
      resendVerification,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
