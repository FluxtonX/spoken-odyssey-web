/**
 * Firebase Auth (client SDK) for the web app.
 * Backend spokenOdessie_backend uses firebase-admin to VERIFY tokens — different SDK, same project.
 * Project: spoken-odesey (from backend FIREBASE_PROJECT_ID)
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getBackendErrorMessage } from "./backend";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

function getAuthInstance() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey) {
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. Add it to .env.local and restart the dev server."
    );
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. See FIREBASE_SETUP.md and .env.example for setup instructions."
    );
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

function getActionCodeSettings() {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return { url: `${origin}/auth/action`, handleCodeInApp: true };
}

async function ensurePersistence() {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  await setPersistence(auth, browserLocalPersistence);
  return auth;
}

export function getFirebaseAuth() {
  return getAuthInstance();
}

export async function signUpWithEmail({ name, email, password }) {
  const auth = await ensurePersistence();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name?.trim()) await updateProfile(credential.user, { displayName: name.trim() });
  return credential.user;
}

export async function signInWithEmail(email, password) {
  const auth = await ensurePersistence();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (!credential.user.emailVerified) {
    const error = new Error("Please verify your email before signing in.");
    error.code = "auth/email-not-verified";
    throw error;
  }
  return credential.user;
}

export async function signInWithGoogle() {
  const auth = await ensurePersistence();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return (await signInWithPopup(auth, provider)).user;
}

export async function sendPasswordReset(email) {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  await sendPasswordResetEmail(auth, email, getActionCodeSettings());
}

export async function resendVerificationEmail(email, password) {
  const auth = await ensurePersistence();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user, getActionCodeSettings());
  await signOut(auth);
}

export async function verifyEmailWithCode(oobCode) {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  await applyActionCode(auth, oobCode);
}

export async function resetPasswordWithCode(oobCode, newPassword) {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function signOutUser() {
  const auth = getAuthInstance();
  if (auth) await signOut(auth);
}

const FIREBASE_ERROR_MESSAGES = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/popup-blocked": "Pop-up was blocked. Allow pop-ups and try again.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different sign-in method.",
  "auth/expired-action-code": "This link has expired. Request a new one.",
  "auth/invalid-action-code": "This link is invalid or has already been used.",
  "auth/email-not-verified":
    "Please verify your email before signing in. We sent you a new verification link.",
};

export function getAuthErrorMessage(error, fallback = "Authentication failed. Please try again.") {
  if (error?.code && FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }
  return getBackendErrorMessage(error, fallback);
}
