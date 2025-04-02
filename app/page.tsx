'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useWeather } from '@/hooks/useWeather';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');

  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    setLocation,
    refetch,
    getUserLocation,
    location,
  } = useWeather(locationParam || undefined);

  // Update the weather data when the location query parameter changes
  useEffect(() => {
    if (locationParam) {
      setLocation(locationParam);
    }
  }, [locationParam, setLocation]);

  return (
    <>
      <header className="mb-6 w-full max-w-md">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="flex-1 text-center text-2xl font-bold">My Weather</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-white"
            aria-label="Refresh weather data"
          >
            <RefreshCcw
              className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </motion.div>
      </header>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Weather Card Component */}
        <WeatherCard
          weatherData={currentWeather}
          forecast={forecast}
          isLoading={isLoading}
          error={error}
        />

        {currentWeather && forecast && !isLoading && (
          <Link href="/details">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full rounded-xl bg-white/30 py-4 font-medium transition-all duration-300 hover:bg-white/40 dark:bg-slate-700/30 dark:hover:bg-slate-700/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              aria-label="View detailed forecast"
            >
              View Detailed Forecast
            </motion.button>
          </Link>
        )}
      </motion.div>
    </>
  );
}
