import type {
  PublicUser,
  UserAttendedEventsPage,
  UserCommentsPage,
  UserInterest,
  UserOrganisationsPage,
} from '@/features/users/types';
import { api } from '@/lib/api';

export function getPublicUser(id: string): Promise<PublicUser> {
  return api.get<PublicUser>(`/users/${id}`);
}

export function listUserInterests(id: string): Promise<UserInterest[]> {
  return api.get<UserInterest[]>(`/users/${id}/interests`);
}

export function listUserOrganisations(id: string, page: number): Promise<UserOrganisationsPage> {
  return api.get<UserOrganisationsPage>(`/users/${id}/organisations`, {
    params: { page },
  });
}

export function listUserComments(id: string, page: number): Promise<UserCommentsPage> {
  return api.get<UserCommentsPage>(`/users/${id}/comments`, {
    params: { page },
  });
}

export function listUserAttendedEvents(id: string, page: number): Promise<UserAttendedEventsPage> {
  return api.get<UserAttendedEventsPage>(`/users/${id}/attended-events`, {
    params: { page },
  });
}
