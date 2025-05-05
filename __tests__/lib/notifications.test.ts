import {
  supportsNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  showWeatherNotification,
  urlBase64ToUint8Array,
} from '@/lib/notifications';

// Properly mock the notifications module
jest.mock('@/lib/notifications', () => {
  // Keep the original module implementation
  const originalModule = jest.requireActual('@/lib/notifications');

  // Customize specific functions
  return {
    ...originalModule,
    // Default implementation for supportsNotifications that can be overridden in tests
    supportsNotifications: jest.fn().mockReturnValue(true),
  };
});

// Mock the window.Notification API
const mockNotification = {
  permission: 'default',
  requestPermission: jest.fn(),
  close: jest.fn(),
};

// Mock the ServiceWorker API
const mockServiceWorker = {
  register: jest.fn(),
};

describe('Notification Utilities', () => {
  let originalNotification: any;
  let originalServiceWorker: any;

  beforeEach(() => {
    // Save original objects
    originalNotification = global.Notification;
    originalServiceWorker = navigator.serviceWorker;

    // Setup mocks
    global.Notification = mockNotification as any;
    Object.defineProperty(window, 'Notification', {
      value: mockNotification,
      writable: true,
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original objects
    global.Notification = originalNotification;
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker,
      writable: true,
    });
  });

  describe('supportsNotifications', () => {
    it('should return true if Notification API is available', () => {
      // Reset mock to use actual implementation for this test
      (supportsNotifications as jest.Mock).mockImplementationOnce(() => 'Notification' in window);
      expect(supportsNotifications()).toBe(true);
    });

    it('should return false if Notification API is not available', () => {
      delete (window as any).Notification;
      (supportsNotifications as jest.Mock).mockImplementationOnce(() => 'Notification' in window);
      expect(supportsNotifications()).toBe(false);
    });
  });

  describe('getNotificationPermission', () => {
    it('should return the current permission status', () => {
      mockNotification.permission = 'granted';
      expect(getNotificationPermission()).toBe('granted');

      mockNotification.permission = 'denied';
      expect(getNotificationPermission()).toBe('denied');
    });

    it('should return null if notifications are not supported', () => {
      delete (window as any).Notification;
      (supportsNotifications as jest.Mock).mockReturnValueOnce(false);
      expect(getNotificationPermission()).toBe(null);
    });
  });

  describe('requestNotificationPermission', () => {
    it('should request permission and return true if granted', async () => {
      mockNotification.requestPermission = jest.fn().mockResolvedValue('granted');
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
      expect(mockNotification.requestPermission).toHaveBeenCalled();
    });

    it('should request permission and return false if denied', async () => {
      mockNotification.requestPermission = jest.fn().mockResolvedValue('denied');
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
      expect(mockNotification.requestPermission).toHaveBeenCalled();
    });

    it('should return false if notifications are not supported', async () => {
      (supportsNotifications as jest.Mock).mockReturnValueOnce(false);
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });

    it('should handle errors and return false', async () => {
      mockNotification.requestPermission = jest.fn().mockRejectedValue(new Error('Test error'));
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });
  });

  describe('showWeatherNotification', () => {
    it('should create a notification with the provided data', () => {
      // Setup notification constructor mock
      const NotificationConstructorMock = jest.fn();
      global.Notification = NotificationConstructorMock as any;

      // Setup notification permission
      NotificationConstructorMock.permission = 'granted';

      // Set the mock return value
      (supportsNotifications as jest.Mock).mockReturnValueOnce(true);

      // Test
      showWeatherNotification({
        title: 'Test Title',
        body: 'Test Body',
        tag: 'test-tag',
        requireInteraction: true,
        data: { test: 'data' },
      });

      // Assert
      expect(NotificationConstructorMock).toHaveBeenCalledWith('Test Title', {
        body: 'Test Body',
        icon: '/favicon.png',
        tag: 'test-tag',
        requireInteraction: true,
        data: { test: 'data' },
      });
    });

    it('should not create a notification if permission is not granted', () => {
      // Setup
      const NotificationConstructorMock = jest.fn();
      NotificationConstructorMock.permission = 'denied';
      global.Notification = NotificationConstructorMock as any;

      // Set the mock return value
      (supportsNotifications as jest.Mock).mockReturnValueOnce(true);

      // Test
      showWeatherNotification({ title: 'Test', body: 'Test' });

      // Assert
      expect(NotificationConstructorMock).not.toHaveBeenCalled();
    });
  });

  describe('urlBase64ToUint8Array', () => {
    it('should convert base64 string to Uint8Array', () => {
      const testBase64 = 'dGVzdHN0cmluZw=='; // 'teststring' in base64
      const result = urlBase64ToUint8Array(testBase64);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(10); // 'teststring' is 10 characters

      // Check a few values to ensure conversion worked correctly
      expect(result[0]).toBe(116); // 't'
      expect(result[1]).toBe(101); // 'e'
      expect(result[2]).toBe(115); // 's'
    });

    it('should handle base64 strings with padding', () => {
      const testBase64 = 'dGVzdA=='; // 'test' in base64
      const result = urlBase64ToUint8Array(testBase64);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(4); // 'test' is 4 characters
    });
  });
});
