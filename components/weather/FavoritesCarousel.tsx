'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useFavorites, FavoriteLocation } from '@/hooks/useFavorites';
import { FavoriteCard } from './FavoriteCard';
import { useWeather } from '@/hooks/useWeather';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useFavoritesWeather } from '@/hooks/useWeatherQueries';

export interface WeatherCardData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  weatherData: any;
  isLoading: boolean;
  error: Error | null;
}

// Memoized component to prevent unnecessary re-renders
const FavoritesCarousel = memo(function FavoritesCarousel() {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { fetchByCoordinates } = useWeather();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Using React Query to fetch weather data for all favorites
  const favoritesWeatherQuery = useFavoritesWeather(favorites);
  const favoriteWeatherData = favoritesWeatherQuery.data || [];
  const isLoading = favoritesWeatherQuery.isLoading || favoritesLoading;

  // Memoize the handler for selecting a favorite location
  const handleSelectFavorite = useCallback(
    (index: number) => {
      // Always select the clicked card, regardless of the current selection
      setSelectedIndex(index);

      // Update the current weather with the selected location
      if (favoriteWeatherData[index]) {
        const { lat, lon } = favoriteWeatherData[index].location;
        fetchByCoordinates(lat, lon);
        // Update URL to reflect the selected location
        const locationParam = `${lat},${lon}`;
        router.push(`/?location=${encodeURIComponent(locationParam)}`);

        // Scroll the selected card into the center of the view
        setTimeout(() => {
          if (carouselRef.current) {
            const carousel = carouselRef.current;
            const card = carousel.querySelector(`[data-card-index="${index}"]`) as HTMLElement;

            if (card) {
              const cardWidth = card.offsetWidth;
              const carouselWidth = carousel.offsetWidth;

              // Calculate position to center the card
              const scrollLeft = card.offsetLeft - carouselWidth / 2 + cardWidth / 2;

              // Smooth scroll to the position
              carousel.scrollTo({
                left: scrollLeft,
                behavior: 'smooth',
              });
            }
          }
        }, 50); // Small timeout to ensure DOM is updated
      }
    },
    [favoriteWeatherData, fetchByCoordinates, router]
  );

  // Memoize the scroll handler to prevent unnecessary function creation
  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const scrollAmount = direction === 'left' ? -260 : 260;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  // Show loading state if we're still loading favorites
  if (favoritesLoading) {
    return (
      <div className="my-4 flex w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  // Don't show anything if there are no favorites
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-6">
      <h2 className="mb-3 text-lg font-medium">Favorites</h2>

      <div className="relative z-0">
        {/* Left scroll button (only on desktop) */}
        {!isMobile && favorites.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md hover:bg-white/30"
            onClick={() => scrollCarousel('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="scrollable show-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-6"
          style={{ scrollbarWidth: 'thin' }}
        >
          {favoriteWeatherData.map((favorite, index) => (
            <div
              key={`${favorite.location.name}-${index}`}
              className="snap-center"
              data-card-index={index}
              style={{
                flexShrink: 0,
                transition: 'all 0.3s ease',
                // Ensure selected card has a moderate z-index but still below navigation arrows
                zIndex: selectedIndex === index ? 5 : 1,
                position: 'relative',
              }}
            >
              <FavoriteCard
                location={favorite.location}
                weatherData={favorite.weatherData}
                isLoading={favorite.isLoading}
                error={favorite.error}
                onSelect={() => handleSelectFavorite(index)}
                isSelected={selectedIndex === index}
                isActive={true} // Always active to allow selection
              />
            </div>
          ))}
        </div>

        {/* Right scroll button (only on desktop) */}
        {!isMobile && favorites.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md hover:bg-white/30"
            onClick={() => scrollCarousel('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
});

// Add display name for better debugging
FavoritesCarousel.displayName = 'FavoritesCarousel';

export { FavoritesCarousel };
