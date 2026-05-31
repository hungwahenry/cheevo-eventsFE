import type { MyTicket, TicketsPage } from '@/features/tickets/types';
import { api } from '@/lib/api';

export function listMyTickets(page: number, perPage = 30): Promise<TicketsPage> {
  return api.get<TicketsPage>('/attendee/tickets', {
    params: { page, per_page: perPage },
  });
}

export function getMyTicket(id: string): Promise<MyTicket> {
  return api.get<MyTicket>(`/attendee/tickets/${id}`);
}
