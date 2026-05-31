import { getMyTicket, listMyTickets } from '@/features/tickets/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const myTicketsKey = ['my-tickets'] as const;
export const myTicketKey = (id: string) => ['my-ticket', id] as const;

export function useMyTickets() {
  return useInfiniteQuery({
    queryKey: myTicketsKey,
    queryFn: ({ pageParam }) => listMyTickets(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.last_page ? last.page + 1 : undefined),
  });
}

export function useMyTicket(id: string) {
  return useQuery({
    queryKey: myTicketKey(id),
    queryFn: () => getMyTicket(id),
  });
}
