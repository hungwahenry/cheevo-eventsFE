import {
  searchAll,
  searchEvents,
  searchOrganisations,
  searchUsers,
} from '@/features/search/api';
import type {
  SearchEventResult,
  SearchOrganisationResult,
  SearchType,
  SearchTypePage,
  SearchUserResult,
} from '@/features/search/types';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

const MIN_QUERY = 2;

type AnySearchResult = SearchEventResult | SearchOrganisationResult | SearchUserResult;

export function useSearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 250);
  const enabled = debounced.length >= MIN_QUERY;

  return {
    debouncedQuery: debounced,
    ...useQuery({
      queryKey: ['search', 'all', debounced] as const,
      queryFn: () => searchAll(debounced),
      enabled,
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    }),
  };
}

export function useSearchByType(query: string, type: SearchType) {
  const debounced = useDebouncedValue(query.trim(), 250);
  const enabled = debounced.length >= MIN_QUERY;

  return useInfiniteQuery<SearchTypePage<AnySearchResult>>({
    queryKey: ['search', type, debounced] as const,
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      if (type === 'event') return searchEvents(debounced, page);
      if (type === 'organisation') return searchOrganisations(debounced, page);
      return searchUsers(debounced, page);
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled,
    placeholderData: keepPreviousData,
  });
}
