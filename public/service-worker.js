// Service Worker for MyOwnWeather App
const CACHE_NAME = 'myownweather-v3';

// Install event - just set up the service worker with minimal caching
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  // Skip waiting to become active immediately 
  self.skipWaiting();
});

// Activate event - claim clients immediately
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  // Claim clients immediately so service worker controls the page
  event.waitUntil(
    clients.claim().then(() => {
      console.log('[Service Worker] Now controlling all clients');
    })
  );
});

// Fetch event - basic passthrough, no caching
self.addEventListener('fetch', event => {
  // Let the browser handle all requests normally
  // This is a simplified approach focusing on notifications
});

// Handle direct notification request from the app
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const notifData = event.data.notification;
    
    console.log('[Service Worker] Showing notification:', notifData.title);
    
    self.registration.showNotification(
      notifData.title || 'MyOwnWeather',
      {
        body: notifData.body || 'Weather update',
        icon: notifData.icon || '/favicon.png',
        badge: '/favicon.png',
        data: notifData.data || { url: '/' },
        vibrate: [200, 100, 200],
        tag: notifData.tag || 'weather-notification',
        requireInteraction: notifData.requireInteraction || false,
      }
    ).then(() => {
      console.log('[Service Worker] Notification shown successfully');
    }).catch(err => {
      console.error('[Service Worker] Failed to show notification:', err);
    });
  }
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked:', event.notification);
  
  event.notification.close();
  
  // Extract the URL to open from the notification data
  const urlToOpen = event.notification.data?.url || '/';
  
  // Handle notification click
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            console.log('[Service Worker] Focusing existing window');
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          console.log('[Service Worker] Opening new window to', urlToOpen);
          return clients.openWindow(urlToOpen);
        }
      })
  );
}); 