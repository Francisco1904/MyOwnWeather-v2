'use client';

import { useState, useEffect } from 'react';

// Simple hook to check if a media query matches
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Set initial value
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Set up listener for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Clean up function
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
