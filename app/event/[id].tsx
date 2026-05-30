import { EventDetailScreen } from '@/features/event-detail';
import { useLocalSearchParams } from 'expo-router';

export default function EventDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EventDetailScreen id={id} />;
}
