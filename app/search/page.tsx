'use client';

import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import weatherService from '@/lib/services/weatherApi';

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

export default function SearchPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecent, setShowRecent] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const router = useRouter();

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

  useEffect(() => {
    // Show recent searches when query is empty
    if (searchQuery === '') {
      setShowRecent(true);
      setSearchResults([]);
      return;
    }

    // Hide recent searches when typing
    setShowRecent(false);

    // Perform search using the weatherAPI
    const performSearch = async () => {
      setIsSearching(true);

      try {
        const results = await weatherService.searchLocations(searchQuery);

        // Map API results to our LocationResult type with added ID
        const mappedResults = results.map((location: any, index: number) => ({
          ...location,
          id: index,
        }));

        setSearchResults(mappedResults);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle selection of a location
  const handleLocationSelect = (location: LocationResult) => {
    // Create a query string for the weather API (format depends on your API)
    const query = `${location.lat},${location.lon}`;

    // Create a full name for display
    const fullName = [location.name, location.region, location.country].filter(Boolean).join(', ');

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
    const updatedSearches = [recentSearch, ...recentSearches.filter(item => item.id !== id)].slice(
      0,
      5
    );

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    // Navigate to home with the selected location in URL params
    router.push(`/?location=${encodeURIComponent(query)}`);
  };

  // Handle selection of a recent search
  const handleRecentSelect = (recentSearch: RecentSearch) => {
    // Move this search to the top of the list
    const updatedSearches = [
      recentSearch,
      ...recentSearches.filter(item => item.id !== recentSearch.id),
    ];

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    // Navigate to home with the selected location
    router.push(`/?location=${encodeURIComponent(recentSearch.query)}`);
  };

  if (!mounted) return null;

  return (
    <>
      <header className="section-header">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="back-button"
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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon className="h-5 w-5 text-white/70" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full rounded-xl border-0 bg-white/20 py-3 pl-12 pr-12 text-white placeholder-white/60 shadow-sm backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 dark:bg-slate-800/30 dark:focus:ring-slate-500/30"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search for a city"
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-4"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-white/70 transition-colors hover:text-white" />
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
                >
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-white/70" />
                  <p className="text-white/70">Searching for locations...</p>
                </motion.div>
              ) : showRecent ? (
                <motion.div
                  key="recent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="mb-4 flex items-center text-lg font-semibold">
                    <Clock className="mr-2 h-5 w-5 text-white/70" />
                    Recent Searches
                  </h2>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      {recentSearches.map(location => (
                        <RecentSearchItem
                          key={location.id}
                          location={location}
                          onSelect={() => handleRecentSelect(location)}
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
                >
                  <h2 className="mb-4 flex items-center text-lg font-semibold">
                    <MapPin className="mr-2 h-5 w-5 text-white/70" />
                    Search Results
                  </h2>
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map(location => (
                        <SearchResultItem
                          key={location.id}
                          location={location}
                          onSelect={() => handleLocationSelect(location)}
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
      </motion.div>
    </>
  );
}

interface RecentSearchItemProps {
  location: RecentSearch;
  onSelect: () => void;
}

function RecentSearchItem({ location, onSelect }: RecentSearchItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20 dark:bg-slate-700/20 dark:hover:bg-slate-700/30"
      onClick={onSelect}
    >
      <div className="flex items-center">
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 dark:bg-slate-700/40">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">{location.name}</p>
          <p className="text-xs opacity-80">{location.fullName}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface SearchResultItemProps {
  location: LocationResult;
  onSelect: () => void;
}

function SearchResultItem({ location, onSelect }: SearchResultItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="cursor-pointer rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20 dark:bg-slate-700/20 dark:hover:bg-slate-700/30"
      onClick={onSelect}
    >
      <div className="flex items-center">
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 dark:bg-slate-700/40">
          <MapPin className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">{location.name}</p>
          <p className="text-xs opacity-80">
            {[location.region, location.country].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
