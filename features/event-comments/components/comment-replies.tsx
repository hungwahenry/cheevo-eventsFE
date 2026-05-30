import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CommentRow } from '@/features/event-comments/components/comment-row';
import { useCommentReplies } from '@/features/event-comments/hooks';
import type { EventComment } from '@/features/event-comments/types';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Spinner } from '@/components/ui/spinner';

type CommentRepliesProps = {
  parent: EventComment;
  onReply: (target: EventComment) => void;
  onLongPress: (comment: EventComment) => void;
};

export function CommentReplies({ parent, onReply, onLongPress }: CommentRepliesProps) {
  const [expanded, setExpanded] = React.useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCommentReplies(parent.event_id, parent.id, expanded);

  const replies = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  if (parent.replies_count === 0) return null;

  return (
    <View className="mt-1 pl-12">
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center gap-2 py-1.5">
        <View className="bg-muted-foreground/40 h-px w-6" />
        <Text className="text-muted-foreground text-xs font-medium">
          {expanded ? 'Hide' : `View ${parent.replies_count}`}{' '}
          {parent.replies_count === 1 ? 'reply' : 'replies'}
        </Text>
        <Icon
          as={expanded ? ChevronUp : ChevronDown}
          className="text-muted-foreground size-3"
        />
      </Pressable>

      {expanded ? (
        <View>
          {isLoading ? (
            <View className="py-3">
              <Spinner size="sm" />
            </View>
          ) : null}

          {replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              onReply={() => onReply(parent)}
              onLongPress={onLongPress}
              compact
            />
          ))}

          {hasNextPage ? (
            <Pressable
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="py-2">
              <Text className="text-muted-foreground text-xs">
                {isFetchingNextPage ? 'Loading…' : 'View more replies'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
