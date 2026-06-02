import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { StatusPill } from '@/components/ui/status-pill';
import { Text } from '@/components/ui/text';
import { CommentLikeButton } from '@/features/event-comments/components/actions/comment-like-button';
import { CommentGifView } from '@/features/event-comments/components/compose/comment-gif';
import type { EventComment } from '@/features/event-comments/types';
import { useOpenUserProfile } from '@/features/users/hooks';
import { formatRelativeShort } from '@/lib/format/datetime';
import { haptics } from '@/lib/haptics';
import { Pressable, View } from 'react-native';

type CommentRowProps = {
  comment: EventComment;
  onReply: (comment: EventComment) => void;
  onLongPress: (comment: EventComment) => void;
  compact?: boolean;
};

export function CommentRow({ comment, onReply, onLongPress, compact }: CommentRowProps) {
  const openUser = useOpenUserProfile();

  const time = formatRelativeShort(comment.created_at);

  if (comment.deleted) {
    return (
      <View className="flex-row gap-3 py-2.5">
        <Avatar alt="Deleted avatar" className={compact ? 'size-7' : 'size-9'} />
        <View className="flex-1 justify-center">
          <Text className="text-muted-foreground text-sm italic">
            [deleted]
            {time ? <Text className="text-muted-foreground text-xs"> · {time}</Text> : null}
          </Text>
        </View>
      </View>
    );
  }

  const displayName = comment.author.display_name ?? comment.author.username ?? 'Someone';
  const handle = comment.author.username ? `@${comment.author.username}` : null;
  const replyingTo = comment.parent_id !== null ? comment.mentioned_users[0] : null;
  const openAuthor = () => {
    if (comment.author.id) openUser(comment.author.id);
  };

  const handleLongPress = () => {
    haptics.impact();
    onLongPress(comment);
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={350}
      className="flex-row gap-3 py-2.5">
      <Pressable onPress={openAuthor} hitSlop={4}>
        <Avatar alt={`${displayName} avatar`} className={compact ? 'size-7' : 'size-9'}>
          {comment.author.avatar_url ? (
            <AvatarImage source={{ uri: comment.author.avatar_url }} />
          ) : null}
        </Avatar>
      </Pressable>

      <View className="flex-1">
        <Pressable onPress={openAuthor} hitSlop={4}>
          <View className="flex-row flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <Text className="text-foreground text-sm font-semibold">{displayName}</Text>
            {handle ? (
              <Text className="text-muted-foreground text-xs">{handle}</Text>
            ) : null}
            {comment.is_going ? (
              <StatusPill label="Going" tone="primary" size="sm" />
            ) : null}
            {time ? (
              <Text className="text-muted-foreground text-xs">· {time}</Text>
            ) : null}
          </View>
        </Pressable>

        {replyingTo?.username ? (
          <Text className="text-muted-foreground mt-0.5 text-xs">
            Replying to{' '}
            <Text
              onPress={() => openUser(replyingTo.id)}
              className="text-primary text-xs font-medium">
              @{replyingTo.username}
            </Text>
          </Text>
        ) : null}

        {comment.body ? (
          <Text className="text-foreground mt-0.5 text-sm leading-5">
            {comment.body}
          </Text>
        ) : null}

        {comment.gif ? <CommentGifView gif={comment.gif} /> : null}

        <View className="mt-1 flex-row items-center gap-4">
          <Pressable onPress={() => onReply(comment)} hitSlop={6}>
            <Text className="text-muted-foreground text-xs font-medium">Reply</Text>
          </Pressable>
        </View>
      </View>

      <CommentLikeButton comment={comment} />
    </Pressable>
  );
}
