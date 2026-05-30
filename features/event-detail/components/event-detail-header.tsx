import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { EventDetail } from '@/features/event-detail/types';
import { formatShortDateTime } from '@/lib/format/datetime';
import { Calendar, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

export function EventDetailHeader({ event }: { event: EventDetail }) {
  const when = formatShortDateTime(event.starts_at);
  const location = event.venue_name ?? event.city;

  return (
    <View className="gap-3">
      <Text className="text-foreground text-2xl leading-tight font-bold">{event.title}</Text>

      <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
        {when ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={Calendar} className="text-muted-foreground size-4" strokeWidth={2} />
            <Text className="text-muted-foreground text-sm">{when}</Text>
          </View>
        ) : null}
        {location ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={MapPin} className="text-muted-foreground size-4" strokeWidth={2} />
            <Text className="text-muted-foreground text-sm">{location}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
