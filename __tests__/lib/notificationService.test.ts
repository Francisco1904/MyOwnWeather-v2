import {
  NotificationType,
  shouldSendNotification,
  processWeatherNotifications,
  processDailyForecastNotifications,
} from '@/lib/notificationService';
import { showWeatherNotification } from '@/lib/notifications';
import { getCurrentWeather, getForecast } from '@/lib/api';

// Mock dependencies
jest.mock('@/lib/notifications', () => ({
  showWeatherNotification: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  getCurrentWeather: jest.fn(),
  getForecast: jest.fn(),
}));

describe('Notification Service', () => {
  const mockPreferences = {
    masterEnabled: true,
    categories: {
      dailyForecast: true,
      severeWeather: true,
      temperatureThresholds: {
        enabled: true,
        highThreshold: 90,
        lowThreshold: 30,
      },
      precipitationAlerts: true,
      uvIndexWarnings: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shouldSendNotification', () => {
    it('returns false if master toggle is disabled', () => {
      const result = shouldSendNotification(
        { type: NotificationType.DAILY_FORECAST, location: 'Test', message: 'Test Message' },
        { ...mockPreferences, masterEnabled: false }
      );

      expect(result).toBe(false);
    });

    it('returns true for enabled daily forecast notifications', () => {
      const result = shouldSendNotification(
        { type: NotificationType.DAILY_FORECAST, location: 'Test', message: 'Test Message' },
        mockPreferences
      );

      expect(result).toBe(true);
    });

    it('returns false for disabled daily forecast notifications', () => {
      const result = shouldSendNotification(
        { type: NotificationType.DAILY_FORECAST, location: 'Test', message: 'Test Message' },
        {
          ...mockPreferences,
          categories: { ...mockPreferences.categories, dailyForecast: false },
        }
      );

      expect(result).toBe(false);
    });

    it('correctly handles high temperature notification with threshold', () => {
      // Temperature above threshold should return true
      const resultAbove = shouldSendNotification(
        {
          type: NotificationType.HIGH_TEMPERATURE,
          location: 'Test',
          message: 'High Temp',
          data: { temperature: 95 },
        },
        mockPreferences
      );

      expect(resultAbove).toBe(true);

      // Temperature below threshold should return false
      const resultBelow = shouldSendNotification(
        {
          type: NotificationType.HIGH_TEMPERATURE,
          location: 'Test',
          message: 'High Temp',
          data: { temperature: 85 },
        },
        mockPreferences
      );

      expect(resultBelow).toBe(false);
    });
  });

  describe('processWeatherNotifications', () => {
    beforeEach(() => {
      // Mock weather data
      (getCurrentWeather as jest.Mock).mockResolvedValue({
        current: {
          temp_c: 35,
          temp_f: 95,
          uv: 9,
        },
      });

      (getForecast as jest.Mock).mockResolvedValue({
        forecast: {
          forecastday: [
            {
              day: {
                condition: {
                  text: 'Severe thunderstorm',
                },
                daily_chance_of_rain: 80,
              },
            },
          ],
        },
      });
    });

    it('skips processing if notifications are disabled', async () => {
      await processWeatherNotifications(
        'London',
        'london-123',
        { ...mockPreferences, masterEnabled: false },
        'C'
      );

      expect(getCurrentWeather).not.toHaveBeenCalled();
      expect(getForecast).not.toHaveBeenCalled();
      expect(showWeatherNotification).not.toHaveBeenCalled();
    });

    it('generates high temperature notification when appropriate', async () => {
      await processWeatherNotifications('London', 'london-123', mockPreferences, 'F');

      expect(getCurrentWeather).toHaveBeenCalledWith('london-123');
      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Weather Alert'),
          body: expect.stringContaining('High temperature'),
          tag: expect.stringContaining('high_temperature'),
        })
      );
    });

    it('generates severe weather notification when appropriate', async () => {
      await processWeatherNotifications('London', 'london-123', mockPreferences, 'C');

      expect(getForecast).toHaveBeenCalledWith('london-123');
      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Weather Alert'),
          body: expect.stringContaining('Severe'),
          tag: expect.stringContaining('severe_weather'),
          requireInteraction: true,
        })
      );
    });

    it('generates precipitation alert when appropriate', async () => {
      await processWeatherNotifications('London', 'london-123', mockPreferences, 'C');

      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Weather Alert'),
          body: expect.stringContaining('Rain likely'),
          tag: expect.stringContaining('precipitation'),
        })
      );
    });

    it('generates UV index warning when appropriate', async () => {
      await processWeatherNotifications('London', 'london-123', mockPreferences, 'C');

      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Weather Alert'),
          body: expect.stringContaining('High UV'),
          tag: expect.stringContaining('uv_index'),
        })
      );
    });

    it('handles API errors gracefully', async () => {
      (getCurrentWeather as jest.Mock).mockRejectedValue(new Error('API error'));
      (getForecast as jest.Mock).mockRejectedValue(new Error('API error'));

      await processWeatherNotifications('London', 'london-123', mockPreferences, 'C');

      // Should not throw and the function should complete
      expect(showWeatherNotification).not.toHaveBeenCalled();
    });
  });

  describe('processDailyForecastNotifications', () => {
    beforeEach(() => {
      (getForecast as jest.Mock).mockResolvedValue({
        forecast: {
          forecastday: [
            {
              day: {
                condition: {
                  text: 'Sunny',
                },
                maxtemp_c: 25,
                maxtemp_f: 77,
                mintemp_c: 15,
                mintemp_f: 59,
              },
            },
          ],
        },
      });
    });

    it('skips processing if notifications are disabled', async () => {
      await processDailyForecastNotifications('London', 'london-123', {
        ...mockPreferences,
        masterEnabled: false,
      });

      expect(getForecast).not.toHaveBeenCalled();
      expect(showWeatherNotification).not.toHaveBeenCalled();
    });

    it('skips processing if daily forecast notifications are disabled', async () => {
      await processDailyForecastNotifications('London', 'london-123', {
        ...mockPreferences,
        categories: { ...mockPreferences.categories, dailyForecast: false },
      });

      expect(getForecast).not.toHaveBeenCalled();
      expect(showWeatherNotification).not.toHaveBeenCalled();
    });

    it('sends daily forecast notification when enabled', async () => {
      await processDailyForecastNotifications('London', 'london-123', mockPreferences);

      expect(getForecast).toHaveBeenCalledWith('london-123');
      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Daily Forecast'),
          body: expect.stringContaining('Sunny'),
          tag: expect.stringContaining('daily-forecast'),
        })
      );
    });

    it('handles API errors gracefully', async () => {
      (getForecast as jest.Mock).mockRejectedValue(new Error('API error'));

      await processDailyForecastNotifications('London', 'london-123', mockPreferences);

      // Should not throw and the function should complete
      expect(showWeatherNotification).not.toHaveBeenCalled();
    });
  });
});
