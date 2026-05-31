import type { Order, OrdersPage } from '@/features/orders/types';
import { api } from '@/lib/api';

export function listOrders(page: number, perPage = 20): Promise<OrdersPage> {
  return api.get<OrdersPage>('/attendee/orders', {
    params: { page, per_page: perPage },
  });
}

export function getOrder(id: string): Promise<Order> {
  return api.get<Order>(`/attendee/orders/${id}`);
}

export function verifyOrder(id: string, lookupKey?: string): Promise<Order> {
  return api.post<Order>(`/attendee/orders/${id}/verify`, {
    lookup_key: lookupKey,
  });
}

export function cancelOrder(id: string): Promise<Order> {
  return api.delete<Order>(`/attendee/orders/${id}`);
}
