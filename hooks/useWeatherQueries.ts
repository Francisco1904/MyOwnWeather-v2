'use client';

import { useQuery, useQueries } from '@tanstack/react-query';
import { useCallback, useState, useEffect } from 'react';
import weatherService, { CurrentWeather, ForecastWeather } from '@/lib/services/weatherApi';
import { FavoriteLocation } from '@/hooks/useFavorites';

// Keys for React Query cache
export const weatherKeys = {
  all: ['weather'] as const,
  current: (location: string) => [...weatherKeys.all, 'current', location] as const,
  forecast: (location: string, days: number) =>
    [...weatherKeys.all, 'forecast', location, days] as const,
  search: (query: string) => [...weatherKeys.all, 'search', query] as const,
  favorites: (locations: FavoriteLocation[]) => [...weatherKeys.all, 'favorites'] as const,
};

// Hook for fetching current weather
export function useCurrentWeather(location: string) {
  return useQuery({
    queryKey: weatherKeys.current(location),
    queryFn: () => weatherService.getCurrentWeather(location),
    enabled: !!location,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for fetching weather forecast
export function useForecast(location: string, days: number = 3) {
  return useQuery({
    queryKey: weatherKeys.forecast(location, days),
    queryFn: () => weatherService.getForecast(location, days),
    enabled: !!location,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Hook for searching locations
export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: weatherKeys.search(query),
    queryFn: () => weatherService.searchLocations(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Hook for getting user's geolocation
export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getUserLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Check for geolocation support inside the effect
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          setUserLocation(locationString);
          setIsLoading(false);
        },
        geoError => {
          console.error('Geolocation error:', geoError);
          setError(new Error('Unable to retrieve your location'));
          setIsLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      // Handle case when geolocation is not supported
      setError(new Error('Geolocation is not supported by your browser'));
      setIsLoading(false);
    }
  }, []);

  // Only run geolocation on client-side
  useEffect(() => {
    // This condition won't affect hook execution order
    if (typeof window !== 'undefined') {
      getUserLocation();
    }
  }, [getUserLocation]);

  return {
    userLocation,
    isLoading,
    error,
    getUserLocation,
  };
}

// Hook for combined current weather and forecast
export function useWeatherData(location?: string) {
  const defaultLocation = process.env.NEXT_PUBLIC_DEFAULT_LOCATION || 'London';

  // Always call useUserLocation no matter what, to maintain hook call order
  const { userLocation, isLoading: isLoadingLocation } = useUserLocation();

  // Determine the location to use, with a priority order
  // This computation doesn't affect hook call order
  const queryLocation = location || userLocation || defaultLocation;

  // Always call these hooks with the computed location
  const currentWeatherQuery = useCurrentWeather(queryLocation);
  const forecastQuery = useForecast(queryLocation, 5);

  return {
    currentWeather: currentWeatherQuery.data,
    forecast: forecastQuery.data,
    isLoading: currentWeatherQuery.isLoading || forecastQuery.isLoading || isLoadingLocation,
    isError: currentWeatherQuery.isError || forecastQuery.isError,
    error: currentWeatherQuery.error || forecastQuery.error,
    refetch: () => {
      currentWeatherQuery.refetch();
      forecastQuery.refetch();
    },
    userLocation,
  };
}

// Hook for fetching weather data for multiple favorite locations
export function useFavoritesWeather(favorites: FavoriteLocation[]) {
  const queries = useQueries({
    queries: favorites.map(favorite => ({
      queryKey: weatherKeys.current(`${favorite.lat},${favorite.lon}`),
      queryFn: () => weatherService.getCurrentWeather(`${favorite.lat},${favorite.lon}`),
      staleTime: 1000 * 60 * 10, // 10 minutes
    })),
    combine: results => {
      return {
        data: results.map((result, index) => ({
          location: favorites[index],
          weatherData: result.data || null,
          isLoading: result.isLoading,
          error: result.error,
        })),
        isLoading: results.some(result => result.isLoading),
        isError: results.some(result => result.isError),
      };
    },
  });

  return queries;
}
