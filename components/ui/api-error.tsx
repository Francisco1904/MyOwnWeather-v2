'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudOff, RefreshCcw, WifiOff, AlertTriangle, ServerCrash } from 'lucide-react';

export type ErrorType =
  | 'network'
  | 'server'
  | 'not-found'
  | 'unauthorized'
  | 'forbidden'
  | 'generic';

interface ApiErrorProps {
  message?: string;
  error?: Error | null;
  statusCode?: number;
  retry?: () => void;
  className?: string;
}

const getErrorType = (error: Error | null | undefined, statusCode?: number): ErrorType => {
  if (
    !navigator.onLine ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('network')
  ) {
    return 'network';
  }

  if (statusCode) {
    if (statusCode === 404) return 'not-found';
    if (statusCode === 401) return 'unauthorized';
    if (statusCode === 403) return 'forbidden';
    if (statusCode >= 500) return 'server';
  }

  return 'generic';
};

const ApiError: React.FC<ApiErrorProps> = ({
  message,
  error,
  statusCode,
  retry,
  className = '',
}) => {
  const errorType = getErrorType(error, statusCode);

  // Set default messages based on error type
  let title = 'Something went wrong';
  let description = message || error?.message || 'An unexpected error occurred';
  let Icon = AlertTriangle;

  switch (errorType) {
    case 'network':
      title = 'Connection Error';
      description = message || 'Please check your internet connection and try again';
      Icon = WifiOff;
      break;
    case 'server':
      title = 'Server Error';
      description = message || 'Our servers are experiencing issues. Please try again later';
      Icon = ServerCrash;
      break;
    case 'not-found':
      title = 'Not Found';
      description = message || 'The requested resource could not be found';
      Icon = CloudOff;
      break;
    case 'unauthorized':
      title = 'Authentication Required';
      description = message || 'Please log in to access this content';
      Icon = AlertTriangle;
      break;
    case 'forbidden':
      title = 'Access Denied';
      description = message || 'You do not have permission to access this resource';
      Icon = AlertTriangle;
      break;
  }

  return (
    <div
      className={`rounded-xl bg-white/20 p-6 text-center shadow-lg backdrop-blur-md dark:bg-slate-800/30 ${className}`}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="mb-4 text-sm opacity-90">{description}</p>
      {retry && (
        <Button
          onClick={retry}
          className="bg-white/20 hover:bg-white/30 dark:bg-slate-700/30 dark:hover:bg-slate-700/50"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ApiError;
