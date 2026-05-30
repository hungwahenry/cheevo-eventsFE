import type { CommentAction } from '@/features/event-comments/components/comment-actions-sheet';
import type { EventComment } from '@/features/event-comments/types';
import { Trash2 } from 'lucide-react-native';
import * as React from 'react';

export function useCommentActions(
  comment: EventComment | null,
  handlers: { onDelete: (comment: EventComment) => void }
): CommentAction[] {
  return React.useMemo(() => {
    if (!comment) return [];
    const actions: CommentAction[] = [];

    if (comment.is_mine) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        destructive: true,
        onPress: () => handlers.onDelete(comment),
      });
    }

    return actions;
  }, [comment, handlers]);
}
