import type { Gender } from '@/features/auth';
import { useOnboardingStore } from '@/features/onboarding/stores';
import { aboutStepSchema } from '@/features/onboarding/validation';
import { haptics } from '@/lib/haptics';
import { useState } from 'react';

export function useAboutStep() {
  const dateOfBirth = useOnboardingStore((s) => s.dateOfBirth);
  const gender = useOnboardingStore((s) => s.gender);
  const patch = useOnboardingStore((s) => s.patch);
  const setStep = useOnboardingStore((s) => s.setStep);
  const [errors, setErrors] = useState<{ dateOfBirth?: string; gender?: string }>({});

  const onContinue = () => {
    const parsed = aboutStepSchema.safeParse({ dateOfBirth, gender });
    if (!parsed.success) {
      const next: { dateOfBirth?: string; gender?: string } = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === 'dateOfBirth') next.dateOfBirth ??= issue.message;
        if (issue.path[0] === 'gender') next.gender ??= issue.message;
      }
      setErrors(next);
      haptics.error();
      return;
    }
    setErrors({});
    haptics.select();
    setStep(2);
  };

  return {
    dateOfBirth,
    gender,
    errors,
    canContinue: aboutStepSchema.safeParse({ dateOfBirth, gender }).success,
    setDateOfBirth: (value: string) => patch({ dateOfBirth: value }),
    setGender: (value: Gender) => patch({ gender: value }),
    onContinue,
    onBack: () => setStep(0),
  };
}
