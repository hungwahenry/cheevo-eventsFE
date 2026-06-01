import { EventFlyer } from '@/components/event-flyer';
import type { FeedEvent } from '@/features/feed/types';
import { View } from 'react-native';

type EventCardFlyerProps = {
  event: FeedEvent;
  isVisible: boolean;
};

export function EventCardFlyer({ event, isVisible }: EventCardFlyerProps) {
  return (
    <View className="bg-muted aspect-[4/5] w-full overflow-hidden rounded-3xl">
      <EventFlyer
        flyerUrl={event.flyer_url}
        flyerType={event.flyer_type}
        isVisible={isVisible}
      />
    </View>
  );
}
