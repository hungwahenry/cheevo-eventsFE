import { EventFlyer } from '@/components/event-flyer';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { TicketRow } from '@/features/tickets/components/ticket-row';
import { TicketScreenHeader } from '@/features/tickets/components/ticket-screen-header';
import { useMyTickets } from '@/features/tickets/hooks';
import { formatShortDateTime } from '@/lib/format/datetime';
import { selectTicketsForEvent } from '@/lib/tickets';
import { Link } from 'expo-router';
import { CalendarIcon, MapPinIcon, TicketIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export function EventTicketDetail({ eventId }: { eventId: string }) {
  const { data, isLoading } = useMyTickets();

  const tickets = useMemo(
    () => selectTicketsForEvent(data?.pages.flatMap((p) => p.items) ?? [], eventId),
    [data, eventId]
  );

  if (isLoading) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View className="bg-background flex-1">
        <TicketScreenHeader />
        <EmptyState
          icon={TicketIcon}
          title="No tickets for this event"
          description="Looks like your tickets aren't here yet."
        />
      </View>
    );
  }

  const event = tickets[0].event;
  const when = formatShortDateTime(event.starts_at);
  const venue = event.venue_name ?? event.city;

  return (
    <View className="bg-background flex-1">
      <TicketScreenHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Link href={`/events/${event.slug}`} asChild>
          <Pressable className="bg-muted mx-4 flex-row items-center gap-3 rounded-xl p-3 active:opacity-80">
            <View className="bg-muted h-20 w-16 overflow-hidden rounded-md">
              <EventFlyer
                flyerUrl={event.flyer_url}
                flyerType={event.flyer_type}
                variant="thumbnail"
              />
            </View>
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-foreground text-base font-sans-semibold" numberOfLines={2}>
                {event.title}
              </Text>
              {when ? (
                <View className="flex-row items-center gap-1.5">
                  <Icon as={CalendarIcon} className="text-muted-foreground size-3" />
                  <Text className="text-muted-foreground text-xs">{when}</Text>
                </View>
              ) : null}
              {venue ? (
                <View className="flex-row items-center gap-1.5">
                  <Icon as={MapPinIcon} className="text-muted-foreground size-3" />
                  <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                    {venue}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        </Link>

        <View className="mx-4 mt-6">
          <Text className="text-muted-foreground mb-2 px-1 text-xs font-sans-semibold uppercase tracking-wide">
            Your tickets
          </Text>
          <View className="bg-muted overflow-hidden rounded-xl">
            {tickets.map((ticket, idx) => (
              <TicketRow key={ticket.id} ticket={ticket} isLast={idx === tickets.length - 1} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
