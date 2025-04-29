'use client';

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  SearchIcon,
  MapPin,
  X,
  Loader2,
  Clock,
  Home,
  BarChart2,
  Search,
  Settings,
  SearchX,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocationSearch } from '@/hooks/useWeatherQueries';
import { toast } from '@/hooks/use-toast';
import { handleKeyboardActivation } from '@/lib/utils';

// Type for search results
interface LocationResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// Type for recent searches stored in localStorage
interface RecentSearch {
  id: string;
  name: string;
  fullName: string; // City, Region, Country format for display
  query: string; // The actual query to use when searching
}

// Ensure the search results data is properly typed
type SearchResults = LocationResult[];

// Memoized search result item component
const SearchResultItem = memo(function SearchResultItem({
  location,
  onSelect,
}: {
  location: LocationResult;
  onSelect: () => void;
}) {
  // Memoize the location description to avoid re-calculations
  const locationDescription = useMemo(
    () => [location.region, location.country].filter(Boolean).join(', '),
    [location.region, location.country]
  );

  // Memoize the keyboard event handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect();
      }
    },
    [onSelect]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20 dark:bg-slate-700/20 dark:hover:bg-slate-700/30"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View weather for ${location.name}, ${locationDescription}`}
    >
      <div className="flex items-center">
        <div
          className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 dark:bg-slate-700/40"
          aria-hidden="true"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium">{location.name}</p>
          <p className="text-xs opacity-80">{locationDescription}</p>
        </div>
      </div>
    </motion.div>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

// Memoized recent search item component
const RecentSearchItem = memo(function RecentSearchItem({
  location,
  onSelect,
}: {
  location: RecentSearch;
  onSelect: () => void;
}) {
  // Memoize the keyboard event handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect();
      }
    },
    [onSelect]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20 dark:bg-slate-700/20 dark:hover:bg-slate-700/30"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View weather for ${location.name}`}
    >
      <div className="flex items-center">
        <div
          className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 dark:bg-slate-700/40"
          aria-hidden="true"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium">{location.name}</p>
          <p className="text-xs opacity-80">{location.fullName}</p>
        </div>
      </div>
    </motion.div>
  );
});

RecentSearchItem.displayName = 'RecentSearchItem';

const SearchPage = memo(function SearchPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecent, setShowRecent] = useState(true);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const router = useRouter();

  // Use React Query for location search
  const {
    data: searchResults = [] as SearchResults,
    isLoading: isSearching,
    refetch,
  } = useLocationSearch(searchQuery);

  // Set showRecent to false when we get search results
  useEffect(() => {
    if (searchQuery.length > 0 && searchResults.length > 0) {
      setShowRecent(false);
    }
  }, [searchQuery, searchResults]);

  // Load recent searches from localStorage
  useEffect(() => {
    setMounted(true);

    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Load recent searches from localStorage
    if (typeof window !== 'undefined') {
      const storedSearches = localStorage.getItem('recentSearches');
      if (storedSearches) {
        try {
          const parsedSearches = JSON.parse(storedSearches);
          setRecentSearches(parsedSearches);
        } catch (error) {
          console.error('Error parsing recent searches:', error);
          // If there's an error, reset recent searches
          localStorage.removeItem('recentSearches');
        }
      }
    }
  }, []);

  // Show/hide recent searches based on query
  useEffect(() => {
    if (searchQuery === '') {
      setShowRecent(true);
    }
  }, [searchQuery]);

  // Memoize clear search handler
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Memoize location selection handler
  const handleLocationSelect = useCallback(
    (location: LocationResult) => {
      // Create a query string for the weather API (format depends on your API)
      const query = `${location.lat},${location.lon}`;

      // Create a full name for display
      const fullName = [location.name, location.region, location.country]
        .filter(Boolean)
        .join(', ');

      // Create a unique ID
      const id = `${location.lat}-${location.lon}`;

      // Create the recent search object
      const recentSearch: RecentSearch = {
        id,
        name: location.name,
        fullName,
        query,
      };

      // Update recent searches list (add to front, remove duplicates, limit to 5)
      const updatedSearches = [
        recentSearch,
        ...recentSearches.filter(item => item.id !== id),
      ].slice(0, 5);

      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      // Navigate to home with the selected location in URL params
      router.push(`/?location=${encodeURIComponent(query)}`);
    },
    [recentSearches, router]
  );

  // Memoize recent search selection handler
  const handleRecentSelect = useCallback(
    (recentSearch: RecentSearch) => {
      // Move this search to the top of the list
      const updatedSearches = [
        recentSearch,
        ...recentSearches.filter(item => item.id !== recentSearch.id),
      ];

      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      // Navigate to home with the selected location
      router.push(`/?location=${encodeURIComponent(recentSearch.query)}`);
    },
    [recentSearches, router]
  );

  // Create memoized handlers for individual items
  const getLocationSelectHandler = useCallback(
    (location: LocationResult) => {
      return () => handleLocationSelect(location);
    },
    [handleLocationSelect]
  );

  const getRecentSelectHandler = useCallback(
    (location: RecentSearch) => {
      return () => handleRecentSelect(location);
    },
    [handleRecentSelect]
  );

  if (!mounted) return null;

  return (
    <>
      <header className="section-header">
        <Link href="/" aria-label="Go back to home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="back-button"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        </Link>
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Search Locations
        </motion.h1>
      </header>

      <motion.div
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Input */}
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
            aria-hidden="true"
          >
            <SearchIcon className="h-5 w-5 text-white/70" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full rounded-xl border-0 bg-white/20 py-3 pl-12 pr-12 text-white placeholder-white/60 shadow-sm backdrop-blur-md transition-all duration-300 dark:bg-slate-800/30"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search for a city"
            aria-controls="search-results"
            aria-expanded={searchResults.length > 0 ? 'true' : 'false'}
            role="combobox"
            aria-owns="search-results"
            aria-haspopup="listbox"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-4"
              onClick={handleClearSearch}
              aria-label="Clear search"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClearSearch();
                }
              }}
            >
              <X
                className="h-5 w-5 text-white/70 transition-colors hover:text-white"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* Search Results or Recent Searches */}
        <div className="content-card">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                  aria-live="polite"
                >
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-white/70" aria-hidden="true" />
                  <p className="text-white/70">Searching for locations...</p>
                </motion.div>
              ) : showRecent ? (
                <motion.div
                  key="recent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id="search-results"
                  role="region"
                  aria-label="Recent searches"
                  aria-live="polite"
                >
                  <h2 className="mb-4 flex items-center text-lg font-semibold">
                    <Clock className="mr-2 h-5 w-5 text-white/70" aria-hidden="true" />
                    Recent Searches
                  </h2>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      {recentSearches.map(location => (
                        <RecentSearchItem
                          key={location.id}
                          location={location}
                          onSelect={getRecentSelectHandler(location)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-white/70">
                      Your recent searches will appear here
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id="search-results"
                  role="region"
                  aria-label="Search results"
                  aria-live="polite"
                >
                  <h2 className="mb-4 flex items-center text-lg font-semibold">
                    <MapPin className="mr-2 h-5 w-5 text-white/70" aria-hidden="true" />
                    Search Results
                  </h2>
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((location: LocationResult) => (
                        <SearchResultItem
                          key={location.id}
                          location={location}
                          onSelect={getLocationSelectHandler(location)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-white/70">
                      No locations found. Try a different search term.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {searchResults.length === 0 && !isSearching && searchQuery !== '' && (
          <motion.div
            className="my-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-live="polite"
          >
            <p>No locations found for &ldquo;{searchQuery}&rdquo;</p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
});

SearchPage.displayName = 'SearchPage';

export default SearchPage;
