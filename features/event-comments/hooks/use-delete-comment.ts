import { deleteComment } from '@/features/event-comments/api';
import { commentsKey } from '@/features/event-comments/hooks/use-event-comments';
import { repliesKey } from '@/features/event-comments/hooks/use-comment-replies';
import type { CommentsPage, EventComment } from '@/features/event-comments/types';
import { eventKey } from '@/features/event-detail/hooks/use-event';
import type { EventDetail } from '@/features/event-detail/types';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

export function useDeleteComment(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: EventComment) => deleteComment(eventId, comment.id),
    onSuccess: (_data, comment) => {
      const decrementBy = 1 + comment.replies_count;

      if (comment.parent_id !== null) {
        queryClient.setQueryData<InfiniteData<CommentsPage>>(
          repliesKey(eventId, comment.parent_id),
          (prev) =>
            prev
              ? {
                  ...prev,
                  pages: prev.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((c) => c.id !== comment.id),
                    total: Math.max(0, page.total - 1),
                  })),
                }
              : prev
        );

        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey(eventId), (prev) =>
          prev
            ? {
                ...prev,
                pages: prev.pages.map((page) => ({
                  ...page,
                  items: page.items.map((c) =>
                    c.id === comment.parent_id
                      ? { ...c, replies_count: Math.max(0, c.replies_count - 1) }
                      : c
                  ),
                })),
              }
            : prev
        );
      } else {
        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey(eventId), (prev) =>
          prev
            ? {
                ...prev,
                pages: prev.pages.map((page) => ({
                  ...page,
                  items: page.items.filter((c) => c.id !== comment.id),
                  total: Math.max(0, page.total - 1),
                })),
              }
            : prev
        );

        queryClient.removeQueries({ queryKey: repliesKey(eventId, comment.id) });
      }

      queryClient.setQueryData<EventDetail>(eventKey(eventId), (prev) =>
        prev ? { ...prev, comments_count: Math.max(0, prev.comments_count - decrementBy) } : prev
      );
    },
  });
}
