import { useOnboardingStore } from '@/features/onboarding/stores';
import { profileStepSchema, type ProfileStepInput } from '@/features/onboarding/validation';
import { firstErrorMessage } from '@/lib/form-errors';
import { haptics } from '@/lib/haptics';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { useUsernameAvailability } from './use-username-availability';

export function useProfileStep() {
  const firstName = useOnboardingStore((s) => s.firstName);
  const lastName = useOnboardingStore((s) => s.lastName);
  const username = useOnboardingStore((s) => s.username);
  const avatarUri = useOnboardingStore((s) => s.avatarUri);
  const patch = useOnboardingStore((s) => s.patch);
  const setStep = useOnboardingStore((s) => s.setStep);

  const form = useForm<ProfileStepInput>({
    resolver: zodResolver(profileStepSchema),
    mode: 'onTouched',
    defaultValues: { firstName, lastName, username },
  });

  const values = form.watch();
  const usernameStatus = useUsernameAvailability(values.username);
  const avatarSeed = values.username.trim().toLowerCase() || undefined;
  const canContinue =
    profileStepSchema.safeParse(values).success &&
    usernameStatus.available !== false &&
    !usernameStatus.isChecking;

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      patch({ avatarUri: result.assets[0].uri });
    }
  };

  const onContinue = form.handleSubmit(
    (data) => {
      if (usernameStatus.available === false) {
        haptics.error();
        toast.error('That username is taken.');
        return;
      }
      haptics.select();
      patch(data);
      setStep(1);
    },
    (errors) => {
      haptics.error();
      const message = firstErrorMessage(errors);
      if (message) toast.error(message);
    },
  );

  return {
    control: form.control,
    avatarUri,
    avatarSeed,
    pickAvatar,
    usernameStatus,
    canContinue,
    onContinue,
  };
}
