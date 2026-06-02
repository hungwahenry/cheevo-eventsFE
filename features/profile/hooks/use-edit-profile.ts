import { useCurrentUser } from '@/features/auth';
import { useUsernameAvailability } from '@/features/onboarding/hooks';
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile';
import { editProfileSchema, type EditProfileInput } from '@/features/profile/validation';
import { firstErrorMessage } from '@/lib/form-errors';
import { haptics } from '@/lib/haptics';
import { requestDeviceLocation, type ResolvedLocation } from '@/lib/location';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';

export function useEditProfile() {
  const user = useCurrentUser();
  const mutation = useUpdateProfile();

  const form = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: user?.profile.first_name ?? '',
      lastName: user?.profile.last_name ?? '',
      username: user?.profile.username ?? '',
      bio: user?.profile.bio ?? '',
    },
  });

  const values = form.watch();
  const usernameDirty = values.username !== (user?.profile.username ?? '');
  const usernameStatus = useUsernameAvailability(usernameDirty ? values.username : '');

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [locationOverride, setLocationOverride] = useState<ResolvedLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading'>('idle');

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setRemoveAvatar(false);
    }
  };

  const clearAvatar = () => {
    setAvatarUri(null);
    setRemoveAvatar(true);
  };

  const updateLocation = async () => {
    setLocationStatus('loading');
    try {
      const result = await requestDeviceLocation();
      if (result.status === 'denied') {
        setLocationStatus('idle');
        haptics.error();
        toast.error('Location permission is required. Enable it in Settings.');
        return;
      }
      setLocationOverride(result.location);
      setLocationStatus('idle');
      haptics.success();
    } catch {
      setLocationStatus('idle');
      haptics.error();
    }
  };

  const isDirty =
    form.formState.isDirty ||
    avatarUri !== null ||
    removeAvatar ||
    locationOverride !== null;

  const canSave =
    isDirty &&
    !mutation.isPending &&
    !usernameStatus.isChecking &&
    usernameStatus.available !== false;

  const placeName = locationOverride?.placeName ?? user?.profile.place_name ?? null;

  const save = form.handleSubmit(
    (data) => {
      if (usernameStatus.available === false) {
        haptics.error();
        toast.error('That username is taken.');
        return;
      }

      const initialUsername = user?.profile.username ?? '';
      const initialBio = user?.profile.bio ?? '';

      mutation.mutate(
        {
          ...(data.firstName !== (user?.profile.first_name ?? '')
            ? { firstName: data.firstName }
            : {}),
          ...(data.lastName !== (user?.profile.last_name ?? '')
            ? { lastName: data.lastName }
            : {}),
          ...(data.username !== initialUsername ? { username: data.username } : {}),
          ...((data.bio ?? '') !== initialBio ? { bio: data.bio ?? null } : {}),
          ...(locationOverride
            ? {
                latitude: locationOverride.latitude,
                longitude: locationOverride.longitude,
                placeName: locationOverride.placeName,
                city: locationOverride.city,
              }
            : {}),
          ...(avatarUri ? { avatarUri } : {}),
          ...(removeAvatar && !avatarUri ? { removeAvatar: true } : {}),
        },
        {
          onSuccess: () => {
            haptics.success();
            toast.success('Profile updated');
            router.back();
          },
          onError: () => {
            haptics.error();
            toast.error('Could not save. Try again.');
          },
        },
      );
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
    removedAvatar: removeAvatar,
    currentAvatarUrl: user?.profile.avatar_url ?? null,
    avatarSeed: values.username.trim().toLowerCase() || undefined,
    pickAvatar,
    clearAvatar,
    usernameStatus,
    usernameDirty,
    locationStatus,
    placeName,
    updateLocation,
    canSave,
    isSaving: mutation.isPending,
    save,
  };
}
