'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FavoritesList } from '@/components/weather/FavoritesList';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="mb-6 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center">
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
          <h1 className="text-2xl font-bold">Favorite Locations</h1>
        </div>
      </header>

      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/20 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-800/30">
        {!isAuthenticated ? (
          <div className="py-8 text-center">
            <h2 className="text-xl font-semibold">Login Required</h2>
            <p className="mt-2 text-sm opacity-80">
              Please log in to view and manage your favorite locations.
            </p>
            <Link href="/auth/login" className="mt-4 inline-block">
              <Button className="mt-4">Login</Button>
            </Link>
          </div>
        ) : (
          <FavoritesList />
        )}
      </div>
    </>
  );
}
