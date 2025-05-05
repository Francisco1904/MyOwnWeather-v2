'use client';

import { useState, useEffect, memo, Suspense, lazy } from 'react';
import { RefreshCcw, MapPin } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { useWeatherData } from '@/hooks/useWeatherQueries';
import { toast } from '@/hooks/use-toast';

// Lazy load components that aren't needed immediately
const FavoritesCarousel = lazy(() =>
  import('@/components/weather/FavoritesCarousel').then(mod => ({ default: mod.FavoritesCarousel }))
);

// Optimized title component
const PageTitle = memo(function PageTitle() {
  return <h1 className="section-title animate-fade-in w-full text-center">Weather</h1>;
});

// Navigation button component to reduce re-renders
const NavButton = memo(function NavButton({
  icon,
  onClick,
  disabled,
  ariaLabel,
  title,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  title?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className="back-button"
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
});

// Main content component that uses useSearchParams
function HomeContent() {
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
        <PageTitle />
        <div className="flex-1"></div>
        <div className="absolute right-0 flex space-x-2">
          <NavButton
            icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
            onClick={refreshUserLocation}
            disabled={isLoading}
            ariaLabel="Get my location"
            title="Get my location"
          />
          <NavButton
            icon={
              <RefreshCcw
                className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
            }
            onClick={() => refetch()}
            disabled={isLoading}
            ariaLabel="Refresh weather data"
          />
        </div>
      </header>

      <div className="animate-fade-in w-full space-y-6">
        {/* Weather Card */}
        <WeatherCard
          weatherData={currentWeather || null}
          forecast={forecast}
          isLoading={isLoading}
          error={isError ? new Error('Failed to fetch weather data') : null}
        />

        {currentWeather && forecast && !isLoading && (
          <div className="animate-fade-in delay-300">
            <Link
              href={`/details?location=${locationParam ? encodeURIComponent(locationParam) : ''}`}
            >
              <button
                className="w-full overflow-hidden rounded-xl bg-white/20 py-4 font-medium shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/30 active:scale-[0.98] dark:bg-slate-800/30 dark:hover:bg-slate-800/40"
                aria-label="View detailed forecast"
              >
                View Detailed Forecast
              </button>
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <div className="animate-fade-in delay-400">
            <Suspense
              fallback={<div className="h-32 w-full animate-pulse rounded-xl bg-white/10"></div>}
            >
              <FavoritesCarousel />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
}

// Wrap the component that uses useSearchParams in a Suspense boundary
export default function HomePage() {
  return (
    <Suspense
      fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
    >
      <HomeContent />
    </Suspense>
  );
}
