import { getFeed } from '@/features/feed/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export const feedKey = ['feed'] as const;

export function useFeed(perPage = 10) {
  return useInfiniteQuery({
    queryKey: feedKey,
    queryFn: ({ pageParam }) => getFeed(pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
  });
}
