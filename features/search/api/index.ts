import type {
  SearchEventResult,
  SearchGroups,
  SearchOrganisationResult,
  SearchType,
  SearchTypePage,
  SearchUserResult,
} from '@/features/search/types';
import { api } from '@/lib/api';

export function searchAll(query: string): Promise<SearchGroups> {
  return api.get<SearchGroups>('/search', { params: { q: query } });
}

export function searchEvents(query: string, page: number): Promise<SearchTypePage<SearchEventResult>> {
  return api.get<SearchTypePage<SearchEventResult>>('/search/event', {
    params: { q: query, page },
  });
}

export function searchOrganisations(query: string, page: number): Promise<SearchTypePage<SearchOrganisationResult>> {
  return api.get<SearchTypePage<SearchOrganisationResult>>('/search/organisation', {
    params: { q: query, page },
  });
}

export function searchUsers(query: string, page: number): Promise<SearchTypePage<SearchUserResult>> {
  return api.get<SearchTypePage<SearchUserResult>>('/search/user', {
    params: { q: query, page },
  });
}

export const searchByType = {
  event: searchEvents,
  organisation: searchOrganisations,
  user: searchUsers,
} as const satisfies Record<SearchType, (q: string, page: number) => Promise<SearchTypePage<unknown>>>;
