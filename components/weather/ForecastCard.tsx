import React from 'react';
import { motion } from 'framer-motion';
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
import { formatDate } from '@/lib/utils';
import { useTemperature } from '@/lib/context/temperature-context';

// Custom icon component to match the style in the screenshot
function WeatherIcon({
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
}

interface ForecastCardProps {
  day: ForecastDay;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export default function ForecastCard({ day, isExpanded, onToggle, index }: ForecastCardProps) {
  const { unit, isReady } = useTemperature();
  const { date, day: dayData } = day;
  const formattedDate = formatDate(date, isExpanded ? 'EEEE, d MMMM' : 'EEE, d MMM');

  // Get appropriate icon based on condition
  const getIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="h-5 w-5 text-white" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-5 w-5 text-white" />;
    } else {
      return <Sun className="h-5 w-5 text-white" />;
    }
  };

  // Helper function to get temperature in the selected unit
  const getTemp = (celsius: number, fahrenheit: number) => {
    return unit === 'C' ? Math.round(celsius) : Math.round(fahrenheit);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="w-full overflow-hidden rounded-xl bg-white/10 shadow-md backdrop-blur-md dark:bg-slate-800/20"
    >
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={e => e.key === 'Enter' && onToggle()}
      >
        <div className="flex items-center">
          <WeatherIcon icon={getIcon(dayData.condition.text)} />
          <div className="ml-3">
            <p className={`font-medium ${isExpanded ? 'text-lg' : ''}`}>{formattedDate}</p>
            <p className="text-sm opacity-80">{dayData.condition.text}</p>
          </div>
        </div>

        <div className="flex items-center">
          <p className="mr-4 text-xl font-bold">
            {getTemp(dayData.maxtemp_c, dayData.maxtemp_f)}°{isReady ? unit : ''}
            <span className="ml-1 text-sm opacity-70">
              {getTemp(dayData.mintemp_c, dayData.mintemp_f)}°{isReady ? unit : ''}
            </span>
          </p>
          <div className="rounded-full bg-white/10 p-1">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="border-t border-white/10 px-4 py-3"
        >
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
        </motion.div>
      )}
    </motion.div>
  );
}
