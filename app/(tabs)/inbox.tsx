import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { InboxNotification } from '@/features/notifications/api';
import { InboxList } from '@/features/notifications/components/inbox-list';
import {
  NotificationPreferencesSheet,
  type NotificationPreferencesSheetRef,
} from '@/features/notifications/components/notification-preferences-sheet';
import { useMarkAllRead, useUnreadCount } from '@/features/notifications/hooks';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';

function routeFor(notification: InboxNotification): string | null {
  const data = notification.data as Record<string, any>;

  switch (notification.type) {
    case 'attendee.order_paid':
      return '/(tabs)/tickets';
    case 'attendee.event_starting_soon':
    case 'attendee.new_event_from_subscription':
      return data.event_id ? `/event/${data.event_id}` : null;
    case 'attendee.comment_reply':
      return data.event_id ? `/event/${data.event_id}` : null;
    default:
      return null;
  }
}

function SettingsAction({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityLabel="Notification settings"
      className="bg-muted size-10 items-center justify-center rounded-full">
      <Icon as={Settings} className="text-foreground size-5" strokeWidth={2.25} />
    </Pressable>
  );
}

export default function InboxScreen() {
  const unread = useUnreadCount();
  const markAll = useMarkAllRead();
  const prefsRef = useRef<NotificationPreferencesSheetRef>(null);

  const handleOpen = (notification: InboxNotification) => {
    const target = routeFor(notification);
    if (target) router.push(target as any);
  };

  return (
    <Screen
      title="Notifications"
      rightAction={<SettingsAction onPress={() => prefsRef.current?.present()} />}>
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

      <NotificationPreferencesSheet ref={prefsRef} />
    </Screen>
  );
}
