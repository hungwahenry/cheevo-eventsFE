import { quoteOrder } from '@/features/checkout/api';
import type { CartItem } from '@/features/checkout/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useQuote(eventId: string, items: CartItem[]) {
  const debounced = useDebouncedValue(items, 300);

  return useQuery({
    queryKey: ['quote', eventId, debounced] as const,
    queryFn: () => quoteOrder(eventId, debounced),
    enabled: debounced.length > 0,
    staleTime: 0,
  });
}
