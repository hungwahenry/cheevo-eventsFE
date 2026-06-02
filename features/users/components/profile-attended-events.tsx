import { EventFlyer } from '@/components/event-flyer';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import type { ProfileViewpoint } from '@/features/users/components/profile-tabs';
import { useUserAttendedEvents } from '@/features/users/hooks';
import type { UserAttendedEvent } from '@/features/users/types';
import { formatShortDate } from '@/lib/format/datetime';
import { router } from 'expo-router';
import { CalendarIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  userId: string;
  viewpoint: ProfileViewpoint;
};

export function ProfileAttendedEvents({ userId, viewpoint }: Props) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserAttendedEvents(userId);

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
        icon={CalendarIcon}
        title="No past events"
        description={
          viewpoint === 'self'
            ? "Events you've attended will show up here once they end."
            : "Events they've attended will show up here."
        }
        className="py-8"
      />
    );
  }

  return (
    <View className="gap-3 py-2">
      {items.map((event) => (
        <EventRow key={event.id} event={event} />
      ))}
      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="items-center pt-2">
          <Text className="text-primary text-xs font-semibold">
            {isFetchingNextPage ? 'Loading…' : 'Show more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function EventRow({ event }: { event: UserAttendedEvent }) {
  const subtitle = [formatShortDate(event.ends_at ?? event.starts_at), event.venue_name ?? event.city]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={() => router.push(`/event/${event.slug}` as any)}
      className="flex-row items-center gap-3">
      <View className="bg-muted size-12 items-center justify-center overflow-hidden rounded-xl">
        {event.flyer_url ? (
          <EventFlyer
            flyerUrl={event.flyer_url}
            flyerType={event.flyer_type}
            variant="thumbnail"
          />
        ) : (
          <Icon as={CalendarIcon} className="text-muted-foreground" size={18} strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-foreground text-sm font-semibold">
          {event.title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

