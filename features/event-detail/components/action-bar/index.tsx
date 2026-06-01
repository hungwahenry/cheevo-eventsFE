import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CheckoutSheet, type CheckoutSheetRef } from '@/features/checkout';
import {
  EventCommentsSheet,
  type EventCommentsSheetRef,
} from '@/features/event-comments';
import { ActionBarWrapper } from '@/features/event-detail/components/action-bar/action-bar-wrapper';
import { CommentsButton } from '@/features/event-detail/components/action-bar/comments-button';
import { PastEventAction } from '@/features/event-detail/components/action-bar/past-event-action';
import { PresaleRsvpAction } from '@/features/event-detail/components/action-bar/presale-rsvp-action';
import { RsvpAction } from '@/features/event-detail/components/action-bar/rsvp-action';
import type { EventDetail } from '@/features/event-detail/types';
import { formatPriceRange } from '@/lib/format/money';
import { isEventInPresale } from '@/lib/presale';
import { Ticket } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function EventDetailActionBar({ event }: { event: EventDetail }) {
  const commentsRef = React.useRef<EventCommentsSheetRef>(null);
  const checkoutRef = React.useRef<CheckoutSheetRef>(null);
  const isPast = event.status === 'past';
  const hasTickets = event.tickets_count > 0;
  const inPresale = isEventInPresale(event.presale_until);
  const presaleBlocks = inPresale && !event.is_rsvped;

  const openComments = () => commentsRef.current?.present();
  const openCheckout = () => checkoutRef.current?.present();

  return (
    <>
      {isPast ? (
        <PastEventAction
          commentsCount={event.comments_count}
          onOpenComments={openComments}
        />
      ) : hasTickets && presaleBlocks ? (
        <PresaleRsvpAction event={event} onOpenComments={openComments} />
      ) : hasTickets ? (
        <ActionBarWrapper>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs">From</Text>
            <Text className="text-foreground text-base font-semibold">
              {formatPriceRange(event.tickets_min_price, event.tickets_max_price, event.currency) ?? 'Free'}
            </Text>
          </View>
          <CommentsButton count={event.comments_count} onPress={openComments} />
          <Button className="px-8" onPress={openCheckout}>
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
        canCompose={!isPast}
      />

      {!isPast && hasTickets && !presaleBlocks ? (
        <CheckoutSheet ref={checkoutRef} event={event} />
      ) : null}
    </>
  );
}
