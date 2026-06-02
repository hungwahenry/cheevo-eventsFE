import {
  getOrganisationSubscribersPreview,
  getPublicOrganisation,
  listOrganisationPastEvents,
  listOrganisationUpcomingEvents,
  subscribeToOrganisation,
  unsubscribeFromOrganisation,
} from '@/features/organisations/api';
import type {
  OrganisationEventsPage,
  PublicOrganisation,
} from '@/features/organisations/types';
import { isApiError } from '@/lib/api';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const publicOrgKey = (slug: string) => ['org', slug] as const;
export const orgUpcomingKey = (slug: string) => ['org', slug, 'upcoming'] as const;
export const orgPastKey = (slug: string) => ['org', slug, 'past'] as const;
export const orgSubscribersKey = (slug: string) => ['org', slug, 'subscribers'] as const;

export function usePublicOrganisation(slug: string) {
  return useQuery({
    queryKey: publicOrgKey(slug),
    queryFn: () => getPublicOrganisation(slug),
    enabled: !!slug,
  });
}

export function useOrganisationUpcomingEvents(slug: string) {
  return useInfiniteQuery<OrganisationEventsPage>({
    queryKey: orgUpcomingKey(slug),
    queryFn: ({ pageParam }) => listOrganisationUpcomingEvents(slug, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });
}

export function useOrganisationPastEvents(slug: string) {
  return useInfiniteQuery<OrganisationEventsPage>({
    queryKey: orgPastKey(slug),
    queryFn: ({ pageParam }) => listOrganisationPastEvents(slug, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });
}

export function useOrganisationSubscribers(slug: string) {
  return useQuery({
    queryKey: orgSubscribersKey(slug),
    queryFn: () => getOrganisationSubscribersPreview(slug),
    enabled: !!slug,
  });
}

export function useToggleSubscribe(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, currentlySubscribed }: { orgId: string; currentlySubscribed: boolean }) =>
      currentlySubscribed
        ? unsubscribeFromOrganisation(orgId)
        : subscribeToOrganisation(orgId),

    onMutate: async ({ currentlySubscribed }) => {
      await queryClient.cancelQueries({ queryKey: publicOrgKey(slug) });
      const previous = queryClient.getQueryData<PublicOrganisation>(publicOrgKey(slug));

      if (previous) {
        queryClient.setQueryData<PublicOrganisation>(publicOrgKey(slug), {
          ...previous,
          is_subscribed: !currentlySubscribed,
          subscribers_count: previous.subscribers_count + (currentlySubscribed ? -1 : 1),
        });
      }

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(publicOrgKey(slug), context.previous);
      }
      if (isApiError(error)) {
        toast.error(error.message);
      } else {
        toast.error('Could not update subscription.');
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: publicOrgKey(slug) });
      queryClient.invalidateQueries({ queryKey: orgSubscribersKey(slug) });
    },
  });
}
