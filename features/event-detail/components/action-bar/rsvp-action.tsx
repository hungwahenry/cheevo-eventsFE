import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ActionBarWrapper } from '@/features/event-detail/components/action-bar/action-bar-wrapper';
import { CommentsButton } from '@/features/event-detail/components/action-bar/comments-button';
import { useRsvpToggle } from '@/features/event-detail/hooks';
import type { EventDetail } from '@/features/event-detail/types';
import { useFeature } from '@/features/system/hooks';
import { MOTION } from '@/lib/motion';
import { Check, Sparkles } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  event: EventDetail;
  onOpenComments: () => void;
};

export function RsvpAction({ event, onOpenComments }: Props) {
  const toggle = useRsvpToggle(event.slug, event.id);
  const rsvpEnabled = useFeature('rsvp.enabled');
  const showButton = rsvpEnabled || event.is_rsvped;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scale.value = withSequence(
      withTiming(MOTION.like.peak, { duration: MOTION.like.upMs }),
      withTiming(1, { duration: MOTION.like.downMs })
    );
  }, [event.is_rsvped, scale]);

  return (
    <ActionBarWrapper>
      <View className="flex-1">
        <Text className="text-muted-foreground text-xs">{event.rsvps_count} going</Text>
        <Text className="text-foreground text-base font-sans-semibold">
          {event.is_rsvped ? "You're going" : 'Are you in?'}
        </Text>
      </View>
      <CommentsButton count={event.comments_count} onPress={onOpenComments} />
      {showButton ? (
        <Button
          variant={event.is_rsvped ? 'outline' : 'default'}
          className="px-8"
          disabled={toggle.isPending}
          onPress={() => toggle.mutate(!event.is_rsvped)}>
          <Animated.View style={animatedStyle}>
            <Icon
              as={event.is_rsvped ? Check : Sparkles}
              className={event.is_rsvped ? 'text-foreground size-4' : 'text-primary-foreground size-4'}
              strokeWidth={2.25}
            />
          </Animated.View>
          <Text>{event.is_rsvped ? 'Going' : 'RSVP'}</Text>
        </Button>
      ) : null}
    </ActionBarWrapper>
  );
}
