import type { CommentAction } from '@/features/event-comments/components/comment-actions-sheet';
import type { EventComment } from '@/features/event-comments/types';
import { Copy, Flag, Share2, Trash2 } from 'lucide-react-native';
import * as React from 'react';

export function useCommentActions(
  comment: EventComment | null,
  handlers: {
    onDelete: (comment: EventComment) => void;
    onReport: (comment: EventComment) => void;
  }
): CommentAction[] {
  return React.useMemo(() => {
    if (!comment) return [];
    const actions: CommentAction[] = [];

    if (comment.body) {
      actions.push({
        label: 'Copy text',
        icon: Copy,
        onPress: () => {},
      });
    }

    actions.push({
      label: 'Share',
      icon: Share2,
      onPress: () => {},
    });

    if (comment.is_mine) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        destructive: true,
        onPress: () => handlers.onDelete(comment),
      });
    } else {
      actions.push({
        label: 'Report',
        icon: Flag,
        destructive: true,
        onPress: () => handlers.onReport(comment),
      });
    }

    return actions;
  }, [comment, handlers]);
}
