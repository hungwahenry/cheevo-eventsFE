import { Text } from '@/components/ui/text';
import type { EventDetailFeature } from '@/features/event-detail/types';
import { Image } from 'expo-image';
import { View } from 'react-native';

const fillParent = { width: '100%', height: '100%' } as const;

export function EventDetailFeatureCard({ feature }: { feature: EventDetailFeature }) {
  return (
    <View className="border-border flex-row gap-3 rounded-2xl border p-3">
      {feature.image_url ? (
        <View className="bg-muted size-14 overflow-hidden rounded-lg">
          <Image
            source={{ uri: feature.image_url }}
            style={fillParent}
            contentFit="cover"
            transition={150}
          />
        </View>
      ) : null}
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-foreground text-sm font-semibold">{feature.title}</Text>
        {feature.description ? (
          <Text className="text-muted-foreground text-xs">{feature.description}</Text>
        ) : null}
      </View>
    </View>
  );
}
