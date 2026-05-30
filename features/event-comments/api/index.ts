import type {
  CommentsPage,
  CreateCommentPayload,
  EventComment,
  LikeResponse,
} from '@/features/event-comments/types';
import { api } from '@/lib/api';

export function listComments(
  eventId: string,
  page: number,
  perPage = 20
): Promise<CommentsPage> {
  return api.get<CommentsPage>(`/attendee/events/${eventId}/comments`, {
    params: { page, per_page: perPage },
  });
}

export function listReplies(
  eventId: string,
  commentId: string,
  page: number,
  perPage = 20
): Promise<CommentsPage> {
  return api.get<CommentsPage>(
    `/attendee/events/${eventId}/comments/${commentId}/replies`,
    { params: { page, per_page: perPage } }
  );
}

export function createComment(
  eventId: string,
  payload: CreateCommentPayload
): Promise<EventComment> {
  return api.post<EventComment>(`/attendee/events/${eventId}/comments`, payload);
}

export function deleteComment(eventId: string, commentId: string): Promise<unknown> {
  return api.delete<unknown>(`/attendee/events/${eventId}/comments/${commentId}`);
}

export function likeComment(eventId: string, commentId: string): Promise<LikeResponse> {
  return api.post<LikeResponse>(
    `/attendee/events/${eventId}/comments/${commentId}/like`
  );
}

export function unlikeComment(eventId: string, commentId: string): Promise<LikeResponse> {
  return api.delete<LikeResponse>(
    `/attendee/events/${eventId}/comments/${commentId}/like`
  );
}
