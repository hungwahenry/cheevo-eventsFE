import type { ActionsSheetRef } from '@/components/ui/actions-sheet';
import { useEventActions } from '@/features/event-detail/hooks/use-event-actions';
import type { EventDetail } from '@/features/event-detail/types';
import type { ReportSheetRef } from '@/features/reports';
import * as React from 'react';

export function useEventDetailActions(event: EventDetail | null) {
  const actionsRef = React.useRef<ActionsSheetRef>(null);
  const reportRef = React.useRef<ReportSheetRef>(null);

  const handleReport = React.useCallback((e: EventDetail) => {
    reportRef.current?.present({
      type: 'event',
      id: e.id,
      noun: 'this event',
    });
  }, []);

  const actions = useEventActions(event, { onReport: handleReport });

  return { actionsRef, reportRef, actions };
}
