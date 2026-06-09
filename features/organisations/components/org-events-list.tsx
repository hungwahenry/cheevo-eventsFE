import { EventFlyer } from '@/components/event-flyer';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import type { OrganisationEvent } from '@/features/organisations/types';
import { formatShortDate, formatShortDateTime } from '@/lib/format/datetime';
import type { InfiniteData } from '@tanstack/react-query';
import { router } from 'expo-router';
import { CalendarIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

type Page = {
  items: OrganisationEvent[];
  page: number;
  last_page: number;
};

type Props = {
  data: InfiniteData<Page> | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  emptyTitle: string;
  emptyDescription: string;
  variant: 'upcoming' | 'past';
};

export function OrgEventsList({
  data,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  emptyTitle,
  emptyDescription,
  variant,
}: Props) {
  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="gap-3 px-5 py-2">
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
        title={emptyTitle}
        description={emptyDescription}
        className="py-8"
      />
    );
  }

  return (
    <View className="gap-3 px-5 pt-1">
      {items.map((event) => (
        <EventRow key={event.id} event={event} variant={variant} />
      ))}
      {hasNextPage ? (
        <Pressable
          onPress={fetchNextPage}
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

function EventRow({
  event,
  variant,
}: {
  event: OrganisationEvent;
  variant: 'upcoming' | 'past';
}) {
  const date =
    variant === 'upcoming'
      ? formatShortDateTime(event.starts_at)
      : formatShortDate(event.ends_at ?? event.starts_at);
  const subtitle = [date, event.venue_name ?? event.city].filter(Boolean).join(' · ');

  return (
    <Pressable
      onPress={() => router.push(`/events/${event.slug}` as any)}
      className="flex-row items-center gap-3">
      <View className="bg-muted size-14 items-center justify-center overflow-hidden rounded-xl">
        {event.flyer_url ? (
          <EventFlyer
            flyerUrl={event.flyer_url}
            flyerType={event.flyer_type}
            variant="thumbnail"
          />
        ) : (
          <Icon as={CalendarIcon} className="text-muted-foreground" size={20} strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-foreground text-sm font-sans-semibold">
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
