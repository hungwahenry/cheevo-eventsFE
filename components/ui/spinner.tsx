import { cn } from '@/lib/utils';
import * as React from 'react';
import { type ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = ViewProps & {
  size?: SpinnerSize;
  /** Color override for the dot. Kept name for backward compatibility with prior bar-style API. */
  barClassName?: string;
};

const SIZES: Record<SpinnerSize, number> = { sm: 8, md: 14, lg: 20 };
const DURATION = 700;

export function Spinner({ size = 'md', barClassName, className, ...props }: SpinnerProps) {
  const dim = SIZES[size];
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: DURATION, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.6, { duration: DURATION, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: DURATION, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: DURATION, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[animatedStyle, { width: dim, height: dim, borderRadius: dim / 2 }]}
      className={cn('bg-primary', barClassName, className)}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      {...props}
    />
  );
}
