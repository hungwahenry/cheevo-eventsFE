import { Text } from '@/components/ui/text';
import { EventDetailAbout } from '@/features/event-detail/components/event-detail-about';
import { EventDetailActionBar } from '@/features/event-detail/components/event-detail-action-bar';
import { EventDetailFeatures } from '@/features/event-detail/components/event-detail-features';
import { EventDetailFlyer } from '@/features/event-detail/components/event-detail-flyer';
import { EventDetailGallery } from '@/features/event-detail/components/event-detail-gallery';
import { EventDetailHeader } from '@/features/event-detail/components/event-detail-header';
import { EventDetailOrganisation } from '@/features/event-detail/components/event-detail-organisation';
import { EventDetailPinnedHeader } from '@/features/event-detail/components/event-detail-pinned-header';
import { EventDetailPromo } from '@/features/event-detail/components/event-detail-promo';
import { EventDetailTickets } from '@/features/event-detail/components/event-detail-tickets';
import { useEvent } from '@/features/event-detail/hooks';
import { formatShortDateTime } from '@/lib/format/datetime';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

export function EventDetailScreen({ id }: { id: string }) {
  const { data: event, isLoading, error } = useEvent(id);
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  if (isLoading) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-8">
        <Text className="text-foreground text-lg font-semibold">Event not found</Text>
        <Text className="text-muted-foreground mt-1 text-center text-sm">
          It might have been taken down or you opened a stale link.
        </Text>
      </View>
    );
  }

  const flyerHeight = (width * 5) / 4;
  const pinStart = flyerHeight - 40;
  const pinEnd = flyerHeight + 80;
  const meta = buildMeta(event.starts_at, event.venue_name, event.city);

  return (
    <View className="bg-background flex-1">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32">
        <EventDetailFlyer event={event} />
        <View className="gap-6 px-5 pt-6">
          <EventDetailHeader event={event} />
          <EventDetailAbout event={event} />
          <EventDetailPromo event={event} />
          <EventDetailTickets event={event} />
          <EventDetailGallery event={event} />
          <EventDetailFeatures event={event} />
          <EventDetailOrganisation event={event} />
        </View>
      </Animated.ScrollView>

      <EventDetailPinnedHeader
        title={event.title}
        meta={meta}
        scrollY={scrollY}
        startAt={pinStart}
        endAt={pinEnd}
      />

      <EventDetailActionBar event={event} />
    </View>
  );
}

function buildMeta(starts: string | null, venue: string | null, city: string | null) {
  const when = formatShortDateTime(starts);
  const where = venue ?? city;
  if (when && where) return `${when} · ${where}`;
  return when ?? where ?? null;
}
