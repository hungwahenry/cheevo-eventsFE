export type InboxNotificationType =
  | 'attendee.order_paid'
  | 'attendee.event_starting_soon'
  | 'attendee.new_event_from_subscription'
  | 'attendee.comment_reply'
  | string;

export type InboxNotification = {
  id: string;
  type: InboxNotificationType;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

export type InboxPage = {
  items: InboxNotification[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};

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
