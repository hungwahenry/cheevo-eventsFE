import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { InboxNotification } from '@/features/notifications/types';
import { InboxList } from '@/features/notifications/components/inbox-list';
import { useMarkAllRead, useUnreadCount } from '@/features/notifications/hooks';
import { router } from 'expo-router';
import { View } from 'react-native';

function routeFor(notification: InboxNotification): string | null {
  const data = notification.data as Record<string, any>;
  const eventTarget = data.event_slug ?? data.event_id;

  switch (notification.type) {
    case 'attendee.order_paid':
      return '/(tabs)/tickets';
    case 'attendee.event_starting_soon':
    case 'attendee.new_event_from_subscription':
    case 'attendee.comment_reply':
      return eventTarget ? `/event/${eventTarget}` : null;
    default:
      return null;
  }
}

export default function InboxScreen() {
  const unread = useUnreadCount();
  const markAll = useMarkAllRead();

  const handleOpen = (notification: InboxNotification) => {
    const target = routeFor(notification);
    if (target) router.push(target as any);
  };

  return (
    <Screen title="Notifications">
      <View className="flex-row items-center justify-between px-5 pb-3">
        <Text className="text-muted-foreground text-xs">
          {unread.data?.unread ?? 0} unread
        </Text>
        {unread.data && unread.data.unread > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => markAll.mutate()}
            disabled={markAll.isPending}>
            <Text>Mark all read</Text>
          </Button>
        ) : null}
      </View>

      <InboxList onOpen={handleOpen} />
    </Screen>
  );
}
