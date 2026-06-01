import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { EventDetailSection } from '@/features/event-detail/components/sections/event-detail-section';
import { EventDetailTicketCard } from '@/features/event-detail/components/tickets/event-detail-ticket-card';
import type { EventDetail } from '@/features/event-detail/types';
import { getOnSaleTickets } from '@/lib/tickets';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

const INLINE_LIMIT = 3;

export function EventDetailTickets({ event }: { event: EventDetail }) {
  const onSale = getOnSaleTickets(event.tickets);
  if (onSale.length === 0) return null;

  const visible = onSale.slice(0, INLINE_LIMIT);
  const remaining = onSale.length - visible.length;

  return (
    <EventDetailSection title="Tickets">
      <View className="gap-2">
        {visible.map((ticket) => (
          <EventDetailTicketCard
            key={ticket.id}
            ticket={ticket}
            currency={event.currency}
          />
        ))}
        {remaining > 0 ? <ViewAllRow count={onSale.length} /> : null}
      </View>
    </EventDetailSection>
  );
}

function ViewAllRow({ count }: { count: number }) {
  return (
    <Pressable
      onPress={() => {
      }}
      className="bg-muted flex-row items-center justify-between rounded-2xl px-4 py-3">
      <Text className="text-foreground text-sm font-medium">View all {count} tickets</Text>
      <Icon as={ChevronRight} className="text-muted-foreground size-4" strokeWidth={2} />
    </Pressable>
  );
}
