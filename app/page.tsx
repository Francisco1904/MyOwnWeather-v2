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
import { ForecastData, CurrentWeather } from '@/lib/services/weatherApi';
import { FavoritesCarousel } from '@/components/weather/FavoritesCarousel';
import { useAuth } from '@/lib/context/auth-context';

export default function HomePage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');
  const { isAuthenticated } = useAuth();

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
    if (locationParam && locationParam !== location) {
      setLocation(locationParam);
    }
  }, [locationParam, setLocation, location]);

  return (
    <>
      <header className="section-header">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Weather
        </motion.h1>
        <div className="flex-1"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
          className="back-button"
          aria-label="Refresh weather data"
        >
          <RefreshCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span className="sr-only">Refresh</span>
        </Button>
      </header>

      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Weather Card (Already using the weather-card class with appropriate styling) */}
        <WeatherCard
          weatherData={currentWeather}
          forecast={forecast || undefined}
          isLoading={isLoading}
          error={error}
        />

        {currentWeather && forecast && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/details">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full overflow-hidden rounded-xl bg-white/20 py-4 font-medium shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 dark:bg-slate-800/30 dark:hover:bg-slate-800/40"
                aria-label="View detailed forecast"
              >
                View Detailed Forecast
              </motion.button>
            </Link>
          </motion.div>
        )}

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FavoritesCarousel />
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
