// Application constants

// API Keys
// In a real application, these would be stored in environment variables
// and not committed to the repository
export const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'mock_api_key';

// Notification settings
export const DEFAULT_NOTIFICATION_SETTINGS = {
  masterEnabled: false,
  categories: {
    dailyForecast: true,
    severeWeather: true,
    temperatureThresholds: {
      enabled: false,
      highThreshold: 95, // Default high temp threshold (F)
      lowThreshold: 32, // Default low temp threshold (F)
    },
    precipitationAlerts: true,
    uvIndexWarnings: true,
  },
};

// Unit settings
export const DEFAULT_TEMPERATURE_UNIT = 'C';

// Time settings
export const FORECAST_UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour
export const SEVERE_WEATHER_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
