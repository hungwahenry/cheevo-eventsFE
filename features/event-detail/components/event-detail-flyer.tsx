import { Icon } from '@/components/ui/icon';
import { EventCardVideo } from '@/features/feed/components/event-card-video';
import type { EventDetail } from '@/features/event-detail/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View, useWindowDimensions } from 'react-native';

const fillParent = { width: '100%', height: '100%' } as const;

export function EventDetailFlyer({ event }: { event: EventDetail }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const height = (width * 5) / 4;

  return (
    <View className="bg-muted relative w-full" style={{ height }}>
      {event.flyer_url ? (
        event.flyer_type === 'video' ? (
          <EventCardVideo url={event.flyer_url} isVisible={true} />
        ) : (
          <Image
            source={{ uri: event.flyer_url }}
            style={fillParent}
            contentFit="cover"
            transition={200}
          />
        )
      ) : null}

      <Pressable
        onPress={() => router.back()}
        className="pt-safe absolute top-0 left-3 z-10"
        hitSlop={12}>
        <View className="bg-background/85 mt-2 size-10 items-center justify-center rounded-full">
          <Icon as={ChevronLeft} className="text-foreground size-5" strokeWidth={2.25} />
        </View>
      </Pressable>
    </View>
  );
}
