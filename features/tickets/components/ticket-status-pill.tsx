import { StatusPill, type StatusPillTone } from '@/components/ui/status-pill';
import type { TicketStatus } from '@/features/tickets/types';

const TONE: Record<TicketStatus, StatusPillTone> = {
  valid: 'success',
  scanned: 'muted',
  revoked: 'destructive',
};

const LABEL: Record<TicketStatus, string> = {
  valid: 'Valid',
  scanned: 'Used',
  revoked: 'Revoked',
};

export function TicketStatusPill({ status }: { status: TicketStatus }) {
  return <StatusPill label={LABEL[status]} tone={TONE[status]} />;
}
