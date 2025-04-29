# Weather App API Rate Limiting Documentation

This document explains the API rate limiting implementation in the Weather App.

## Overview

The Weather App implements a sophisticated rate limiting system to ensure reliable API consumption and prevent hitting third-party API rate limits. This implementation uses the token bucket algorithm, request caching, priority queuing, and exponential backoff retry mechanism.

## Key Features

1. **Token Bucket Algorithm**: Controls the rate of API requests
2. **Response Caching**: Reduces redundant API calls
3. **Request Prioritization**: Critical requests get priority
4. **Request Queuing**: Gracefully handles bursts of requests
5. **Exponential Backoff**: Smart retries when rate limits are hit
6. **Cache Invalidation**: Force refresh when needed

## Technical Implementation

### Token Bucket Algorithm

The token bucket algorithm is a well-established rate limiting approach that offers a balance between limiting average request rates while allowing for reasonable request bursts.

- A "bucket" holds tokens (representing permission to make API requests)
- Tokens regenerate at a fixed rate (e.g., 1 token per second)
- Each API request consumes one token
- If the bucket is empty, requests wait or queue based on priority

Configuration parameters:

```typescript
const defaultRateLimitConfig: RateLimitConfig = {
  burstCapacity: 10, // Allow bursts of up to 10 requests
  refillRate: 1, // Add 1 token per second
  refillInterval: 1000, // Refill every second
  maxRetries: 3, // Maximum of 3 retries for rate-limited requests
  initialBackoff: 1000, // Start with 1 second backoff
  maxBackoff: 30000, // Maximum backoff of 30 seconds
  cacheTime: 5 * 60 * 1000, // Cache responses for 5 minutes
};
```

### Request Prioritization

Requests are assigned priorities:

- `high`: Critical requests that should proceed ASAP (weather data)
- `normal`: Important but can be queued (location search)
- `low`: Background tasks that can wait

High-priority requests will block and wait for an available token, while normal and low-priority requests will be queued for processing when tokens become available.

### Response Caching

The system caches API responses to:

- Reduce API usage
- Improve app responsiveness
- Provide data when offline

Cached data expires after a configurable time period (default: 5 minutes). The cache key is based on the endpoint and request parameters.

### Exponential Backoff Retry

When rate limit errors occur (HTTP 429), the system:

1. Waits using an exponential backoff algorithm (wait time doubles with each retry)
2. Adds jitter (random variation) to prevent thundering herd problem
3. Retries up to a configured maximum number of attempts

The backoff formula is:

```
backoff = min(initialBackoff * 2^attempt, maxBackoff) + jitter
```

## Usage Examples

### Basic API Call

Normal API calls work just like before:

```typescript
// Get current weather
const weather = await weatherService.getCurrentWeather('London');

// Get forecast
const forecast = await weatherService.getForecast('Paris', 5);
```

### Force Refresh

To bypass the cache:

```typescript
// Force refresh current weather data
const freshWeather = await weatherService.refreshData('current', 'London');
```

### Check Rate Limit Status

To check if we're currently rate limited:

```typescript
if (weatherService.isRateLimited()) {
  // Show message to user that we're temporarily rate limited
  showNotification('Too many requests, please wait a moment...');
}
```

## Best Practices

1. **Prioritize Critical Requests**: Set appropriate priorities
2. **Use Cached Data When Possible**: For non-critical updates
3. **Provide User Feedback**: Inform users when hitting limits
4. **Consider Weather Update Frequency**: Weather doesn't change by the second; responsible polling reduces API usage

## Monitoring and Tuning

The rate limiting parameters can be adjusted based on:

- Observed API usage patterns
- Weather API provider limits
- Application requirements

Key values to consider tuning:

- `burstCapacity`: Higher for more immediate requests in bursts
- `refillRate`: Adjust based on API provider limits
- `cacheTime`: Shorter for more frequent updates, longer for lower traffic

## Technical Details

The implementation uses:

- TypeScript for type safety
- Singleton pattern for global rate limiter
- Promise-based API for async handling
- Cache with TTL (time-to-live)
- Generic types for flexibility

## Future Improvements

Potential future enhancements:

- Persistent caching (localStorage/IndexedDB)
- Dynamic rate adjustments based on response headers
- More sophisticated priority management
- Request batching for related data
