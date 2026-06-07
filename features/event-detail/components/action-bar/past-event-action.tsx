import { Text } from '@/components/ui/text';
import { ActionBarWrapper } from '@/features/event-detail/components/action-bar/action-bar-wrapper';
import { CommentsButton } from '@/features/event-detail/components/action-bar/comments-button';
import { View } from 'react-native';

type Props = {
  commentsCount: number;
  onOpenComments: () => void;
};

export function PastEventAction({ commentsCount, onOpenComments }: Props) {
  return (
    <ActionBarWrapper>
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">Event ended</Text>
        <Text className="text-foreground text-base font-sans-semibold">Thanks for coming</Text>
      </View>
      <CommentsButton count={commentsCount} onPress={onOpenComments} />
    </ActionBarWrapper>
  );
}
