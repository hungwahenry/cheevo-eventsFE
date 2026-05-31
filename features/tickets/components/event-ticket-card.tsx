import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { MyTicket, TicketEvent } from '@/features/tickets/types';
import { formatShortDateTime } from '@/lib/format/datetime';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  event: TicketEvent;
  tickets: MyTicket[];
};

export function EventTicketCard({ event, tickets }: Props) {
  const when = formatShortDateTime(event.starts_at);
  const venue = event.venue_name ?? event.city;
  const validCount = tickets.filter((t) => t.status === 'valid').length;
  const totalCount = tickets.length;
  const countLabel = `${totalCount} ticket${totalCount === 1 ? '' : 's'}${
    validCount < totalCount ? ` · ${validCount} active` : ''
  }`;

  return (
    <Link href={`/tickets/event/${event.id}`} asChild>
      <Pressable className="bg-card flex-row items-center gap-3 rounded-xl p-2.5 active:opacity-80">
        <View className="bg-muted h-16 w-12 overflow-hidden rounded-md">
          {event.flyer_url ? (
            <Image
              source={{ uri: event.flyer_url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={150}
            />
          ) : null}
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
            {event.title}
          </Text>
          {when ? (
            <Text className="text-muted-foreground text-xs" numberOfLines={1}>
              {when}
            </Text>
          ) : null}
          {venue ? (
            <Text className="text-muted-foreground text-xs" numberOfLines={1}>
              {venue}
            </Text>
          ) : null}
          <Text className="text-foreground mt-0.5 text-xs font-medium">{countLabel}</Text>
        </View>

        <Icon as={ChevronRightIcon} className="text-muted-foreground size-4" />
      </Pressable>
    </Link>
  );
}
