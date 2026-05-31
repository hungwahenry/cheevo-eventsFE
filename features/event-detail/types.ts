export type EventDetailInterest = {
  id: number;
  slug: string;
  name: string;
};

export type EventDetailOrganisation = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  about: string | null;
  city: string | null;
  events_count: number;
  subscribers_count: number;
};

export type EventDetailImage = {
  id: string;
  url: string;
  sort_order: number;
};

export type EventDetailFeature = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
};

export type EventDetailTicket = {
  id: string;
  name: string;
  description: string | null;
  gross_price: number;
  display_price: number | null;
  quantity: number | null;
  sold_count: number;
  sort_order: number;
  status: 'draft' | 'on_sale' | 'paused';
  sales_starts_at: string | null;
  sales_ends_at: string | null;
  valid_from: string | null;
  valid_to: string | null;
  max_per_order: number | null;
};

export type EventDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  place_id: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
  flyer_url: string | null;
  flyer_type: 'image' | 'video' | null;
  video_url: string | null;
  published_at: string | null;
  presale_until: string | null;
  tickets_count: number;
  tickets_min_price: number | null;
  tickets_max_price: number | null;
  currency: string;
  rsvps_count: number;
  comments_count: number;
  organisation: EventDetailOrganisation;
  interests: EventDetailInterest[];
  images: EventDetailImage[];
  features: EventDetailFeature[];
  tickets: EventDetailTicket[];
  is_subscribed: boolean;
  is_rsvped: boolean;
  interest_overlap: number;
};

export type RsvpResponse = {
  is_rsvped: boolean;
  rsvps_count: number;
};
