import { SearchBar } from '@/features/search/components/search-bar';
import { SearchResults } from '@/features/search/components/search-results';
import { useSearch } from '@/features/search/hooks';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const { debouncedQuery, data, isLoading, isError } = useSearch(query);

  return (
    <View className="bg-background pt-safe-offset-2 flex-1">
      <SearchBar value={query} onChange={setQuery} autoFocus showBack />
      <SearchResults
        query={debouncedQuery}
        data={data}
        isLoading={isLoading}
        isError={isError}
      />
    </View>
  );
}
