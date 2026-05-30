import { Text } from '@/components/ui/text';
import { EventCard } from '@/features/feed/components/event-card';
import { useFeed } from '@/features/feed/hooks';
import type { FeedEvent } from '@/features/feed/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View, type ViewToken } from 'react-native';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 65 };

const keyExtractor = (event: FeedEvent) => event.id;

function CardSeparator() {
  return <View className="h-6" />;
}

export function FeedList() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();

  const events: FeedEvent[] = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const [visibleId, setVisibleId] = useState<string | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const top = viewableItems[0];
    const id = (top?.item as FeedEvent | undefined)?.id ?? null;
    setVisibleId(id);
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: FeedEvent }) => <EventCard event={item} isVisible={item.id === visibleId} />,
    [visibleId]
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-1 px-8">
        <Text className="text-foreground text-lg font-semibold">No events yet</Text>
        <Text className="text-muted-foreground text-center text-sm">
          Pick more interests or follow some organisers to start seeing what&apos;s on.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <View className="gap-1 px-5 pt-2 pb-4">
        <Text className="text-foreground text-3xl font-bold tracking-tight">For you</Text>
        <Text className="text-muted-foreground text-sm">
          Events picked for what you&apos;re into.
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={CardSeparator}
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}
