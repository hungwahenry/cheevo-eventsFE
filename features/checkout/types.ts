import type { Order } from '@/features/orders/types';

export type CartItem = {
  ticket_id: string;
  quantity: number;
};

export type QuoteLine = {
  ticket_id: string;
  ticket_name: string;
  quantity: number;
  unit_price_minor: number;
  subtotal_minor: number;
};

export type OrderQuote = {
  subtotal_minor: number;
  fees_minor: number;
  total_minor: number;
  currency: string;
  items: QuoteLine[];
};

export type CreatedOrder = {
  order: Order;
  authorization_url: string;
};
