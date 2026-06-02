import {
  getPublicUser,
  listUserAttendedEvents,
  listUserComments,
  listUserInterests,
  listUserOrganisations,
} from '@/features/users/api';
import type {
  UserAttendedEventsPage,
  UserCommentsPage,
  UserOrganisationsPage,
} from '@/features/users/types';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const publicUserKey = (id: string) => ['user', id] as const;
export const userInterestsKey = (id: string) => ['user', id, 'interests'] as const;
export const userOrganisationsKey = (id: string) => ['user', id, 'organisations'] as const;
export const userCommentsKey = (id: string) => ['user', id, 'comments'] as const;
export const userAttendedEventsKey = (id: string) => ['user', id, 'attended-events'] as const;

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

export function useUserComments(id: string) {
  return useInfiniteQuery<UserCommentsPage>({
    queryKey: userCommentsKey(id),
    queryFn: ({ pageParam }) => listUserComments(id, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

export function useUserAttendedEvents(id: string) {
  return useInfiniteQuery<UserAttendedEventsPage>({
    queryKey: userAttendedEventsKey(id),
    queryFn: ({ pageParam }) => listUserAttendedEvents(id, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}
