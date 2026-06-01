import { listReportReasons } from '@/features/reports/api';
import type { ReportTargetType } from '@/features/reports/types';
import { useQuery } from '@tanstack/react-query';

export const reportReasonsKey = (targetType: ReportTargetType) =>
  ['report-reasons', targetType] as const;

export function useReportReasons(
  targetType: ReportTargetType | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: targetType ? reportReasonsKey(targetType) : ['report-reasons', 'none'],
    queryFn: () => listReportReasons(targetType as ReportTargetType),
    enabled: enabled && targetType !== null,
    staleTime: 5 * 60 * 1000,
  });
}
