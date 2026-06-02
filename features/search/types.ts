export type SearchEventResult = {
  id: string;
  title: string;
  starts_at: string | null;
  ends_at: string | null;
  venue_name: string | null;
  city: string | null;
  flyer_url: string | null;
  status: 'draft' | 'published' | 'past';
  organisation?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
};

export type SearchOrganisationResult = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  about: string | null;
  city: string | null;
};

export type SearchUserResult = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  city: string | null;
};

export type SearchGroups = {
  events: SearchEventResult[];
  organisations: SearchOrganisationResult[];
  users: SearchUserResult[];
};

export type SearchType = 'event' | 'organisation' | 'user';

export type SearchTypePage<T> = {
  items: T[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
