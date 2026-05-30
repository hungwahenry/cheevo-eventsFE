import { createComment } from '@/features/event-comments/api';
import { commentsKey } from '@/features/event-comments/hooks/use-event-comments';
import { repliesKey } from '@/features/event-comments/hooks/use-comment-replies';
import type {
  CommentsPage,
  CreateCommentPayload,
} from '@/features/event-comments/types';
import { eventKey } from '@/features/event-detail/hooks/use-event';
import type { EventDetail } from '@/features/event-detail/types';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

export function useCreateComment(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(eventId, payload),
    onSuccess: (created) => {
      const isReply = created.parent_id !== null;

      if (isReply) {
        queryClient.invalidateQueries({
          queryKey: repliesKey(eventId, created.parent_id as string),
        });

        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey(eventId), (prev) =>
          prev
            ? {
                ...prev,
                pages: prev.pages.map((page) => ({
                  ...page,
                  items: page.items.map((c) =>
                    c.id === created.parent_id
                      ? { ...c, replies_count: c.replies_count + 1 }
                      : c
                  ),
                })),
              }
            : prev
        );
      } else {
        queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey(eventId), (prev) => {
          if (!prev || prev.pages.length === 0) return prev;
          const [first, ...rest] = prev.pages;
          return {
            ...prev,
            pages: [
              { ...first, items: [created, ...first.items], total: first.total + 1 },
              ...rest,
            ],
          };
        });
      }

      queryClient.setQueryData<EventDetail>(eventKey(eventId), (prev) =>
        prev ? { ...prev, comments_count: prev.comments_count + 1 } : prev
      );
    },
  });
}

export type ReplyTarget = {
  parentId: string;
  mentionedUserId: string;
  mentionUsername: string | null;
};
