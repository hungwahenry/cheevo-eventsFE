import { Text } from '@/components/ui/text';
import type { InboxNotification } from '@/features/notifications/api';
import { BellIcon, MailOpenIcon, MessageCircleIcon, PartyPopperIcon, TicketIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useUniwind } from 'uniwind';

type Props = {
  notification: InboxNotification;
  onPress: () => void;
};

type Presentation = {
  Icon: typeof BellIcon;
  title: string;
  body: string;
};

function presentationFor(notification: InboxNotification): Presentation {
  const data = notification.data as Record<string, any>;

  switch (notification.type) {
    case 'attendee.order_paid':
      return {
        Icon: TicketIcon,
        title: 'Your tickets are ready',
        body: data.event_title ? `Order for ${data.event_title} confirmed.` : 'Order confirmed.',
      };
    case 'attendee.event_starting_soon':
      return {
        Icon: PartyPopperIcon,
        title: `Tomorrow: ${data.event_title ?? 'your event'}`,
        body: 'See you there.',
      };
    case 'attendee.new_event_from_subscription':
      return {
        Icon: BellIcon,
        title: data.organisation_name ? `New from ${data.organisation_name}` : 'New event',
        body: data.event_title ?? '',
      };
    case 'attendee.comment_reply':
      return {
        Icon: MessageCircleIcon,
        title: 'New reply on your comment',
        body: data.preview ?? '',
      };
    default:
      return {
        Icon: MailOpenIcon,
        title: 'Notification',
        body: '',
      };
  }
}

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffSec = Math.max(1, Math.round((Date.now() - date.getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString();
}

export function InboxRow({ notification, onPress }: Props) {
  const { theme } = useUniwind();
  const { Icon, title, body } = presentationFor(notification);
  const isUnread = notification.read_at === null;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row gap-3 px-5 py-4 ${isUnread ? 'bg-card' : ''}`}>
      <View className="size-10 items-center justify-center rounded-full bg-muted">
        <Icon size={18} color={theme === 'dark' ? '#fff' : '#111'} strokeWidth={2} />
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text className={`flex-1 text-sm ${isUnread ? 'font-semibold' : 'font-medium'}`}>
            {title}
          </Text>
          <Text className="text-muted-foreground text-xs">
            {relativeTime(notification.created_at)}
          </Text>
        </View>

        {body ? (
          <Text className="text-muted-foreground text-xs" numberOfLines={2}>
            {body}
          </Text>
        ) : null}
      </View>

      {isUnread ? <View className="bg-primary size-2 self-center rounded-full" /> : null}
    </Pressable>
  );
}
