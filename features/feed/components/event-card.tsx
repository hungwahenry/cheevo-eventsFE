import { EventCardDetails } from '@/features/feed/components/event-card-details';
import { EventCardFlyer } from '@/features/feed/components/event-card-flyer';
import type { FeedEvent } from '@/features/feed/types';
import { memo } from 'react';
import { View } from 'react-native';

type EventCardProps = {
  event: FeedEvent;
  isVisible: boolean;
};

function EventCardImpl({ event, isVisible }: EventCardProps) {
  return (
    <View className="gap-4 px-5">
      <EventCardFlyer event={event} isVisible={isVisible} />
      <EventCardDetails event={event} />
    </View>
  );
}

export const EventCard = memo(EventCardImpl);
