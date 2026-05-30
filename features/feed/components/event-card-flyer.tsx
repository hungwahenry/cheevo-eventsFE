import { EventCardVideo } from '@/features/feed/components/event-card-video';
import type { FeedEvent } from '@/features/feed/types';
import { Image } from 'expo-image';
import { View } from 'react-native';

const fillParent = { width: '100%', height: '100%' } as const;

type EventCardFlyerProps = {
  event: FeedEvent;
  isVisible: boolean;
};

export function EventCardFlyer({ event, isVisible }: EventCardFlyerProps) {
  return (
    <View className="bg-muted aspect-[4/5] w-full overflow-hidden rounded-3xl">
      {event.flyer_url ? (
        event.flyer_type === 'video' ? (
          <EventCardVideo url={event.flyer_url} isVisible={isVisible} />
        ) : (
          <Image
            source={{ uri: event.flyer_url }}
            style={fillParent}
            contentFit="cover"
            transition={200}
          />
        )
      ) : null}
    </View>
  );
}
