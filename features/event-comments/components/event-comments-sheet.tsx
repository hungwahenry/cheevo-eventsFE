import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { CommentCompose } from '@/features/event-comments/components/comment-compose';
import { CommentReplies } from '@/features/event-comments/components/comment-replies';
import { CommentRow } from '@/features/event-comments/components/comment-row';
import {
  useDeleteComment,
  useEventComments,
  type ReplyTarget,
} from '@/features/event-comments/hooks';
import type { EventComment } from '@/features/event-comments/types';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { MessageCircle } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
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
  const ref = React.useRef<BottomSheetModal>(null);
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  const [isOpen, setIsOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] = React.useState<ReplyTarget | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<EventComment | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEventComments(eventId, isOpen);
  const isInitialLoading = data === undefined;
  const remove = useDeleteComment(eventId);

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  React.useImperativeHandle(forwardedRef, () => ({
    present: () => ref.current?.present(),
    dismiss: () => ref.current?.dismiss(),
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

  const handleReply = (comment: EventComment) => {
    setReplyTarget({
      parentId: comment.parent_id ?? comment.id,
      mentionedUserId: comment.author.id,
      mentionUsername: comment.author.username,
    });
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    remove.mutate(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <>
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        stackBehavior="push"
        onChange={(index) => setIsOpen(index >= 0)}
        onDismiss={() => {
          setIsOpen(false);
          setReplyTarget(null);
        }}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View style={{ flex: 1 }}>
          <View className="border-border border-b px-5 pb-3">
            <Text className="text-foreground text-base font-semibold">
              {commentsCount > 0
                ? `${commentsCount.toLocaleString()} ${commentsCount === 1 ? 'comment' : 'comments'}`
                : 'Comments'}
            </Text>
          </View>

          <BottomSheetFlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View>
                <CommentRow
                  comment={item}
                  onReply={handleReply}
                  onDelete={setPendingDelete}
                />
                <CommentReplies
                  parent={item}
                  onReply={handleReply}
                  onDelete={setPendingDelete}
                />
              </View>
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              isInitialLoading ? (
                <View className="items-center py-12">
                  <Spinner size="sm" />
                </View>
              ) : (
                <EmptyState
                  icon={MessageCircle}
                  title="No comments yet"
                  description="Be the first to share your thoughts about this event."
                />
              )
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-4">
                  <Spinner size="sm" />
                </View>
              ) : null
            }
          />

          <CommentCompose
            eventId={eventId}
            replyTarget={replyTarget}
            onCancelReply={() => setReplyTarget(null)}
            onSent={() => setReplyTarget(null)}
          />
        </View>
      </BottomSheetModal>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={handleConfirmDelete}>
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
