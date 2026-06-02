import type {
  OrganisationEventsPage,
  OrganisationSubscribersPreview,
  PublicOrganisation,
} from '@/features/organisations/types';
import { api } from '@/lib/api';

export function getPublicOrganisation(slug: string): Promise<PublicOrganisation> {
  return api.get<PublicOrganisation>(`/attendee/orgs/${slug}`);
}

export function listOrganisationUpcomingEvents(
  slug: string,
  page: number,
): Promise<OrganisationEventsPage> {
  return api.get<OrganisationEventsPage>(`/attendee/orgs/${slug}/upcoming-events`, {
    params: { page },
  });
}

export function listOrganisationPastEvents(
  slug: string,
  page: number,
): Promise<OrganisationEventsPage> {
  return api.get<OrganisationEventsPage>(`/attendee/orgs/${slug}/past-events`, {
    params: { page },
  });
}

export function getOrganisationSubscribersPreview(
  slug: string,
): Promise<OrganisationSubscribersPreview> {
  return api.get<OrganisationSubscribersPreview>(`/attendee/orgs/${slug}/subscribers`);
}

export function subscribeToOrganisation(orgId: string): Promise<unknown> {
  return api.post(`/attendee/organisations/${orgId}/subscribe`);
}

export function unsubscribeFromOrganisation(orgId: string): Promise<unknown> {
  return api.delete(`/attendee/organisations/${orgId}/subscribe`);
}
