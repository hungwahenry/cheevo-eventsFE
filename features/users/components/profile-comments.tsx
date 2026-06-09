import { EventFlyer } from '@/components/event-flyer';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import type { ProfileViewpoint } from '@/features/users/components/profile-tabs';
import { useUserComments } from '@/features/users/hooks';
import type { UserComment } from '@/features/users/types';
import { formatRelativeShort } from '@/lib/format/datetime';
import { router } from 'expo-router';
import { MessageCircleIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  userId: string;
  viewpoint: ProfileViewpoint;
};

export function ProfileComments({ userId, viewpoint }: Props) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserComments(userId);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="gap-3 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MessageCircleIcon}
        title="No comments"
        description={
          viewpoint === 'self'
            ? 'Comments you leave on events will show up here.'
            : 'Comments they leave on events will show up here.'
        }
        className="py-8"
      />
    );
  }

  return (
    <View className="gap-3 py-2">
      {items.map((comment) => (
        <CommentRow key={comment.id} comment={comment} />
      ))}
      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="items-center pt-2">
          <Text className="text-primary text-xs font-sans-semibold">
            {isFetchingNextPage ? 'Loading…' : 'Show more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function CommentRow({ comment }: { comment: UserComment }) {
  return (
    <Pressable
      onPress={() => router.push(`/events/${comment.event.slug}` as any)}
      className="flex-row gap-3">
      <View className="bg-muted size-12 items-center justify-center overflow-hidden rounded-xl">
        <EventFlyer
          flyerUrl={comment.event.flyer_url}
          flyerType={comment.event.flyer_type}
          variant="thumbnail"
        />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <Text numberOfLines={1} className="text-muted-foreground text-xs">
          On {comment.event.title} · {formatRelativeShort(comment.created_at)}
        </Text>
        {comment.body ? (
          <Text numberOfLines={3} className="text-foreground text-sm">
            {comment.body}
          </Text>
        ) : comment.gif ? (
          <Text className="text-muted-foreground text-xs italic">[gif]</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
