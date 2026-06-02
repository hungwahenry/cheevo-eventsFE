import { searchGifs } from '@/lib/giphy/api';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 24;

export function useGiphySearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 300);

  return {
    debouncedQuery: debounced,
    ...useInfiniteQuery({
      queryKey: ['giphy', debounced],
      queryFn: ({ pageParam }) =>
        searchGifs({
          query: debounced || undefined,
          limit: PAGE_SIZE,
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
