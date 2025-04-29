import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart2, Search, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Determine active page based on current pathname
  const getActivePage = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/details')) return 'details';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/settings')) return 'settings';
    return '';
  };

  const activePage = getActivePage();

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-sky-400 to-purple-500 p-4 pb-20 text-white transition-colors duration-300 dark:from-slate-900 dark:to-purple-900">
      <AnimatePresence mode="wait">
        <div className="w-full max-w-md">{children}</div>
      </AnimatePresence>

      {/* Bottom Navigation - now shared across all pages */}
      <BottomNav activePage={activePage} />
    </div>
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
      aria-label="Main navigation"
      role="navigation"
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
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="rounded-md"
    >
      <motion.div
        className="flex flex-col items-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div
          className={`rounded-full p-2 transition-colors duration-300 ${
            active ? 'bg-white/30 dark:bg-slate-700/40' : 'text-white/70'
          }`}
          aria-hidden="true"
        >
          {icon}
        </div>
        <span className={`mt-1 text-xs ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
      </motion.div>
    </Link>
  );
}
