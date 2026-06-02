export type PublicOrganisation = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  about: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  city: string | null;
  events_count: number;
  subscribers_count: number;
  hosting_since: string | null;
  category: { id: number; slug: string; name: string } | null;
  socials: Array<{
    platform: string;
    name: string;
    handle: string;
    url: string | null;
  }>;
  is_subscribed: boolean;
  is_blocked: boolean;
};

export type OrganisationEvent = {
  id: string;
  title: string;
  starts_at: string | null;
  ends_at: string | null;
  venue_name: string | null;
  city: string | null;
  flyer_url: string | null;
  flyer_type: 'image' | 'video' | null;
  status: 'draft' | 'published' | 'past';
};

export type OrganisationEventsPage = {
  items: OrganisationEvent[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type OrganisationSubscribersPreview = {
  count: number;
  sample: Array<{
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    city: string | null;
  }>;
};
