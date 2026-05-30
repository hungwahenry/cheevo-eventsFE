import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CommentGifView } from '@/features/event-comments/components/comment-gif';
import { useToggleCommentLike } from '@/features/event-comments/hooks';
import type { EventComment } from '@/features/event-comments/types';
import { formatRelativeShort } from '@/lib/format/datetime';
import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { Heart } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useUniwind } from 'uniwind';

type CommentRowProps = {
  comment: EventComment;
  onReply: (comment: EventComment) => void;
  onDelete: (comment: EventComment) => void;
  compact?: boolean;
};

export function CommentRow({ comment, onReply, onDelete, compact }: CommentRowProps) {
  const toggleLike = useToggleCommentLike(comment.event_id);
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];
  const time = formatRelativeShort(comment.created_at);
  const displayName = comment.author.display_name ?? comment.author.username ?? 'Someone';
  const handle = comment.author.username ? `@${comment.author.username}` : null;

  const handleLike = () => {
    haptics.select();
    toggleLike.mutate({ comment, next: !comment.is_liked });
  };

  const handleLongPress = () => {
    if (!comment.is_mine) return;
    haptics.impact();
    onDelete(comment);
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
        <View className="flex-row items-baseline gap-1.5">
          <Text className="text-foreground text-sm font-semibold">{displayName}</Text>
          {handle ? (
            <Text className="text-muted-foreground text-xs">{handle}</Text>
          ) : null}
          {time ? (
            <Text className="text-muted-foreground text-xs">· {time}</Text>
          ) : null}
        </View>

        {comment.parent_id !== null && comment.mentioned_users[0]?.username ? (
          <Text className="text-muted-foreground mt-0.5 text-xs">
            Replying to{' '}
            <Text className="text-primary text-xs font-medium">
              @{comment.mentioned_users[0].username}
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
          {comment.likes_count > 0 ? (
            <Text className="text-muted-foreground text-xs">
              {comment.likes_count.toLocaleString()}{' '}
              {comment.likes_count === 1 ? 'like' : 'likes'}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable onPress={handleLike} hitSlop={8} className="pt-1">
        <Icon
          as={Heart}
          className={
            comment.is_liked
              ? 'text-destructive size-4'
              : 'text-muted-foreground size-4'
          }
          fill={comment.is_liked ? colors.destructive : 'transparent'}
          strokeWidth={2}
        />
      </Pressable>
    </Pressable>
  );
}
