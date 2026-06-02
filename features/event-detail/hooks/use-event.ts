import { getEvent } from '@/features/event-detail/api';
import { useQuery } from '@tanstack/react-query';

export const eventKey = (slug: string) => ['event', slug] as const;

export function useEvent(slug: string) {
  return useQuery({
    queryKey: eventKey(slug),
    queryFn: () => getEvent(slug),
    enabled: Boolean(slug),
  });
}
