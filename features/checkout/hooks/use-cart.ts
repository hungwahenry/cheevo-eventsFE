import type { CartItem } from '@/features/checkout/types';
import * as React from 'react';

export function useCart() {
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  const setQuantity = React.useCallback((ticketId: string, quantity: number) => {
    setCounts((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[ticketId];
      } else {
        next[ticketId] = quantity;
      }
      return next;
    });
  }, []);

  const increment = React.useCallback((ticketId: string, max?: number) => {
    setCounts((prev) => {
      const current = prev[ticketId] ?? 0;
      const ceiling = max ?? Number.POSITIVE_INFINITY;
      if (current >= ceiling) return prev;
      return { ...prev, [ticketId]: current + 1 };
    });
  }, []);

  const decrement = React.useCallback((ticketId: string) => {
    setCounts((prev) => {
      const current = prev[ticketId] ?? 0;
      const next = { ...prev };
      if (current <= 1) {
        delete next[ticketId];
      } else {
        next[ticketId] = current - 1;
      }
      return next;
    });
  }, []);

  const clear = React.useCallback(() => setCounts({}), []);

  const items: CartItem[] = React.useMemo(
    () => Object.entries(counts).map(([ticket_id, quantity]) => ({ ticket_id, quantity })),
    [counts]
  );

  const totalQuantity = items.reduce((sum, line) => sum + line.quantity, 0);

  return {
    counts,
    items,
    totalQuantity,
    setQuantity,
    increment,
    decrement,
    clear,
    quantityOf: (id: string) => counts[id] ?? 0,
  };
}
