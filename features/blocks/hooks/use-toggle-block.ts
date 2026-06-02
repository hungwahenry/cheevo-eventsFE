import { createBlock, deleteBlock } from '@/features/blocks/api';
import type { BlockTargetType } from '@/features/blocks/types';
import { isApiError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

type Args = {
  targetType: BlockTargetType;
  targetId: string;
  currentlyBlocked: boolean;
  /** Query keys to invalidate after the toggle so cached "is_blocked" flips. */
  invalidate?: ReadonlyArray<readonly unknown[]>;
};

export function useToggleBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ targetType, targetId, currentlyBlocked }: Args) =>
      currentlyBlocked
        ? deleteBlock(targetType, targetId)
        : createBlock(targetType, targetId),

    onSuccess: (_data, { currentlyBlocked, invalidate }) => {
      toast.success(currentlyBlocked ? 'Unblocked.' : 'Blocked.');
      invalidate?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },

    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
      } else {
        toast.error('Could not update block.');
      }
    },
  });
}
