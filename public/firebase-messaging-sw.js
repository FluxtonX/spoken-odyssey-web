// Web Push Service Worker for Spoken Odyssey
// Handles FCM background message events and clicks when the browser tab is closed

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
  const notificationTitle = payload?.notification?.title || payload?.data?.title || "Spoken Odyssey";
  const notificationOptions = {
    body: payload?.notification?.body || payload?.data?.body || "You have a new story notification.",
    icon: '/icon-192.png',
    badge: '/badge.png',
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/memories';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
