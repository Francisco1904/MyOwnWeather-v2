# Testing the Rate Limiting Implementation

This document provides guidance on how to manually test and verify the rate limiting implementation in the Weather App.

## Overview

The Weather API Service incorporates several rate limiting features:

1. Token bucket algorithm for regulating API requests
2. Response caching to minimize redundant calls
3. Request prioritization and queuing
4. Exponential backoff retry mechanism
5. User interface for rate limit notifications

## Manual Testing Steps

### 1. Testing Cache Functionality

1. Open the Network tab in your browser's Developer Tools
2. Navigate to the home page of the Weather App
3. Observe the API requests made for weather data
4. Refresh the page and observe that no new API calls are made for the same location
5. Wait 5 minutes (cache expiry time) and refresh again to see new API calls

### 2. Testing Rate Limit Handling

1. Modify the rate limiting configuration temporarily (in `lib/services/weatherApi.ts`):

   ```typescript
   const defaultRateLimitConfig: RateLimitConfig = {
     burstCapacity: 3,         // Reduce to 3 for testing
     refillRate: 0.2,          // Slow refill rate (1 token per 5 seconds)
     ...
   };
   ```

2. Reload the application
3. Rapidly perform multiple searches or location changes
4. Observe the rate limit banner appearing when tokens are exhausted
5. Watch the "Try now" button behavior when clicked during rate limiting

### 3. Testing Priority Handling

1. With the reduced token configuration above:
2. Click "Refresh" on the current weather (high priority) while searching locations (normal priority)
3. Observe that current weather refresh completes despite rate limiting
4. Notice location searches being queued

### 4. Testing Exponential Backoff

1. To test this, you'll need to simulate a 429 response:
2. Temporarily mock the weatherApi.ts to simulate a 429 error:
   ```typescript
   // Add this mock in a development-only test file
   mockAxiosGet.mockRejectedValueOnce({ response: { status: 429 } }).mockResolvedValueOnce({
     data: {
       /* weather data */
     },
   });
   ```
3. Observe in console logs that retries happen with increasing delays

## Expected Behaviors

1. **Cache Working Correctly If**:

   - Subsequent identical requests don't trigger network calls within cache time
   - API calls resume after cache expiration

2. **Rate Limiting Working Correctly If**:

   - Banner appears when rapid requests exhaust tokens
   - High priority requests still complete during rate limiting
   - Normal/low priority requests queue and complete when tokens become available

3. **Retry Logic Working Correctly If**:
   - After a 429 response, the request is retried
   - Console shows increasing backoff times between retries

## UI Component Testing

The `RateLimitBanner` component should:

1. Only appear when rate limiting is active
2. Show a "Try now" button that attempts to refresh data
3. Indicate when a refresh attempt is in progress
4. Automatically disappear when rate limiting ends

## Restoration

After testing, remember to restore the original rate limit configuration:

```typescript
const defaultRateLimitConfig: RateLimitConfig = {
  burstCapacity: 10,         // Back to 10
  refillRate: 1,             // Back to 1 per second
  ...
};
```
