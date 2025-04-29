'use client';

import { useState, useEffect } from 'react';

// Simple hook to check if a media query matches
export function useMediaQuery(query: string): boolean {
  // Initialize with false for SSR compatibility
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Function to get match status
    const getMatches = (query: string): boolean => {
      // Check browser support
      if (typeof window.matchMedia !== 'function') {
        return false;
      }
      return window.matchMedia(query).matches;
    };

    // Set initial value
    setMatches(getMatches(query));

    // Create handler function
    const handleChange = () => {
      setMatches(getMatches(query));
    };

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Add listener
    mediaQueryList.addEventListener('change', handleChange);

    // Clean up function
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]); // Re-run if query changes

  return matches;
}
