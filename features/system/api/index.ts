import { api } from '@/lib/api';

import type { ConfigResponse, FlagsResponse } from '@/features/system/types';

export function fetchFlags(): Promise<FlagsResponse> {
  return api.get<FlagsResponse>('/flags');
}

export function fetchConfig(): Promise<ConfigResponse> {
  return api.get<ConfigResponse>('/config');
}
