import { TicketDetail } from '@/features/tickets/components/ticket-detail';
import { useLocalSearchParams } from 'expo-router';

export default function TicketDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TicketDetail ticketId={id} />;
}
