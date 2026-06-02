import type { ActionItem, ActionsSheetRef } from '@/components/ui/actions-sheet';
import { useToggleBlock } from '@/features/blocks/hooks';
import type { PublicOrganisation } from '@/features/organisations/types';
import { type ReportSheetRef } from '@/features/reports';
import { Flag, ShieldOff, ShieldUser } from 'lucide-react-native';
import * as React from 'react';

export function useOrganisationActions(org: PublicOrganisation | null) {
  const actionsRef = React.useRef<ActionsSheetRef>(null);
  const reportRef = React.useRef<ReportSheetRef>(null);
  const toggleBlock = useToggleBlock();
  const [pendingBlock, setPendingBlock] = React.useState<PublicOrganisation | null>(null);

  const handleReport = React.useCallback((o: PublicOrganisation) => {
    reportRef.current?.present({
      type: 'organisation',
      id: o.id,
      noun: `@${o.slug}`,
    });
  }, []);

  const handleBlock = React.useCallback(
    (o: PublicOrganisation) => {
      if (o.is_blocked) {
        toggleBlock.mutate({
          targetType: 'organisation',
          targetId: o.id,
          currentlyBlocked: true,
          invalidate: [['org', o.slug]],
        });
      } else {
        setPendingBlock(o);
      }
    },
    [toggleBlock]
  );

  const confirmBlock = React.useCallback(() => {
    if (!pendingBlock) return;
    toggleBlock.mutate({
      targetType: 'organisation',
      targetId: pendingBlock.id,
      currentlyBlocked: false,
      invalidate: [['org', pendingBlock.slug]],
    });
    setPendingBlock(null);
  }, [pendingBlock, toggleBlock]);

  const cancelBlock = React.useCallback(() => setPendingBlock(null), []);

  const actions: ActionItem[] = React.useMemo(() => {
    if (!org) return [];

    return [
      {
        label: org.is_blocked ? 'Unblock' : 'Block',
        icon: org.is_blocked ? ShieldUser : ShieldOff,
        destructive: !org.is_blocked,
        onPress: () => handleBlock(org),
      },
      {
        label: 'Report',
        icon: Flag,
        destructive: true,
        onPress: () => handleReport(org),
      },
    ];
  }, [org, handleBlock, handleReport]);

  return { actionsRef, reportRef, actions, pendingBlock, cancelBlock, confirmBlock };
}
