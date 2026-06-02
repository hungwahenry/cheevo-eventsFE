import { Text } from '@/components/ui/text';
import type { SearchEventResult } from '@/features/search/types';
import { formatShortDateTime } from '@/lib/format/datetime';
import { Image } from 'expo-image';
import { CalendarIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  event: SearchEventResult;
  onPress: () => void;
};

export function SearchEventRow({ event, onPress }: Props) {
  const subtitle = [formatShortDateTime(event.starts_at), event.venue_name ?? event.city]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-5 py-3">
      <View className="bg-muted size-14 items-center justify-center overflow-hidden rounded-xl">
        {event.flyer_url ? (
          <Image source={{ uri: event.flyer_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <CalendarIcon size={20} className="text-muted-foreground" strokeWidth={2} />
        )}
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-foreground text-sm font-semibold">
          {event.title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            {subtitle}
          </Text>
        ) : null}
        {event.organisation ? (
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            {event.organisation.name}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
