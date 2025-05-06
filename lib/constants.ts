// Application constants

export const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'mock_api_key';

// Notification settings default values per temperature unit
export const DEFAULT_TEMPERATURE_THRESHOLDS = {
  C: {
    high: 32, // High threshold in Celsius
    low: 3, // Low threshold in Celsius
  },
  F: {
    high: 90, // High threshold in Fahrenheit
    low: 37, // Low threshold in Fahrenheit
  },
};

// Notification settings
export const DEFAULT_NOTIFICATION_SETTINGS = {
  masterEnabled: false,
  categories: {
    dailyForecast: true,
    severeWeather: true,
    temperatureThresholds: {
      enabled: false,
      highThreshold: DEFAULT_TEMPERATURE_THRESHOLDS.F.high, // Default high temp threshold (F)
      lowThreshold: DEFAULT_TEMPERATURE_THRESHOLDS.F.low, // Default low temp threshold (F)
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
