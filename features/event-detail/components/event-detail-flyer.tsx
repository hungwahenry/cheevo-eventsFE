import { EventCardVideo } from '@/features/feed/components/event-card-video';
import type { EventDetail } from '@/features/event-detail/types';
import { Image } from 'expo-image';
import { View, useWindowDimensions } from 'react-native';

const fillParent = { width: '100%', height: '100%' } as const;

export function EventDetailFlyer({ event }: { event: EventDetail }) {
  const { width } = useWindowDimensions();
  const height = (width * 5) / 4;

  return (
    <View className="bg-muted w-full" style={{ height }}>
      {event.flyer_url ? (
        event.flyer_type === 'video' ? (
          <EventCardVideo url={event.flyer_url} isVisible={true} />
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
