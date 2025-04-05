'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart2, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TemperatureProvider } from '@/lib/context/temperature-context';
import { AuthProvider } from '@/lib/context/auth-context';
import ErrorBoundary from '@/components/ui/error-boundary';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  return (
    <AuthProvider>
      <TemperatureProvider>
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-sky-400 to-purple-500 p-4 text-white transition-colors duration-300 dark:from-slate-900 dark:to-purple-900">
          <div className="has-bottom-nav w-full max-w-md pt-4">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>

          <BottomNav pathname={pathname} />
        </div>
      </TemperatureProvider>
    </AuthProvider>
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
        paddingBottom: 'calc(1rem + var(--safe-area-inset-bottom))',
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
