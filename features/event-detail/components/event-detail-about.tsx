import { Text } from '@/components/ui/text';
import { EventDetailSection } from '@/features/event-detail/components/event-detail-section';
import type { EventDetail } from '@/features/event-detail/types';

export function EventDetailAbout({ event }: { event: EventDetail }) {
  if (!event.description) return null;

  return (
    <EventDetailSection title="About">
      <Text className="text-muted-foreground text-sm leading-relaxed">{event.description}</Text>
    </EventDetailSection>
  );
}
