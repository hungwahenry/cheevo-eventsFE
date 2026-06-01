import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { EventDetail } from '@/features/event-detail/types';
import { PlayCircle } from 'lucide-react-native';
import { Linking } from 'react-native';

export function EventDetailPromo({ event }: { event: EventDetail }) {
  if (!event.video_url) return null;

  return (
    <Button
      variant="outline"
      onPress={() => Linking.openURL(event.video_url as string)}>
      <Icon as={PlayCircle} className="text-foreground size-4" strokeWidth={2.25} />
      <Text>Watch promo</Text>
    </Button>
  );
}
