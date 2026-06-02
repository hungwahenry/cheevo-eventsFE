import type { PickedGif } from '@/lib/giphy';

export type CommentAuthor = {
  id: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  deleted: boolean;
};

export type MentionedUser = {
  id: string;
  username: string | null;
  display_name: string | null;
};

export type EventComment = {
  id: string;
  event_id: string;
  parent_id: string | null;
  body: string | null;
  gif: PickedGif | null;
  mentions: string[];
  mentioned_users: MentionedUser[];
  likes_count: number;
  replies_count: number;
  is_liked: boolean;
  is_mine: boolean;
  is_going: boolean;
  deleted: boolean;
  created_at: string;
  author: CommentAuthor;
};

export type CommentsPage = {
  items: EventComment[];
  page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type CreateCommentPayload = {
  body?: string;
  gif?: PickedGif;
  parent_id?: string;
  mentions?: string[];
};

export type LikeResponse = {
  is_liked: boolean;
  likes_count: number;
};

export type ReplyTarget = {
  parentId: string;
  mentionedUserId: string;
  mentionUsername: string | null;
};
