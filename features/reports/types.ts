export type ReportTargetType = 'event' | 'organisation' | 'user' | 'event_comment';

export type ReportReason = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  requires_details: boolean;
};

export type ReportStatus = 'open' | 'under_review' | 'actioned' | 'dismissed';

export type Report = {
  id: string;
  target_type: ReportTargetType;
  target_id: string;
  report_reason_id: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
};

export type CreateReportPayload = {
  target_type: ReportTargetType;
  target_id: string;
  report_reason_id: string;
  details?: string;
};

export type ReportTarget = {
  type: ReportTargetType;
  id: string;
  /** What appears in the sheet title — e.g. "this comment", "this event". */
  noun: string;
};
