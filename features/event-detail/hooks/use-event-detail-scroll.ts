import { useWindowDimensions } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

/** Scroll tracking + pin-header offset calculations for the event detail screen. */
export function useEventDetailScroll() {
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const flyerHeight = (width * 5) / 4;
  const pinStart = flyerHeight - 40;
  const pinEnd = flyerHeight + 80;

  return { scrollY, onScroll, pinStart, pinEnd };
}
