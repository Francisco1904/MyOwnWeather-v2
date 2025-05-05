import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '@/lib/context/notification-context';
import { useAuth } from '@/lib/context/auth-context';
import { requestNotificationPermission } from '@/lib/notifications';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Mock dependencies
jest.mock('@/lib/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/notifications', () => ({
  supportsNotifications: jest.fn(() => true),
  getNotificationPermission: jest.fn(() => 'default'),
  requestNotificationPermission: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn().mockResolvedValue(undefined),
  onSnapshot: jest.fn(),
}));

// Test component that uses the notification context
const TestComponent = () => {
  const {
    notificationPreferences,
    updateMasterToggle,
    updateNotificationCategory,
    hasPermission,
    requestPermission,
  } = useNotifications();

  return (
    <div>
      <div data-testid="master-enabled">{notificationPreferences.masterEnabled.toString()}</div>
      <div data-testid="daily-forecast">
        {notificationPreferences.categories.dailyForecast.toString()}
      </div>
      <div data-testid="has-permission">{hasPermission.toString()}</div>
      <button
        data-testid="toggle-master"
        onClick={() => updateMasterToggle(!notificationPreferences.masterEnabled)}
      >
        Toggle Master
      </button>
      <button
        data-testid="update-daily"
        onClick={() =>
          updateNotificationCategory(
            'categories.dailyForecast',
            !notificationPreferences.categories.dailyForecast
          )
        }
      >
        Toggle Daily Forecast
      </button>
      <button data-testid="request-permission" onClick={requestPermission}>
        Request Permission
      </button>
    </div>
  );
};

describe('NotificationProvider', () => {
  // Mock unsubscribe function
  const mockUnsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock auth
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'test-user-id' },
      isAuthenticated: true,
    });

    // Mock Firestore
    (doc as jest.Mock).mockReturnValue('mock-doc-ref');
    (onSnapshot as jest.Mock).mockImplementation((docRef, successCallback, errorCallback) => {
      // Simulate a snapshot with default data
      successCallback({
        exists: () => true,
        data: () => ({
          masterEnabled: false,
          categories: {
            dailyForecast: true,
            severeWeather: true,
            temperatureThresholds: {
              enabled: false,
              highThreshold: 95,
              lowThreshold: 32,
            },
            precipitationAlerts: true,
            uvIndexWarnings: true,
          },
        }),
      });

      return mockUnsubscribe;
    });
  });

  it('renders children and provides notification context', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('master-enabled').textContent).toBe('false');
      expect(screen.getByTestId('daily-forecast').textContent).toBe('true');
    });
  });

  it('updates master toggle when requested', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('master-enabled').textContent).toBe('false');
    });

    // Click to toggle master
    fireEvent.click(screen.getByTestId('toggle-master'));

    // Verify setDoc was called with the right parameters
    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        expect.objectContaining({
          masterEnabled: true,
        }),
        { merge: true }
      );
    });
  });

  it('updates notification category when requested', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('daily-forecast').textContent).toBe('true');
    });

    // Click to toggle daily forecast
    fireEvent.click(screen.getByTestId('update-daily'));

    // Verify setDoc was called with the right parameters
    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        expect.objectContaining({
          categories: expect.objectContaining({
            dailyForecast: false,
          }),
        }),
        expect.anything()
      );
    });
  });

  it('requests permission when needed', async () => {
    (requestNotificationPermission as jest.Mock).mockResolvedValue(true);

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('has-permission').textContent).toBe('false');
    });

    // Click to request permission
    fireEvent.click(screen.getByTestId('request-permission'));

    // Verify request was made
    await waitFor(() => {
      expect(requestNotificationPermission).toHaveBeenCalled();
    });
  });

  it('unsubscribes from Firestore when unmounted', async () => {
    const { unmount } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('master-enabled')).toBeInTheDocument();
    });

    // Unmount the component
    unmount();

    // Verify unsubscribe was called
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('handles unauthenticated users correctly', async () => {
    // Mock user as not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Wait for initial render with default settings
    await waitFor(() => {
      expect(screen.getByTestId('master-enabled').textContent).toBe('false');
    });

    // Verify that no Firestore calls were made
    expect(onSnapshot).not.toHaveBeenCalled();
  });
});
