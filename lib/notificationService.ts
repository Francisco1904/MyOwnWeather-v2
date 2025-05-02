// Notification service for processing and sending weather notifications

import { NotificationPreferences } from '@/lib/context/notification-context';
import { showWeatherNotification } from '@/lib/notifications';
import { getCurrentWeather, getForecast } from '@/lib/api';

/**
 * Types of notifications that can be sent
 */
export enum NotificationType {
  DAILY_FORECAST = 'daily_forecast',
  SEVERE_WEATHER = 'severe_weather',
  HIGH_TEMPERATURE = 'high_temperature',
  LOW_TEMPERATURE = 'low_temperature',
  PRECIPITATION = 'precipitation',
  UV_INDEX = 'uv_index',
}

/**
 * Interface for weather condition notification
 */
export interface WeatherCondition {
  type: NotificationType;
  location: string;
  message: string;
  data?: any;
}

/**
 * Check if a notification should be sent based on user preferences
 */
export function shouldSendNotification(
  condition: WeatherCondition,
  preferences: NotificationPreferences
): boolean {
  if (!preferences.masterEnabled) {
    return false;
  }

  const { categories } = preferences;

  switch (condition.type) {
    case NotificationType.DAILY_FORECAST:
      return categories.dailyForecast;

    case NotificationType.SEVERE_WEATHER:
      return categories.severeWeather;

    case NotificationType.HIGH_TEMPERATURE:
      return (
        categories.temperatureThresholds.enabled &&
        condition.data?.temperature >= categories.temperatureThresholds.highThreshold
      );

    case NotificationType.LOW_TEMPERATURE:
      return (
        categories.temperatureThresholds.enabled &&
        condition.data?.temperature <= categories.temperatureThresholds.lowThreshold
      );

    case NotificationType.PRECIPITATION:
      return categories.precipitationAlerts;

    case NotificationType.UV_INDEX:
      return categories.uvIndexWarnings;

    default:
      return false;
  }
}

/**
 * Process weather data for a location and generate any required notifications
 */
export async function processWeatherNotifications(
  locationName: string,
  locationId: string,
  preferences: NotificationPreferences,
  temperatureUnit: 'C' | 'F'
): Promise<void> {
  try {
    // Skip if notifications are disabled
    if (!preferences.masterEnabled) {
      return;
    }

    // Fetch weather data
    const currentWeather = await getCurrentWeather(locationId);
    const forecast = await getForecast(locationId);

    const conditions: WeatherCondition[] = [];

    // Check for temperature thresholds
    if (
      preferences.categories.temperatureThresholds.enabled &&
      currentWeather?.current?.temp_c !== undefined &&
      currentWeather?.current?.temp_f !== undefined
    ) {
      const temp =
        temperatureUnit === 'C' ? currentWeather.current.temp_c : currentWeather.current.temp_f;

      const highThreshold = preferences.categories.temperatureThresholds.highThreshold;
      const lowThreshold = preferences.categories.temperatureThresholds.lowThreshold;

      // High temperature alert
      if (temp >= highThreshold) {
        conditions.push({
          type: NotificationType.HIGH_TEMPERATURE,
          location: locationName,
          message: `High temperature alert: Currently ${temp}°${temperatureUnit} in ${locationName}`,
          data: { temperature: temp },
        });
      }

      // Low temperature alert
      if (temp <= lowThreshold) {
        conditions.push({
          type: NotificationType.LOW_TEMPERATURE,
          location: locationName,
          message: `Low temperature alert: Currently ${temp}°${temperatureUnit} in ${locationName}`,
          data: { temperature: temp },
        });
      }
    }

    // Check for severe weather conditions
    if (
      preferences.categories.severeWeather &&
      forecast?.forecast?.forecastday?.[0]?.day?.condition?.text
    ) {
      const condition = forecast.forecast.forecastday[0].day.condition.text.toLowerCase();

      // List of severe weather keywords
      const severeWeatherKeywords = [
        'storm',
        'thunder',
        'hurricane',
        'tornado',
        'blizzard',
        'ice',
        'flood',
        'warning',
        'severe',
        'extreme',
      ];

      if (severeWeatherKeywords.some(keyword => condition.includes(keyword))) {
        conditions.push({
          type: NotificationType.SEVERE_WEATHER,
          location: locationName,
          message: `Severe weather alert: ${forecast.forecast.forecastday[0].day.condition.text} expected in ${locationName}`,
          data: { condition: forecast.forecast.forecastday[0].day.condition.text },
        });
      }
    }

    // Check for precipitation alerts
    if (
      preferences.categories.precipitationAlerts &&
      forecast?.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain
    ) {
      const rainChance = forecast.forecast.forecastday[0].day.daily_chance_of_rain;

      if (rainChance > 70) {
        conditions.push({
          type: NotificationType.PRECIPITATION,
          location: locationName,
          message: `Rain likely today in ${locationName} (${rainChance}% chance)`,
          data: { rainChance },
        });
      }
    }

    // Check for UV index warnings
    if (preferences.categories.uvIndexWarnings && currentWeather?.current?.uv !== undefined) {
      const uvIndex = currentWeather.current.uv;

      if (uvIndex >= 8) {
        conditions.push({
          type: NotificationType.UV_INDEX,
          location: locationName,
          message: `High UV alert: UV index of ${uvIndex} in ${locationName}`,
          data: { uvIndex },
        });
      }
    }

    // Send notifications for applicable conditions
    conditions.forEach(condition => {
      if (shouldSendNotification(condition, preferences)) {
        showWeatherNotification({
          title: `Weather Alert: ${locationName}`,
          body: condition.message,
          tag: `weather-${condition.type}-${locationName}`,
          requireInteraction: condition.type === NotificationType.SEVERE_WEATHER,
          data: {
            type: condition.type,
            location: locationName,
            ...condition.data,
          },
        });
      }
    });
  } catch (error) {
    console.error('Error processing weather notifications:', error);
  }
}

/**
 * Process daily forecast notifications
 */
export async function processDailyForecastNotifications(
  locationName: string,
  locationId: string,
  preferences: NotificationPreferences
): Promise<void> {
  try {
    // Skip if notifications or daily forecasts are disabled
    if (!preferences.masterEnabled || !preferences.categories.dailyForecast) {
      return;
    }

    // Fetch forecast data
    const forecast = await getForecast(locationId);

    if (forecast?.forecast?.forecastday?.[0]?.day) {
      const today = forecast.forecast.forecastday[0].day;

      showWeatherNotification({
        title: `Daily Forecast: ${locationName}`,
        body: `Today: ${today.condition.text}, High: ${today.maxtemp_c}°C (${today.maxtemp_f}°F), Low: ${today.mintemp_c}°C (${today.mintemp_f}°F)`,
        tag: `daily-forecast-${locationName}`,
        data: {
          type: NotificationType.DAILY_FORECAST,
          location: locationName,
        },
      });
    }
  } catch (error) {
    console.error('Error processing daily forecast notifications:', error);
  }
}
