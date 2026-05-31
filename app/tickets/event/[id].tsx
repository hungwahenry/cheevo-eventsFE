import { EventTicketDetail } from '@/features/tickets/components/event-ticket-detail';
import { useLocalSearchParams } from 'expo-router';

export default function EventTicketsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EventTicketDetail eventId={id} />;
}
