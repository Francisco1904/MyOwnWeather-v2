'use client';

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart2, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TemperatureProvider } from '@/lib/context/temperature-context';
import { AuthProvider } from '@/lib/context/auth-context';
import { NotificationProvider } from '@/lib/context/notification-context';
import ErrorBoundary from '@/components/ui/error-boundary';
import { ReactQueryProvider } from '@/lib/providers/query-provider';
import RateLimitBanner from '@/components/ui/rate-limit-banner';
import { useToast } from '@/components/ui/use-toast';
import { registerServiceWorker, subscribeToPushNotifications } from '@/lib/notifications';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();

  // Register service worker for notifications and offline functionality
  useEffect(() => {
    const registerSW = async () => {
      try {
        console.log('Initializing service worker...');

        // Check if service worker is already controlling the page
        if (navigator.serviceWorker.controller) {
          console.log('Service worker is already active and controlling the page');
          return;
        }

        // Register the service worker
        console.log('Registering service worker...');
        const registration = await registerServiceWorker();

        if (registration) {
          console.log('Service worker registered successfully');

          // Log current service worker state
          if (registration.installing) {
            console.log('Service worker is installing');
          } else if (registration.waiting) {
            console.log('Service worker is waiting');
          } else if (registration.active) {
            console.log('Service worker is active');
          }

          // Wait for the service worker to become active if it's still installing
          if (registration.installing) {
            registration.installing.addEventListener('statechange', event => {
              console.log('Service worker state changed:', (event.target as any)?.state);
            });
          }
        } else {
          console.warn('Failed to register service worker');
        }
      } catch (error) {
        console.error('Error during service worker setup:', error);
      }
    };

    // Only register in production or if explicitly allowed in development
    if (
      (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SW === 'true') &&
      'serviceWorker' in navigator
    ) {
      // Wait a bit for the page to load fully before registering SW
      setTimeout(registerSW, 1000);
    } else {
      console.log('Service worker registration skipped (not in production or not enabled)');
    }
  }, []);

  // Add viewport meta tag to handle safe areas on iOS
  useEffect(() => {
    // Check if the meta tag already exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');

    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }

    // Update viewport meta to include viewport-fit=cover for iOS safe areas
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
  }, []);

  // Handle refresh when rate limit banner refresh button is clicked
  const handleRefresh = useCallback(async () => {
    // We'll just show a toast notification for now
    // In a real app, you might want to trigger a data refresh
    toast({
      title: 'Refreshing data',
      description: 'Attempting to refresh weather data...',
      duration: 2000,
    });

    // Wait a moment to simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [toast]);

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <TemperatureProvider>
          <NotificationProvider>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-sky-400 to-purple-500 p-4 text-white transition-colors duration-300 dark:from-slate-900 dark:to-purple-900">
              {/* Rate limit banner displays at the top when needed */}
              <RateLimitBanner className="mb-4 w-full max-w-md" onRefresh={handleRefresh} />

              <div className="has-bottom-nav w-full max-w-md pt-4">
                <ErrorBoundary>{children}</ErrorBoundary>
              </div>

              <BottomNav pathname={pathname} />
            </div>
          </NotificationProvider>
        </TemperatureProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  const activePage =
    pathname === '/'
      ? 'home'
      : pathname.startsWith('/details')
        ? 'details'
        : pathname.startsWith('/search')
          ? 'search'
          : pathname.startsWith('/settings')
            ? 'settings'
            : '';

  return (
    <motion.nav
      className="pb-safe fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white/20 backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
      style={{
        paddingTop: '1rem',
        paddingBottom: 'calc(1.2rem + var(--safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, var(--safe-area-inset-left))',
        paddingRight: 'max(1rem, var(--safe-area-inset-right))',
      }}
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
        className="-mt-2 flex flex-col items-center pb-1"
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
