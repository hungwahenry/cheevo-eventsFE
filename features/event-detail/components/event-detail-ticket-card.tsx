import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { EventDetailTicket } from '@/features/event-detail/types';
import { formatShortDate } from '@/lib/format/datetime';
import { formatNaira } from '@/lib/format/money';
import { Clock, Ticket as TicketIcon, Users } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Meta = { icon: LucideIcon; label: string };

export function EventDetailTicketCard({ ticket }: { ticket: EventDetailTicket }) {
  const showCompare =
    ticket.display_price !== null && ticket.display_price > ticket.gross_price;

  const meta: Meta[] = [];
  if (ticket.quantity !== null) {
    meta.push({ icon: TicketIcon, label: `${ticket.quantity} left` });
  }
  if (ticket.sales_ends_at) {
    meta.push({ icon: Clock, label: `Closes ${formatShortDate(ticket.sales_ends_at)}` });
  }
  if (ticket.max_per_order !== null) {
    meta.push({ icon: Users, label: `Max ${ticket.max_per_order} per order` });
  }

  return (
    <View className="bg-card border-border gap-3 rounded-2xl border p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-foreground text-base font-semibold">{ticket.name}</Text>
          {ticket.description ? (
            <Text className="text-muted-foreground text-xs">{ticket.description}</Text>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="text-foreground text-xl font-bold">
            {formatNaira(ticket.gross_price)}
          </Text>
          {showCompare ? (
            <Text className="text-muted-foreground text-sm line-through">
              {formatNaira(ticket.display_price as number)}
            </Text>
          ) : null}
        </View>
      </View>

      {meta.length > 0 ? (
        <View className="border-border flex-row flex-wrap gap-x-3 gap-y-1.5 border-t pt-3">
          {meta.map((item) => (
            <View key={item.label} className="flex-row items-center gap-1.5">
              <Icon
                as={item.icon}
                className="text-muted-foreground size-3.5"
                strokeWidth={2}
              />
              <Text className="text-muted-foreground text-xs">{item.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
