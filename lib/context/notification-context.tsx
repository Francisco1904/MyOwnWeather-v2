'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  supportsNotifications,
  getNotificationPermission,
  requestNotificationPermission,
} from '@/lib/notifications';
import { DEFAULT_NOTIFICATION_SETTINGS } from '@/lib/constants';

// Types for notification preferences
export interface NotificationPreferences {
  masterEnabled: boolean;
  categories: {
    dailyForecast: boolean;
    severeWeather: boolean;
    temperatureThresholds: {
      enabled: boolean;
      highThreshold: number; // in user's preferred temperature unit
      lowThreshold: number; // in user's preferred temperature unit
    };
    precipitationAlerts: boolean;
    uvIndexWarnings: boolean;
  };
}

// Default notification preferences from constants
const defaultNotificationPreferences: NotificationPreferences = DEFAULT_NOTIFICATION_SETTINGS;

// Define the context type
interface NotificationContextType {
  notificationPreferences: NotificationPreferences;
  loading: boolean;
  updateMasterToggle: (enabled: boolean) => Promise<void>;
  updateNotificationCategory: (categoryPath: string, value: any) => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Custom hook to use notifications context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences
  );
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // Check if browser supports notifications
  const notificationSupported = typeof window !== 'undefined' && supportsNotifications();

  // Check notification permission status
  useEffect(() => {
    if (notificationSupported) {
      const permission = getNotificationPermission();
      setHasPermission(permission === 'granted');
    }
  }, [notificationSupported]);

  // Request notification permission
  const requestPermission = async () => {
    if (!notificationSupported) {
      console.warn('Notifications not supported in this browser');
      return;
    }

    try {
      const permissionGranted = await requestNotificationPermission();
      setHasPermission(permissionGranted);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Load user notification preferences from Firestore
  useEffect(() => {
    setLoading(true);

    // No need to fetch if not authenticated
    if (!isAuthenticated || !user) {
      setNotificationPreferences(defaultNotificationPreferences);
      setLoading(false);
      return;
    }

    // Reference to user's preferences doc
    const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'notifications');

    // Set up real-time listener for notification preferences
    const unsubscribe = onSnapshot(
      userPrefsRef,
      docSnapshot => {
        if (docSnapshot.exists()) {
          setNotificationPreferences(docSnapshot.data() as NotificationPreferences);
        } else {
          // If no preferences exist, create default ones
          setDoc(userPrefsRef, defaultNotificationPreferences).catch(error =>
            console.error('Error setting default notification preferences:', error)
          );
          setNotificationPreferences(defaultNotificationPreferences);
        }
        setLoading(false);
      },
      error => {
        console.error('Error getting notification preferences:', error);
        setNotificationPreferences(defaultNotificationPreferences);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, user]);

  // Update master toggle
  const updateMasterToggle = async (enabled: boolean) => {
    if (!isAuthenticated || !user) return;

    try {
      // Update local state
      setNotificationPreferences(prev => ({
        ...prev,
        masterEnabled: enabled,
      }));

      // Update in database
      const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'notifications');
      await setDoc(
        userPrefsRef,
        {
          ...notificationPreferences,
          masterEnabled: enabled,
        },
        { merge: true }
      );

      // Request browser permission if enabling notifications
      if (enabled && !hasPermission && notificationSupported) {
        await requestPermission();
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  // Update specific notification category
  const updateNotificationCategory = async (categoryPath: string, value: any) => {
    if (!isAuthenticated || !user) return;

    try {
      // Create a deep copy to work with
      const updatedPreferences = JSON.parse(JSON.stringify(notificationPreferences));

      // Handle deep path updates like 'categories.temperatureThresholds.highThreshold'
      const pathParts = categoryPath.split('.');
      let current = updatedPreferences;

      // Navigate to the right location in the object
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }

      // Update the value
      current[pathParts[pathParts.length - 1]] = value;

      // Update local state
      setNotificationPreferences(updatedPreferences);

      // Update in database
      const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'notifications');
      await setDoc(userPrefsRef, updatedPreferences, { merge: true });
    } catch (error) {
      console.error('Error updating notification category:', error);
    }
  };

  const value = {
    notificationPreferences,
    loading,
    updateMasterToggle,
    updateNotificationCategory,
    hasPermission,
    requestPermission,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
