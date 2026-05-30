import type { EventDetail, RsvpResponse } from '@/features/event-detail/types';
import { api } from '@/lib/api';

export function getEvent(id: string): Promise<EventDetail> {
  return api.get<EventDetail>(`/attendee/events/${id}`);
}

export function rsvp(eventId: string): Promise<RsvpResponse> {
  return api.post<RsvpResponse>(`/attendee/events/${eventId}/rsvp`);
}

export function unrsvp(eventId: string): Promise<RsvpResponse> {
  return api.delete<RsvpResponse>(`/attendee/events/${eventId}/rsvp`);
}

export function subscribe(organisationId: string): Promise<unknown> {
  return api.post<unknown>(`/attendee/organisations/${organisationId}/subscribe`);
}

export function unsubscribe(organisationId: string): Promise<unknown> {
  return api.delete<unknown>(`/attendee/organisations/${organisationId}/subscribe`);
}
