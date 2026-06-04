import { routeForNotification } from '@/lib/notification-routing';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function useNotificationResponseListener(): void {
  useEffect(() => {
    const handle = (
      response: Notifications.NotificationResponse | null
    ): void => {
      if (!response) return;
      const raw =
        (response.notification.request.content.data as
          | Record<string, any>
          | undefined) ?? {};
      const { type, ...rest } = raw;
      const target = routeForNotification(type, rest);
      if (target) router.push(target as any);
    };

    void Notifications.getLastNotificationResponseAsync().then(handle);

    const sub = Notifications.addNotificationResponseReceivedListener(handle);
    return () => sub.remove();
  }, []);
}
