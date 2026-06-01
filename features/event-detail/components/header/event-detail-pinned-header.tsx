import { Text } from '@/components/ui/text';
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

type EventDetailPinnedHeaderProps = {
  title: string;
  meta: string | null;
  scrollY: SharedValue<number>;
  startAt: number;
  endAt: number;
};

export function EventDetailPinnedHeader({
  title,
  meta,
  scrollY,
  startAt,
  endAt,
}: EventDetailPinnedHeaderProps) {
  const [shown, setShown] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [startAt, endAt], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [startAt, endAt],
          [-8, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  useAnimatedReaction(
    () => scrollY.value > startAt + (endAt - startAt) / 2,
    (next, prev) => {
      if (next !== prev) runOnJS(setShown)(next);
    }
  );

  return (
    <Animated.View
      style={animatedStyle}
      pointerEvents={shown ? 'auto' : 'none'}
      className="bg-background pt-safe border-border absolute top-0 right-0 left-0 z-20 border-b">
      <View className="flex-row items-center px-14 py-2">
        <View className="min-w-0 flex-1">
          <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
            {title}
          </Text>
          {meta ? (
            <Text className="text-muted-foreground text-xs" numberOfLines={1}>
              {meta}
            </Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}
