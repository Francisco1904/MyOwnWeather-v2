import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationDemo } from '@/components/settings/NotificationDemo';
import { useNotifications } from '@/lib/context/notification-context';
import { showWeatherNotification } from '@/lib/notifications';
import { useToast } from '@/components/ui/use-toast';
import { NotificationType } from '@/lib/notificationService';

// Mock dependencies
jest.mock('@/lib/context/notification-context', () => ({
  useNotifications: jest.fn(),
}));

jest.mock('@/lib/notifications', () => ({
  showWeatherNotification: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('NotificationDemo', () => {
  const mockToast = { toast: jest.fn() };
  const mockNotificationPreferences = {
    masterEnabled: true,
    categories: {
      dailyForecast: true,
      severeWeather: true,
      temperatureThresholds: {
        enabled: true,
        highThreshold: 95,
        lowThreshold: 32,
      },
      precipitationAlerts: true,
      uvIndexWarnings: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock notifications context
    (useNotifications as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn().mockResolvedValue(true),
      notificationPreferences: mockNotificationPreferences,
    });

    // Mock toast
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  it('renders the notification demo component', () => {
    render(<NotificationDemo />);

    // Check key elements are rendered
    expect(screen.getByText('Notification Demo')).toBeInTheDocument();
    expect(screen.getByText('Try out weather notifications')).toBeInTheDocument();
    expect(screen.getByText('Select notification type to test')).toBeInTheDocument();
    expect(screen.getByText('Send Test Notification')).toBeInTheDocument();
  });

  it('shows a disabled button if notification type is disabled', () => {
    // Mock preferences with daily forecast disabled
    (useNotifications as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
      notificationPreferences: {
        ...mockNotificationPreferences,
        categories: {
          ...mockNotificationPreferences.categories,
          dailyForecast: false,
        },
      },
    });

    render(<NotificationDemo />);

    // Get the send button and verify it's disabled
    const sendButton = screen.getByText('Notification Type Disabled');
    expect(sendButton).toBeDisabled();

    // Check for the warning
    expect(screen.getByText(/This notification type is currently disabled/)).toBeInTheDocument();
  });

  it('requests permission if not already granted', async () => {
    // Mock no permission
    const mockRequestPermission = jest.fn().mockResolvedValue(true);
    (useNotifications as jest.Mock).mockReturnValue({
      hasPermission: false,
      requestPermission: mockRequestPermission,
      notificationPreferences: mockNotificationPreferences,
    });

    render(<NotificationDemo />);

    // Click send notification button
    fireEvent.click(screen.getByText('Send Test Notification'));

    // Verify permission was requested
    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled();
    });
  });

  it('sends a notification with the correct type', async () => {
    render(<NotificationDemo />);

    // Select a notification type (default is daily forecast)

    // Click send notification button
    fireEvent.click(screen.getByText('Send Test Notification'));

    // Verify notification was shown
    await waitFor(() => {
      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          tag: expect.stringContaining('demo'),
        })
      );

      // Verify toast was shown
      expect(mockToast.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test notification sent',
        })
      );
    });
  });

  it('handles notification type selection', async () => {
    render(<NotificationDemo />);

    // First, open the select dropdown
    fireEvent.click(screen.getByRole('combobox'));

    // Wait for the select content to be visible
    await waitFor(() => {
      // Note: This might need adjustment based on how your Select component is implemented
      const severeWeatherOption = screen.getByText(/Severe Weather/i);
      fireEvent.click(severeWeatherOption);
    });

    // Now send the notification
    fireEvent.click(screen.getByText('Send Test Notification'));

    // Verify the correct notification type was used
    await waitFor(() => {
      expect(showWeatherNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Alert'),
          requireInteraction: true,
        })
      );
    });
  });

  it('shows error toast if notification fails', async () => {
    // Mock notification function to throw error
    (showWeatherNotification as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    render(<NotificationDemo />);

    // Click send notification button
    fireEvent.click(screen.getByText('Send Test Notification'));

    // Verify error toast was shown
    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Notification error',
          variant: 'destructive',
        })
      );
    });
  });
});
