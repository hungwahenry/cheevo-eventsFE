import type { ActionsSheetRef } from '@/components/ui/actions-sheet';
import { useCommentActions } from '@/features/event-comments/hooks/use-comment-actions';
import type { useCommentsSheet } from '@/features/event-comments/hooks/use-comments-sheet';
import type { EventComment } from '@/features/event-comments/types';
import type { ReportSheetRef } from '@/features/reports';
import { haptics } from '@/lib/haptics';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { Platform, Share } from 'react-native';
import { toast } from 'sonner-native';

type Sheet = ReturnType<typeof useCommentsSheet>;

export function useCommentsSheetActions(sheet: Sheet) {
  const actionsRef = React.useRef<ActionsSheetRef>(null);
  const reportRef = React.useRef<ReportSheetRef>(null);

  const handleCopy = React.useCallback(async (comment: EventComment) => {
    if (!comment.body) return;
    try {
      await Clipboard.setStringAsync(comment.body);
      haptics.success();
      toast.success('Copied');
    } catch {
      haptics.error();
      toast.error("Couldn't copy.");
    }
  }, []);

  const handleShare = React.useCallback(async (comment: EventComment) => {
    const text = comment.body?.trim();
    const gifUrl = comment.gif?.url ?? null;
    const message = text || gifUrl;
    if (!message) return;

    try {
      await Share.share({
        message: Platform.select({ ios: text ? message : undefined, default: message }),
        url: Platform.select({ ios: text ? undefined : gifUrl ?? undefined, default: undefined }),
      });
    } catch {
      haptics.error();
      toast.error("Couldn't open the share sheet.");
    }
  }, []);

  const handleReport = React.useCallback((comment: EventComment) => {
    reportRef.current?.present({
      type: 'event_comment',
      id: comment.id,
      noun: comment.parent_id !== null ? 'this reply' : 'this comment',
    });
  }, []);

  const actions = useCommentActions(sheet.actionsTarget, {
    onCopy: handleCopy,
    onShare: handleShare,
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
