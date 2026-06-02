import type { Gender } from '@/features/auth';
import { useOnboardingStore } from '@/features/onboarding/stores';
import { aboutStepSchema } from '@/features/onboarding/validation';
import { haptics } from '@/lib/haptics';
import { toast } from 'sonner-native';

export function useAboutStep() {
  const dateOfBirth = useOnboardingStore((s) => s.dateOfBirth);
  const gender = useOnboardingStore((s) => s.gender);
  const patch = useOnboardingStore((s) => s.patch);
  const setStep = useOnboardingStore((s) => s.setStep);

  const onContinue = () => {
    const parsed = aboutStepSchema.safeParse({ dateOfBirth, gender });
    if (!parsed.success) {
      haptics.error();
      toast.error(parsed.error.issues[0]?.message ?? 'Please complete this step.');
      return;
    }
    haptics.select();
    setStep(2);
  };

  return {
    dateOfBirth,
    gender,
    canContinue: aboutStepSchema.safeParse({ dateOfBirth, gender }).success,
    setDateOfBirth: (value: string) => patch({ dateOfBirth: value }),
    setGender: (value: Gender) => patch({ gender: value }),
    onContinue,
    onBack: () => setStep(0),
  };
}
