import { listReplies } from '@/features/event-comments/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export const repliesKey = (eventId: string, commentId: string) =>
  ['event-comment-replies', eventId, commentId] as const;

export function useCommentReplies(eventId: string, commentId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: repliesKey(eventId, commentId),
    queryFn: ({ pageParam }) => listReplies(eventId, commentId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled: enabled && Boolean(commentId),
  });
}
