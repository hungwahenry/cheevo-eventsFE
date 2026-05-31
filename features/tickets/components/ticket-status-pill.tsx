import { Text } from '@/components/ui/text';
import type { TicketStatus } from '@/features/tickets/types';
import { View } from 'react-native';

const STYLES: Record<TicketStatus, { container: string; label: string; text: string }> = {
  valid: {
    container: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    label: 'Valid',
  },
  scanned: {
    container: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'Used',
  },
  revoked: {
    container: 'bg-destructive/10',
    text: 'text-destructive',
    label: 'Revoked',
  },
};

export function TicketStatusPill({ status }: { status: TicketStatus }) {
  const s = STYLES[status];

  return (
    <View className={`rounded-full px-2 py-0.5 ${s.container}`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}
