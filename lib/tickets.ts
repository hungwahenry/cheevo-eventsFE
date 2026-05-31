type AvailabilityInput = {
  quantity: number | null;
  sold_count: number;
  max_per_order: number | null;
};

export type TicketAvailability = {
  remaining: number | null;
  soldOut: boolean;
  maxPurchasable: number;
};

export function getTicketAvailability(ticket: AvailabilityInput): TicketAvailability {
  const remaining =
    ticket.quantity !== null ? ticket.quantity - ticket.sold_count : null;
  const soldOut = remaining !== null && remaining <= 0;
  const maxPurchasable = Math.min(
    ticket.max_per_order ?? Number.POSITIVE_INFINITY,
    remaining ?? Number.POSITIVE_INFINITY
  );

  return { remaining, soldOut, maxPurchasable };
}

export function getOnSaleTickets<T extends { status: string }>(tickets: T[]): T[] {
  return tickets.filter((t) => t.status === 'on_sale');
}

export type TicketEventGroup<T> = {
  event: T extends { event: infer E } ? E : never;
  tickets: T[];
};

export function groupTicketsByEvent<T extends { event: { id: string } }>(
  tickets: T[]
): TicketEventGroup<T>[] {
  const byEvent = new Map<string, TicketEventGroup<T>>();
  for (const ticket of tickets) {
    const existing = byEvent.get(ticket.event.id);
    if (existing) {
      existing.tickets.push(ticket);
    } else {
      byEvent.set(ticket.event.id, {
        event: ticket.event as TicketEventGroup<T>['event'],
        tickets: [ticket],
      });
    }
  }
  return [...byEvent.values()];
}

export function selectTicketsForEvent<T extends { event: { id: string } }>(
  tickets: T[],
  eventId: string
): T[] {
  return tickets.filter((t) => t.event.id === eventId);
}

export function ticketCountLabel<T extends { status: string }>(tickets: T[]): string {
  const total = tickets.length;
  const valid = tickets.filter((t) => t.status === 'valid').length;
  const base = `${total} ticket${total === 1 ? '' : 's'}`;
  return valid < total ? `${base} · ${valid} active` : base;
}
