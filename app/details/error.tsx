'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiError from '@/components/ui/api-error';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Details page error:', error);
  }, [error]);

  return (
    <>
      <header className="section-header">
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
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Detailed Forecast
          </motion.h1>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ApiError error={error} retry={reset} statusCode={error.digest ? 500 : undefined} />
      </motion.div>
    </>
  );
}
