import { EventCardDetails } from '@/features/feed/components/event-card-details';
import { EventCardFlyer } from '@/features/feed/components/event-card-flyer';
import type { FeedEvent } from '@/features/feed/types';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable } from 'react-native';

type EventCardProps = {
  event: FeedEvent;
  isVisible: boolean;
};

function EventCardImpl({ event, isVisible }: EventCardProps) {
  const router = useRouter();

  return (
    <Pressable className="gap-4 px-5" onPress={() => router.push(`/event/${event.slug}`)}>
      <EventCardFlyer event={event} isVisible={isVisible} />
      <EventCardDetails event={event} />
    </Pressable>
  );
}

export const EventCard = memo(EventCardImpl);
