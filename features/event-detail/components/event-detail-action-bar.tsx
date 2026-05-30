import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRsvpToggle } from '@/features/event-detail/hooks';
import type { EventDetail } from '@/features/event-detail/types';
import { formatPriceRange } from '@/lib/format/money';
import { Check, Sparkles, Ticket } from 'lucide-react-native';
import { View } from 'react-native';

export function EventDetailActionBar({ event }: { event: EventDetail }) {
  const hasTickets = event.tickets_count > 0;

  if (hasTickets) {
    const price = formatPriceRange(event.tickets_min_price, event.tickets_max_price);
    return (
      <ActionBarWrapper>
        <View className="flex-1">
          <Text className="text-muted-foreground text-xs">From</Text>
          <Text className="text-foreground text-base font-semibold">{price ?? 'Free'}</Text>
        </View>
        <Button className="px-8">
          <Icon as={Ticket} className="text-primary-foreground size-4" strokeWidth={2.25} />
          <Text>Get tickets</Text>
        </Button>
      </ActionBarWrapper>
    );
  }

  return <RsvpAction event={event} />;
}

function RsvpAction({ event }: { event: EventDetail }) {
  const toggle = useRsvpToggle(event.id);

  return (
    <ActionBarWrapper>
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">{event.rsvps_count} going</Text>
        <Text className="text-foreground text-base font-semibold">
          {event.is_rsvped ? "You're going" : 'Are you in?'}
        </Text>
      </View>
      <Button
        variant={event.is_rsvped ? 'outline' : 'default'}
        className="px-8"
        disabled={toggle.isPending}
        onPress={() => toggle.mutate(!event.is_rsvped)}>
        <Icon
          as={event.is_rsvped ? Check : Sparkles}
          className={event.is_rsvped ? 'text-foreground size-4' : 'text-primary-foreground size-4'}
          strokeWidth={2.25}
        />
        <Text>{event.is_rsvped ? 'Going' : 'RSVP'}</Text>
      </Button>
    </ActionBarWrapper>
  );
}

function ActionBarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-background pb-safe-offset-3 border-border absolute right-0 bottom-0 left-0 border-t">
      <View className="flex-row items-center gap-4 px-5 pt-3">{children}</View>
    </View>
  );
}
