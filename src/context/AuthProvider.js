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
  sendHeartbeat 
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

    pingHeartbeat();
    const intervalId = setInterval(pingHeartbeat, 60000);

    return () => clearInterval(intervalId);
  }, [jwtToken]);

  const login = useCallback(async (email, password) => {
    const response = await loginWithBackend(email.trim(), password);
    const token = response.token;
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(response.data);
    return response.data;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const response = await registerWithBackend({ displayName: name, email: email.trim(), password });
    const token = response.token;
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(response.data);
    return response.data;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const firebaseUser = await signInWithGoogle();
    const googleToken = await firebaseUser.getIdToken();
    const response = await googleLoginWithBackend(googleToken);
    const token = response.token;
    localStorage.setItem("spokenOdysseyToken", token);
    setJwtToken(token);
    setProfile(response.data);
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
    await signOutUser();
  }, []);

  const sendResetEmail = useCallback(async (email) => {
    await sendPasswordReset(email.trim());
  }, []);

  const resendVerification = useCallback(async (email, password) => {
    await resendVerificationEmail(email.trim(), password);
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
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      sendResetEmail,
      resendVerification,
      refreshProfile,
      getToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
