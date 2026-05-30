import { searchGifs } from '@/lib/giphy/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 24;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

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
