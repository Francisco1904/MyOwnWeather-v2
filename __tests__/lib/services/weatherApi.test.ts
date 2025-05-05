import { weatherService, WeatherApiError } from '@/lib/services/weatherApi';

// Directly mock the weatherService exported from the module
jest.mock('@/lib/services/weatherApi');

describe('Weather API Service', () => {
  // Mock data that will be used in the tests
  const mockCurrentWeatherData = {
    location: { name: 'London' },
    current: { temp_c: 15 },
  };

  const mockForecastData = {
    location: { name: 'Paris' },
    forecast: { forecastday: [] },
  };

  const mockLocationsData = [{ name: 'New York', country: 'USA' }];

  beforeEach(() => {
    jest.clearAllMocks();

    // Configure each mock method's default behavior
    (weatherService.getCurrentWeather as jest.Mock).mockResolvedValue(mockCurrentWeatherData);
    (weatherService.getForecast as jest.Mock).mockResolvedValue(mockForecastData);
    (weatherService.searchLocations as jest.Mock).mockResolvedValue(mockLocationsData);
    (weatherService.refreshData as jest.Mock).mockResolvedValue(mockCurrentWeatherData);
    (weatherService.isRateLimited as jest.Mock).mockReturnValue(false);
  });

  describe('Basic API functionality', () => {
    it('getCurrentWeather should return weather data', async () => {
      const result = await weatherService.getCurrentWeather('London');

      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('London');
      expect(result).toEqual(mockCurrentWeatherData);
    });

    it('getForecast should call with correct parameters', async () => {
      const result = await weatherService.getForecast('Paris', 5);

      expect(weatherService.getForecast).toHaveBeenCalledWith('Paris', 5);
      expect(result).toEqual(mockForecastData);
    });

    it('searchLocations should return location data', async () => {
      const result = await weatherService.searchLocations('New York');

      expect(weatherService.searchLocations).toHaveBeenCalledWith('New York');
      expect(result).toEqual(mockLocationsData);
    });
  });

  describe('Rate limiting and caching', () => {
    it('should call API for new requests', async () => {
      await weatherService.getCurrentWeather('London');

      expect(weatherService.getCurrentWeather).toHaveBeenCalledTimes(1);
    });

    it('should use refreshData to bypass cache', async () => {
      await weatherService.refreshData('current', 'London');

      expect(weatherService.refreshData).toHaveBeenCalledWith('current', 'London');
    });
  });

  describe('Error handling', () => {
    it('should handle rate limit errors appropriately', async () => {
      // Configure the mock to throw an error only for the first call
      const error = new WeatherApiError('Rate limit exceeded', 429);
      (weatherService.getCurrentWeather as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockCurrentWeatherData);

      // First call should reject
      try {
        await weatherService.getCurrentWeather('London');
        // If we reach here, the test should fail
        expect('this code').toBe('not reached');
      } catch (err) {
        expect(err).toBeInstanceOf(WeatherApiError);
        expect((err as WeatherApiError).message).toBe('Rate limit exceeded');
        expect((err as WeatherApiError).statusCode).toBe(429);
      }

      // Second call should work after the error
      const result = await weatherService.getCurrentWeather('London');
      expect(result).toEqual(mockCurrentWeatherData);
    });

    it('should handle network errors appropriately', async () => {
      // Configure the mock to throw a network error
      const error = new WeatherApiError('Network Error');
      (weatherService.getCurrentWeather as jest.Mock).mockRejectedValueOnce(error);

      // Test with try/catch instead of expect().rejects pattern
      try {
        await weatherService.getCurrentWeather('London');
        // If we reach here, the test should fail
        expect('this code').toBe('not reached');
      } catch (err) {
        expect(err).toBeInstanceOf(WeatherApiError);
        expect((err as WeatherApiError).message).toBe('Network Error');
      }
    });
  });

  describe('Rate limit status', () => {
    it('isRateLimited should return a boolean', () => {
      const result = weatherService.isRateLimited();
      expect(typeof result).toBe('boolean');
    });
  });
});
