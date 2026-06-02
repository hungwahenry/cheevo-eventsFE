import { EventDetailScreen } from '@/features/event-detail';
import { useLocalSearchParams } from 'expo-router';

export default function EventDetailRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <EventDetailScreen slug={slug} />;
}
