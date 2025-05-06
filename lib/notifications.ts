// Notification utilities for the weather app

/**
 * Register the service worker for notifications and offline functionality
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered successfully:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  } else {
    console.warn('Service Workers or Push API not supported');
    return null;
  }
}

/**
 * Check if the browser supports notifications
 */
export function supportsNotifications(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Check if the current permission status for notifications
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (!supportsNotifications()) {
    return null;
  }
  return Notification.permission;
}

/**
 * Request permission to show notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!supportsNotifications()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Subscribe to push notifications (requires VAPID keys in a real app)
 */
export async function subscribeToPushNotifications(
  swRegistration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    // Check if already subscribed
    const existingSubscription = await swRegistration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Already subscribed to push notifications');
      return existingSubscription;
    }

    // Generate a temporary dummy application server key for testing
    // In a real app, you would use your VAPID public key
    const tempAppServerKey = urlBase64ToUint8Array(
      'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    );

    // Try to subscribe with the dummy key
    try {
      const pushSubscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: tempAppServerKey,
      });

      console.log('Push notification subscription successful:', pushSubscription);
      return pushSubscription;
    } catch (subscribeError) {
      console.error('Push subscription failed with key:', subscribeError);

      // If that fails, try without an application server key (for test environments)
      try {
        const pushSubscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
        });

        console.log('Push notification subscription successful (fallback):', pushSubscription);
        return pushSubscription;
      } catch (fallbackError) {
        console.error('Push subscription fallback also failed:', fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}

/**
 * Helper function to convert VAPID public key for push subscription
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Show a test notification (for development purposes)
 */
export function showTestNotification() {
  if (!supportsNotifications() || Notification.permission !== 'granted') {
    console.warn('Notifications not supported or permission not granted');
    return;
  }

  showWeatherNotification({
    title: 'MyOwnWeather Test',
    body: 'This is a test notification from MyOwnWeather',
  });
}

interface WeatherNotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
}

/**
 * Display a weather notification
 */
export function showWeatherNotification(data: WeatherNotificationData) {
  if (!supportsNotifications()) {
    console.warn('Notifications not supported in this browser');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  console.log('Attempting to show notification:', data.title);

  // Try to get the service worker registration
  if ('serviceWorker' in navigator) {
    // Check if service worker is controlling the page
    if (navigator.serviceWorker.controller) {
      console.log('Using active service worker to show notification');

      // Use postMessage to communicate with the service worker
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        notification: data,
      });

      // Also try the standard method as a backup
      navigator.serviceWorker.ready
        .then(registration => {
          console.log('Got service worker registration, showing notification');
          // Use service worker to show notification (works on all platforms including mobile)
          return registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/favicon.png',
            tag: data.tag || 'weather-notification',
            requireInteraction: data.requireInteraction || false,
            data: data.data || {},
            // @ts-ignore - vibrate and badge are valid in service worker notifications
            vibrate: [200, 100, 200],
            badge: '/favicon.png',
          });
        })
        .then(() => {
          console.log('Notification shown successfully via service worker');
        })
        .catch(error => {
          console.error('Error showing notification through service worker:', error);
          fallbackToDirectNotification(data);
        });
    } else {
      console.warn('No controlling service worker, registering one...');

      // Try to register a service worker if none is controlling the page
      registerServiceWorker()
        .then(registration => {
          if (registration) {
            console.log('Newly registered service worker, showing notification');

            // Small delay to ensure the service worker activates
            setTimeout(() => {
              registration
                .showNotification(data.title, {
                  body: data.body,
                  icon: data.icon || '/favicon.png',
                  tag: data.tag || 'weather-notification',
                  requireInteraction: data.requireInteraction || false,
                  data: data.data || {},
                  // @ts-ignore
                  vibrate: [200, 100, 200],
                  badge: '/favicon.png',
                })
                .catch(err => {
                  console.error('Error showing notification with new SW:', err);
                  fallbackToDirectNotification(data);
                });
            }, 1000);
          } else {
            console.warn('Failed to register service worker, falling back to direct notification');
            fallbackToDirectNotification(data);
          }
        })
        .catch(error => {
          console.error('Error registering service worker:', error);
          fallbackToDirectNotification(data);
        });
    }
  } else {
    // Fallback to direct notification API for browsers that support it
    console.log('Service workers not supported, using direct notification');
    fallbackToDirectNotification(data);
  }
}

/**
 * Fallback to direct notification API if service worker is not available
 * Note: This doesn't work on most mobile devices
 */
function fallbackToDirectNotification(data: WeatherNotificationData) {
  try {
    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/favicon.png',
      tag: data.tag || 'weather-notification',
      requireInteraction: data.requireInteraction || false,
    });

    notification.onclick = () => {
      console.log('Weather notification clicked');
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Failed to show notification using direct API:', error);
  }
}

/**
 * Unregister all service workers - useful for troubleshooting
 */
export async function unregisterServiceWorkers(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service worker unregistered');
    }

    return true;
  } catch (error) {
    console.error('Error unregistering service workers:', error);
    return false;
  }
}
