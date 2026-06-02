import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { FeedEvent } from '@/features/feed/types';
import { formatShortDateTime } from '@/lib/format/datetime';
import { formatPriceRange } from '@/lib/format/money';
import { router } from 'expo-router';
import { Calendar, MapPin, Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export function EventCardDetails({ event }: { event: FeedEvent }) {
  const org = event.organisation;
  const price = formatPriceRange(event.tickets_min_price, event.tickets_max_price, event.currency);
  const when = formatShortDateTime(event.starts_at);
  const location = event.venue_name ?? event.city;
  const badge = price ?? 'Free · RSVP';

  return (
    <View className="gap-3">
      {org ? (
        <Pressable
          onPress={() => router.push(`/org/${org.slug}` as any)}
          hitSlop={6}
          className="flex-row items-center gap-2 self-start active:opacity-70">
          {org.logo_url ? (
            <Avatar alt={`${org.name} logo`} className="size-5">
              <AvatarImage source={{ uri: org.logo_url }} />
            </Avatar>
          ) : null}
          <Text className="text-foreground text-sm font-medium">{org.name}</Text>
          {event.is_subscribed ? (
            <Text className="text-muted-foreground text-xs">· Following</Text>
          ) : null}
        </Pressable>
      ) : null}

      <Text className="text-foreground text-xl leading-tight font-bold">{event.title}</Text>

      <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
        {when ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={Calendar} className="text-muted-foreground size-4" strokeWidth={2} />
            <Text className="text-muted-foreground text-xs">{when}</Text>
          </View>
        ) : null}
        {location ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={MapPin} className="text-muted-foreground size-4" strokeWidth={2} />
            <Text className="text-muted-foreground text-xs">{location}</Text>
          </View>
        ) : null}
        {event.interest_overlap > 0 ? (
          <View className="flex-row items-center gap-1.5">
            <Icon as={Sparkles} className="text-primary size-4" strokeWidth={2} />
            <Text className="text-primary text-xs font-medium">
              {event.interest_overlap === 1
                ? '1 match'
                : `${event.interest_overlap} matches`}
            </Text>
          </View>
        ) : null}
      </View>

      <Badge variant="secondary" className="self-start">
        <Text>{badge}</Text>
      </Badge>
    </View>
  );
}
