import { useCurrentUser } from '@/features/auth';
import { useInterests } from '@/features/onboarding/hooks';
import { useUpdateInterests } from '@/features/profile/hooks/use-update-interests';
import { haptics } from '@/lib/haptics';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner-native';

export function useInterestsSettings() {
  const user = useCurrentUser();
  const { data: interests = [], isLoading } = useInterests();
  const updateInterests = useUpdateInterests();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (user) setSelectedIds(user.interests.map((i) => i.id));
  }, [user]);

  const initialIds = useMemo(() => user?.interests.map((i) => i.id) ?? [], [user]);

  const dirty =
    selectedIds.length !== initialIds.length ||
    selectedIds.some((id) => !initialIds.includes(id));
  const canSave = dirty && selectedIds.length > 0;

  const toggle = (id: number) => {
    haptics.select();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const save = () => {
    updateInterests.mutate(
      { interestIds: selectedIds },
      {
        onSuccess: () => {
          haptics.success();
          toast.success('Interests updated');
          router.back();
        },
        onError: () => {
          haptics.error();
          toast.error('Could not save. Try again.');
        },
      },
    );
  };

  return {
    interests,
    isLoading,
    selectedIds,
    toggle,
    canSave,
    isSaving: updateInterests.isPending,
    save,
  };
}
