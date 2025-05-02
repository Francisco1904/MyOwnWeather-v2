// API utilities for fetching weather data

import { API_KEY } from '@/lib/constants';

// Base URL for weather API
const API_BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Options for API requests
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Make an API request with error handling
 */
async function fetchAPI(endpoint: string, options: RequestOptions = {}) {
  try {
    const { method = 'GET', headers = {}, body } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Get current weather for a location
 */
export async function getCurrentWeather(locationId: string) {
  return fetchAPI(`/current.json?key=${API_KEY}&q=${encodeURIComponent(locationId)}`);
}

/**
 * Get weather forecast for a location
 * @param locationId - The location ID or name
 * @param days - Number of days to forecast (1-7)
 */
export async function getForecast(locationId: string, days: number = 5) {
  return fetchAPI(`/forecast.json?key=${API_KEY}&q=${encodeURIComponent(locationId)}&days=${days}`);
}

/**
 * Search for a location by name
 */
export async function searchLocation(query: string) {
  return fetchAPI(`/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
}

/**
 * Get historical weather data for a location
 */
export async function getHistoricalWeather(locationId: string, date: string) {
  return fetchAPI(`/history.json?key=${API_KEY}&q=${encodeURIComponent(locationId)}&dt=${date}`);
}

/**
 * Subscribe to push notifications for a location
 * Note: In a real implementation, this would involve saving the subscription to a backend service
 */
export async function subscribeToLocationNotifications(
  locationId: string,
  locationName: string,
  pushSubscription: PushSubscription
) {
  // This is a mock implementation as we don't have a real backend for this demo
  console.log(
    `Mock: Subscribed to notifications for ${locationName} (${locationId})`,
    pushSubscription
  );

  // In a real implementation, you would send this to your backend:
  // return fetchAPI('/notifications/subscribe', {
  //   method: 'POST',
  //   body: {
  //     locationId,
  //     locationName,
  //     subscription: pushSubscription
  //   }
  // });

  return { success: true };
}
