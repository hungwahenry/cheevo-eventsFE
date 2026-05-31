import { getOrder } from '@/features/orders/api';
import { useQuery } from '@tanstack/react-query';

export const orderKey = (id: string) => ['order', id] as const;

export function useOrder(id: string, options?: { pollWhilePending?: boolean }) {
  return useQuery({
    queryKey: orderKey(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
    refetchInterval: (query) =>
      options?.pollWhilePending && query.state.data?.status === 'pending' ? 2000 : false,
  });
}
