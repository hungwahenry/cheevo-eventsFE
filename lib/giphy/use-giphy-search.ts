import { useConfigValue } from '@/features/system/hooks';
import { searchGifs } from '@/lib/giphy/api';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useGiphySearch(query: string) {
  const pageSize = useConfigValue('search.giphy_page_size', 24);
  const debounceMs = useConfigValue('search.giphy_debounce_ms', 300);
  const debounced = useDebouncedValue(query.trim(), debounceMs);

  return {
    debouncedQuery: debounced,
    ...useInfiniteQuery({
      queryKey: ['giphy', debounced, pageSize],
      queryFn: ({ pageParam }) =>
        searchGifs({
          query: debounced || undefined,
          limit: pageSize,
          offset: pageParam,
        }),
      initialPageParam: 0,
      getNextPageParam: (last) => {
        const next = last.offset + last.items.length;
        return next < last.total ? next : undefined;
      },
    }),
  };
}
