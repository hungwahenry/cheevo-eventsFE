import { EventCardDetails } from '@/features/feed/components/event-card-details';
import { EventCardFlyer } from '@/features/feed/components/event-card-flyer';
import type { FeedEvent } from '@/features/feed/types';
import { View } from 'react-native';

export function EventCard({ event }: { event: FeedEvent }) {
  return (
    <View className="gap-4 px-5">
      <EventCardFlyer event={event} />
      <EventCardDetails event={event} />
    </View>
  );
}
