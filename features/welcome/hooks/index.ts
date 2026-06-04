import { useQuery } from '@tanstack/react-query';

import * as api from '@/features/welcome/api';

export const welcomeKey = () => ['welcome'] as const;

export function useWelcomeContent() {
  return useQuery({
    queryKey: welcomeKey(),
    queryFn: () => api.fetchWelcomeContent(),
    staleTime: 5 * 60_000,
  });
}
