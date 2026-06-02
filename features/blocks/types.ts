export type BlockTargetType = 'user' | 'organisation';

export type BlockedUser = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  city: string | null;
};

export type BlockedOrganisation = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  about: string | null;
  city: string | null;
};

export type BlockedPage<T> = {
  items: T[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
