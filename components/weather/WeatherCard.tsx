'use client';

import { useState, memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Cloud, CloudSun, Droplets, Wind } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CurrentWeather } from '@/lib/services/weatherApi';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useTemperature } from '@/lib/context/temperature-context';
import { FavoriteStar } from '@/components/weather/FavoriteStar';
import { useTheme } from 'next-themes';
import ApiError from '@/components/ui/api-error';

// Custom icon component to match the style in the screenshot
const WeatherIcon = memo(function WeatherIcon({
  icon,
  className = '',
  size = 24,
}: {
  icon: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white/20 p-2 ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      {icon}
    </div>
  );
});

WeatherIcon.displayName = 'WeatherIcon';

// Type definitions for forecast data
interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f?: number; // Make optional to accommodate the API response
  condition: {
    text: string;
    icon: string;
  };
  chance_of_rain: number;
}

interface ForecastData {
  forecast: {
    forecastday: Array<{
      hour: HourlyForecast[];
    }>;
  };
}

interface WeatherCardProps {
  weatherData: CurrentWeather | null;
  forecast?: ForecastData;
  isLoading: boolean;
  error: Error | null;
}

const HourlyForecastItem = memo(function HourlyForecastItem({
  hour,
  index,
  getTemp,
  unit,
  isReady,
}: {
  hour: HourlyForecast;
  index: number;
  getTemp: (celsius: number, fahrenheit: number | undefined) => number;
  unit: string;
  isReady: boolean;
}) {
  const hourTime = new Date(hour.time);
  const displayTime = index === 0 ? 'Now' : hourTime.getHours() + ':00';

  const weatherIcon = useMemo(() => {
    if (hour.condition.text.toLowerCase().includes('rain')) {
      return <Droplets className="h-4 w-4 text-white" aria-hidden="true" />;
    } else if (hour.condition.text.toLowerCase().includes('cloud')) {
      return <Cloud className="h-4 w-4 text-white" aria-hidden="true" />;
    } else {
      return <CloudSun className="h-4 w-4 text-white" aria-hidden="true" />;
    }
  }, [hour.condition.text]);

  return (
    <div className="flex min-w-[70px] flex-col items-center rounded-xl bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/15">
      <span className="text-xs">{displayTime}</span>
      {/* Render custom icon instead of API image */}
      <div className="my-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        {weatherIcon}
      </div>
      <span className="text-sm font-medium">
        {getTemp(hour.temp_c, hour.temp_f)}°{isReady ? unit : ''}
      </span>
    </div>
  );
});

HourlyForecastItem.displayName = 'HourlyForecastItem';

export const WeatherCard = memo(function WeatherCard({
  weatherData,
  forecast,
  isLoading,
  error,
}: WeatherCardProps) {
  // Always call all hooks first
  const { unit, isReady } = useTemperature();
  const { theme } = useTheme();

  // Helper function to get temperature in the selected unit
  const getTemp = useCallback(
    (celsius: number = 0, fahrenheit: number | undefined = undefined) => {
      return unit === 'C' ? Math.round(celsius) : Math.round(fahrenheit || celsius * 1.8 + 32);
    },
    [unit]
  );

  // Always extract data safely, even if weatherData is null/undefined
  const weatherConditionText = weatherData?.current?.condition?.text?.toLowerCase() || '';
  const locationLocaltime = weatherData?.location?.localtime || '';
  const currentTempC = weatherData?.current?.temp_c || 0;
  const currentTempF = weatherData?.current?.temp_f || 0;
  const feelsLikeC = weatherData?.current?.feelslike_c || 0;
  const feelsLikeF = weatherData?.current?.feelslike_f || 0;

  // Memoize the weather condition icon based on current condition
  const weatherIcon = useMemo(() => {
    if (!weatherConditionText)
      return <CloudSun className="h-32 w-32 text-white" aria-hidden="true" />;

    if (weatherConditionText.includes('cloud')) {
      return <Cloud className="h-32 w-32 text-white" aria-hidden="true" />;
    } else if (weatherConditionText.includes('sun') || weatherConditionText.includes('clear')) {
      return (
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-300"
          aria-hidden="true"
        >
          <span className="sr-only">Sun</span>
        </div>
      );
    } else {
      return <CloudSun className="h-32 w-32 text-white" aria-hidden="true" />;
    }
  }, [weatherConditionText]);

  // Memoize hourly forecast data to prevent recalculation on re-renders
  const displayHourly = useMemo(() => {
    if (!forecast?.forecast?.forecastday?.[0]?.hour) return [];

    const hourlyData = forecast.forecast.forecastday[0].hour;
    const now = new Date();
    const currentHour = now.getHours();

    // Filter to show only future hours
    const filteredHourly = hourlyData.filter((hour: HourlyForecast) => {
      try {
        const hourTime = new Date(hour.time);
        // Using >= might filter out all hours if currentHour matches exactly with the last hour
        // So we'll check if the hour is the same or later
        return hourTime.getHours() >= currentHour;
      } catch (error) {
        console.error('Error parsing hour time:', error, hour);
        return false;
      }
    });

    // Add logging to debug the issue
    console.log('Current hour:', currentHour);
    console.log('Filtered hourly count:', filteredHourly.length);

    // If we don't have enough hours left today, add some from tomorrow
    let result = filteredHourly;
    if (filteredHourly.length < 12 && forecast.forecast.forecastday.length > 1) {
      const tomorrowHours = forecast.forecast.forecastday[1].hour.slice(
        0,
        12 - filteredHourly.length
      );
      result = [...filteredHourly, ...tomorrowHours];
      console.log('Added tomorrow hours, total:', result.length);
    }

    // Make sure we always return at least the current hour if available
    if (result.length === 0 && hourlyData.length > 0) {
      const nearestHour = hourlyData.reduce((prev, curr) => {
        const prevHour = new Date(prev.time).getHours();
        const currHour = new Date(curr.time).getHours();
        return Math.abs(currHour - currentHour) < Math.abs(prevHour - currentHour) ? curr : prev;
      });
      result = [nearestHour];
      console.log('No hours matched, using nearest hour');
    }

    // Show up to 12 hours
    return result.slice(0, 12);
  }, [forecast?.forecast?.forecastday]);

  // Memoize current temperature to avoid recalculations
  const currentTemp = useMemo(
    () => getTemp(currentTempC, currentTempF),
    [currentTempC, currentTempF, getTemp]
  );

  const feelsLikeTemp = useMemo(
    () => getTemp(feelsLikeC, feelsLikeF),
    [feelsLikeC, feelsLikeF, getTemp]
  );

  const minTemp = useMemo(
    () => getTemp(feelsLikeC - 5, feelsLikeF - 9),
    [feelsLikeC, feelsLikeF, getTemp]
  );

  const formattedDate = useMemo(() => {
    if (!locationLocaltime) {
      return 'Today'; // Default fallback
    }
    try {
      return formatDate(locationLocaltime, 'EEEE, MMM d');
    } catch (error) {
      console.error('Error formatting date in WeatherCard:', error);
      return 'Today'; // Fallback if date formatting fails
    }
  }, [locationLocaltime]);

  // Now we can have conditional returns because all hooks have been called
  if (isLoading) {
    return (
      <div className="weather-card animate-pulse">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-36 bg-white/20" />
          <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Skeleton className="mb-4 h-24 w-24 rounded-full bg-white/20" />
          <Skeleton className="mb-2 h-16 w-32 bg-white/20" />
          <Skeleton className="h-6 w-40 bg-white/20" />
        </div>
        <div className="mt-6 flex justify-between">
          <Skeleton className="h-8 w-20 bg-white/20" />
          <Skeleton className="h-8 w-20 bg-white/20" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/20" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <ApiError
        error={error}
        message={
          error?.message === 'Failed to fetch'
            ? 'Network connection issue. Please check your internet connection.'
            : error?.message || 'Unable to fetch weather data right now.'
        }
        className="weather-card"
        retry={() => window.location.reload()}
      />
    );
  }

  const { location, current } = weatherData;

  return (
    <div className="weather-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {location.name}, {location.country}
          </h2>
          <p className="text-sm opacity-90">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-2">
          <FavoriteStar
            location={{
              name: location.name,
              country: location.country,
              lat: location.lat,
              lon: location.lon,
            }}
          />
          <Link href="/search">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
              role="button"
              tabIndex={0}
              aria-label="Search for location"
            >
              <Search className="h-5 w-5 text-white" />
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        {/* Weather icon based on condition */}
        <div className="relative flex h-32 w-32 items-center justify-center">{weatherIcon}</div>

        <h1 className="mt-2 text-[80px] font-bold leading-none">
          {currentTemp}°{isReady ? unit : ''}
        </h1>

        <p className="text-xl font-medium">{current.condition.text}</p>

        <div className="mt-2 flex items-center space-x-4">
          <span>
            Max: {feelsLikeTemp}°{isReady ? unit : ''}
          </span>
          <span>
            Min: {minTemp}°{isReady ? unit : ''}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="weather-card-item">
          <WeatherIcon icon={<Droplets className="h-5 w-5 text-white" aria-hidden="true" />} />
          <p className="mt-2 text-xs opacity-80">Humidity</p>
          <p className="font-bold">{current.humidity}%</p>
        </div>

        <div className="weather-card-item">
          <WeatherIcon icon={<Wind className="h-5 w-5 text-white" aria-hidden="true" />} />
          <p className="mt-2 text-xs opacity-80">Wind</p>
          <p className="font-bold">
            {unit === 'C'
              ? `${Math.round(current.wind_kph)} km/h`
              : `${Math.round(current.wind_mph)} mph`}
          </p>
        </div>

        <div className="weather-card-item">
          <WeatherIcon icon={<CloudSun className="h-5 w-5 text-white" aria-hidden="true" />} />
          <p className="mt-2 text-xs opacity-80">Feels Like</p>
          <p className="font-bold">
            {feelsLikeTemp}°{isReady ? unit : ''}
          </p>
        </div>
      </div>

      {displayHourly.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm">Hourly Forecast</p>
          <div className="scrollbar-styled -mx-2 overflow-x-auto px-2 pb-2">
            <div className="flex min-w-max space-x-2">
              {displayHourly.map((hour: HourlyForecast, index: number) => (
                <HourlyForecastItem
                  key={index}
                  hour={hour}
                  index={index}
                  getTemp={getTemp}
                  unit={unit}
                  isReady={isReady}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

WeatherCard.displayName = 'WeatherCard';
