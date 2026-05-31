import { Screen } from '@/components/screen';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { EventCard } from '@/features/feed/components/event-card';
import { useFeed } from '@/features/feed/hooks';
import type { FeedEvent } from '@/features/feed/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, View, type ViewToken } from 'react-native';

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

  return (
    <Screen title="For you" subtitle="Events picked for what you’re into.">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      ) : events.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-1 px-8">
          <Text className="text-foreground text-lg font-semibold">No events yet</Text>
          <Text className="text-muted-foreground text-center text-sm">
            Pick more interests or follow some organisers to start seeing what&apos;s on.
          </Text>
        </View>
      ) : (
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
      )}
    </Screen>
  );
}
