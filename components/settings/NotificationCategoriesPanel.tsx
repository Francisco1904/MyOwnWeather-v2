'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Calendar, CloudRain, Thermometer, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNotifications, NotificationPreferences } from '@/lib/context/notification-context';
import { useTemperature } from '@/lib/context/temperature-context';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '@/lib/utils';
import { DEFAULT_TEMPERATURE_THRESHOLDS } from '@/lib/constants';

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
  const categoryId = `category-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const switchId = `${categoryId}-switch`;
  const panelId = `${categoryId}-panel`;
  const advancedBtnId = `${categoryId}-advanced-btn`;

  return (
    <div
      className={cn(
        'mb-4 rounded-xl p-4 backdrop-blur-sm transition-all duration-300',
        isEnabled ? 'bg-white/10' : 'bg-white/5 opacity-75'
      )}
      role="region"
      aria-labelledby={categoryId}
    >
      <div className="flex items-center justify-between">
        <div className="flex max-w-[75%] items-start space-x-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
              isEnabled ? 'bg-white/20' : 'bg-white/10'
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
          <div>
            <h3 id={categoryId} className={cn('font-medium', !isEnabled && 'opacity-85')}>
              {title}
            </h3>
            <p className={cn('mt-0.5 pr-4 text-sm opacity-80', !isEnabled && 'opacity-70')}>
              {description}
            </p>
          </div>
        </div>

        <div className="ml-4 flex items-center justify-center">
          <Label htmlFor={switchId} className="sr-only">
            Enable {title} notifications
          </Label>
          <Switch
            id={switchId}
            checked={isEnabled}
            onCheckedChange={onToggle}
            aria-describedby={categoryId}
          />
        </div>
      </div>

      {children && isEnabled && (
        <div className="mt-2">
          <button
            id={advancedBtnId}
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
            aria-expanded={expanded}
            aria-controls={panelId}
          >
            <span>Advanced options</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
                role="region"
                aria-labelledby={advancedBtnId}
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
  const [highTempInput, setHighTempInput] = useState<string>('');
  const [lowTempInput, setLowTempInput] = useState<string>('');
  const [previousUnit, setPreviousUnit] = useState<'C' | 'F'>(unit);

  // Initialize input values when preferences or unit changes
  useEffect(() => {
    if (notificationPreferences.categories.temperatureThresholds) {
      const { highThreshold, lowThreshold } =
        notificationPreferences.categories.temperatureThresholds;

      // If unit has changed, convert the values
      if (unit !== previousUnit) {
        // Convert temperatures when switching units
        if (unit === 'C' && previousUnit === 'F') {
          // Convert from F to C
          const highC = fahrenheitToCelsius(highThreshold);
          const lowC = fahrenheitToCelsius(lowThreshold);

          // Update both local state and stored preferences
          setHighTempInput(highC.toString());
          setLowTempInput(lowC.toString());
          updateNotificationCategory('categories.temperatureThresholds.highThreshold', highC);
          updateNotificationCategory('categories.temperatureThresholds.lowThreshold', lowC);
        } else if (unit === 'F' && previousUnit === 'C') {
          // Convert from C to F
          const highF = celsiusToFahrenheit(highThreshold);
          const lowF = celsiusToFahrenheit(lowThreshold);

          // Update both local state and stored preferences
          setHighTempInput(highF.toString());
          setLowTempInput(lowF.toString());
          updateNotificationCategory('categories.temperatureThresholds.highThreshold', highF);
          updateNotificationCategory('categories.temperatureThresholds.lowThreshold', lowF);
        }

        // Update previous unit
        setPreviousUnit(unit);
      } else {
        // No unit change, just update the input fields
        setHighTempInput(highThreshold.toString());
        setLowTempInput(lowThreshold.toString());
      }
    }
  }, [
    notificationPreferences.categories.temperatureThresholds,
    unit,
    previousUnit,
    updateNotificationCategory,
  ]);

  const handleCategoryToggle = (category: string, value: boolean) => {
    updateNotificationCategory(`categories.${category}`, value);
  };

  const handleTempThresholdToggle = (value: boolean) => {
    updateNotificationCategory('categories.temperatureThresholds.enabled', value);
  };

  const handleTempThresholdChange = (type: 'high' | 'low', value: string) => {
    // Update the local input state to allow for empty values
    if (type === 'high') {
      setHighTempInput(value);
    } else {
      setLowTempInput(value);
    }

    // Only update the stored preferences if it's a valid number
    if (value !== '') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        updateNotificationCategory(`categories.temperatureThresholds.${type}Threshold`, numValue);
      }
    }
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
      <h2 id="notification-categories-heading" className="text-lg font-medium">
        Notification Categories
      </h2>
      <p className="text-sm opacity-80">Customize which weather alerts you receive</p>

      <div role="group" aria-labelledby="notification-categories-heading">
        <NotificationCategory
          title="Daily Forecasts"
          description="Get daily weather forecasts for your locations"
          icon={<Calendar className="h-5 w-5" aria-hidden="true" />}
          isEnabled={dailyForecast}
          onToggle={value => handleCategoryToggle('dailyForecast', value)}
        />

        <NotificationCategory
          title="Severe Weather"
          description="Urgent alerts for severe weather conditions"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          isEnabled={severeWeather}
          onToggle={value => handleCategoryToggle('severeWeather', value)}
        />

        <NotificationCategory
          title="Temperature Thresholds"
          description="Alerts when temperature exceeds your set thresholds"
          icon={<Thermometer className="h-5 w-5" aria-hidden="true" />}
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
                value={highTempInput}
                onChange={e => handleTempThresholdChange('high', e.target.value)}
                className="bg-white/10 text-white placeholder:text-white/50"
                placeholder={`e.g., ${DEFAULT_TEMPERATURE_THRESHOLDS[unit].high}`}
                min={unit === 'C' ? 0 : 32}
                max={unit === 'C' ? 50 : 120}
                aria-describedby="high-temp-desc"
              />
              <p id="high-temp-desc" className="mt-1 text-xs opacity-70">
                You'll be notified when temperature exceeds this value
              </p>
            </div>
            <div>
              <Label htmlFor="low-temp" className="mb-1 block text-sm">
                Low temperature threshold (°{unit})
              </Label>
              <Input
                id="low-temp"
                type="number"
                value={lowTempInput}
                onChange={e => handleTempThresholdChange('low', e.target.value)}
                className="bg-white/10 text-white placeholder:text-white/50"
                placeholder={`e.g., ${DEFAULT_TEMPERATURE_THRESHOLDS[unit].low}`}
                min={unit === 'C' ? -20 : -4}
                max={unit === 'C' ? 20 : 68}
                aria-describedby="low-temp-desc"
              />
              <p id="low-temp-desc" className="mt-1 text-xs opacity-70">
                You'll be notified when temperature drops below this value
              </p>
            </div>
          </div>
        </NotificationCategory>

        <NotificationCategory
          title="Precipitation Alerts"
          description="Get notified about upcoming rain, snow, or storms"
          icon={<CloudRain className="h-5 w-5" aria-hidden="true" />}
          isEnabled={precipitationAlerts}
          onToggle={value => handleCategoryToggle('precipitationAlerts', value)}
        />

        <NotificationCategory
          title="UV Index Warnings"
          description="Warnings for high UV index levels"
          icon={<Sun className="h-5 w-5" aria-hidden="true" />}
          isEnabled={uvIndexWarnings}
          onToggle={value => handleCategoryToggle('uvIndexWarnings', value)}
        />
      </div>
    </div>
  );
}
