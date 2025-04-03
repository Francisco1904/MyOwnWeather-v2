import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/context/auth-context';
import { toast } from '@/hooks/use-toast';

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  createdAt: Date;
}

// Create a simple cache to prevent unnecessary re-fetches
const CACHE_EXPIRY_TIME = 30000; // 30 seconds
interface Cache {
  data: FavoriteLocation[];
  timestamp: number;
  userId: string;
}

let favoritesCache: Cache | null = null;

export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Debounce additions/removals to prevent UI freezes
  const pendingOperationRef = useRef<NodeJS.Timeout | null>(null);

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!favoritesCache || !user) return false;
    if (favoritesCache.userId !== user.uid) return false;

    const now = Date.now();
    return now - favoritesCache.timestamp < CACHE_EXPIRY_TIME;
  }, [user]);

  // Setup real-time updates via snapshot
  const setupRealtimeUpdates = useCallback(() => {
    if (!isAuthenticated || !user) return;

    // Clear any existing subscriptions
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);

    try {
      const favoritesRef = collection(db, 'favorites');
      const q = query(favoritesRef, where('userId', '==', user.uid));

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const favoritesList: FavoriteLocation[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            country: doc.data().country,
            lat: doc.data().lat,
            lon: doc.data().lon,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }));

          // Sort by most recently added
          favoritesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

          // Update state and cache
          setFavorites(favoritesList);
          favoritesCache = {
            data: favoritesList,
            timestamp: Date.now(),
            userId: user.uid,
          };
          setLoading(false);
        },
        error => {
          console.error('Error setting up favorites listener:', error);
          setLoading(false);
          toast({
            title: 'Connection Error',
            description: 'Problem connecting to favorites service',
            variant: 'destructive',
          });
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error('Error setting up favorites listener:', error);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch user's favorite locations - fallback to non-realtime
  const fetchFavorites = useCallback(
    async (force = false) => {
      if (!isAuthenticated || !user) {
        setFavorites([]);
        return;
      }

      // Use cached data if valid and not forced refresh
      if (!force && isCacheValid()) {
        setFavorites(favoritesCache!.data);
        return;
      }

      setLoading(true);
      try {
        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const favoritesList: FavoriteLocation[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          country: doc.data().country,
          lat: doc.data().lat,
          lon: doc.data().lon,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        // Sort by most recently added
        favoritesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Update state and cache
        setFavorites(favoritesList);
        favoritesCache = {
          data: favoritesList,
          timestamp: Date.now(),
          userId: user.uid,
        };
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast({
          title: 'Error',
          description: 'Failed to load favorite locations',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, user, isCacheValid]
  );

  // Add a location to favorites - optimistically update UI
  const addFavorite = useCallback(
    async (location: { name: string; country: string; lat: number; lon: number }) => {
      if (!isAuthenticated || !user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to save favorite locations',
          variant: 'destructive',
        });
        return false;
      }

      // Check if max limit reached
      if (favorites.length >= 10) {
        toast({
          title: 'Limit Reached',
          description: 'You can save up to 10 favorite locations',
          variant: 'destructive',
        });
        return false;
      }

      // Check if already exists
      const exists = favorites.some(
        fav => Math.abs(fav.lat - location.lat) < 0.01 && Math.abs(fav.lon - location.lon) < 0.01
      );

      if (exists) {
        toast({
          title: 'Already in Favorites',
          description: `${location.name} is already in your favorites`,
          variant: 'default',
        });
        return false;
      }

      // Optimistically update UI
      const tempId = `temp-${Date.now()}`;
      const newFavorite: FavoriteLocation = {
        id: tempId,
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        createdAt: new Date(),
      };

      setFavorites(prev => [newFavorite, ...prev]);

      // Clear any pending operation
      if (pendingOperationRef.current) {
        clearTimeout(pendingOperationRef.current);
      }

      // Add debounce to batch rapid operations
      pendingOperationRef.current = setTimeout(async () => {
        try {
          const favoritesRef = collection(db, 'favorites');
          await addDoc(favoritesRef, {
            userId: user.uid,
            name: location.name,
            country: location.country,
            lat: location.lat,
            lon: location.lon,
            createdAt: serverTimestamp(),
          });

          toast({
            title: 'Location Added',
            description: `${location.name} added to favorites`,
            variant: 'default',
          });

          // Real-time updates should handle the state update
          return true;
        } catch (error) {
          console.error('Error adding favorite:', error);
          // Revert optimistic update on error
          setFavorites(prev => prev.filter(fav => fav.id !== tempId));
          toast({
            title: 'Error',
            description: 'Failed to add location to favorites',
            variant: 'destructive',
          });
          return false;
        }
      }, 300);

      return true;
    },
    [favorites, isAuthenticated, user]
  );

  // Remove a location from favorites - optimistically update UI
  const removeFavorite = useCallback(
    async (favoriteId: string, locationName: string) => {
      if (!isAuthenticated || !user) return false;

      // Optimistically update UI
      const favoriteToRemove = favorites.find(fav => fav.id === favoriteId);
      if (!favoriteToRemove) return false;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));

      // Clear any pending operation
      if (pendingOperationRef.current) {
        clearTimeout(pendingOperationRef.current);
      }

      // Add debounce to batch rapid operations
      pendingOperationRef.current = setTimeout(async () => {
        try {
          const favoriteRef = doc(db, 'favorites', favoriteId);
          await deleteDoc(favoriteRef);

          toast({
            title: 'Removed',
            description: `${locationName} removed from favorites`,
            variant: 'default',
          });

          return true;
        } catch (error) {
          console.error('Error removing favorite:', error);
          // Revert optimistic update on error
          setFavorites(prev => [...prev, favoriteToRemove]);
          toast({
            title: 'Error',
            description: 'Failed to remove location from favorites',
            variant: 'destructive',
          });
          return false;
        }
      }, 300);

      return true;
    },
    [favorites, isAuthenticated, user]
  );

  // Check if a location is in favorites - using cached data for performance
  const isFavorite = useCallback(
    (lat: number, lon: number) => {
      return favorites.some(
        fav => Math.abs(fav.lat - lat) < 0.01 && Math.abs(fav.lon - lon) < 0.01
      );
    },
    [favorites]
  );

  // Get a favorite by coordinates - using cached data for performance
  const getFavoriteByCoords = useCallback(
    (lat: number, lon: number) => {
      return favorites.find(
        fav => Math.abs(fav.lat - lat) < 0.01 && Math.abs(fav.lon - lon) < 0.01
      );
    },
    [favorites]
  );

  // Setup real-time updates or fetch data on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isCacheValid()) {
        // Use cached data if available
        setFavorites(favoritesCache!.data);
      } else {
        // Otherwise setup real-time updates
        setupRealtimeUpdates();
      }
    } else {
      setFavorites([]);
      // Clear any existing subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    }

    // Cleanup subscription when component unmounts
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated, user, isCacheValid, setupRealtimeUpdates]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByCoords,
    refreshFavorites: () => fetchFavorites(true), // Force refresh
  };
}
