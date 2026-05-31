import { listOrders } from '@/features/orders/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export const ordersKey = ['orders'] as const;

export function useOrders() {
  return useInfiniteQuery({
    queryKey: ordersKey,
    queryFn: ({ pageParam }) => listOrders(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
  });
}
