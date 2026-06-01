import type { PickedGif } from '@/lib/giphy';
import { Image } from 'expo-image';
import { View } from 'react-native';

const MAX_WIDTH = 180;

export function CommentGifView({ gif }: { gif: PickedGif }) {
  const aspect = gif.height > 0 ? gif.width / gif.height : 1;

  return (
    <View
      className="bg-muted mt-1 overflow-hidden rounded-xl"
      style={{ width: MAX_WIDTH, aspectRatio: aspect }}>
      <Image
        source={{ uri: gif.url }}
        className="size-full"
        contentFit="cover"
        transition={120}
      />
    </View>
  );
}
