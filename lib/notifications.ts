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
  return 'Notification' in window;
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
    // In a real implementation, you would use your VAPID public key here
    const pushSubscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      // applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
    });

    console.log('Push notification subscription successful:', pushSubscription);
    return pushSubscription;
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

  const notification = new Notification('MyOwnWeather Test', {
    body: 'This is a test notification from MyOwnWeather',
    icon: '/favicon.png',
  });

  notification.onclick = () => {
    console.log('Notification clicked');
    window.focus();
    notification.close();
  };
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
  if (!supportsNotifications() || Notification.permission !== 'granted') {
    console.warn('Notifications not supported or permission not granted');
    return;
  }

  const notification = new Notification(data.title, {
    body: data.body,
    icon: data.icon || '/favicon.png',
    tag: data.tag || 'weather-notification',
    requireInteraction: data.requireInteraction || false,
    data: data.data || {},
  });

  notification.onclick = () => {
    console.log('Weather notification clicked');
    window.focus();
    notification.close();
  };
}
