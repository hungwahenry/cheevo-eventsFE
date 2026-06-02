import type {
  NotificationPreferences,
  PreferenceUpdate,
  QuietHours,
} from '@/features/notifications/types';
import { api } from '@/lib/api';

export function getNotificationPreferences(): Promise<NotificationPreferences> {
  return api.get<NotificationPreferences>('/notifications/preferences');
}

export function updateNotificationPreferences(updates: PreferenceUpdate[]): Promise<null> {
  return api.patch<null>('/notifications/preferences', { preferences: updates });
}

export function updateQuietHours(quietHours: QuietHours): Promise<NotificationPreferences> {
  return api.patch<NotificationPreferences>('/notifications/quiet-hours', {
    start: quietHours.start,
    end: quietHours.end,
    timezone: quietHours.timezone,
  });
}

export function toggleEventMute(eventId: string): Promise<{ muted: boolean }> {
  return api.post<{ muted: boolean }>(`/notifications/events/${eventId}/mute`);
}
