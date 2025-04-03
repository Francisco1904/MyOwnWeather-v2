import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';

interface FavoriteStarProps {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  className?: string;
}

export function FavoriteStar({ location, className = '' }: FavoriteStarProps) {
  const { isFavorite, addFavorite, removeFavorite, getFavoriteByCoords } = useFavorites();

  const isLocationFavorite = isFavorite(location.lat, location.lon);

  const handleToggleFavorite = async () => {
    if (isLocationFavorite) {
      const favorite = getFavoriteByCoords(location.lat, location.lon);
      if (favorite) {
        await removeFavorite(favorite.id, location.name);
      }
    } else {
      await addFavorite(location);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      className={`text-white ${className}`}
      aria-label={isLocationFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isLocationFavorite ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Star
          className={`h-5 w-5 ${isLocationFavorite ? 'fill-yellow-300 text-yellow-300' : 'text-white'}`}
          aria-hidden="true"
        />
      </motion.div>
    </Button>
  );
}
