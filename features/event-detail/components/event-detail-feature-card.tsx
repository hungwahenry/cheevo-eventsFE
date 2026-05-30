import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { EventDetailFeature } from '@/features/event-detail/types';
import { formatTimeRange } from '@/lib/format/datetime';
import { Image } from 'expo-image';
import { ExternalLink } from 'lucide-react-native';
import { Linking, Pressable, View } from 'react-native';

const fillParent = { width: '100%', height: '100%' } as const;

export function EventDetailFeatureCard({ feature }: { feature: EventDetailFeature }) {
  const time = formatTimeRange(feature.starts_at, feature.ends_at);
  const handlePress = feature.link
    ? () => Linking.openURL(feature.link as string)
    : undefined;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!feature.link}
      className="bg-muted aspect-square w-[200px] overflow-hidden rounded-2xl">
      {feature.image_url ? (
        <Image
          source={{ uri: feature.image_url }}
          style={fillParent}
          contentFit="cover"
          transition={150}
        />
      ) : null}

      {feature.link ? (
        <View className="absolute top-2 right-2 size-7 items-center justify-center rounded-full bg-black/55">
          <Icon as={ExternalLink} className="size-3.5 text-white" strokeWidth={2.25} />
        </View>
      ) : null}

      <View className="absolute inset-x-0 bottom-0 gap-1 bg-black/55 p-3">
        <Text className="text-sm font-semibold text-white" numberOfLines={1}>
          {feature.title}
        </Text>
        {feature.description ? (
          <Text className="text-xs text-white/85" numberOfLines={2}>
            {feature.description}
          </Text>
        ) : null}
        {time ? <Text className="text-xs text-white/75">{time}</Text> : null}
      </View>
    </Pressable>
  );
}
