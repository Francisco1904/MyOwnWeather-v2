import { subscribeToPushNotifications, urlBase64ToUint8Array } from '@/lib/notifications';

describe('Push Subscription', () => {
  it('should subscribe to push notifications', async () => {
    // Mock service worker registration
    const mockPushSubscription = { endpoint: 'https://example.com/push' };
    const mockSubscribe = jest.fn().mockResolvedValue(mockPushSubscription);
    const mockPushManager = { subscribe: mockSubscribe };
    const mockRegistration = { pushManager: mockPushManager };

    const subscription = await subscribeToPushNotifications(mockRegistration as any);

    expect(mockSubscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
    });
    expect(subscription).toBe(mockPushSubscription);
  });

  it('should handle subscription failure', async () => {
    // Mock subscription failure
    const mockError = new Error('Subscription failed');
    const mockSubscribe = jest.fn().mockRejectedValue(mockError);
    const mockPushManager = { subscribe: mockSubscribe };
    const mockRegistration = { pushManager: mockPushManager };

    const subscription = await subscribeToPushNotifications(mockRegistration as any);

    expect(mockSubscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
    });
    expect(subscription).toBeNull();
  });

  it('converts urlBase64ToUint8Array correctly', () => {
    // Test with a known VAPID key format
    const sampleVapidKey =
      'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
    const result = urlBase64ToUint8Array(sampleVapidKey);

    // Check it returns a Uint8Array of the correct length
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(65); // The expected length for a VAPID key
  });
});
