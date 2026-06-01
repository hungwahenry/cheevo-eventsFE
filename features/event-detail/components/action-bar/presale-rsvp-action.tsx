import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ActionBarWrapper } from '@/features/event-detail/components/action-bar/action-bar-wrapper';
import { CommentsButton } from '@/features/event-detail/components/action-bar/comments-button';
import { useRsvpToggle } from '@/features/event-detail/hooks';
import type { EventDetail } from '@/features/event-detail/types';
import { LockIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  event: EventDetail;
  onOpenComments: () => void;
};

export function PresaleRsvpAction({ event, onOpenComments }: Props) {
  const toggle = useRsvpToggle(event.id);

  return (
    <ActionBarWrapper>
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">RSVP to unlock</Text>
        <Text className="text-foreground text-base font-semibold">Presale</Text>
      </View>
      <CommentsButton count={event.comments_count} onPress={onOpenComments} />
      <Button
        className="px-8"
        disabled={toggle.isPending}
        onPress={() => toggle.mutate(true)}>
        <Icon as={LockIcon} className="text-primary-foreground size-4" strokeWidth={2.25} />
        <Text>RSVP to unlock</Text>
      </Button>
    </ActionBarWrapper>
  );
}
