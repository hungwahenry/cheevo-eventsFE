import { useSessionStore } from '@/features/auth';
import * as onboardingApi from '@/features/onboarding/api';
import { useOnboardingStore } from '@/features/onboarding/stores';
import { haptics } from '@/lib/haptics';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

export function useCompleteProfile() {
  return useMutation({
    mutationFn: () => onboardingApi.completeProfile(useOnboardingStore.getState()),
    onSuccess: (user) => {
      haptics.success();
      useSessionStore.getState().setUser(user);
      useOnboardingStore.getState().reset();
      router.replace('/');
    },
    onError: () => haptics.error(),
  });
}
