import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { CommentReplies } from '@/features/event-comments/components/comment-replies';
import { CommentRow } from '@/features/event-comments/components/comment-row';
import type { EventComment } from '@/features/event-comments/types';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';

type CommentsListProps = {
  items: EventComment[];
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNextPage: () => void;
  onReply: (comment: EventComment) => void;
  onLongPress: (comment: EventComment) => void;
};

export function CommentsList({
  items,
  isInitialLoading,
  isFetchingNextPage,
  hasNextPage,
  onFetchNextPage,
  onReply,
  onLongPress,
}: CommentsListProps) {
  return (
    <BottomSheetFlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 }}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <View>
          <CommentRow comment={item} onReply={onReply} onLongPress={onLongPress} />
          <CommentReplies parent={item} onReply={onReply} onLongPress={onLongPress} />
        </View>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) onFetchNextPage();
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
  );
}
