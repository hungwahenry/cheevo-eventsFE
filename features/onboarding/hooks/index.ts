import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Gender } from '@/features/auth';
import { useSessionStore } from '@/features/auth';
import * as onboardingApi from '@/features/onboarding/api';
import { useOnboardingStore } from '@/features/onboarding/stores';
import {
  aboutStepSchema,
  profileStepSchema,
  type ProfileStepInput,
} from '@/features/onboarding/validation';
import { haptics } from '@/lib/haptics';
import { requestDeviceLocation } from '@/lib/location';

const USERNAME_PATTERN = /^[a-z][a-z0-9_]{2,29}$/;

export function useInterests() {
  return useQuery({
    queryKey: ['onboarding', 'interests'],
    queryFn: onboardingApi.getInterests,
    staleTime: 10 * 60_000,
  });
}

/** Debounced live username availability for the inline check on the profile step. */
export function useUsernameAvailability(username: string) {
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(username.trim().toLowerCase()), 400);
    return () => clearTimeout(handle);
  }, [username]);

  const isValidFormat = USERNAME_PATTERN.test(debounced);

  const query = useQuery({
    queryKey: ['onboarding', 'username-available', debounced],
    queryFn: () => onboardingApi.checkUsername(debounced),
    enabled: isValidFormat,
    staleTime: 60_000,
  });

  return {
    isValidFormat,
    isChecking: isValidFormat && query.isFetching,
    available: isValidFormat ? query.data?.available : undefined,
  };
}

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

  const onContinue = form.handleSubmit((data) => {
    if (usernameStatus.available === false) {
      form.setError('username', { message: 'That username is taken.' });
      return;
    }
    haptics.select();
    patch(data);
    setStep(1);
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    avatarUri,
    avatarSeed,
    pickAvatar,
    usernameStatus,
    canContinue,
    onContinue,
  };
}

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

export function useLocationStep() {
  const latitude = useOnboardingStore((s) => s.latitude);
  const placeName = useOnboardingStore((s) => s.placeName);
  const patch = useOnboardingStore((s) => s.patch);
  const setStep = useOnboardingStore((s) => s.setStep);
  const [status, setStatus] = useState<'idle' | 'loading' | 'denied'>('idle');

  const requestLocation = async () => {
    setStatus('loading');
    try {
      const result = await requestDeviceLocation();
      if (result.status === 'denied') {
        setStatus('denied');
        haptics.error();
        return;
      }
      patch(result.location);
      setStatus('idle');
      haptics.success();
    } catch {
      setStatus('idle');
      haptics.error();
    }
  };

  const onContinue = () => {
    if (latitude === null) return;
    haptics.select();
    setStep(3);
  };

  return {
    status,
    hasLocation: latitude !== null,
    placeName,
    requestLocation,
    onContinue,
    onBack: () => setStep(1),
  };
}

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
