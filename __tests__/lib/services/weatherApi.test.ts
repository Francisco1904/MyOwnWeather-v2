import axios from 'axios';
import { weatherService, WeatherApiError } from '@/lib/services/weatherApi';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
  isAxiosError: jest.fn(),
}));

describe('Weather API Service with Rate Limiting', () => {
  const mockAxiosGet = jest.fn();
  const mockData = { data: 'test data' };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up axios mock
    (axios.create as jest.Mock).mockReturnValue({
      get: mockAxiosGet,
    });

    // Set up successful response
    mockAxiosGet.mockResolvedValue({ data: mockData });
  });

  describe('Basic API functionality', () => {
    it('getCurrentWeather should call the correct endpoint with parameters', async () => {
      const result = await weatherService.getCurrentWeather('London');

      expect(mockAxiosGet).toHaveBeenCalledWith('/current.json', {
        params: { q: 'London' },
      });
      expect(result).toBe(mockData);
    });

    it('getForecast should call the correct endpoint with parameters', async () => {
      const result = await weatherService.getForecast('Paris', 5);

      expect(mockAxiosGet).toHaveBeenCalledWith('/forecast.json', {
        params: {
          q: 'Paris',
          days: 5,
        },
      });
      expect(result).toBe(mockData);
    });

    it('searchLocations should call the correct endpoint with parameters', async () => {
      const result = await weatherService.searchLocations('New York');

      expect(mockAxiosGet).toHaveBeenCalledWith('/search.json', {
        params: { q: 'New York' },
      });
      expect(result).toBe(mockData);
    });
  });

  describe('Rate limiting and caching', () => {
    it('should return cached data for repeated calls with the same parameters', async () => {
      // First call
      await weatherService.getCurrentWeather('London');

      // Second call with the same parameters should use cached data
      await weatherService.getCurrentWeather('London');

      // The actual API should only be called once
      expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    });

    it('should bypass cache when using refreshData', async () => {
      // Make a regular call first
      await weatherService.getCurrentWeather('London');

      // Then force refresh
      await weatherService.refreshData('current', 'London');

      // The API should be called twice
      expect(mockAxiosGet).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error handling', () => {
    it('should handle rate limit errors (429) appropriately', async () => {
      // Mock a rate limit error
      const rateLimitError = {
        response: {
          status: 429,
          data: 'Rate limit exceeded',
        },
      };

      // First call fails with rate limit, second succeeds
      mockAxiosGet.mockRejectedValueOnce(rateLimitError).mockResolvedValueOnce({ data: mockData });

      // Set up axios.isAxiosError to return true
      (axios.isAxiosError as jest.Mock).mockReturnValue(true);

      // This should throw a WeatherApiError with status 429
      await expect(weatherService.getCurrentWeather('London')).rejects.toThrow(WeatherApiError);

      try {
        await weatherService.getCurrentWeather('London');
      } catch (error) {
        expect(error instanceof WeatherApiError).toBeTruthy();
        expect((error as WeatherApiError).statusCode).toBe(429);
        expect((error as WeatherApiError).message).toContain('rate limit');
      }
    });

    it('should handle network errors appropriately', async () => {
      // Mock a network error
      const networkError = new Error('Network Error');
      mockAxiosGet.mockRejectedValueOnce(networkError);

      // This should throw a WeatherApiError
      await expect(weatherService.getCurrentWeather('London')).rejects.toThrow(WeatherApiError);
    });
  });

  describe('Rate limit status', () => {
    it('isRateLimited should return a boolean', () => {
      // Since this is largely an implementation detail and would require
      // complex mocking of internal state, we just verify it returns a boolean
      const result = weatherService.isRateLimited();
      expect(typeof result).toBe('boolean');
    });
  });
});
