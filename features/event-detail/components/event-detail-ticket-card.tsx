import { Text } from '@/components/ui/text';
import type { EventDetailTicket } from '@/features/event-detail/types';
import { formatDateRange, formatShortDate } from '@/lib/format/datetime';
import { formatNaira } from '@/lib/format/money';
import { View } from 'react-native';

export function EventDetailTicketCard({ ticket }: { ticket: EventDetailTicket }) {
  const showCompare =
    ticket.display_price !== null && ticket.display_price > ticket.gross_price;

  const summary = buildSummary(ticket);

  return (
    <View className="bg-card border-border flex-row overflow-hidden rounded-2xl border">
      <View className="bg-primary w-1.5" />

      <View className="flex-1 gap-2 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-foreground text-base font-semibold" numberOfLines={1}>
              {ticket.name}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-foreground text-xl leading-tight font-bold">
              {formatNaira(ticket.gross_price)}
            </Text>
            {showCompare ? (
              <Text className="text-muted-foreground text-xs line-through">
                {formatNaira(ticket.display_price as number)}
              </Text>
            ) : null}
          </View>
        </View>

        {summary ? (
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            {summary}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function buildSummary(ticket: EventDetailTicket): string {
  const parts: string[] = [];

  if (ticket.quantity !== null) {
    parts.push(`${ticket.quantity} left`);
  }
  if (ticket.sales_ends_at) {
    parts.push(`Closes ${formatShortDate(ticket.sales_ends_at)}`);
  }
  const validity = formatDateRange(ticket.valid_from, ticket.valid_to);
  if (validity) {
    parts.push(`Valid ${validity}`);
  }
  if (ticket.max_per_order !== null) {
    parts.push(`Max ${ticket.max_per_order}/order`);
  }

  return parts.join(' · ');
}
