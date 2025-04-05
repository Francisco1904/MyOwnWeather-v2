'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Moon,
  Sun,
  Home,
  BarChart2,
  Search,
  Settings,
  LogOut,
  User,
  UserPlus,
  LogIn,
  Star,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useTemperature } from '@/lib/context/temperature-context';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { FavoritesModal } from '@/components/favorites/FavoritesModal';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { unit, toggleUnit, isReady } = useTemperature();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await logout();
    // Redirect to home page
    router.push('/');
  };

  // Define the sections as separate components to reorder based on auth status
  const renderSignInSection = (delay = 0.1) => (
    <motion.div
      key="sign-in-section"
      className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Sign In</h2>
        <div className="space-y-6">
          <p className="text-white/80">
            Sign in to save your preferences and access your weather data across devices.
          </p>
          <div className="mt-6">
            <Link href="/auth/login" className="mb-3 block">
              <Button className="flex w-full items-center justify-center bg-white/20 py-6 text-white hover:bg-white/30 dark:bg-slate-700/50 dark:hover:bg-slate-700/60">
                <LogIn className="mr-2 h-5 w-5" />
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                className="flex w-full items-center justify-center bg-white/10 py-6 text-white hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40"
                variant="ghost"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAppearanceSection = (delay = 0.1) => (
    <motion.div
      key="appearance-section"
      className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Appearance</h2>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Dark Mode</Label>
                <p className="text-sm opacity-80">Switch between light and dark themes</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-300 dark:text-yellow-200" />
                <Switch
                  checked={isDark}
                  onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
                  className="data-[state=checked]:bg-slate-700"
                  ariaLabel="Toggle dark mode"
                  isThemeToggle={true}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>

            {/* Theme Preview */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme('light')}
                className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                  !isDark ? 'border-white ring-2 ring-white/50' : 'border-transparent'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-purple-500 opacity-90"></div>
                <div className="relative p-3">
                  <div className="mb-2 rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <div className="mb-1 h-3 w-16 rounded-full bg-white/60"></div>
                    <div className="h-3 w-10 rounded-full bg-white/60"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-6 w-6 rounded-full bg-white/30"></div>
                    <div className="h-6 w-10 rounded-lg bg-white/30"></div>
                  </div>
                  <div className="mt-2 text-center text-xs font-medium">Light</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme('dark')}
                className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                  isDark ? 'border-white ring-2 ring-white/50' : 'border-transparent'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900 opacity-90"></div>
                <div className="relative p-3">
                  <div className="mb-2 rounded-lg bg-slate-800/40 p-2 backdrop-blur-sm">
                    <div className="mb-1 h-3 w-16 rounded-full bg-white/40"></div>
                    <div className="h-3 w-10 rounded-full bg-white/40"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-6 w-6 rounded-full bg-slate-700/50"></div>
                    <div className="h-6 w-10 rounded-lg bg-slate-700/50"></div>
                  </div>
                  <div className="mt-2 text-center text-xs font-medium">Dark</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesSection = (delay = 0.2) => (
    <motion.div
      key="preferences-section"
      className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Preferences</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Temperature Unit</Label>
              <p className="text-sm opacity-80">Choose between Celsius and Fahrenheit</p>
            </div>
            {isReady && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">°C</span>
                <Switch
                  checked={unit === 'F'}
                  onCheckedChange={toggleUnit}
                  ariaLabel="Toggle temperature unit"
                />
                <span className="text-sm font-medium">°F</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Notifications</Label>
                <p className="text-sm opacity-80">Receive weather alerts and updates</p>
              </div>
              <Switch defaultChecked={false} ariaLabel="Toggle notifications" />
            </div>
          </div>

          {isAuthenticated && (
            <div className="border-t border-white/10 pt-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Favorite Locations</Label>
                  <p className="text-sm opacity-80">Manage your saved locations</p>
                </div>
                <Button
                  className="flex w-full items-center justify-center bg-white/10 py-6 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40"
                  variant="ghost"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Star className="mr-2 h-5 w-5" />
                  Manage Favorites
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderAccountSection = (delay = 0.3) => (
    <motion.div
      key="account-section"
      className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Account</h2>

        <div className="space-y-6">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 dark:bg-slate-700/40">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{user?.displayName}</p>
              <p className="text-sm text-white/70">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-xl bg-white/10 py-3 font-medium transition-all duration-300 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Order the sections based on authentication status
  const getOrderedSections = () => {
    if (isAuthenticated) {
      // When authenticated: Appearance, Preferences, Account
      return [
        renderAppearanceSection(0.1),
        renderPreferencesSection(0.2),
        renderAccountSection(0.3),
      ];
    } else {
      // When not authenticated: Sign In, Appearance, Preferences
      return [
        renderSignInSection(0.1),
        renderAppearanceSection(0.2),
        renderPreferencesSection(0.3),
      ];
    }
  };

  return (
    <>
      <header className="section-header">
        <Link href="/" aria-label="Go back to home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-4 rounded-full bg-white/20 p-2 backdrop-blur-md dark:bg-slate-800/40"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        </Link>
        <h1 className="section-title">Settings</h1>
      </header>

      {getOrderedSections()}

      {/* Favorites Modal */}
      <FavoritesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
