import { cn } from '@/lib/utils';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = ViewProps & {
  size?: SpinnerSize;
  barClassName?: string;
};

const BARS = 4;
const CYCLE_MS = 480;
const STAGGER_MS = 110;

const SIZES: Record<
  SpinnerSize,
  { height: number; bar: string; gap: string }
> = {
  sm: { height: 14, bar: 'w-[3px]', gap: 'gap-[3px]' },
  md: { height: 20, bar: 'w-[4px]', gap: 'gap-[4px]' },
  lg: { height: 28, bar: 'w-[5px]', gap: 'gap-[5px]' },
};

export function Spinner({
  size = 'md',
  barClassName,
  className,
  ...props
}: SpinnerProps) {
  const sizing = SIZES[size];

  return (
    <View
      className={cn('flex-row items-end', sizing.gap, className)}
      style={{ height: sizing.height }}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      {...props}>
      {Array.from({ length: BARS }).map((_, i) => (
        <Bar
          key={i}
          delay={i * STAGGER_MS}
          maxHeight={sizing.height}
          className={cn('bg-primary rounded-full', sizing.bar, barClassName)}
        />
      ))}
    </View>
  );
}

function Bar({
  delay,
  maxHeight,
  className,
}: {
  delay: number;
  maxHeight: number;
  className: string;
}) {
  const min = maxHeight * 0.3;
  const heightValue = useSharedValue(min);

  React.useEffect(() => {
    heightValue.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(maxHeight, { duration: CYCLE_MS }),
          withTiming(min, { duration: CYCLE_MS })
        ),
        -1
      )
    );
  }, [delay, heightValue, maxHeight, min]);

  const style = useAnimatedStyle(() => ({ height: heightValue.value }));

  return <Animated.View style={style} className={className} />;
}
