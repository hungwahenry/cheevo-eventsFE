import type { ActionsSheetRef } from '@/components/ui/actions-sheet';
import { useCommentActions } from '@/features/event-comments/hooks/use-comment-actions';
import type { useCommentsSheet } from '@/features/event-comments/hooks/use-comments-sheet';
import type { EventComment } from '@/features/event-comments/types';
import type { ReportSheetRef } from '@/features/reports';
import * as React from 'react';

type Sheet = ReturnType<typeof useCommentsSheet>;

export function useCommentsSheetActions(sheet: Sheet) {
  const actionsRef = React.useRef<ActionsSheetRef>(null);
  const reportRef = React.useRef<ReportSheetRef>(null);

  const handleReport = React.useCallback((comment: EventComment) => {
    reportRef.current?.present({
      type: 'event_comment',
      id: comment.id,
      noun: comment.parent_id !== null ? 'this reply' : 'this comment',
    });
  }, []);

  const actions = useCommentActions(sheet.actionsTarget, {
    onDelete: sheet.requestDelete,
    onReport: handleReport,
  });

  const handleLongPress = React.useCallback(
    (comment: EventComment) => {
      sheet.openActions(comment);
      actionsRef.current?.present();
    },
    [sheet]
  );

  return { actionsRef, reportRef, actions, handleLongPress };
}
