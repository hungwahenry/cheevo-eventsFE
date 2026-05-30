import type { CommentGif } from '@/features/event-comments/types';
import { Image } from 'expo-image';
import { View } from 'react-native';

const MAX_WIDTH = 180;

export function CommentGifView({ gif }: { gif: CommentGif }) {
  const aspect = gif.height > 0 ? gif.width / gif.height : 1;

  return (
    <View
      className="bg-muted mt-1 overflow-hidden rounded-xl"
      style={{ width: MAX_WIDTH, aspectRatio: aspect }}>
      <Image
        source={{ uri: gif.url }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={120}
      />
    </View>
  );
}
