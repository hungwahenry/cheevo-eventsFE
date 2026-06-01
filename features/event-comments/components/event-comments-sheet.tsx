import { ActionsSheet } from '@/components/ui/actions-sheet';
import { SheetHeader } from '@/components/ui/sheet-header';
import { CommentCompose } from '@/features/event-comments/components/comment-compose';
import { CommentsList } from '@/features/event-comments/components/comments-list';
import { DeleteCommentDialog } from '@/features/event-comments/components/delete-comment-dialog';
import { useCommentsSheet, useCommentsSheetActions } from '@/features/event-comments/hooks';
import { ReportSheet } from '@/features/reports';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  const sheet = useCommentsSheet(eventId);
  const { actionsRef, reportRef, actions, handleLongPress } = useCommentsSheetActions(sheet);

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

  return (
    <>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        stackBehavior="push"
        topInset={insets.top}
        onChange={(index) => sheet.setIsOpen(index >= 0)}
        onDismiss={sheet.handleClose}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View className="flex-1">
          <SheetHeader
            title={
              commentsCount > 0
                ? `${commentsCount.toLocaleString()} ${commentsCount === 1 ? 'comment' : 'comments'}`
                : 'Comments'
            }
          />

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

      <ActionsSheet ref={actionsRef} actions={actions} />

      <ReportSheet ref={reportRef} />

      <DeleteCommentDialog
        open={sheet.pendingDelete !== null}
        onConfirm={sheet.confirmDelete}
        onCancel={sheet.cancelDelete}
      />
    </>
  );
});
