import { Text } from '@/components/ui/text';
import type { EventDetailTicket } from '@/features/event-detail/types';
import { formatDateRange, formatShortDate } from '@/lib/format/datetime';
import { formatMoney } from '@/lib/format/money';
import { getTicketAvailability } from '@/lib/tickets';
import { View } from 'react-native';

type EventDetailTicketCardProps = {
  ticket: EventDetailTicket;
  currency: string;
};

export function EventDetailTicketCard({ ticket, currency }: EventDetailTicketCardProps) {
  const showCompare =
    ticket.display_price !== null && ticket.display_price > ticket.gross_price;
  const { remaining, soldOut } = getTicketAvailability(ticket);
  const summary = buildSummary(ticket, remaining);

  return (
    <View
      className={`bg-muted gap-2 rounded-2xl p-4 ${soldOut ? 'opacity-60' : ''}`}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-foreground text-base font-sans-semibold" numberOfLines={1}>
            {ticket.name}
          </Text>
          {ticket.description ? (
            <Text className="text-muted-foreground mt-0.5 text-xs" numberOfLines={2}>
              {ticket.description}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="text-foreground text-xl leading-tight font-sans-bold">
            {formatMoney(ticket.gross_price, currency)}
          </Text>
          {showCompare ? (
            <Text className="text-muted-foreground text-xs line-through">
              {formatMoney(ticket.display_price as number, currency)}
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
  );
}

function buildSummary(ticket: EventDetailTicket, remaining: number | null): string {
  const parts: string[] = [];

  if (remaining !== null) {
    parts.push(remaining <= 0 ? 'Sold out' : `${remaining} left`);
  }
  if (ticket.sales_ends_at) {
    parts.push(`Closes ${formatShortDate(ticket.sales_ends_at)}`);
  }
  const validity = formatDateRange(ticket.valid_from, ticket.valid_to);
  if (validity) {
    parts.push(`Valid ${validity}`);
  }

  return parts.join(' · ');
}
