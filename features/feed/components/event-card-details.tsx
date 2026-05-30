import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { FeedEvent } from '@/features/feed/types';
import { formatShortDateTime } from '@/lib/format/datetime';
import { formatPriceRange } from '@/lib/format/money';
import { Image } from 'expo-image';
import { Calendar, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

export function EventCardDetails({ event }: { event: FeedEvent }) {
  const org = event.organisation;
  const price = formatPriceRange(event.tickets_min_price, event.tickets_max_price);
  const when = formatShortDateTime(event.starts_at);
  const location = event.venue_name ?? event.city;

  return (
    <View className="gap-3">
      {org ? (
        <View className="flex-row items-center gap-2">
          {org.logo_url ? (
            <Image
              source={{ uri: org.logo_url }}
              style={{ width: 22, height: 22, borderRadius: 11 }}
              contentFit="cover"
            />
          ) : null}
          <Text className="text-foreground text-sm font-medium">{org.name}</Text>
          {event.is_subscribed ? (
            <Text className="text-muted-foreground text-xs">· Following</Text>
          ) : null}
        </View>
      ) : null}

      <Text className="text-foreground text-xl leading-tight font-bold">{event.title}</Text>

      <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1.5">
        {when ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={Calendar} className="text-muted-foreground size-3.5" strokeWidth={2} />
            <Text className="text-muted-foreground text-xs">{when}</Text>
          </View>
        ) : null}
        {location ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={MapPin} className="text-muted-foreground size-3.5" strokeWidth={2} />
            <Text className="text-muted-foreground text-xs">{location}</Text>
          </View>
        ) : null}
      </View>

      <View className="mt-1 flex-row items-center justify-between">
        <Text className="text-foreground text-base font-semibold">{price ?? 'RSVP'}</Text>
        <Button size="sm" className="px-6">
          <Text>{price ? 'Get tickets' : 'RSVP'}</Text>
        </Button>
      </View>
    </View>
  );
}
