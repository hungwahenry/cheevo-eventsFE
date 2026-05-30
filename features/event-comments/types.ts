import type { GiphyGif } from '@/lib/giphy';

export type CommentGif = Pick<GiphyGif, 'id' | 'url' | 'width' | 'height'>;

export type CommentAuthor = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type EventComment = {
  id: string;
  event_id: string;
  parent_id: string | null;
  body: string | null;
  gif: CommentGif | null;
  mentions: string[];
  likes_count: number;
  replies_count: number;
  is_liked: boolean;
  is_mine: boolean;
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
  gif?: CommentGif;
  parent_id?: string;
  mentions?: string[];
};

export type LikeResponse = {
  is_liked: boolean;
  likes_count: number;
};
