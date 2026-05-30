import { EventDetailFeatureCard } from '@/features/event-detail/components/event-detail-feature-card';
import { EventDetailSection } from '@/features/event-detail/components/event-detail-section';
import type { EventDetail } from '@/features/event-detail/types';
import { View } from 'react-native';

export function EventDetailFeatures({ event }: { event: EventDetail }) {
  if (event.features.length === 0) return null;

  return (
    <EventDetailSection title="What to expect">
      <View className="gap-2">
        {event.features.map((feature) => (
          <EventDetailFeatureCard key={feature.id} feature={feature} />
        ))}
      </View>
    </EventDetailSection>
  );
}
