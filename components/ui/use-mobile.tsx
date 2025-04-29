import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Always initialize with undefined to avoid hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  // Use effect to safely access browser APIs only on the client side
  React.useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Set initial state based on current window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Create media query for changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Event handler
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener
    mql.addEventListener('change', onChange);

    // Clean up function
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // For SSR, default to desktop view (false) if undefined
  return isMobile ?? false;
}
