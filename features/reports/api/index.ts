import type {
  CreateReportPayload,
  Report,
  ReportReason,
  ReportTargetType,
} from '@/features/reports/types';
import { api } from '@/lib/api';

export function listReportReasons(
  targetType: ReportTargetType
): Promise<ReportReason[]> {
  return api.get<ReportReason[]>('/report-reasons', {
    params: { target_type: targetType },
  });
}

export function createReport(payload: CreateReportPayload): Promise<Report> {
  return api.post<Report>('/reports', payload);
}
