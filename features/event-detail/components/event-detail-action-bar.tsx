import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  EventCommentsSheet,
  type EventCommentsSheetRef,
} from '@/features/event-comments';
import { useRsvpToggle } from '@/features/event-detail/hooks';
import type { EventDetail } from '@/features/event-detail/types';
import { formatPriceRange } from '@/lib/format/money';
import { Check, MessageCircle, Sparkles, Ticket } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function EventDetailActionBar({ event }: { event: EventDetail }) {
  const commentsRef = React.useRef<EventCommentsSheetRef>(null);
  const hasTickets = event.tickets_count > 0;

  const openComments = () => commentsRef.current?.present();

  return (
    <>
      {hasTickets ? (
        <ActionBarWrapper>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs">From</Text>
            <Text className="text-foreground text-base font-semibold">
              {formatPriceRange(event.tickets_min_price, event.tickets_max_price) ?? 'Free'}
            </Text>
          </View>
          <CommentsButton count={event.comments_count} onPress={openComments} />
          <Button className="px-8">
            <Icon as={Ticket} className="text-primary-foreground size-4" strokeWidth={2.25} />
            <Text>Get Tixs</Text>
          </Button>
        </ActionBarWrapper>
      ) : (
        <RsvpAction event={event} onOpenComments={openComments} />
      )}

      <EventCommentsSheet
        ref={commentsRef}
        eventId={event.id}
        commentsCount={event.comments_count}
      />
    </>
  );
}

function RsvpAction({
  event,
  onOpenComments,
}: {
  event: EventDetail;
  onOpenComments: () => void;
}) {
  const toggle = useRsvpToggle(event.id);

  return (
    <ActionBarWrapper>
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">{event.rsvps_count} going</Text>
        <Text className="text-foreground text-base font-semibold">
          {event.is_rsvped ? "You're going" : 'Are you in?'}
        </Text>
      </View>
      <CommentsButton count={event.comments_count} onPress={onOpenComments} />
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

function CommentsButton({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Button variant="outline" className="gap-1.5 px-4" onPress={onPress}>
      <Icon as={MessageCircle} className="text-foreground size-4" strokeWidth={2.25} />
      {count > 0 ? <Text>{count.toLocaleString()}</Text> : null}
    </Button>
  );
}

function ActionBarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-background pb-safe-offset-3 border-border absolute right-0 bottom-0 left-0 border-t">
      <View className="flex-row items-center gap-3 px-5 pt-3">{children}</View>
    </View>
  );
}
