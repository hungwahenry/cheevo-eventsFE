import { listBlockedOrganisations, listBlockedUsers } from '@/features/blocks/api';
import type {
  BlockedOrganisation,
  BlockedPage,
  BlockedUser,
} from '@/features/blocks/types';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

export const blockedUsersKey = ['blocks', 'users'] as const;
export const blockedOrganisationsKey = ['blocks', 'organisations'] as const;

export function useBlockedUsers() {
  return useInfiniteQuery<BlockedPage<BlockedUser>>({
    queryKey: blockedUsersKey,
    queryFn: ({ pageParam }) => listBlockedUsers(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  });
}

export function useBlockedOrganisations() {
  return useInfiniteQuery<BlockedPage<BlockedOrganisation>>({
    queryKey: blockedOrganisationsKey,
    queryFn: ({ pageParam }) => listBlockedOrganisations(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  });
}
