import { Text } from '@/components/ui/text';
import { EventCard } from '@/features/feed/components/event-card';
import { useFeed } from '@/features/feed/hooks';
import type { FeedEvent } from '@/features/feed/types';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

export function FeedList() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();

  const events: FeedEvent[] = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  if (isLoading) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-8">
        <Text className="text-foreground text-lg font-semibold">No events yet</Text>
        <Text className="text-muted-foreground mt-1 text-center text-sm">
          Pick more interests or follow some organisers to start seeing what&apos;s on.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <View className="px-5 pt-2 pb-4">
        <Text className="text-foreground text-3xl font-bold tracking-tight">For you</Text>
        <Text className="text-muted-foreground mt-1 text-sm">
          Events picked for what you&apos;re into.
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(event) => event.id}
        renderItem={({ item }) => <EventCard event={item} />}
        ItemSeparatorComponent={() => <View className="h-8" />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.6}
      />
    </View>
  );
}
