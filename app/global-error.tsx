'use client';

import React from 'react';
import { useEffect } from 'react';
import ApiError from '@/components/ui/api-error';
import { Button } from '@/components/ui/button';
import { Home, RefreshCcw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-purple-500 p-4 text-white">
        <div className="w-full max-w-md">
          <ApiError
            error={error}
            message="A critical error has occurred in the application"
            statusCode={error.digest ? 500 : undefined}
            className="mb-4"
          />

          <div className="mt-6 flex gap-4">
            <Button onClick={reset} className="flex-1 bg-white/20 py-6 hover:bg-white/30">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              onClick={() => (window.location.href = '/')}
              className="flex-1 bg-white/20 py-6 hover:bg-white/30"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
