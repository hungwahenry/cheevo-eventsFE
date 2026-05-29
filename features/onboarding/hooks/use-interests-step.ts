import { useOnboardingStore } from '@/features/onboarding/stores';
import { haptics } from '@/lib/haptics';
import { useState } from 'react';
import { useCompleteProfile } from './use-complete-profile';
import { useInterests } from './use-interests';

export function useInterestsStep() {
  const interestIds = useOnboardingStore((s) => s.interestIds);
  const marketingOptIn = useOnboardingStore((s) => s.marketingOptIn);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);
  const patch = useOnboardingStore((s) => s.patch);
  const setStep = useOnboardingStore((s) => s.setStep);
  const interestsQuery = useInterests();
  const complete = useCompleteProfile();
  const [error, setError] = useState<string | null>(null);

  const onFinish = () => {
    if (interestIds.length === 0) {
      setError('Pick at least one.');
      haptics.error();
      return;
    }
    setError(null);
    haptics.select();
    complete.mutate();
  };

  return {
    interests: interestsQuery.data ?? [],
    isLoading: interestsQuery.isLoading,
    selectedIds: interestIds,
    toggleInterest,
    marketingOptIn,
    setMarketingOptIn: (value: boolean) => patch({ marketingOptIn: value }),
    error,
    canFinish: interestIds.length > 0,
    onFinish,
    onBack: () => setStep(2),
    isSubmitting: complete.isPending,
  };
}
