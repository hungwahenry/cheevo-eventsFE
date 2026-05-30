import { EventDetailSection } from '@/features/event-detail/components/event-detail-section';
import type { EventDetail } from '@/features/event-detail/types';
import { Image } from 'expo-image';
import { ScrollView, View } from 'react-native';

const fillParent = { width: '100%', height: '100%' } as const;

export function EventDetailGallery({ event }: { event: EventDetail }) {
  if (event.images.length === 0) return null;

  return (
    <EventDetailSection title="Gallery">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-5">
        {event.images.map((image) => (
          <View
            key={image.id}
            className="bg-muted overflow-hidden rounded-xl"
            style={{ width: 140, height: 140 }}>
            <Image
              source={{ uri: image.url }}
              style={fillParent}
              contentFit="cover"
              transition={150}
            />
          </View>
        ))}
      </ScrollView>
    </EventDetailSection>
  );
}
