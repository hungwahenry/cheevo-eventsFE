import { Text } from '@/components/ui/text';
import type { EventDetail } from '@/features/event-detail/types';

export function EventDetailAbout({ event }: { event: EventDetail }) {
  if (!event.description) return null;

  return (
    <Text className="text-muted-foreground text-sm leading-normal">{event.description}</Text>
  );
}
