import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import { isApiError } from '@/lib/api/errors';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isApiError(error) && error.isValidation) return;
      toast.error(isApiError(error) ? error.message : 'Something went wrong. Please try again.');
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
});
