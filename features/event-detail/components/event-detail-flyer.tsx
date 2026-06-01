import { EventFlyer } from '@/components/event-flyer';
import type { EventDetail } from '@/features/event-detail/types';
import { View, useWindowDimensions } from 'react-native';

export function EventDetailFlyer({ event }: { event: EventDetail }) {
  const { width } = useWindowDimensions();
  const height = (width * 5) / 4;

  return (
    <View className="bg-muted w-full" style={{ height }}>
      <EventFlyer flyerUrl={event.flyer_url} flyerType={event.flyer_type} />
    </View>
  );
}
