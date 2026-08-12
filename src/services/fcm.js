import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { registerDevicePushToken } from "./backend";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BJXNS_q1D0HCkwg0NuYEFENXd6J1X1Ig3v_aWKemxQ2sB1qcoiBl89jeG1k8gsxH-jw-90cLPejLtIPz_qyl0OQ";

/**
 * Initialize Web Push Notifications & register device token with backend
 */
export async function initializePushNotifications(authToken) {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    // 1. Request notification permission from browser user
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Web Push Notification permission denied by user.");
      return null;
    }

    // 2. Register service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Firebase Messaging SW registered:", registration.scope);

    // 3. Get Firebase app & messaging instance
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    };

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // 4. Retrieve FCM push token using VAPID key
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("[FCM] Device Push Token retrieved:", `${currentToken.substring(0, 20)}...`);

      // 5. Register push token with backend database if authToken is provided
      if (authToken) {
        await registerDevicePushToken(authToken, currentToken, "web");
      }

      // Listen for foreground push messages when app tab is active
      onMessage(messaging, (payload) => {
        console.log("[FCM] Foreground Push Message received:", payload);
        const rawTitle = payload?.notification?.title || payload?.data?.title || "Spoken Odyssey";
        const title = rawTitle.startsWith("Spoken Odyssey") ? rawTitle : `Spoken Odyssey • ${rawTitle}`;
        const body = payload?.notification?.body || payload?.data?.body || "New story notification";
        const targetUrl = payload?.data?.url || payload?.data?.actionUrl || "/memories";

        const options = {
          body,
          icon: "/odyssey.png",
          badge: "/odyssey.png",
          data: payload?.data || {},
        };

        if (Notification.permission === "granted") {
          const notif = new Notification(title, options);
          notif.onclick = (e) => {
            e.preventDefault();
            window.focus();
            if (targetUrl) {
              window.location.href = targetUrl;
            }
          };
        }
      });

      return currentToken;
    } else {
      console.warn("[FCM] No registration token available.");
      return null;
    }
  } catch (error) {
    console.warn("[FCM] Web Push Notification initialization warning:", error.message);
    return null;
  }
}
