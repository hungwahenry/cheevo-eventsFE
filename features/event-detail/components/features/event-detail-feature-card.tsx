import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { EventDetailFeature } from '@/features/event-detail/types';
import { formatTimeRange } from '@/lib/format/datetime';
import { Image } from 'expo-image';
import { ExternalLink } from 'lucide-react-native';
import { Linking, Pressable, View } from 'react-native';

export function EventDetailFeatureCard({ feature }: { feature: EventDetailFeature }) {
  const time = formatTimeRange(feature.starts_at, feature.ends_at);
  const handlePress = feature.link
    ? () => Linking.openURL(feature.link as string)
    : undefined;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!feature.link}
      className="w-[200px] gap-2 active:opacity-80">
      <View className="bg-muted aspect-square overflow-hidden rounded-2xl">
        {feature.image_url ? (
          <Image
            source={{ uri: feature.image_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
          />
        ) : null}
      </View>

      <View className="gap-0.5">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-foreground text-sm font-sans-semibold" numberOfLines={1}>
            {feature.title}
          </Text>
          {feature.link ? (
            <Icon
              as={ExternalLink}
              className="text-muted-foreground size-3.5"
              strokeWidth={2}
            />
          ) : null}
        </View>
        {feature.description ? (
          <Text className="text-muted-foreground text-xs" numberOfLines={2}>
            {feature.description}
          </Text>
        ) : null}
        {time ? <Text className="text-muted-foreground text-xs">{time}</Text> : null}
      </View>
    </Pressable>
  );
}
