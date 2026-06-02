import { ActionsSheet } from '@/components/ui/actions-sheet';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { EventDetailActionBar } from '@/features/event-detail/components/action-bar';
import { EventDetailFeatures } from '@/features/event-detail/components/features/event-detail-features';
import { EventDetailFlyer } from '@/features/event-detail/components/event-detail-flyer';
import { EventDetailHeader } from '@/features/event-detail/components/header/event-detail-header';
import { EventDetailPinnedHeader } from '@/features/event-detail/components/header/event-detail-pinned-header';
import { EventDetailAbout } from '@/features/event-detail/components/sections/event-detail-about';
import { EventDetailGallery } from '@/features/event-detail/components/sections/event-detail-gallery';
import { EventDetailOrganisation } from '@/features/event-detail/components/sections/event-detail-organisation';
import { EventDetailPresaleBanner } from '@/features/event-detail/components/sections/event-detail-presale-banner';
import { EventDetailPromo } from '@/features/event-detail/components/sections/event-detail-promo';
import { EventDetailTickets } from '@/features/event-detail/components/tickets/event-detail-tickets';
import {
  useEvent,
  useEventDetailActions,
  useEventDetailScroll,
} from '@/features/event-detail/hooks';
import { ReportSheet } from '@/features/reports';
import { formatShortDateTime } from '@/lib/format/datetime';
import { isEventInPresale } from '@/lib/presale';
import { useManualRefresh } from '@/lib/use-manual-refresh';
import { useRouter } from 'expo-router';
import { ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import { Pressable, RefreshControl, View } from 'react-native';
import Animated from 'react-native-reanimated';

export function EventDetailScreen({ slug }: { slug: string }) {
  const { data: event, isLoading, error, refetch } = useEvent(slug);
  const { refreshing, onRefresh } = useManualRefresh(refetch);
  const router = useRouter();
  const { scrollY, onScroll, pinStart, pinEnd } = useEventDetailScroll();
  const { actionsRef, reportRef, actions } = useEventDetailActions(event ?? null);

  if (isLoading) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <Spinner size="lg" />
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

  const meta = buildMeta(event.starts_at, event.venue_name, event.city);

  return (
    <View className="bg-background flex-1">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <EventDetailFlyer event={event} />
        <View className="gap-6 px-5 pt-6">
          <EventDetailHeader event={event} />
          <EventDetailAbout event={event} />
          <EventDetailPromo event={event} />
          {isEventInPresale(event.presale_until) && event.presale_until ? (
            <EventDetailPresaleBanner
              presaleUntil={event.presale_until}
              isRsvped={event.is_rsvped}
            />
          ) : null}
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

      <View className="pt-safe-offset-2 absolute top-0 left-3 z-30">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Back">
          <View className="bg-foreground/15 size-9 items-center justify-center rounded-full">
            <Icon as={ChevronLeft} className="text-foreground size-5" strokeWidth={2.25} />
          </View>
        </Pressable>
      </View>

      <View className="pt-safe-offset-2 absolute top-0 right-3 z-30">
        <Pressable
          onPress={() => actionsRef.current?.present()}
          hitSlop={12}
          accessibilityLabel="More options">
          <View className="bg-foreground/15 size-9 items-center justify-center rounded-full">
            <Icon as={MoreHorizontal} className="text-foreground size-5" strokeWidth={2.25} />
          </View>
        </Pressable>
      </View>

      <EventDetailActionBar event={event} />

      <ActionsSheet ref={actionsRef} actions={actions} />
      <ReportSheet ref={reportRef} />
    </View>
  );
}

function buildMeta(starts: string | null, venue: string | null, city: string | null) {
  const when = formatShortDateTime(starts);
  const where = venue ?? city;
  if (when && where) return `${when} · ${where}`;
  return when ?? where ?? null;
}
