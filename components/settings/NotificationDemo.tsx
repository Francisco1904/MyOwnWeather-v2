'use client';

import { useState } from 'react';
import { Bell, AlertTriangle, Sun, CloudRain, Thermometer, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { showWeatherNotification } from '@/lib/notifications';
import { useNotifications } from '@/lib/context/notification-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NotificationType } from '@/lib/notificationService';
import { cn } from '@/lib/utils';

export function NotificationDemo() {
  const { hasPermission, requestPermission, notificationPreferences } = useNotifications();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<NotificationType>(
    NotificationType.DAILY_FORECAST
  );

  // Demo notification content based on notification type
  const demoNotifications = {
    [NotificationType.DAILY_FORECAST]: {
      title: 'Daily Forecast: New York',
      body: 'Today: Partly cloudy, High: 24°C (75°F), Low: 16°C (61°F)',
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />,
      description: 'Daily weather forecasts',
    },
    [NotificationType.SEVERE_WEATHER]: {
      title: 'Severe Weather Alert: San Francisco',
      body: 'Thunderstorms expected in the afternoon with potential for heavy rainfall',
      icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
      description: 'Severe weather warnings',
    },
    [NotificationType.HIGH_TEMPERATURE]: {
      title: 'High Temperature Alert: Phoenix',
      body: 'Extreme heat warning: Currently 105°F (40°C)',
      icon: <Thermometer className="h-5 w-5" aria-hidden="true" />,
      description: 'High temperature alerts',
    },
    [NotificationType.LOW_TEMPERATURE]: {
      title: 'Low Temperature Alert: Chicago',
      body: 'Freeze warning: Currently 28°F (-2°C)',
      icon: <Thermometer className="h-5 w-5" aria-hidden="true" />,
      description: 'Low temperature alerts',
    },
    [NotificationType.PRECIPITATION]: {
      title: 'Rain Alert: Seattle',
      body: 'Heavy rain expected today (90% chance of precipitation)',
      icon: <CloudRain className="h-5 w-5" aria-hidden="true" />,
      description: 'Precipitation alerts',
    },
    [NotificationType.UV_INDEX]: {
      title: 'UV Index Warning: Miami',
      body: 'Very high UV index (9) today. Take precautions when outdoors.',
      icon: <Sun className="h-5 w-5" aria-hidden="true" />,
      description: 'UV index warnings',
    },
  };

  const handleSendTestNotification = async () => {
    setIsLoading(true);

    try {
      // If we don't have permission yet, request it
      if (!hasPermission) {
        await requestPermission();
      }

      const notifContent = demoNotifications[selectedType];

      // Attempt to show a test notification
      showWeatherNotification({
        title: notifContent.title,
        body: notifContent.body,
        tag: `demo-${selectedType}`,
        requireInteraction: selectedType === NotificationType.SEVERE_WEATHER,
        data: { type: selectedType, demo: true },
      });

      toast({
        title: 'Test notification sent',
        description: 'If notifications are enabled in your browser, you should see it now.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error sending test notification:', error);

      toast({
        title: 'Notification error',
        description:
          'Could not send test notification. Make sure notifications are enabled in your browser.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if this notification type is enabled in user preferences
  const isTypeEnabled = () => {
    switch (selectedType) {
      case NotificationType.DAILY_FORECAST:
        return notificationPreferences.categories.dailyForecast;
      case NotificationType.SEVERE_WEATHER:
        return notificationPreferences.categories.severeWeather;
      case NotificationType.HIGH_TEMPERATURE:
      case NotificationType.LOW_TEMPERATURE:
        return notificationPreferences.categories.temperatureThresholds.enabled;
      case NotificationType.PRECIPITATION:
        return notificationPreferences.categories.precipitationAlerts;
      case NotificationType.UV_INDEX:
        return notificationPreferences.categories.uvIndexWarnings;
      default:
        return false;
    }
  };

  const currentNotif = demoNotifications[selectedType];
  const enabled = isTypeEnabled();
  const demoId = 'notification-demo';
  const selectId = 'notification-type-select';
  const previewId = 'notification-preview';

  return (
    <div
      className="space-y-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
      role="region"
      aria-labelledby={demoId}
    >
      <div className="flex items-start space-x-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20"
          aria-hidden="true"
        >
          <Bell className="h-5 w-5" />
        </div>
        <div className="max-w-[90%]">
          <h3 id={demoId} className="font-medium">
            Notification Demo
          </h3>
          <p className="mt-0.5 pr-4 text-sm opacity-80">Try out weather notifications</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <label htmlFor={selectId} className="text-sm font-medium">
          Select notification type to test
        </label>
        <Select
          value={selectedType}
          onValueChange={value => setSelectedType(value as NotificationType)}
          name="notification-type"
        >
          <SelectTrigger
            id={selectId}
            className="border-white/20 bg-white/10 text-white"
            aria-label="Select notification type"
          >
            <SelectValue placeholder="Select notification type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(demoNotifications).map(([type, content]) => (
              <SelectItem key={type} value={type as string} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className="inline-flex" aria-hidden="true">
                    {content.icon}
                  </span>
                  <span>{content.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        id={previewId}
        className={cn(
          'rounded-lg border border-white/10 p-3 transition-all duration-300',
          enabled ? 'bg-white/5' : 'bg-white/5 opacity-75'
        )}
        role="region"
        aria-label="Notification preview"
      >
        <div className="flex items-center gap-2 font-medium">
          <div
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
              enabled ? 'bg-white/20' : 'bg-white/10'
            )}
            aria-hidden="true"
          >
            {currentNotif.icon}
          </div>
          <h4 className={cn(!enabled && 'opacity-85')} id={`${previewId}-title`}>
            {currentNotif.title}
          </h4>
        </div>
        <p className={cn('mt-1 text-sm', !enabled && 'opacity-80')} id={`${previewId}-body`}>
          {currentNotif.body}
        </p>
        {!enabled && (
          <p className="mt-2 text-xs text-yellow-300" id={`${previewId}-warning`} role="alert">
            Note: This notification type is currently disabled in your settings.
          </p>
        )}
      </div>

      <Button
        onClick={handleSendTestNotification}
        disabled={isLoading || !enabled}
        className={cn(
          'w-full text-white transition-all duration-300 hover:text-white',
          enabled
            ? 'bg-white/10 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40'
            : 'cursor-not-allowed bg-white/10 opacity-70'
        )}
        aria-busy={isLoading}
        aria-describedby={!enabled ? `${previewId}-warning` : undefined}
      >
        {isLoading
          ? 'Sending...'
          : enabled
            ? 'Send Test Notification'
            : 'Notification Type Disabled'}
      </Button>

      <p className="text-xs opacity-70" id="demo-description">
        This will send a test notification to demonstrate how weather alerts will appear on your
        device.
      </p>
    </div>
  );
}
