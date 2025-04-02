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
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-sky-400 to-purple-500 p-4 pb-20 text-white transition-colors duration-300 dark:from-slate-900 dark:to-purple-900">
      <header className="mb-6 flex w-full max-w-md items-center">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mr-3 rounded-full bg-white/20 p-2 backdrop-blur-md dark:bg-slate-800/40"
            aria-label="Go back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
        </Link>
        <motion.h1
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Search Locations
        </motion.h1>
      </header>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Input */}
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon className="h-5 w-5 text-white/70" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full rounded-xl border-0 bg-white/20 py-3 pl-12 pr-12 text-white placeholder-white/60 backdrop-blur-md transition-all duration-300 focus:ring-2 focus:ring-white/30 dark:bg-slate-800/30"
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
        <div className="overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30">
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
                    <Clock className="mr-2 h-4 w-4" />
                    Recent Searches
                  </h2>
                  {recentSearches.length > 0 ? (
                    <ul className="space-y-2">
                      {recentSearches.map(location => (
                        <RecentSearchItem
                          key={location.id}
                          location={location}
                          onSelect={() => handleRecentSelect(location)}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="py-4 text-center text-white/70">No recent searches</p>
                  )}
                </motion.div>
              ) : searchResults.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="mb-4 text-lg font-semibold">Search Results</h2>
                  <ul className="space-y-3">
                    {searchResults.map(location => (
                      <SearchResultItem
                        key={location.id}
                        location={location}
                        onSelect={() => handleLocationSelect(location)}
                      />
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <p className="mb-2 text-white/70">No locations found for "{searchQuery}"</p>
                  <p className="text-center text-sm text-white/50">
                    Try searching for a city name or check the spelling
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav activePage="search" />
    </div>
  );
}

interface RecentSearchItemProps {
  location: RecentSearch;
  onSelect: () => void;
}

function RecentSearchItem({ location, onSelect }: RecentSearchItemProps) {
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <button className="block w-full text-left" onClick={onSelect}>
        <div className="flex items-center rounded-xl bg-white/10 p-3 transition-colors duration-200 hover:bg-white/15 dark:bg-slate-700/20 dark:hover:bg-slate-700/30">
          <Clock className="mr-3 h-5 w-5 text-white/70" />
          <span>{location.fullName}</span>
        </div>
      </button>
    </motion.li>
  );
}

interface SearchResultItemProps {
  location: LocationResult;
  onSelect: () => void;
}

function SearchResultItem({ location, onSelect }: SearchResultItemProps) {
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <button className="block w-full text-left" onClick={onSelect}>
        <div className="flex items-center justify-between rounded-xl bg-white/10 p-4 transition-colors duration-200 hover:bg-white/15 dark:bg-slate-700/20 dark:hover:bg-slate-700/30">
          <div className="flex items-center">
            <MapPin className="mr-3 h-5 w-5 text-white/70" />
            <div>
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-white/70">
                {location.region ? `${location.region}, ` : ''}
                {location.country}
              </div>
            </div>
          </div>
        </div>
      </button>
    </motion.li>
  );
}

interface BottomNavProps {
  activePage: string;
}

function BottomNav({ activePage }: BottomNavProps) {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white/20 p-4 backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavItem href="/" icon={<Home />} label="Home" active={activePage === 'home'} />
      <NavItem
        href="/details"
        icon={<BarChart2 />}
        label="Details"
        active={activePage === 'details'}
      />
      <NavItem href="/search" icon={<Search />} label="Search" active={activePage === 'search'} />
      <NavItem
        href="/settings"
        icon={<Settings />}
        label="Settings"
        active={activePage === 'settings'}
      />
    </motion.nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ href, icon, label, active = false }: NavItemProps) {
  return (
    <Link href={href}>
      <motion.div
        className="flex flex-col items-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div
          className={`rounded-full p-2 transition-colors duration-300 ${
            active ? 'bg-white/30 dark:bg-slate-700/40' : 'text-white/70'
          }`}
        >
          {icon}
        </div>
        <span className={`mt-1 text-xs ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
      </motion.div>
    </Link>
  );
}
