import { useSessionStore } from '@/features/auth';
import { updateProfile } from '@/features/profile/api';
import type { UpdateProfileInput } from '@/features/profile/types';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProfile() {
  const setUser = useSessionStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (user) => {
      setUser(user);
    },
  });
}
