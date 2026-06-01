import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { EventTicketCard } from '@/features/tickets/components/event-ticket-card';
import { useMyTickets } from '@/features/tickets/hooks';
import { groupTicketsByEvent } from '@/lib/tickets';
import { TicketIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

export function TicketsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useMyTickets();

  const groups = useMemo(
    () => groupTicketsByEvent(data?.pages.flatMap((p) => p.items) ?? []),
    [data]
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={TicketIcon}
        title="No tickets yet"
        description="Tickets you buy will show up here."
      />
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={groups}
      keyExtractor={(g) => g.event.id}
      renderItem={({ item }) => (
        <EventTicketCard event={item.event} tickets={item.tickets} />
      )}
      ItemSeparatorComponent={() => <View className="h-3" />}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 96 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} />
      }
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-6 items-center">
            <Text className="text-muted-foreground text-xs">Loading more…</Text>
          </View>
        ) : null
      }
    />
  );
}
