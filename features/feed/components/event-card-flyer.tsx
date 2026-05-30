import { Text } from '@/components/ui/text';
import type { FeedEvent } from '@/features/feed/types';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { View } from 'react-native';

export function EventCardFlyer({ event }: { event: FeedEvent }) {
  return (
    <View className="bg-muted aspect-[4/5] w-full overflow-hidden rounded-3xl">
      {event.flyer_url ? (
        event.flyer_type === 'video' ? (
          <VideoFlyerPlaceholder />
        ) : (
          <Image
            source={{ uri: event.flyer_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        )
      ) : null}
    </View>
  );
}

function VideoFlyerPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <View className="size-16 items-center justify-center rounded-full bg-white/15">
        <Play color="white" size={28} fill="white" />
      </View>
      <Text className="mt-3 text-xs font-medium tracking-wide text-white uppercase">
        Video flyer
      </Text>
    </View>
  );
}
