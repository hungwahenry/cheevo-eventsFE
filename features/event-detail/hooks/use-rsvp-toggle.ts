import { rsvp, unrsvp } from '@/features/event-detail/api';
import { eventKey } from '@/features/event-detail/hooks/use-event';
import type { EventDetail } from '@/features/event-detail/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRsvpToggle(eventSlug: string, eventId: string) {
  const queryClient = useQueryClient();
  const key = eventKey(eventSlug);

  return useMutation({
    mutationFn: (next: boolean) => (next ? rsvp(eventId) : unrsvp(eventId)),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<EventDetail>(key);
      if (prev) {
        queryClient.setQueryData<EventDetail>(key, {
          ...prev,
          is_rsvped: next,
          rsvps_count: prev.rsvps_count + (next ? 1 : -1),
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
