'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Calendar, CloudRain, Thermometer, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNotifications, NotificationPreferences } from '@/lib/context/notification-context';
import { useTemperature } from '@/lib/context/temperature-context';

interface NotificationCategoryProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode;
}

const NotificationCategory = ({
  title,
  description,
  icon,
  isEnabled,
  onToggle,
  children,
}: NotificationCategoryProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'mb-4 rounded-xl p-4 backdrop-blur-sm transition-all duration-300',
        isEnabled ? 'bg-white/10' : 'bg-white/5 opacity-75'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex max-w-[75%] items-start space-x-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
              isEnabled ? 'bg-white/20' : 'bg-white/10'
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className={cn('font-medium', !isEnabled && 'opacity-85')}>{title}</h3>
            <p className={cn('mt-0.5 pr-4 text-sm opacity-80', !isEnabled && 'opacity-70')}>
              {description}
            </p>
          </div>
        </div>

        <div className="ml-4 flex items-center justify-center">
          <Switch checked={isEnabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {children && isEnabled && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <span>Advanced options</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export function NotificationCategoriesPanel() {
  const { notificationPreferences, updateNotificationCategory } = useNotifications();
  const { unit } = useTemperature();

  const handleCategoryToggle = (category: string, value: boolean) => {
    updateNotificationCategory(`categories.${category}`, value);
  };

  const handleTempThresholdToggle = (value: boolean) => {
    updateNotificationCategory('categories.temperatureThresholds.enabled', value);
  };

  const handleTempThresholdChange = (type: 'high' | 'low', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    updateNotificationCategory(`categories.temperatureThresholds.${type}Threshold`, numValue);
  };

  // Extract values from the preferences
  const {
    dailyForecast,
    severeWeather,
    temperatureThresholds,
    precipitationAlerts,
    uvIndexWarnings,
  } = notificationPreferences.categories;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Notification Categories</h2>
      <p className="text-sm opacity-80">Customize which weather alerts you receive</p>

      <NotificationCategory
        title="Daily Forecasts"
        description="Get daily weather forecasts for your locations"
        icon={<Calendar className="h-5 w-5" />}
        isEnabled={dailyForecast}
        onToggle={value => handleCategoryToggle('dailyForecast', value)}
      />

      <NotificationCategory
        title="Severe Weather"
        description="Urgent alerts for severe weather conditions"
        icon={<AlertTriangle className="h-5 w-5" />}
        isEnabled={severeWeather}
        onToggle={value => handleCategoryToggle('severeWeather', value)}
      />

      <NotificationCategory
        title="Temperature Thresholds"
        description="Alerts when temperature exceeds your set thresholds"
        icon={<Thermometer className="h-5 w-5" />}
        isEnabled={temperatureThresholds.enabled}
        onToggle={handleTempThresholdToggle}
      >
        <div className="space-y-3">
          <div>
            <Label htmlFor="high-temp" className="mb-1 block text-sm">
              High temperature threshold (°{unit})
            </Label>
            <Input
              id="high-temp"
              type="number"
              value={temperatureThresholds.highThreshold}
              onChange={e => handleTempThresholdChange('high', e.target.value)}
              className="bg-white/10 text-white placeholder:text-white/50"
              placeholder={`e.g., ${unit === 'C' ? '32' : '90'}`}
              min={unit === 'C' ? 0 : 32}
              max={unit === 'C' ? 50 : 120}
            />
          </div>
          <div>
            <Label htmlFor="low-temp" className="mb-1 block text-sm">
              Low temperature threshold (°{unit})
            </Label>
            <Input
              id="low-temp"
              type="number"
              value={temperatureThresholds.lowThreshold}
              onChange={e => handleTempThresholdChange('low', e.target.value)}
              className="bg-white/10 text-white placeholder:text-white/50"
              placeholder={`e.g., ${unit === 'C' ? '0' : '32'}`}
              min={unit === 'C' ? -20 : -4}
              max={unit === 'C' ? 20 : 68}
            />
          </div>
        </div>
      </NotificationCategory>

      <NotificationCategory
        title="Precipitation Alerts"
        description="Get notified about upcoming rain, snow, or storms"
        icon={<CloudRain className="h-5 w-5" />}
        isEnabled={precipitationAlerts}
        onToggle={value => handleCategoryToggle('precipitationAlerts', value)}
      />

      <NotificationCategory
        title="UV Index Warnings"
        description="Warnings for high UV index levels"
        icon={<Sun className="h-5 w-5" />}
        isEnabled={uvIndexWarnings}
        onToggle={value => handleCategoryToggle('uvIndexWarnings', value)}
      />
    </div>
  );
}
