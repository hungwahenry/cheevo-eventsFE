import { api } from '@/lib/api';

export * from './inbox';

export function registerPushToken(token: string, deviceId: string | null): Promise<null> {
  return api.post<null>('/notifications/push-tokens', {
    token,
    device_id: deviceId,
  });
}

export function unregisterPushToken(token: string): Promise<null> {
  return api.delete<null>('/notifications/push-tokens', {
    data: { token },
  });
}
