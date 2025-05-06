import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { ForecastDay } from '@/lib/services/weatherApi';
import { formatDate, handleKeyboardActivation } from '@/lib/utils';
import { useTemperature } from '@/lib/context/temperature-context';

// Custom icon component to match the style in the screenshot
const WeatherIcon = memo(function WeatherIcon({
  icon,
  className = '',
  size = 24,
}: {
  icon: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white/20 p-2 ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      {icon}
    </div>
  );
});

WeatherIcon.displayName = 'WeatherIcon';

interface ForecastCardProps {
  day: ForecastDay;
  isExpanded: boolean;
  onToggle: () => void;
  index?: number;
  unit: string;
}

const ForecastCard = memo(function ForecastCard({
  day,
  isExpanded,
  onToggle,
  index = 0,
  unit,
}: ForecastCardProps) {
  const { isReady } = useTemperature();
  const { date, day: dayData } = day;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Measure the content height for smoother animations
  useEffect(() => {
    if (contentRef.current && isExpanded) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  // Memoize formatted date to prevent recalculation
  const formattedDate = useMemo(
    () => formatDate(date, isExpanded ? 'EEEE, d MMMM' : 'EEE, d MMM'),
    [date, isExpanded]
  );

  // Memoize icon component for better performance
  const weatherIcon = useMemo(() => getIcon(dayData.condition.text), [dayData.condition.text]);

  // Get appropriate icon based on condition
  function getIcon(condition: string) {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="h-5 w-5 text-white" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-5 w-5 text-white" />;
    } else {
      return <Sun className="h-5 w-5 text-white" />;
    }
  }

  // Helper function to get temperature in the selected unit
  const getTemp = useCallback(
    (celsius: number, fahrenheit: number) => {
      return unit === 'C' ? Math.round(celsius) : Math.round(fahrenheit);
    },
    [unit]
  );

  // Handler for keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle]
  );

  // Memoized temperature displays
  const maxTemp = useMemo(
    () => getTemp(dayData.maxtemp_c, dayData.maxtemp_f),
    [dayData.maxtemp_c, dayData.maxtemp_f, getTemp]
  );

  const minTemp = useMemo(
    () => getTemp(dayData.mintemp_c, dayData.mintemp_f),
    [dayData.mintemp_c, dayData.mintemp_f, getTemp]
  );

  // Animation variants for smoother transitions
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.05 * index, ease: 'easeOut' },
    },
  };

  const contentVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.25, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
      },
    },
    open: {
      height: contentHeight,
      opacity: 1,
      transition: {
        height: { duration: 0.25, ease: 'easeInOut' },
        opacity: { duration: 0.25, delay: 0.1 },
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="w-full overflow-hidden rounded-xl bg-white/10 shadow-md backdrop-blur-md dark:bg-slate-800/20"
    >
      <motion.div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={handleKeyDown}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <WeatherIcon icon={weatherIcon} />
          <div className="ml-3">
            <p className={`font-medium ${isExpanded ? 'text-lg' : ''}`}>{formattedDate}</p>
            <p className="text-sm opacity-80">{dayData.condition.text}</p>
          </div>
        </div>

        <div className="flex items-center">
          <p className="mr-4 text-xl font-bold">
            {maxTemp}°{isReady ? unit : ''}
            <span className="ml-1 text-sm opacity-70">
              {minTemp}°{isReady ? unit : ''}
            </span>
          </p>
          <motion.div
            className="rounded-full bg-white/10 p-1"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            ref={contentRef}
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden border-t border-white/10"
          >
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <WeatherIcon icon={<Wind className="h-4 w-4 text-white" />} size={20} />
                  <div className="ml-2">
                    <p className="text-xs opacity-70">Wind</p>
                    <p className="text-sm font-medium">
                      {unit === 'C' ? `${dayData.maxwind_kph} km/h` : `${dayData.maxwind_mph} mph`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WeatherIcon icon={<Droplets className="h-4 w-4 text-white" />} size={20} />
                  <div className="ml-2">
                    <p className="text-xs opacity-70">Humidity</p>
                    <p className="text-sm font-medium">{dayData.avghumidity}%</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WeatherIcon icon={<Sunrise className="h-4 w-4 text-white" />} size={20} />
                  <div className="ml-2">
                    <p className="text-xs opacity-70">Sunrise</p>
                    <p className="text-sm font-medium">{day.astro.sunrise}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WeatherIcon icon={<Sunset className="h-4 w-4 text-white" />} size={20} />
                  <div className="ml-2">
                    <p className="text-xs opacity-70">Sunset</p>
                    <p className="text-sm font-medium">{day.astro.sunset}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WeatherIcon icon={<CloudRain className="h-4 w-4 text-white" />} size={20} />
                  <div className="ml-2">
                    <p className="text-xs opacity-70">Rain Chance</p>
                    <p className="text-sm font-medium">{dayData.daily_chance_of_rain}%</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WeatherIcon icon={<Sun className="h-4 w-4 text-white" />} size={20} />
                  <div className="ml-2">
                    <p className="text-xs opacity-70">UV Index</p>
                    <p className="text-sm font-medium">{dayData.uv}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ForecastCard.displayName = 'ForecastCard';

export default ForecastCard;
