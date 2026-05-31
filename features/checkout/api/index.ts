import type { CartItem, CreatedOrder, OrderQuote } from '@/features/checkout/types';
import { api } from '@/lib/api';

export function quoteOrder(eventId: string, items: CartItem[]): Promise<OrderQuote> {
  return api.post<OrderQuote>(`/attendee/events/${eventId}/orders/quote`, {
    items,
  });
}

export function createOrder(
  eventId: string,
  payload: { items: CartItem[]; callback_url: string; provider?: string }
): Promise<CreatedOrder> {
  return api.post<CreatedOrder>(`/attendee/events/${eventId}/orders`, payload);
}
