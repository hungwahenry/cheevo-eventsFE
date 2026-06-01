import { useSession } from '@/features/auth/stores';
import { registerPushToken } from '@/features/notifications/api';
import { requestExpoPushToken } from '@/lib/notifications';
import { useEffect, useRef } from 'react';

export function usePushTokenRegistration(): void {
  const { status } = useSession();
  const registeredFor = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      registeredFor.current = null;
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await requestExpoPushToken();
      if (cancelled || result.status !== 'granted') return;
      if (registeredFor.current === result.token) return;

      try {
        await registerPushToken(result.token, result.deviceId);
        registeredFor.current = result.token;
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);
}
