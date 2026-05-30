import { Text } from '@/components/ui/text';
import { EventDetailAbout } from '@/features/event-detail/components/event-detail-about';
import { EventDetailActionBar } from '@/features/event-detail/components/event-detail-action-bar';
import { EventDetailFeatures } from '@/features/event-detail/components/event-detail-features';
import { EventDetailFlyer } from '@/features/event-detail/components/event-detail-flyer';
import { EventDetailGallery } from '@/features/event-detail/components/event-detail-gallery';
import { EventDetailHeader } from '@/features/event-detail/components/event-detail-header';
import { EventDetailOrganisation } from '@/features/event-detail/components/event-detail-organisation';
import { EventDetailTickets } from '@/features/event-detail/components/event-detail-tickets';
import { useEvent } from '@/features/event-detail/hooks';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export function EventDetailScreen({ id }: { id: string }) {
  const { data: event, isLoading, error } = useEvent(id);

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

  return (
    <View className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        <EventDetailFlyer event={event} />
        <View className="gap-8 px-5 pt-6">
          <EventDetailOrganisation event={event} />
          <EventDetailHeader event={event} />
          <EventDetailAbout event={event} />
          <EventDetailTickets event={event} />
          <EventDetailGallery event={event} />
          <EventDetailFeatures event={event} />
        </View>
      </ScrollView>
      <EventDetailActionBar event={event} />
    </View>
  );
}
