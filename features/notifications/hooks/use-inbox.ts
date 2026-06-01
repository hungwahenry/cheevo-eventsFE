import {
  getUnreadCount,
  listInboxNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type InboxPage,
} from '@/features/notifications/api';
import { useMutation, useQuery, useQueryClient, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';

export const inboxKey = ['notifications', 'inbox'] as const;
export const unreadCountKey = ['notifications', 'unread-count'] as const;

export function useInboxNotifications() {
  return useInfiniteQuery<InboxPage>({
    queryKey: inboxKey,
    queryFn: ({ pageParam }) => listInboxNotifications(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: unreadCountKey,
    queryFn: getUnreadCount,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKey });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKey });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
}
