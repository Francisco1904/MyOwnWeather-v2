'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCcw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { weatherService } from '@/lib/services/weatherApi';

interface RateLimitBannerProps {
  className?: string;
  onRefresh?: () => Promise<void>;
}

/**
 * Banner component that displays when the app is experiencing rate limiting
 */
export default function RateLimitBanner({ className = '', onRefresh }: RateLimitBannerProps) {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check for rate limit status periodically
  useEffect(() => {
    // Initial check
    setIsRateLimited(weatherService.isRateLimited());

    // Poll for changes every 2 seconds
    const interval = setInterval(() => {
      setIsRateLimited(weatherService.isRateLimited());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        // Recheck rate limit status immediately after refresh
        setIsRateLimited(weatherService.isRateLimited());
      }
    }
  };

  return (
    <AnimatePresence>
      {isRateLimited && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`rounded-lg bg-amber-500/20 p-3 text-amber-100 backdrop-blur-sm dark:bg-amber-900/30 ${className}`}
          role="alert"
        >
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Rate limit reached. The application is processing requests.
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="ml-3 rounded bg-white/20 px-2 py-1 text-xs font-medium hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
                aria-label="Refresh data"
              >
                {isRefreshing ? (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 animate-spin" />
                    Wait
                  </span>
                ) : (
                  <span className="flex items-center">
                    <RefreshCcw className="mr-1 h-3 w-3" />
                    Try now
                  </span>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
