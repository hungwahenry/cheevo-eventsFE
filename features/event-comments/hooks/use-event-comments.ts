import { listComments } from '@/features/event-comments/api';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

export const commentsKey = (eventId: string) => ['event-comments', eventId] as const;

export function useEventComments(eventId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: commentsKey(eventId),
    queryFn: ({ pageParam }) => listComments(eventId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
    enabled,
  });
}
