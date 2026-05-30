import { api } from '@/lib/api';
import type { GiphySearchResponse } from '@/lib/giphy/types';

export function searchGifs(params: {
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<GiphySearchResponse> {
  return api.get<GiphySearchResponse>('/giphy/search', { params });
}
