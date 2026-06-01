import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { CommentGifView } from '@/features/event-comments/components/comment-gif';
import { CommentLikeButton } from '@/features/event-comments/components/comment-like-button';
import type { EventComment } from '@/features/event-comments/types';
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
  const time = formatRelativeShort(comment.created_at);
  const displayName = comment.author.display_name ?? comment.author.username ?? 'Someone';
  const handle = comment.author.username ? `@${comment.author.username}` : null;
  const replyingTo = comment.parent_id !== null ? comment.mentioned_users[0]?.username : null;

  const handleLongPress = () => {
    haptics.impact();
    onLongPress(comment);
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={350}
      className="flex-row gap-3 py-2.5">
      <Avatar alt={`${displayName} avatar`} className={compact ? 'size-7' : 'size-9'}>
        {comment.author.avatar_url ? (
          <AvatarImage source={{ uri: comment.author.avatar_url }} />
        ) : null}
      </Avatar>

      <View className="flex-1">
        <View className="flex-row flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <Text className="text-foreground text-sm font-semibold">{displayName}</Text>
          {handle ? (
            <Text className="text-muted-foreground text-xs">{handle}</Text>
          ) : null}
          {comment.is_going ? <GoingPill /> : null}
          {time ? (
            <Text className="text-muted-foreground text-xs">· {time}</Text>
          ) : null}
        </View>

        {replyingTo ? (
          <Text className="text-muted-foreground mt-0.5 text-xs">
            Replying to{' '}
            <Text className="text-primary text-xs font-medium">@{replyingTo}</Text>
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

function GoingPill() {
  return (
    <View className="bg-primary/10 rounded-full px-1.5 py-px">
      <Text className="text-primary text-[10px] font-semibold uppercase tracking-wider">
        Going
      </Text>
    </View>
  );
}
