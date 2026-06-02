import type { ActionItem, ActionsSheetRef } from '@/components/ui/actions-sheet';
import { useToggleBlock } from '@/features/blocks/hooks';
import { type ReportSheetRef } from '@/features/reports';
import type { PublicUser } from '@/features/users/types';
import { Flag, ShieldOff, ShieldUser } from 'lucide-react-native';
import * as React from 'react';

export function useUserActions(user: PublicUser | null) {
  const actionsRef = React.useRef<ActionsSheetRef>(null);
  const reportRef = React.useRef<ReportSheetRef>(null);
  const toggleBlock = useToggleBlock();
  const [pendingBlock, setPendingBlock] = React.useState<PublicUser | null>(null);

  const handleReport = React.useCallback((u: PublicUser) => {
    reportRef.current?.present({
      type: 'user',
      id: u.id,
      noun: u.username ? `@${u.username}` : 'this person',
    });
  }, []);

  const handleBlock = React.useCallback(
    (u: PublicUser) => {
      if (u.is_blocked) {
        toggleBlock.mutate({
          targetType: 'user',
          targetId: u.id,
          currentlyBlocked: true,
          invalidate: [['user', u.id]],
        });
      } else {
        setPendingBlock(u);
      }
    },
    [toggleBlock]
  );

  const confirmBlock = React.useCallback(() => {
    if (!pendingBlock) return;
    toggleBlock.mutate({
      targetType: 'user',
      targetId: pendingBlock.id,
      currentlyBlocked: false,
      invalidate: [['user', pendingBlock.id]],
    });
    setPendingBlock(null);
  }, [pendingBlock, toggleBlock]);

  const cancelBlock = React.useCallback(() => setPendingBlock(null), []);

  const actions: ActionItem[] = React.useMemo(() => {
    if (!user) return [];

    return [
      {
        label: user.is_blocked ? 'Unblock' : 'Block',
        icon: user.is_blocked ? ShieldUser : ShieldOff,
        destructive: !user.is_blocked,
        onPress: () => handleBlock(user),
      },
      {
        label: 'Report',
        icon: Flag,
        destructive: true,
        onPress: () => handleReport(user),
      },
    ];
  }, [user, handleBlock, handleReport]);

  return { actionsRef, reportRef, actions, pendingBlock, cancelBlock, confirmBlock };
}
