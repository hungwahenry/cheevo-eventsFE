import {
  getPublicUser,
  listUserInterests,
  listUserOrganisations,
} from '@/features/users/api';
import type { UserOrganisationsPage } from '@/features/users/types';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const publicUserKey = (id: string) => ['user', id] as const;
export const userInterestsKey = (id: string) => ['user', id, 'interests'] as const;
export const userOrganisationsKey = (id: string) => ['user', id, 'organisations'] as const;

export function usePublicUser(id: string) {
  return useQuery({
    queryKey: publicUserKey(id),
    queryFn: () => getPublicUser(id),
    enabled: !!id,
  });
}

export function useUserInterests(id: string) {
  return useQuery({
    queryKey: userInterestsKey(id),
    queryFn: () => listUserInterests(id),
    enabled: !!id,
  });
}

export function useUserOrganisations(id: string) {
  return useInfiniteQuery<UserOrganisationsPage>({
    queryKey: userOrganisationsKey(id),
    queryFn: ({ pageParam }) => listUserOrganisations(id, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}
