import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TicketStatusPill } from '@/features/tickets/components/ticket-status-pill';
import type { MyTicket } from '@/features/tickets/types';
import { Link } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export function TicketRow({ ticket, isLast }: { ticket: MyTicket; isLast: boolean }) {
  return (
    <Link href={`/ticket/${ticket.id}`} asChild>
      <Pressable
        className={`flex-row items-center gap-3 px-4 py-3 active:bg-muted/40 ${
          isLast ? '' : 'border-border/60 border-b'
        }`}>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-foreground text-sm font-medium" numberOfLines={1}>
            {ticket.ticket_name}
          </Text>
          <Text className="text-muted-foreground font-mono text-xs">
            {ticket.code.slice(-8)}
          </Text>
        </View>
        <TicketStatusPill status={ticket.status} />
        <Icon as={ChevronRightIcon} className="text-muted-foreground size-4" />
      </Pressable>
    </Link>
  );
}
