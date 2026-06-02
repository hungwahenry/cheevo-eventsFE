import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import type { InboxNotification } from '@/features/notifications/types';
import { InboxRow } from '@/features/notifications/components/inbox-row';
import { useInboxNotifications, useMarkRead } from '@/features/notifications/hooks';
import { useManualRefresh } from '@/lib/use-manual-refresh';
import { BellIcon, WifiOffIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

type Props = {
  onOpen: (notification: InboxNotification) => void;
};

export function InboxList({ onOpen }: Props) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInboxNotifications();
  const { refreshing, onRefresh } = useManualRefresh(refetch);
  const markRead = useMarkRead();

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  const isEmpty = items.length === 0;
  const isError = Boolean(error) && isEmpty;

  return (
    <FlatList
      className="flex-1"
      data={items}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View className="border-border h-px" />}
      renderItem={({ item }) => (
        <InboxRow
          notification={item}
          onPress={() => {
            if (item.read_at === null) markRead.mutate(item.id);
            onOpen(item);
          }}
        />
      )}
      contentContainerStyle={isEmpty ? { flexGrow: 1, justifyContent: 'center' } : undefined}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        isError ? (
          <EmptyState
            icon={WifiOffIcon}
            title="Couldn't load notifications"
            description="Check your connection and try again."
            action={{ label: 'Retry', variant: 'outline', onPress: () => refetch() }}
          />
        ) : (
          <EmptyState
            icon={BellIcon}
            title="No notifications yet"
            description="We'll let you know when something needs your attention."
          />
        )
      }
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-6">
            <Text className="text-muted-foreground text-xs">Loading more…</Text>
          </View>
        ) : null
      }
    />
  );
}
