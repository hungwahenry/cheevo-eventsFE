import { api } from '@/lib/api';

export type NotificationChannelKey = 'email' | 'push' | 'inapp';
export type NotificationAudienceKey = 'organizer' | 'attendee';

export type NotificationChannelOption = {
  channel: NotificationChannelKey;
  label: string;
  enabled: boolean;
};

export type NotificationTypeOption = {
  type: string;
  label: string;
  description: string;
  audience: NotificationAudienceKey;
  channels: NotificationChannelOption[];
};

export type QuietHours = {
  start: string | null;
  end: string | null;
  timezone: string | null;
};

export type NotificationPreferences = {
  audiences: Array<{ value: NotificationAudienceKey; label: string }>;
  types: NotificationTypeOption[];
  quiet_hours: QuietHours;
};

export type PreferenceUpdate = {
  type: string;
  channel: NotificationChannelKey;
  enabled: boolean;
};

export function getNotificationPreferences(): Promise<NotificationPreferences> {
  return api.get<NotificationPreferences>('/notifications/preferences');
}

export function updateNotificationPreferences(
  updates: PreferenceUpdate[]
): Promise<null> {
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
