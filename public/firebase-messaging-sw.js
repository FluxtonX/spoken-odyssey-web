// Web Push Service Worker for Spoken Odyssey
// Handles FCM background push notifications, brand formatting, and deep-link click navigation

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC1wkKyy_HXPLligWJbpNWj0pq46ugg_aw",
  authDomain: "spoken-odesey.firebaseapp.com",
  projectId: "spoken-odesey",
  appId: "1:884058304379:web:8134d6ee3cd04b4cce97de",
  messagingSenderId: "884058304379",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const rawTitle = payload?.notification?.title || payload?.data?.title || "Spoken Odyssey";
  const notificationTitle = rawTitle.startsWith("Spoken Odyssey") ? rawTitle : `Spoken Odyssey • ${rawTitle}`;

  const body = payload?.notification?.body || payload?.data?.body || "You have a new story notification.";
  const url = payload?.data?.url || payload?.data?.actionUrl || payload?.data?.click_action || "/memories";
  const image = payload?.notification?.image || payload?.data?.image || undefined;

  const notificationOptions = {
    body,
    icon: '/odyssey.png',
    badge: '/odyssey.png',
    image: image,
    vibrate: [100, 50, 100],
    data: {
      url,
      ...payload?.data,
    },
    actions: [
      { action: 'view', title: 'View Story' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const rawUrl = event.notification.data?.url || event.notification.data?.actionUrl || event.notification.data?.click_action || '/memories';
  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `${self.location.origin}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a Spoken Odyssey tab is already open, focus it and navigate to the target URL
      for (let client of windowClients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no active window exists, open a new window to fetch user into the system
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
