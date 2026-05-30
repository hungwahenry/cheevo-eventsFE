import { getEvent } from '@/features/event-detail/api';
import { useQuery } from '@tanstack/react-query';

export const eventKey = (id: string) => ['event', id] as const;

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKey(id),
    queryFn: () => getEvent(id),
    enabled: Boolean(id),
  });
}
