export type TicketStatus = 'valid' | 'scanned' | 'revoked';

export type TicketEvent = {
  id: string;
  title: string;
  slug: string;
  starts_at: string | null;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  flyer_url: string | null;
  flyer_type: 'image' | 'video' | null;
};

export type MyTicket = {
  id: string;
  code: string;
  status: TicketStatus;
  ticket_name: string;
  order_id: string;
  scanned_at: string | null;
  created_at: string;
  event: TicketEvent;
};

export type TicketsPage = {
  items: MyTicket[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
