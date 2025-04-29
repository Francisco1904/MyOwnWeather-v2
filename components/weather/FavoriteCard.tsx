'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudSun, Droplets, Wind, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CurrentWeather } from '@/lib/services/weatherApi';
import { formatDate } from '@/lib/utils';
import { useTemperature } from '@/lib/context/temperature-context';
import { useTheme } from 'next-themes';
import { handleKeyboardActivation } from '@/lib/utils';

// Define types
interface FavoriteCardProps {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  weatherData: CurrentWeather | null;
  isLoading: boolean;
  error: Error | null;
  onSelect: () => void;
  isSelected: boolean;
  isActive: boolean;
}

export function FavoriteCard({
  location,
  weatherData,
  isLoading,
  error,
  onSelect,
  isSelected,
  isActive,
}: FavoriteCardProps) {
  const { unit, isReady } = useTemperature();

  // Helper function to get temperature in the selected unit
  const getTemp = (celsius: number, fahrenheit: number | undefined) => {
    return unit === 'C' ? Math.round(celsius) : Math.round(fahrenheit || celsius * 1.8 + 32);
  };

  if (isLoading) {
    return (
      <motion.div
        className="weather-card animate-pulse"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: isSelected ? 0 : 'auto',
          zIndex: isSelected ? 10 : 'auto',
        }}
        whileHover={{ scale: isActive ? 1.02 : 1 }}
        whileTap={{ scale: isActive ? 0.98 : 1 }}
        onClick={() => isActive && onSelect()}
        onKeyDown={e => {
          // Only handle Enter and Space, let Tab work naturally
          if (isActive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect();
          }
        }}
        tabIndex={isActive ? 0 : -1}
        role="button"
        aria-label={`Loading weather for ${location.name}`}
        aria-busy="true"
        style={{
          cursor: isActive ? 'pointer' : 'default',
          width: isSelected ? '100%' : '240px',
          minWidth: '240px',
          opacity: isActive ? 1 : 0.8,
        }}
      >
        <div className="flex justify-between">
          <Skeleton className="h-6 w-28 bg-white/20" />
        </div>
        <div className="mt-4 flex flex-col items-center">
          <Skeleton className="mb-2 h-16 w-16 rounded-full bg-white/20" />
          <Skeleton className="mb-2 h-8 w-16 bg-white/20" />
          <Skeleton className="h-4 w-24 bg-white/20" />
        </div>
      </motion.div>
    );
  }

  if (error || !weatherData) {
    return (
      <motion.div
        className="weather-card text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: isSelected ? 0 : 'auto',
          zIndex: isSelected ? 10 : 'auto',
        }}
        whileHover={{ scale: isActive ? 1.02 : 1 }}
        whileTap={{ scale: isActive ? 0.98 : 1 }}
        onClick={() => isActive && onSelect()}
        onKeyDown={e => {
          // Only handle Enter and Space, let Tab work naturally
          if (isActive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect();
          }
        }}
        tabIndex={isActive ? 0 : -1}
        role="button"
        aria-label={`Weather unavailable for ${location.name}. ${error?.message || 'Data unavailable'}`}
        style={{
          cursor: isActive ? 'pointer' : 'default',
          width: isSelected ? '100%' : '240px',
          minWidth: '240px',
          opacity: isActive ? 1 : 0.8,
        }}
      >
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <CloudSun className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <h3 className="mb-1 font-medium">{location.name}</h3>
        <p className="text-xs opacity-80">Data unavailable</p>
      </motion.div>
    );
  }

  const { current } = weatherData;

  return (
    <motion.div
      className="weather-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isSelected ? 0 : 'auto',
        zIndex: isSelected ? 10 : 'auto',
      }}
      whileHover={{ scale: isActive ? 1.02 : 1 }}
      whileTap={{ scale: isActive ? 0.98 : 1 }}
      onClick={() => isActive && onSelect()}
      onKeyDown={e => {
        // Only handle Enter and Space, let Tab work naturally
        if (isActive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={isActive ? 0 : -1}
      role="button"
      aria-label={`Weather for ${location.name}, ${location.country}. ${current.temp_c} degrees Celsius, ${current.condition.text}`}
      aria-pressed={isSelected}
      style={{
        cursor: isActive ? 'pointer' : 'default',
        width: isSelected ? '100%' : '240px',
        minWidth: '240px',
        opacity: isActive ? 1 : 0.8,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" aria-hidden="true" />
            <h3 className="text-lg font-bold">{location.name}</h3>
          </div>
          <p className="text-xs opacity-80">{location.country}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center">
        {/* Weather icon based on condition */}
        <div className="relative flex h-16 w-16 items-center justify-center" aria-hidden="true">
          {current?.condition?.text?.toLowerCase().includes('cloud') ? (
            <Cloud className="h-16 w-16 text-white" aria-hidden="true" />
          ) : current?.condition?.text?.toLowerCase().includes('sun') ||
            current?.condition?.text?.toLowerCase().includes('clear') ? (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300"
              aria-hidden="true"
            >
              <span className="sr-only">Sun</span>
            </div>
          ) : (
            <CloudSun className="h-16 w-16 text-white" aria-hidden="true" />
          )}
        </div>

        <h2 className="mt-1 text-3xl font-bold leading-none">
          {getTemp(current.temp_c, current.temp_f)}°{isReady ? unit : ''}
        </h2>

        <p className="mt-1 text-sm font-medium">{current.condition.text}</p>

        {isSelected && (
          <div className="mt-2 grid w-full grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <Droplets className="h-4 w-4 text-white" aria-hidden="true" />
              <p className="mt-1 text-xs">{current.humidity}%</p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <Wind className="h-4 w-4 text-white" aria-hidden="true" />
              <p className="mt-1 text-xs">
                {unit === 'C'
                  ? `${Math.round(current.wind_kph)} km/h`
                  : `${Math.round(current.wind_mph)} mph`}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <CloudSun className="h-4 w-4 text-white" aria-hidden="true" />
              <p className="mt-1 text-xs">
                {getTemp(current.feelslike_c, current.feelslike_f)}°{isReady ? unit : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
