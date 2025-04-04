import { useState, useEffect, useCallback } from 'react';
import weatherService, { CurrentWeather, ForecastData } from '@/lib/services/weatherApi';

interface WeatherState {
  currentWeather: CurrentWeather | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: Error | null;
  location: string;
}

export function useWeather(initialLocation?: string) {
  const defaultLocation = process.env.NEXT_PUBLIC_DEFAULT_LOCATION || 'London';
  const [state, setState] = useState<WeatherState>({
    currentWeather: null,
    forecast: null,
    isLoading: true,
    error: null,
    location: initialLocation || defaultLocation,
  });

  const fetchWeather = useCallback(async (location: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch both current weather and forecast data
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location, 5), // 5-day forecast
      ]);

      setState({
        currentWeather: currentData,
        forecast: forecastData,
        isLoading: false,
        error: null,
        location,
      });
    } catch (error) {
      console.error('Error in useWeather hook:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch weather data'),
      }));
    }
  }, []);

  // Try to get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      setState(prev => ({ ...prev, isLoading: true }));

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          fetchWeather(locationString);
        },
        error => {
          console.error('Geolocation error:', error);
          // Fall back to default location
          fetchWeather(state.location);
        }
      );
    } else {
      // Geolocation not supported, use default location
      fetchWeather(state.location);
    }
  }, [fetchWeather, state.location]);

  // Fetch weather for a specific location
  const setLocation = useCallback(
    (newLocation: string) => {
      // Only fetch if the location has actually changed
      if (newLocation !== state.location) {
        setState(prev => ({ ...prev, location: newLocation }));
        fetchWeather(newLocation);
      }
    },
    [fetchWeather, state.location]
  );

  // Fetch weather for specific coordinates (used by favorites)
  const fetchByCoordinates = useCallback(
    (lat: number, lon: number) => {
      const locationString = `${lat},${lon}`;
      setLocation(locationString);
    },
    [setLocation]
  );

  // Initial fetch on mount
  useEffect(() => {
    if (initialLocation) {
      fetchWeather(initialLocation);
    } else {
      getUserLocation();
    }
  }, [initialLocation, fetchWeather, getUserLocation]);

  return {
    ...state,
    setLocation,
    fetchByCoordinates,
    refetch: () => fetchWeather(state.location),
    getUserLocation,
  };
}
