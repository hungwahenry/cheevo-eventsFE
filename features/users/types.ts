export type PublicUser = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  is_blocked: boolean;
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

export type UserComment = {
  id: string;
  body: string | null;
  gif: { id: string; url: string; preview_url: string | null } | null;
  likes_count: number;
  replies_count: number;
  created_at: string;
  event: {
    id: string;
    slug: string;
    title: string;
    flyer_url: string | null;
    flyer_type: 'image' | 'video' | null;
    status: 'draft' | 'published' | 'past';
  };
};

export type UserCommentsPage = {
  items: UserComment[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type UserAttendedEvent = {
  id: string;
  slug: string;
  title: string;
  starts_at: string | null;
  ends_at: string | null;
  venue_name: string | null;
  city: string | null;
  flyer_url: string | null;
  flyer_type: 'image' | 'video' | null;
  status: 'draft' | 'published' | 'past';
  organisation?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
};

export type UserAttendedEventsPage = {
  items: UserAttendedEvent[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};
