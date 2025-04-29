'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, MapPin } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { ForecastData, CurrentWeather } from '@/lib/services/weatherApi';
import { FavoritesCarousel } from '@/components/weather/FavoritesCarousel';
import { useAuth } from '@/lib/context/auth-context';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { useWeatherData } from '@/hooks/useWeatherQueries';
import { toast } from '@/hooks/use-toast';

export default function HomePage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');
  const { isAuthenticated } = useAuth();

  const { currentWeather, forecast, isLoading, isError, error, refetch, userLocation } =
    useWeatherData(locationParam || undefined);

  const refreshUserLocation = () => {
    // Check for geolocation API
    if (typeof window !== 'undefined' && navigator.geolocation) {
      toast({
        title: 'Getting your location',
        description: 'Please allow location access if prompted',
      });

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;

          // Redirect to the home page with the new location parameter
          window.location.href = `/?location=${encodeURIComponent(locationString)}`;

          toast({
            title: 'Location updated',
            description: 'Weather data for your current location',
          });
        },
        error => {
          console.error('Geolocation error:', error);
          toast({
            title: 'Location error',
            description: 'Could not get your location. Using default location instead.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <header className="section-header">
        <motion.h1
          className="section-title w-full text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Weather
        </motion.h1>
        <div className="flex-1"></div>
        <div className="absolute right-0 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshUserLocation}
            disabled={isLoading}
            className="back-button"
            aria-label="Get my location"
            title="Get my location"
          >
            <MapPin className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Get my location</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
            className="back-button"
            aria-label="Refresh weather data"
          >
            <RefreshCcw
              className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </header>

      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Weather Card */}
        <WeatherCard
          weatherData={currentWeather || null}
          forecast={forecast}
          isLoading={isLoading}
          error={isError ? new Error('Failed to fetch weather data') : null}
        />

        {currentWeather && forecast && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href={`/details?location=${locationParam ? encodeURIComponent(locationParam) : ''}`}
            >
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
