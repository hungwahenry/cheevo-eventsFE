import { api } from '@/lib/api';

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

export function listInboxNotifications(page: number, perPage = 20): Promise<InboxPage> {
  return api.get<InboxPage>('/notifications', { params: { page, per_page: perPage } });
}

export function getUnreadCount(): Promise<{ unread: number }> {
  return api.get<{ unread: number }>('/notifications/unread-count');
}

export function markNotificationRead(id: string): Promise<null> {
  return api.patch<null>(`/notifications/${id}/read`);
}

export function markAllNotificationsRead(): Promise<null> {
  return api.patch<null>('/notifications/read-all');
}
