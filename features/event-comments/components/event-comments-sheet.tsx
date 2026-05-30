import {
  CommentActionsSheet,
  type CommentActionsSheetRef,
} from '@/features/event-comments/components/comment-actions-sheet';
import { CommentCompose } from '@/features/event-comments/components/comment-compose';
import { CommentsList } from '@/features/event-comments/components/comments-list';
import { CommentsSheetHeader } from '@/features/event-comments/components/comments-sheet-header';
import { DeleteCommentDialog } from '@/features/event-comments/components/delete-comment-dialog';
import { useCommentActions, useCommentsSheet } from '@/features/event-comments/hooks';
import type { EventComment } from '@/features/event-comments/types';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';

export type EventCommentsSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type EventCommentsSheetProps = {
  eventId: string;
  commentsCount: number;
};

const SNAP_POINTS = ['90%'];

export const EventCommentsSheet = React.forwardRef<
  EventCommentsSheetRef,
  EventCommentsSheetProps
>(function EventCommentsSheet({ eventId, commentsCount }, forwardedRef) {
  const sheetRef = React.useRef<BottomSheetModal>(null);
  const actionsRef = React.useRef<CommentActionsSheetRef>(null);
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  const sheet = useCommentsSheet(eventId);

  const actions = useCommentActions(sheet.actionsTarget, {
    onDelete: sheet.requestDelete,
  });

  React.useImperativeHandle(forwardedRef, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleLongPress = React.useCallback(
    (comment: EventComment) => {
      if (!comment.is_mine) return;
      sheet.openActions(comment);
      actionsRef.current?.present();
    },
    [sheet]
  );

  return (
    <>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        stackBehavior="push"
        onChange={(index) => sheet.setIsOpen(index >= 0)}
        onDismiss={sheet.handleClose}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View style={{ flex: 1 }}>
          <CommentsSheetHeader count={commentsCount} />

          <CommentsList
            items={sheet.items}
            isInitialLoading={sheet.isInitialLoading}
            isFetchingNextPage={sheet.isFetchingNextPage}
            hasNextPage={sheet.hasNextPage}
            onFetchNextPage={sheet.fetchNextPage}
            onReply={sheet.replyTo}
            onLongPress={handleLongPress}
          />

          <CommentCompose
            eventId={eventId}
            replyTarget={sheet.replyTarget}
            onCancelReply={sheet.clearReply}
            onSent={sheet.clearReply}
          />
        </View>
      </BottomSheetModal>

      <CommentActionsSheet ref={actionsRef} actions={actions} />

      <DeleteCommentDialog
        open={sheet.pendingDelete !== null}
        onConfirm={sheet.confirmDelete}
        onCancel={sheet.cancelDelete}
      />
    </>
  );
});
