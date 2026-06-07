import { Text } from '@/components/ui/text';
import { OrgFollowButton } from '@/features/organisations/components/org-follow-button';
import type { PublicOrganisation } from '@/features/organisations/types';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

type Props = {
  organisation: PublicOrganisation;
  scrollY: SharedValue<number>;
  startAt: number;
  endAt: number;
};

export function OrgPinnedHeader({ organisation, scrollY, startAt, endAt }: Props) {
  const [shown, setShown] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [startAt, endAt], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [startAt, endAt], [-8, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  useAnimatedReaction(
    () => scrollY.value > startAt + (endAt - startAt) / 2,
    (next, prev) => {
      if (next !== prev) runOnJS(setShown)(next);
    },
  );

  return (
    <Animated.View
      style={animatedStyle}
      pointerEvents={shown ? 'auto' : 'none'}
      className="bg-background pt-safe border-border absolute top-0 right-0 left-0 z-20 border-b">
      <View className="flex-row items-center justify-between gap-3 px-14 py-2">
        <View className="min-w-0 flex-1">
          <Text className="text-foreground text-sm font-sans-semibold" numberOfLines={1}>
            {organisation.name}
          </Text>
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            @{organisation.slug}
          </Text>
        </View>
        <OrgFollowButton organisation={organisation} size="sm" />
      </View>
    </Animated.View>
  );
}
