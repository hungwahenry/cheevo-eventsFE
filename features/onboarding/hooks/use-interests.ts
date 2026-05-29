import * as onboardingApi from '@/features/onboarding/api';
import { useQuery } from '@tanstack/react-query';

export function useInterests() {
  return useQuery({
    queryKey: ['onboarding', 'interests'],
    queryFn: onboardingApi.getInterests,
    staleTime: 10 * 60_000,
  });
}
