import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Custom API error class
export class WeatherApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Rate limiting configuration
 * Implements token bucket algorithm
 */
interface RateLimitConfig {
  burstCapacity: number; // Maximum number of tokens in the bucket
  refillRate: number; // Tokens added per second
  refillInterval: number; // How often to refill (in ms)
  maxRetries: number; // Maximum number of retries for rate-limited requests
  initialBackoff: number; // Initial backoff in ms
  maxBackoff: number; // Maximum backoff in ms
  cacheTime: number; // How long to cache responses (in ms)
}

/**
 * Default rate limiting configuration
 * Designed to respect the WeatherAPI.com free tier limits
 */
const defaultRateLimitConfig: RateLimitConfig = {
  burstCapacity: 10, // Allow bursts of up to 10 requests
  refillRate: 1, // Add 1 token per second (conservative for free tier)
  refillInterval: 1000, // Refill every second
  maxRetries: 3, // Maximum of 3 retries for rate-limited requests
  initialBackoff: 1000, // Start with 1 second backoff
  maxBackoff: 30000, // Maximum backoff of 30 seconds
  cacheTime: 5 * 60 * 1000, // Cache responses for 5 minutes
};

/**
 * Rate limiter using token bucket algorithm
 */
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private queue: Array<() => void> = [];
  private requestMap = new Map<string, number>();
  private responseCache = new Map<string, { data: any; timestamp: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = defaultRateLimitConfig) {
    this.tokens = config.burstCapacity;
    this.lastRefill = Date.now();
    this.config = config;

    // Start the token refill interval
    setInterval(() => this.refillTokens(), this.config.refillInterval);
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;

    this.tokens = Math.min(
      this.config.burstCapacity,
      this.tokens + elapsedSeconds * this.config.refillRate
    );

    this.lastRefill = now;

    // Process any queued requests if we have tokens available
    this.processQueue();
  }

  /**
   * Process queued requests if tokens are available
   */
  private processQueue(): void {
    while (this.queue.length > 0 && this.tokens >= 1) {
      const callback = this.queue.shift();
      if (callback) {
        this.tokens -= 1;
        callback();
      }
    }
  }

  /**
   * Generates a cache key for a request
   */
  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  /**
   * Check if we have a cached response
   */
  getCachedResponse<T>(endpoint: string, params: Record<string, any>): T | null {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.responseCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.config.cacheTime) {
      return cached.data as T;
    }

    return null;
  }

  /**
   * Cache a response
   */
  cacheResponse<T>(endpoint: string, params: Record<string, any>, data: T): void {
    const cacheKey = this.getCacheKey(endpoint, params);
    this.responseCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  /**
   * Calculate backoff time using exponential backoff with jitter
   */
  private calculateBackoff(attempt: number): number {
    // Exponential backoff formula: initialBackoff * 2^attempt
    const backoff = Math.min(
      this.config.initialBackoff * Math.pow(2, attempt),
      this.config.maxBackoff
    );

    // Add jitter (±20%) to prevent thundering herd problem
    const jitter = backoff * 0.2;
    return backoff + (Math.random() * jitter * 2 - jitter);
  }

  /**
   * Execute a request with rate limiting
   */
  async executeRequest<T>(
    endpoint: string,
    requestFn: () => Promise<T>,
    params: Record<string, any> = {},
    options: {
      bypassCache?: boolean;
      priority?: 'high' | 'normal' | 'low';
    } = {}
  ): Promise<T> {
    const { bypassCache = false, priority = 'normal' } = options;

    // Check cache first unless bypassing
    if (!bypassCache) {
      const cachedResponse = this.getCachedResponse<T>(endpoint, params);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Helper function to wait
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Track rate limit state for this endpoint
    const endpointKey = endpoint.split('?')[0];
    const now = Date.now();

    // Clear old request timestamps (basic cleanup)
    if (now % 10000 < 100) {
      // Randomly clean up about every 10 seconds
      for (const [key, timestamp] of this.requestMap.entries()) {
        if (now - timestamp > 60000) {
          // Remove entries older than 1 minute
          this.requestMap.delete(key);
        }
      }
    }

    // Execute the request with retries and backoff
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      // Apply backoff for retry attempts
      if (attempt > 0) {
        const backoffTime = this.calculateBackoff(attempt - 1);
        await wait(backoffTime);
      }

      try {
        // Wait for a token if we're out
        if (this.tokens < 1) {
          // For high priority requests, wait for a token
          if (priority === 'high') {
            while (this.tokens < 1) {
              await wait(100); // Check every 100ms
            }
          } else {
            // For normal/low priority, queue the request
            const requestPromise = new Promise<T>((resolve, reject) => {
              this.queue.push(() => {
                requestFn()
                  .then(response => {
                    // Cache successful responses
                    this.cacheResponse(endpoint, params, response);
                    resolve(response);
                  })
                  .catch(reject);
              });
            });

            return requestPromise;
          }
        }

        // Take a token for this request
        this.tokens -= 1;

        // Record this request
        this.requestMap.set(endpointKey, now);

        // Execute the request
        const response = await requestFn();

        // Cache successful responses
        this.cacheResponse(endpoint, params, response);

        return response;
      } catch (error) {
        // If this is a rate limit error (429), retry with backoff
        if (error instanceof WeatherApiError && error.statusCode === 429) {
          if (attempt === this.config.maxRetries) {
            throw error; // We've exhausted our retries
          }
          // Otherwise continue to next retry attempt
          continue;
        }

        // For other errors, throw immediately
        throw error;
      }
    }

    // This line should never be reached
    throw new Error('Unexpected error in rate limiter');
  }
}

// Create a single instance of the rate limiter
const rateLimiter = new RateLimiter();

// Base API configuration
const weatherApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEATHER_API_URL,
  params: {
    key: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
  },
});

// Error handling helper
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;

    // Handle specific error status codes
    if (status === 401) {
      throw new WeatherApiError('Invalid API key or unauthorized access', 401);
    } else if (status === 404) {
      throw new WeatherApiError('Location not found', 404);
    } else if (status === 429) {
      throw new WeatherApiError('API rate limit exceeded. Please try again later', 429);
    } else if (status && status >= 500) {
      throw new WeatherApiError('Weather service is currently unavailable', status);
    } else if (axiosError.code === 'ECONNABORTED') {
      throw new WeatherApiError('Request timed out. Please try again', 408);
    } else if (!navigator.onLine || axiosError.message.includes('Network Error')) {
      throw new WeatherApiError('No internet connection. Please check your network', 0);
    }

    // Generic error with status code if available
    const errorMessage = axiosError.response?.data
      ? typeof axiosError.response.data === 'string'
        ? axiosError.response.data
        : JSON.stringify(axiosError.response.data)
      : 'Failed to fetch weather data';

    throw new WeatherApiError(errorMessage, status);
  }

  // For non-Axios errors
  if (error instanceof Error) {
    throw new WeatherApiError(error.message);
  }

  // Unknown errors
  throw new WeatherApiError('An unexpected error occurred');
};

// Types
export interface CurrentWeather {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    precip_mm: number;
    precip_in: number;
    uv: number;
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    uv: number;
    maxwind_kph: number;
    maxwind_mph: number;
    avghumidity: number;
    totalprecip_mm: number;
    totalprecip_in: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: Array<{
    time: string;
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    chance_of_rain: number;
    chance_of_snow: number;
  }>;
}

export interface ForecastWeather extends CurrentWeather {
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastData {
  forecast: {
    forecastday: Array<{
      hour: HourlyForecast[];
    }>;
  };
}

export interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  chance_of_rain: number;
}

/**
 * Enhanced Weather Service with rate limiting
 * This service maintains the same API interface as the original,
 * but adds rate limiting, caching, and retry capabilities.
 */
export const weatherService = {
  /**
   * Get current weather for a location
   */
  getCurrentWeather: async (query: string): Promise<CurrentWeather> => {
    try {
      return await rateLimiter.executeRequest<CurrentWeather>(
        '/current.json',
        async () => {
          const response = await weatherApi.get('/current.json', {
            params: { q: query },
          });
          return response.data;
        },
        { q: query },
        { priority: 'high' } // Current weather is high priority
      );
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return handleApiError(error);
    }
  },

  /**
   * Get weather forecast for a location
   * @param query Location (city name, lat/lon coordinates, postal code)
   * @param days Number of forecast days (1-10)
   */
  getForecast: async (query: string, days = 3): Promise<ForecastWeather> => {
    try {
      return await rateLimiter.executeRequest<ForecastWeather>(
        '/forecast.json',
        async () => {
          const response = await weatherApi.get('/forecast.json', {
            params: {
              q: query,
              days,
            },
          });
          return response.data;
        },
        { q: query, days },
        { priority: 'high' } // Forecast is also high priority
      );
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return handleApiError(error);
    }
  },

  /**
   * Search for locations
   * @param query Location search term
   */
  searchLocations: async (query: string) => {
    try {
      return await rateLimiter.executeRequest(
        '/search.json',
        async () => {
          const response = await weatherApi.get('/search.json', {
            params: { q: query },
          });
          return response.data;
        },
        { q: query },
        { priority: 'normal' } // Location search is normal priority
      );
    } catch (error) {
      console.error('Error searching locations:', error);
      return handleApiError(error);
    }
  },

  /**
   * Force refresh of a cached response
   * @param endpoint API endpoint
   * @param params Request parameters
   */
  refreshData: async <T>(
    endpoint: 'current' | 'forecast' | 'search',
    query: string,
    days?: number
  ): Promise<T> => {
    try {
      let apiEndpoint = '';
      let params: Record<string, any> = { q: query };

      switch (endpoint) {
        case 'current':
          apiEndpoint = '/current.json';
          break;
        case 'forecast':
          apiEndpoint = '/forecast.json';
          params.days = days || 3;
          break;
        case 'search':
          apiEndpoint = '/search.json';
          break;
      }

      return await rateLimiter.executeRequest<T>(
        apiEndpoint,
        async () => {
          const response = await weatherApi.get(apiEndpoint, { params });
          return response.data;
        },
        params,
        { bypassCache: true, priority: 'high' }
      );
    } catch (error) {
      console.error(`Error refreshing ${endpoint} data:`, error);
      return handleApiError(error);
    }
  },

  /**
   * Check if we're currently rate limited
   */
  isRateLimited: (): boolean => {
    // A simple proxy method to check if we have tokens available
    // This could be expanded to provide more detailed rate limit info
    return rateLimiter['tokens'] < 1;
  },
};

export default weatherService;
