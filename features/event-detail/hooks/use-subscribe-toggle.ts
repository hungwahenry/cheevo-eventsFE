import { subscribe, unsubscribe } from '@/features/event-detail/api';
import { eventKey } from '@/features/event-detail/hooks/use-event';
import type { EventDetail } from '@/features/event-detail/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubscribeToggle(eventSlug: string, organisationId: string) {
  const queryClient = useQueryClient();
  const key = eventKey(eventSlug);

  return useMutation({
    mutationFn: (next: boolean) => (next ? subscribe(organisationId) : unsubscribe(organisationId)),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<EventDetail>(key);
      if (prev) {
        queryClient.setQueryData<EventDetail>(key, {
          ...prev,
          is_subscribed: next,
          organisation: {
            ...prev.organisation,
            subscribers_count: prev.organisation.subscribers_count + (next ? 1 : -1),
          },
        });
      }
      return { prev };
    },
    onError: (_err, _next, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
