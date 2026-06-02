export type PublicUser = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
};

export type UserInterest = {
  id: number;
  slug: string;
  name: string;
};

export type UserOrganisation = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  about: string | null;
  city: string | null;
};

export type UserOrganisationsPage = {
  items: UserOrganisation[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
