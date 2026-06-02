import { quoteOrder } from '@/features/checkout/api';
import type { CartItem } from '@/features/checkout/types';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useQuery } from '@tanstack/react-query';

export function useQuote(eventId: string, items: CartItem[]) {
  const debounced = useDebouncedValue(items, 300);

  return useQuery({
    queryKey: ['quote', eventId, debounced] as const,
    queryFn: () => quoteOrder(eventId, debounced),
    enabled: debounced.length > 0,
    staleTime: 0,
  });
}
