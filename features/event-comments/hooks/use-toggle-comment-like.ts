import { likeComment, unlikeComment } from '@/features/event-comments/api';
import { commentsKey } from '@/features/event-comments/hooks/use-event-comments';
import { repliesKey } from '@/features/event-comments/hooks/use-comment-replies';
import type { CommentsPage, EventComment } from '@/features/event-comments/types';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

type ToggleArgs = { comment: EventComment; next: boolean };

export function useToggleCommentLike(eventId: string) {
  const queryClient = useQueryClient();

  const apply = (comment: EventComment, next: boolean) => {
    const updater = (prev?: InfiniteData<CommentsPage>) =>
      prev
        ? {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              items: page.items.map((c) =>
                c.id === comment.id
                  ? {
                      ...c,
                      is_liked: next,
                      likes_count: Math.max(0, c.likes_count + (next ? 1 : -1)),
                    }
                  : c
              ),
            })),
          }
        : prev;

    queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey(eventId), updater);

    if (comment.parent_id !== null) {
      queryClient.setQueryData<InfiniteData<CommentsPage>>(
        repliesKey(eventId, comment.parent_id),
        updater
      );
    }
  };

  return useMutation({
    mutationFn: ({ comment, next }: ToggleArgs) =>
      next ? likeComment(eventId, comment.id) : unlikeComment(eventId, comment.id),
    onMutate: ({ comment, next }) => {
      apply(comment, next);
      return { comment, next };
    },
    onError: (_err, { comment, next }) => {
      apply(comment, !next);
    },
  });
}
