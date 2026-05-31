export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

export type IssuedTicketStatus = 'valid' | 'scanned' | 'revoked';

export type OrderItem = {
  id: string;
  event_ticket_id: string;
  ticket_name: string;
  quantity: number;
  unit_price_minor: number;
  subtotal_minor: number;
};

export type IssuedTicket = {
  id: string;
  code: string;
  status: IssuedTicketStatus;
  event_id: string;
  event_ticket_id: string;
  scanned_at: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  event_id: string;
  status: OrderStatus;
  subtotal_minor: number;
  fees_minor: number;
  total_minor: number;
  currency: string;
  paid_at: string | null;
  created_at: string;
  items?: OrderItem[];
  issued_tickets?: IssuedTicket[];
};

export type OrdersPage = {
  items: Order[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
