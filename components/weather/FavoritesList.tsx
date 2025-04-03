import React, { useState, useCallback, memo } from 'react';
import { MapPin, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites, FavoriteLocation } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useWeather } from '@/hooks/useWeather';
import { toast } from '@/hooks/use-toast';

export function FavoritesList() {
  const { favorites, loading, removeFavorite, refreshFavorites } = useFavorites();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { fetchByCoordinates } = useWeather();

  // Function to refresh favorites data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFavorites();
    setIsRefreshing(false);

    toast({
      title: 'Refreshed',
      description: 'Your favorite locations have been updated',
      variant: 'success',
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="my-4 flex w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="my-4 rounded-xl bg-white/10 p-4 text-center">
        <p className="text-sm opacity-80">No favorite locations yet</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Favorites ({favorites.length}/10)</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 w-8 p-0 text-white"
          aria-label="Refresh favorites"
        >
          <svg
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Button>
      </div>
      <div className="max-h-60 overflow-y-auto rounded-xl bg-white/10 p-2 pb-4">
        <AnimatePresence initial={false}>
          {favorites.map((favorite, index) => (
            <MemoizedFavoriteItem
              key={favorite.id}
              favorite={favorite}
              onRemove={removeFavorite}
              onSelect={fetchByCoordinates}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface FavoriteItemProps {
  favorite: FavoriteLocation;
  onRemove: (id: string, name: string) => Promise<boolean>;
  onSelect: (lat: number, lon: number) => void;
  index: number;
}

// Component for each favorite item
function FavoriteItem({ favorite, onRemove, onSelect, index }: FavoriteItemProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsRemoving(true);

    try {
      await onRemove(favorite.id, favorite.name);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleClick = useCallback(() => {
    onSelect(favorite.lat, favorite.lon);
    router.push('/');
  }, [favorite.lat, favorite.lon, onSelect, router]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <div
        className="mb-2 flex cursor-pointer items-center justify-between rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/20"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{favorite.name}</p>
            <p className="text-xs opacity-80">{favorite.country}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={isRemoving}
          className="h-8 w-8 text-white hover:bg-white/20 hover:text-red-400"
          aria-label={`Remove ${favorite.name} from favorites`}
        >
          {isRemoving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// Memoize the FavoriteItem for better performance
const MemoizedFavoriteItem = memo(FavoriteItem, (prevProps, nextProps) => {
  return prevProps.favorite.id === nextProps.favorite.id;
});
