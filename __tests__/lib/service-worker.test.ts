import { registerServiceWorker } from '@/lib/notifications';

describe('Service Worker Registration', () => {
  let originalServiceWorker: any;

  beforeEach(() => {
    // Save original service worker
    originalServiceWorker = navigator.serviceWorker;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original objects
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker,
      writable: true,
    });
  });

  it('should register a service worker successfully', async () => {
    // Mock successful registration
    const mockRegistration = { scope: 'https://example.com/' };
    const mockRegister = jest.fn().mockResolvedValue(mockRegistration);

    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: mockRegister },
      writable: true,
    });

    // Check that 'serviceWorker' and 'PushManager' exist in window/navigator
    Object.defineProperty(window, 'PushManager', {
      value: {},
      writable: true,
    });

    const registration = await registerServiceWorker();

    expect(mockRegister).toHaveBeenCalledWith('/service-worker.js');
    expect(registration).toBe(mockRegistration);
  });

  it('should handle service worker registration failure', async () => {
    // Mock failed registration
    const mockError = new Error('Registration failed');
    const mockRegister = jest.fn().mockRejectedValue(mockError);

    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register: mockRegister },
      writable: true,
    });

    // Check that 'serviceWorker' and 'PushManager' exist in window/navigator
    Object.defineProperty(window, 'PushManager', {
      value: {},
      writable: true,
    });

    const registration = await registerServiceWorker();

    expect(mockRegister).toHaveBeenCalledWith('/service-worker.js');
    expect(registration).toBeNull();
  });

  it('should return null if service workers are not supported', async () => {
    // Mock service worker not supported
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      writable: true,
    });

    const registration = await registerServiceWorker();

    expect(registration).toBeNull();
  });
});
