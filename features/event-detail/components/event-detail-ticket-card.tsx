import { Text } from '@/components/ui/text';
import type { EventDetailTicket } from '@/features/event-detail/types';
import { formatNaira } from '@/lib/format/money';
import { View } from 'react-native';

export function EventDetailTicketCard({ ticket }: { ticket: EventDetailTicket }) {
  const showCompare = ticket.display_price !== null && ticket.display_price > ticket.gross_price;
  const availability = ticket.quantity === null ? 'Unlimited' : `${ticket.quantity} left`;

  return (
    <View className="border-border rounded-2xl border p-4">
      <Text className="text-foreground text-base font-semibold">{ticket.name}</Text>
      {ticket.description ? (
        <Text className="text-muted-foreground mt-1 text-xs">{ticket.description}</Text>
      ) : null}
      <View className="mt-3 flex-row items-baseline gap-2">
        <Text className="text-foreground text-lg font-bold">{formatNaira(ticket.gross_price)}</Text>
        {showCompare ? (
          <Text className="text-muted-foreground text-sm line-through">
            {formatNaira(ticket.display_price as number)}
          </Text>
        ) : null}
        <Text className="text-muted-foreground ml-auto text-xs">{availability}</Text>
      </View>
    </View>
  );
}
