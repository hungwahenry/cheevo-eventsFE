export type FeedInterest = {
  id: number;
  slug: string;
  name: string;
};

export type FeedOrganisation = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  subscribers_count: number;
};

export type FeedEvent = {
  id: string;
  title: string;
  slug: string;
  starts_at: string | null;
  ends_at: string | null;
  city: string | null;
  venue_name: string | null;
  flyer_url: string | null;
  flyer_type: 'image' | 'video' | null;
  tickets_min_price: number | null;
  tickets_max_price: number | null;
  tickets_count: number;
  currency: string;
  organisation?: FeedOrganisation;
  interests: FeedInterest[];
  interest_overlap: number;
  is_subscribed: boolean;
};

export type FeedPage = {
  items: FeedEvent[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
