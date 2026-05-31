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
