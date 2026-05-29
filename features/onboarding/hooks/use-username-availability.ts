import * as onboardingApi from '@/features/onboarding/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const USERNAME_PATTERN = /^[a-z][a-z0-9_]{2,29}$/;

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
