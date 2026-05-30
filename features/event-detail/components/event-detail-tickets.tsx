import { EventDetailSection } from '@/features/event-detail/components/event-detail-section';
import { EventDetailTicketCard } from '@/features/event-detail/components/event-detail-ticket-card';
import type { EventDetail } from '@/features/event-detail/types';
import { View } from 'react-native';

export function EventDetailTickets({ event }: { event: EventDetail }) {
  const onSale = event.tickets.filter((t) => t.status === 'on_sale');
  if (onSale.length === 0) return null;

  return (
    <EventDetailSection title="Tickets">
      <View className="gap-2">
        {onSale.map((ticket) => (
          <EventDetailTicketCard key={ticket.id} ticket={ticket} />
        ))}
      </View>
    </EventDetailSection>
  );
}
