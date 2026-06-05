import type { ActionItem } from '@/components/ui/actions-sheet';
import type { EventComment } from '@/features/event-comments/types';
import { Copy, Flag, Share2, Trash2 } from 'lucide-react-native';
import * as React from 'react';

export function useCommentActions(
  comment: EventComment | null,
  handlers: {
    onCopy: (comment: EventComment) => void;
    onShare: (comment: EventComment) => void;
    onDelete: (comment: EventComment) => void;
    onReport: (comment: EventComment) => void;
  }
): ActionItem[] {
  return React.useMemo(() => {
    if (!comment) return [];
    const actions: ActionItem[] = [];

    if (comment.body) {
      actions.push({
        label: 'Copy text',
        icon: Copy,
        onPress: () => handlers.onCopy(comment),
      });
    }

    actions.push({
      label: 'Share',
      icon: Share2,
      onPress: () => handlers.onShare(comment),
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
