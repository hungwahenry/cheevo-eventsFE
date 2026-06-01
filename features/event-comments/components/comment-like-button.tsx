import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useToggleCommentLike } from '@/features/event-comments/hooks';
import type { EventComment } from '@/features/event-comments/types';
import { haptics } from '@/lib/haptics';
import { THEME } from '@/lib/theme';
import { Heart } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useUniwind } from 'uniwind';

export function CommentLikeButton({ comment }: { comment: EventComment }) {
  const toggle = useToggleCommentLike(comment.event_id);
  const { theme } = useUniwind();
  const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

  const handlePress = () => {
    haptics.select();
    toggle.mutate({ comment, next: !comment.is_liked });
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8} className="items-center gap-0.5 pt-1">
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
      {comment.likes_count > 0 ? (
        <Text className="text-muted-foreground text-[10px] tabular-nums">
          {comment.likes_count.toLocaleString()}
        </Text>
      ) : null}
    </Pressable>
  );
}
