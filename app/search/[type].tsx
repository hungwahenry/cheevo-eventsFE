import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { SearchBar } from '@/features/search/components/search-bar';
import { SearchEventRow } from '@/features/search/components/search-event-row';
import { SearchOrganisationRow } from '@/features/search/components/search-organisation-row';
import { SearchUserRow } from '@/features/search/components/search-user-row';
import { useSearchByType } from '@/features/search/hooks';
import type { SearchType } from '@/features/search/types';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchXIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

const TITLES: Record<SearchType, string> = {
  event: 'Events',
  organisation: 'Organisations',
  user: 'People',
};

export default function SearchByTypeScreen() {
  const params = useLocalSearchParams<{ type: SearchType; q?: string }>();
  const type = params.type;
  const [query, setQuery] = useState(params.q ?? '');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearchByType(query, type);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const renderRow = (item: any) => {
    switch (type) {
      case 'event':
        return <SearchEventRow event={item} onPress={() => router.push(`/events/${item.slug}` as any)} />;
      case 'organisation':
        return (
          <SearchOrganisationRow
            organisation={item}
            onPress={() => router.push(`/org/${item.slug}` as any)}
          />
        );
      case 'user':
        return <SearchUserRow user={item} onPress={() => router.push(`/user/${item.id}` as any)} />;
    }
  };

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <SearchBar value={query} onChange={setQuery} placeholder={`Search ${TITLES[type].toLowerCase()}`} showBack />

      <Text className="text-muted-foreground px-5 pb-2 text-xs font-sans-semibold tracking-wide uppercase">
        {TITLES[type]}
      </Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title="No matches"
          description={query.length >= 2 ? `Nothing found for "${query}".` : 'Keep typing.'}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderRow(item)}
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
          contentContainerStyle={{ paddingBottom: 64 }}
        />
      )}
    </View>
  );
}
