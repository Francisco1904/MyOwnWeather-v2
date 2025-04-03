'use client';

import { useState } from 'react';
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

// Custom icon component to match the style in the screenshot
function WeatherIcon({
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
}

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

export function WeatherCard({ weatherData, forecast, isLoading, error }: WeatherCardProps) {
  const { unit, isReady } = useTemperature();
  const { theme } = useTheme();

  // Helper function to get temperature in the selected unit
  const getTemp = (celsius: number, fahrenheit: number | undefined) => {
    return unit === 'C' ? Math.round(celsius) : Math.round(fahrenheit || celsius * 1.8 + 32);
  };

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
      <div className="weather-card text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
          <CloudSun className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Weather Unavailable</h2>
        <p className="mb-4 text-sm opacity-90">
          {error?.message === 'Failed to fetch'
            ? 'Network connection issue. Please check your internet connection.'
            : error?.message || 'Unable to fetch weather data right now.'}
        </p>
        <Button onClick={() => window.location.reload()} className="bg-white/20 hover:bg-white/30">
          Retry
        </Button>
      </div>
    );
  }

  // Get the hourly forecast data if available
  const hourlyData = forecast?.forecast?.forecastday?.[0]?.hour || [];

  // Get the current hour to filter hourly data
  const now = new Date();
  const currentHour = now.getHours();

  // Filter to show only future hours
  const filteredHourly = hourlyData.filter((hour: HourlyForecast) => {
    const hourTime = new Date(hour.time);
    return hourTime.getHours() >= currentHour;
  });

  // Show only next 3-4 hours on the home page
  const displayHourly = filteredHourly.slice(0, 4);

  const { location, current } = weatherData;

  return (
    <div className="weather-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {location.name}, {location.country}
          </h2>
          <p className="text-sm opacity-90">{formatDate(location.localtime, 'EEEE, MMM d')}</p>
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
        {/* Use custom weather icon based on condition */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {current?.condition?.text?.toLowerCase().includes('cloud') ? (
            <Cloud className="h-32 w-32 text-white" aria-hidden="true" />
          ) : current?.condition?.text?.toLowerCase().includes('sun') ||
            current?.condition?.text?.toLowerCase().includes('clear') ? (
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-300"
              aria-hidden="true"
            >
              <span className="sr-only">Sun</span>
            </div>
          ) : (
            <CloudSun className="h-32 w-32 text-white" aria-hidden="true" />
          )}
        </div>

        <h1 className="mt-2 text-[80px] font-bold leading-none">
          {getTemp(current.temp_c, current.temp_f)}°{isReady ? unit : ''}
        </h1>

        <p className="text-xl font-medium">{current.condition.text}</p>

        <div className="mt-2 flex items-center space-x-4">
          <span>
            Max: {getTemp(current.feelslike_c, current.feelslike_f)}°{isReady ? unit : ''}
          </span>
          <span>
            Min: {getTemp(current.feelslike_c - 5, current.feelslike_f - 9)}°{isReady ? unit : ''}
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
            {getTemp(current.feelslike_c, current.feelslike_f)}°{isReady ? unit : ''}
          </p>
        </div>
      </div>

      {displayHourly.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm">Hourly Forecast</p>
          <div className="grid grid-cols-4 gap-2">
            {displayHourly.map((hour: HourlyForecast, index: number) => {
              const hourTime = new Date(hour.time);
              const displayTime = index === 0 ? 'Now' : hourTime.getHours() + ':00';

              return (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/15"
                >
                  <span className="text-xs">{displayTime}</span>
                  {/* Render custom icon instead of API image */}
                  <div className="my-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    {hour.condition.text.toLowerCase().includes('rain') ? (
                      <Droplets className="h-4 w-4 text-white" aria-hidden="true" />
                    ) : hour.condition.text.toLowerCase().includes('cloud') ? (
                      <Cloud className="h-4 w-4 text-white" aria-hidden="true" />
                    ) : (
                      <CloudSun className="h-4 w-4 text-white" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {getTemp(hour.temp_c, hour.temp_f)}°{isReady ? unit : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
