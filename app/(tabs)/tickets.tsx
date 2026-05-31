import { Screen } from '@/components/screen';
import { TicketsList } from '@/features/tickets/components/tickets-list';

export default function TicketsScreen() {
  return (
    <Screen title="Tickets" subtitle="Your tickets, ready at the door.">
      <TicketsList />
    </Screen>
  );
}
