import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ActionBarWrapper } from '@/features/event-detail/components/action-bar/action-bar-wrapper';
import { CommentsButton } from '@/features/event-detail/components/action-bar/comments-button';
import { useRsvpToggle } from '@/features/event-detail/hooks';
import type { EventDetail } from '@/features/event-detail/types';
import { Check, Sparkles } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  event: EventDetail;
  onOpenComments: () => void;
};

export function RsvpAction({ event, onOpenComments }: Props) {
  const toggle = useRsvpToggle(event.slug, event.id);

  return (
    <ActionBarWrapper>
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">{event.rsvps_count} going</Text>
        <Text className="text-foreground text-base font-semibold">
          {event.is_rsvped ? "You're going" : 'Are you in?'}
        </Text>
      </View>
      <CommentsButton count={event.comments_count} onPress={onOpenComments} />
      <Button
        variant={event.is_rsvped ? 'outline' : 'default'}
        className="px-8"
        disabled={toggle.isPending}
        onPress={() => toggle.mutate(!event.is_rsvped)}>
        <Icon
          as={event.is_rsvped ? Check : Sparkles}
          className={event.is_rsvped ? 'text-foreground size-4' : 'text-primary-foreground size-4'}
          strokeWidth={2.25}
        />
        <Text>{event.is_rsvped ? 'Going' : 'RSVP'}</Text>
      </Button>
    </ActionBarWrapper>
  );
}
