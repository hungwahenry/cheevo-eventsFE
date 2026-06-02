import {
  useDeleteComment,
  useEventComments,
} from '@/features/event-comments/hooks';
import type { EventComment, ReplyTarget } from '@/features/event-comments/types';
import * as React from 'react';

export function useCommentsSheet(eventId: string) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] = React.useState<ReplyTarget | null>(null);
  const [actionsTarget, setActionsTarget] = React.useState<EventComment | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<EventComment | null>(null);

  const list = useEventComments(eventId, isOpen);
  const remove = useDeleteComment(eventId);

  const items = React.useMemo(
    () => list.data?.pages.flatMap((p) => p.items) ?? [],
    [list.data]
  );

  const replyTo = React.useCallback((comment: EventComment) => {
    setReplyTarget({
      parentId: comment.parent_id ?? comment.id,
      mentionedUserId: comment.author.id,
      mentionUsername: comment.author.username,
    });
  }, []);

  const clearReply = React.useCallback(() => setReplyTarget(null), []);

  const openActions = React.useCallback((comment: EventComment) => {
    setActionsTarget(comment);
  }, []);

  const requestDelete = React.useCallback((comment: EventComment) => {
    setPendingDelete(comment);
  }, []);

  const cancelDelete = React.useCallback(() => setPendingDelete(null), []);

  const confirmDelete = React.useCallback(() => {
    if (!pendingDelete) return;
    remove.mutate(pendingDelete);
    setPendingDelete(null);
  }, [pendingDelete, remove]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setReplyTarget(null);
  }, []);

  return {
    isOpen,
    setIsOpen,
    isInitialLoading: list.data === undefined,
    items,
    fetchNextPage: list.fetchNextPage,
    hasNextPage: list.hasNextPage,
    isFetchingNextPage: list.isFetchingNextPage,
    replyTarget,
    replyTo,
    clearReply,
    actionsTarget,
    openActions,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
    handleClose,
  };
}
