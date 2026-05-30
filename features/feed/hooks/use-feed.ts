import { getFeed } from '@/features/feed/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export const feedKey = (perPage: number) => ['feed', perPage] as const;

export function useFeed(perPage = 10) {
  return useInfiniteQuery({
    queryKey: feedKey(perPage),
    queryFn: ({ pageParam }) => getFeed(pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
  });
}
