import { useCreateReport } from '@/features/reports/hooks/use-create-report';
import { useReportReasons } from '@/features/reports/hooks/use-report-reasons';
import type { ReportReason, ReportTarget } from '@/features/reports/types';
import { haptics } from '@/lib/haptics';
import * as React from 'react';

const DETAILS_MAX = 1000;

export function useReportSheet({ onSuccess }: { onSuccess: () => void }) {
  const [target, setTarget] = React.useState<ReportTarget | null>(null);
  const [selectedReasonId, setSelectedReasonId] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState('');

  const reasons = useReportReasons(target?.type ?? null, target !== null);
  const create = useCreateReport();

  const selectedReason: ReportReason | null = React.useMemo(
    () => reasons.data?.find((r) => r.id === selectedReasonId) ?? null,
    [reasons.data, selectedReasonId]
  );

  const detailsRequired = selectedReason?.requires_details ?? false;
  const detailsValid = !detailsRequired || details.trim().length > 0;
  const canSubmit = selectedReasonId !== null && detailsValid && !create.isPending;

  const reset = React.useCallback((next: ReportTarget | null) => {
    setTarget(next);
    setSelectedReasonId(null);
    setDetails('');
  }, []);

  const setDetailsBounded = React.useCallback(
    (text: string) => setDetails(text.slice(0, DETAILS_MAX)),
    []
  );

  const submit = React.useCallback(() => {
    if (!target || !selectedReasonId) return;
    haptics.success();

    create.mutate(
      {
        target_type: target.type,
        target_id: target.id,
        report_reason_id: selectedReasonId,
        details: details.trim() || undefined,
      },
      { onSuccess }
    );
  }, [target, selectedReasonId, details, create, onSuccess]);

  return {
    target,
    reset,
    reasons,
    selectedReasonId,
    setSelectedReasonId,
    details,
    setDetails: setDetailsBounded,
    detailsRequired,
    canSubmit,
    isPending: create.isPending,
    submit,
    maxDetails: DETAILS_MAX,
  };
}
