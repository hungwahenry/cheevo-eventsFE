import {
  getUnreadCount,
  listInboxNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type InboxPage,
} from '@/features/notifications/api';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const inboxKey = ['notifications', 'inbox'] as const;
export const unreadCountKey = ['notifications', 'unread-count'] as const;

type UnreadCount = { unread: number };

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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inboxKey });
      await queryClient.cancelQueries({ queryKey: unreadCountKey });

      const previousInbox = queryClient.getQueryData<{ pages: InboxPage[] }>(inboxKey);
      const previousCount = queryClient.getQueryData<UnreadCount>(unreadCountKey);

      if (previousInbox) {
        queryClient.setQueryData(inboxKey, {
          ...previousInbox,
          pages: previousInbox.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === id && item.read_at === null
                ? { ...item, read_at: new Date().toISOString() }
                : item
            ),
          })),
        });
      }

      if (previousCount && previousCount.unread > 0) {
        queryClient.setQueryData<UnreadCount>(unreadCountKey, {
          unread: Math.max(0, previousCount.unread - 1),
        });
      }

      return { previousInbox, previousCount };
    },
    onError: (_err, _id, context) => {
      if (context?.previousInbox) queryClient.setQueryData(inboxKey, context.previousInbox);
      if (context?.previousCount) queryClient.setQueryData(unreadCountKey, context.previousCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKey });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: inboxKey });
      await queryClient.cancelQueries({ queryKey: unreadCountKey });

      const previousInbox = queryClient.getQueryData<{ pages: InboxPage[] }>(inboxKey);
      const previousCount = queryClient.getQueryData<UnreadCount>(unreadCountKey);
      const readAt = new Date().toISOString();

      if (previousInbox) {
        queryClient.setQueryData(inboxKey, {
          ...previousInbox,
          pages: previousInbox.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.read_at === null ? { ...item, read_at: readAt } : item)),
          })),
        });
      }

      queryClient.setQueryData<UnreadCount>(unreadCountKey, { unread: 0 });

      return { previousInbox, previousCount };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousInbox) queryClient.setQueryData(inboxKey, context.previousInbox);
      if (context?.previousCount) queryClient.setQueryData(unreadCountKey, context.previousCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKey });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
}
