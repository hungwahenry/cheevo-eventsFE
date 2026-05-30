import type { FeedPage } from '@/features/feed/types';
import { api } from '@/lib/api';

export function getFeed(page: number, perPage = 10): Promise<FeedPage> {
  return api.get<FeedPage>('/attendee/feed', {
    params: { page, per_page: perPage },
  });
}
