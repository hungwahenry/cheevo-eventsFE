import { useOnboardingStore } from '@/features/onboarding/stores';
import { haptics } from '@/lib/haptics';
import { toast } from 'sonner-native';
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

  const onFinish = () => {
    if (interestIds.length === 0) {
      haptics.error();
      toast.error('Pick at least one.');
      return;
    }
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
    canFinish: interestIds.length > 0,
    onFinish,
    onBack: () => setStep(2),
    isSubmitting: complete.isPending,
  };
}
