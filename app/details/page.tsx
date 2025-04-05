'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Umbrella, Cloud, CloudSun, Droplets, Wind } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { useWeather } from '@/hooks/useWeather';
import { Skeleton } from '@/components/ui/skeleton';
import ForecastCard from '@/components/weather/ForecastCard';
import { formatDate } from '@/lib/utils';
import { useTemperature } from '@/lib/context/temperature-context';
import { FavoriteStar } from '@/components/weather/FavoriteStar';
import { useSearchParams } from 'next/navigation';

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

// Add this interface to match the one in WeatherCard.tsx
interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
  };
  chance_of_rain: number;
}

export default function DetailedForecast() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { theme } = useTheme();
  const { unit, isReady } = useTemperature();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');

  const { currentWeather, forecast, isLoading, error, refetch } = useWeather(
    locationParam || undefined
  );

  // Helper function to get temperature in the selected unit
  const getTemp = (celsius: number, fahrenheit: number) => {
    return unit === 'C' ? Math.round(celsius) : Math.round(fahrenheit);
  };

  const toggleDayExpansion = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null);
    } else {
      setExpandedDay(index);
    }
  };

  if (isLoading) {
    return (
      <>
        <header className="section-header">
          <div className="flex items-center">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mr-3 rounded-full bg-white/20 p-2 backdrop-blur-md dark:bg-slate-800/40"
                aria-label="Go back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
            </Link>
            <motion.h1
              className="section-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Detailed Forecast
            </motion.h1>
          </div>
        </header>

        <div className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30">
          <Skeleton className="mb-4 h-8 w-48" />
          <Skeleton className="mb-3 h-6 w-full" />
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="w-full space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </>
    );
  }

  if (error || !forecast) {
    return (
      <>
        <header className="section-header">
          <div className="flex items-center">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mr-3 rounded-full bg-white/20 p-2 backdrop-blur-md dark:bg-slate-800/40"
                aria-label="Go back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
            </Link>
            <motion.h1
              className="section-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Detailed Forecast
            </motion.h1>
          </div>
        </header>

        <div className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 p-6 text-center shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30">
          <h2 className="mb-2 text-xl font-semibold">Error Loading Forecast</h2>
          <p>{error?.message || 'Failed to load weather data'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-white/20 px-4 py-2 transition-colors hover:bg-white/30"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  // Extract data from the API response
  const { location, current } = currentWeather!;
  const { forecastday } = forecast.forecast;
  const hourlyData = forecastday[0].hour;

  // Get the current hour to filter hourly data
  const now = new Date();
  const currentHour = now.getHours();

  // Filter hourly forecast to show from current hour onwards (or all if we're near end of day)
  const filteredHourly = hourlyData.filter(hour => {
    const hourTime = new Date(hour.time);
    return hourTime.getHours() >= currentHour;
  });

  // If we have less than 8 hours left today, add some from tomorrow
  let displayHourly = filteredHourly;
  if (filteredHourly.length < 8 && forecastday.length > 1) {
    const tomorrowHours = forecastday[1].hour.slice(0, 8 - filteredHourly.length);
    displayHourly = [...filteredHourly, ...tomorrowHours];
  }

  // Ensure we only show 12 hours max
  displayHourly = displayHourly.slice(0, 12);

  return (
    <>
      <header className="section-header">
        <div className="flex items-center">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mr-3 rounded-full bg-white/20 p-2 backdrop-blur-md dark:bg-slate-800/40"
              aria-label="Go back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
          </Link>
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Detailed Forecast
          </motion.h1>
        </div>
      </header>

      <motion.div
        className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {location.name}, {location.country}
              </h2>
              <p className="text-sm opacity-90">{formatDate(location.localtime, 'EEEE, d MMM')}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-3xl font-bold">
                {getTemp(current.temp_c, current.temp_f)}°{isReady ? unit : ''}
              </p>
              <p className="text-sm">{current.condition.text}</p>
              <FavoriteStar
                location={{
                  name: location.name,
                  country: location.country,
                  lat: location.lat,
                  lon: location.lon,
                }}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm">
            <span>Hourly Forecast</span>
          </div>

          <div className="scrollbar-styled -mx-2 overflow-x-auto px-2 pb-2">
            <div className="flex min-w-max space-x-3">
              {displayHourly.map((hour, index) => {
                const hourTime = new Date(hour.time);
                const displayTime = index === 0 ? 'Now' : hourTime.getHours() + ':00';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="flex min-w-[70px] flex-col items-center rounded-xl bg-white/10 p-3 dark:bg-slate-700/20"
                  >
                    <span className="text-xs">{displayTime}</span>
                    {/* Use custom weather icon based on condition */}
                    <div className="my-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      {hour.condition.text.toLowerCase().includes('rain') ? (
                        <Umbrella className="h-4 w-4 text-white" />
                      ) : hour.condition.text.toLowerCase().includes('cloud') ? (
                        <Cloud className="h-4 w-4 text-white" />
                      ) : (
                        <CloudSun className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">
                      {getTemp(hour.temp_c, hour.temp_f)}°{isReady ? unit : ''}
                    </span>
                    <div className="mt-1 flex items-center">
                      <div className="mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                        <Umbrella className="h-2 w-2 text-white" />
                      </div>
                      <span className="text-xs">{hour.chance_of_rain}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-2 flex justify-between px-1 text-sm">
          <span>{forecastday.length}-Day Forecast</span>
        </div>

        {/* Forecast for next several days */}
        <div className="space-y-4">
          {forecastday.map((day, index) => (
            <ForecastCard
              key={index}
              day={day}
              unit={unit}
              isExpanded={expandedDay === index}
              onToggle={() => toggleDayExpansion(index)}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}
