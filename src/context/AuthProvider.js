"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { 
  loginWithBackend, 
  registerWithBackend, 
  googleLoginWithBackend,
  getProfileFromBackend,
  sendHeartbeat,
  getBackendBaseUrl 
} from "@/services/backend";
import {
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
  resendVerificationEmail,
} from "@/services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [jwtToken, setJwtToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mfaPendingState, setMfaPendingState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("spokenOdysseyToken");
    if (storedToken) {
      setJwtToken(storedToken);
      getProfileFromBackend(storedToken)
        .then(data => setProfile(data))
        .catch(() => {
           localStorage.removeItem("spokenOdysseyToken");
           setJwtToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const getToken = useCallback(async () => {
    return jwtToken || localStorage.getItem("spokenOdysseyToken");
  }, [jwtToken]);

  useEffect(() => {
    if (!jwtToken) return undefined;

    const pingHeartbeat = async () => {
      try {
        await sendHeartbeat(jwtToken);
      } catch (err) {
        console.warn("Heartbeat ping failed:", err.message);
      }
    };

    const setupPush = async () => {
      try {
        const { initializePushNotifications } = await import("@/services/fcm");
        await initializePushNotifications(jwtToken);
      } catch (_) {}
    };

    pingHeartbeat();
    setupPush();
    const intervalId = setInterval(pingHeartbeat, 60000);

    return () => clearInterval(intervalId);
  }, [jwtToken]);

  const completeMfa = useCallback((token, userData) => {
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(userData);
    setMfaPendingState(null);
  }, []);

  const clearMfaPending = useCallback(() => {
    setMfaPendingState(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await loginWithBackend(email.trim(), password);
    if (response.mfaRequired) {
      setMfaPendingState({
        mfaToken: response.mfaToken,
        availableMethods: response.availableMethods,
      });
      return { mfaRequired: true, mfaToken: response.mfaToken, availableMethods: response.availableMethods };
    }

    const token = response.token;
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(response.data);
    setMfaPendingState(null);
    return response.data;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const response = await registerWithBackend({ displayName: name, email: email.trim(), password });
    const token = response.token;
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(response.data);
    setMfaPendingState(null);
    return response.data;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const firebaseUser = await signInWithGoogle();
    const googleToken = await firebaseUser.getIdToken();
    const response = await googleLoginWithBackend(googleToken);
    if (response.mfaRequired) {
      setMfaPendingState({
        mfaToken: response.mfaToken,
        availableMethods: response.availableMethods,
      });
      return { mfaRequired: true, mfaToken: response.mfaToken, availableMethods: response.availableMethods };
    }

    const token = response.token;
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(response.data);
    setMfaPendingState(null);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("spokenOdysseyToken");
    localStorage.removeItem("spokenOdysseyLocalMemories");
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("spokenOdysseyLocalMemories")) {
          localStorage.removeItem(k);
        }
      });
    } catch {}
    setJwtToken(null);
    setProfile(null);
    setMfaPendingState(null);
    await signOutUser();
  }, []);

  const sendResetEmail = useCallback(async (email) => {
    const baseUrl = getBackendBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send password reset email.");
      }
      return data;
    } catch (err) {
      if (err.name === "TypeError" || err.message?.includes("fetch")) {
        throw new Error("Could not connect to authentication server. Please check backend connection.");
      }
      throw err;
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    const baseUrl = getBackendBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to send verification email.");
    }
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!jwtToken) return null;
    try {
      const data = await getProfileFromBackend(jwtToken);
      setProfile(data);
      return data;
    } catch (e) {
      return null;
    }
  }, [jwtToken]);

  const value = useMemo(
    () => ({
      jwtToken,
      profile,
      mfaPendingState,
      loading,
      isAuthenticated: !!jwtToken,
      login,
      signup,
      loginWithGoogle,
      logout,
      sendResetEmail,
      resendVerification,
      refreshProfile,
      getToken,
      completeMfa,
      clearMfaPending,
      // Temporarily polyfill firebaseUser to prevent immediate crashes during refactor
      firebaseUser: jwtToken ? { 
        getIdToken: async () => jwtToken,
        email: profile?.email,
        uid: profile?.id,
        displayName: profile?.displayName,
      } : null,
    }),
    [
      jwtToken,
      profile,
      mfaPendingState,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      sendResetEmail,
      resendVerification,
      refreshProfile,
      getToken,
      completeMfa,
      clearMfaPending,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) return {};
  return context;
}
