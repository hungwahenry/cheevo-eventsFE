import { useWindowDimensions } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

export function useOrgScroll() {
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const coverHeight = width / 3;
  const pinStart = coverHeight + 20;
  const pinEnd = coverHeight + 80;

  return { scrollY, onScroll, pinStart, pinEnd };
}
