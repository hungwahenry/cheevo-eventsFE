import type { GiphyGif } from '@/lib/giphy';
import { Image } from 'expo-image';
import * as React from 'react';
import { Pressable } from 'react-native';

type GifPickerTileProps = {
  gif: GiphyGif;
  onPress: (gif: GiphyGif) => void;
};

export const GifPickerTile = React.memo(function GifPickerTile({
  gif,
  onPress,
}: GifPickerTileProps) {
  const aspect = gif.height > 0 ? gif.width / gif.height : 1;

  return (
    <Pressable
      onPress={() => onPress(gif)}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      className="bg-muted flex-1 overflow-hidden rounded-xl active:opacity-80"
      style={{ aspectRatio: aspect }}>
      <Image
        source={{ uri: gif.preview_url }}
        className="size-full"
        contentFit="cover"
        transition={120}
        recyclingKey={gif.id}
      />
    </Pressable>
  );
});
