'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TemperatureUnit = 'C' | 'F';

interface TemperatureContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
  isReady: boolean;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function useTemperature(): TemperatureContextType {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
}

interface TemperatureProviderProps {
  children: ReactNode;
}

export function TemperatureProvider({ children }: TemperatureProviderProps) {
  // Start with C as default but don't show it until we've read from localStorage
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize from localStorage or default to Celsius
    const storedUnit = localStorage.getItem('temperatureUnit');
    if (storedUnit === 'F') {
      setUnit('F');
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    // Only save to localStorage after initial hydration
    if (isReady) {
      localStorage.setItem('temperatureUnit', unit);
    }
  }, [unit, isReady]);

  const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <TemperatureContext.Provider value={{ unit, setUnit, toggleUnit, isReady }}>
      {children}
    </TemperatureContext.Provider>
  );
}
