import { useSessionStore } from '@/features/auth';
import { updateInterests } from '@/features/profile/api';
import type { UpdateInterestsInput } from '@/features/profile/types';
import { useMutation } from '@tanstack/react-query';

export function useUpdateInterests() {
  const setUser = useSessionStore((s) => s.setUser);
  const user = useSessionStore((s) => s.user);

  return useMutation({
    mutationFn: (input: UpdateInterestsInput) => updateInterests(input),
    onSuccess: (interests) => {
      if (user) setUser({ ...user, interests });
    },
  });
}
