import { EventCardDetails } from '@/features/feed/components/event-card-details';
import { EventCardFlyer } from '@/features/feed/components/event-card-flyer';
import type { FeedEvent } from '@/features/feed/types';
import { MOTION } from '@/lib/motion';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { memo, useState } from 'react';
import { Pressable } from 'react-native';

type EventCardProps = {
  event: FeedEvent;
  isVisible: boolean;
};

function EventCardImpl({ event, isVisible }: EventCardProps) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  return (
    <MotiView
      from={{ opacity: 0, translateY: MOTION.entrance.distance }}
      animate={{
        opacity: 1,
        translateY: 0,
        scale: pressed ? MOTION.press.scale : 1,
      }}
      transition={{
        opacity: MOTION.entrance.transition,
        translateY: MOTION.entrance.transition,
        scale: {
          type: 'timing',
          duration: pressed ? MOTION.press.inMs : MOTION.press.outMs,
        },
      }}>
      <Pressable
        className="gap-4 px-5"
        onPress={() => router.push(`/event/${event.slug}`)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}>
        <EventCardFlyer event={event} isVisible={isVisible} />
        <EventCardDetails event={event} />
      </Pressable>
    </MotiView>
  );
}

export const EventCard = memo(EventCardImpl);
