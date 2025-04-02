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
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useTemperature } from '@/lib/context/temperature-context';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const { theme, setTheme } = useTheme();
  const { unit, toggleUnit, isReady } = useTemperature();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Get current user on component mount
    setCurrentUser(getCurrentUser());
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    // Optionally redirect to home page
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-sky-400 to-purple-500 p-4 text-white transition-colors duration-300 dark:from-slate-900 dark:to-purple-900">
      <div className="w-full max-w-md">
        <header className="mb-6 flex items-center">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4 rounded-full bg-white/20 p-2 backdrop-blur-md dark:bg-slate-800/40"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </header>

        {/* Account Section */}
        <motion.div
          className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold">Account</h2>

            {currentUser ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 dark:bg-slate-700/40">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-white/70">{currentUser.email}</p>
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
            ) : (
              <div className="space-y-4">
                <p className="mb-4 text-white/80">
                  Sign in to save your preferences and access your weather data across devices.
                </p>

                <Link href="/auth/login" className="mb-4 block w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center rounded-xl bg-white/20 py-3 font-medium transition-all duration-300 hover:bg-white/30 dark:bg-slate-700/40 dark:hover:bg-slate-700/50"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Log In
                  </motion.button>
                </Link>

                <Link href="/auth/signup" className="block w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center rounded-xl bg-white/10 py-3 font-medium transition-all duration-300 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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

        {/* Preferences Section */}
        <motion.div
          className="mb-6 w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                    <Switch checked={unit === 'F'} onCheckedChange={toggleUnit} />
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
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activePage="settings" />
    </div>
  );
}

function BottomNav({ activePage }: { activePage: string }) {
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
