import { useCurrentUser } from '@/features/auth';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';

export function useOpenUserProfile() {
  const me = useCurrentUser();
  const { dismissAll } = useBottomSheetModal();

  return (userId: string) => {
    dismissAll();
    if (me && me.id === userId) {
      router.push('/(tabs)/profile' as any);
    } else {
      router.push(`/user/${userId}` as any);
    }
  };
}
