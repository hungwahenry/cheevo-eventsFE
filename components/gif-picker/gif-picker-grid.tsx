import { GifPickerTile } from '@/components/gif-picker/gif-picker-tile';
import { splitMasonry } from '@/components/gif-picker/masonry';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import type { GiphyGif } from '@/lib/giphy';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as React from 'react';
import {
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GifPickerGridProps = {
  items: GiphyGif[];
  query: string;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onSelect: (gif: GiphyGif) => void;
};

const END_THRESHOLD = 240;

export function GifPickerGrid({
  items,
  query,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onSelect,
}: GifPickerGridProps) {
  const insets = useSafeAreaInsets();

  const [left, right] = React.useMemo(() => splitMasonry(items), [items]);

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hasNextPage || isFetchingNextPage) return;
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromEnd =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);
      if (distanceFromEnd < END_THRESHOLD) onFetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, onFetchNextPage]
  );

  if (items.length === 0) {
    return <GridEmpty isLoading={isLoading} isError={isError} query={query} />;
  }

  return (
    <BottomSheetScrollView
      onScroll={handleScroll}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
      <View className="flex-row gap-2 px-4">
        <MasonryColumn items={left} onSelect={onSelect} />
        <MasonryColumn items={right} onSelect={onSelect} />
      </View>

      {isFetchingNextPage ? (
        <View className="items-center py-4">
          <Spinner size="sm" />
        </View>
      ) : null}
    </BottomSheetScrollView>
  );
}

function MasonryColumn({
  items,
  onSelect,
}: {
  items: GiphyGif[];
  onSelect: (gif: GiphyGif) => void;
}) {
  return (
    <View className="flex-1 gap-2">
      {items.map((gif) => (
        <GifPickerTile key={gif.id} gif={gif} onPress={onSelect} />
      ))}
    </View>
  );
}

function GridEmpty({
  isLoading,
  isError,
  query,
}: {
  isLoading: boolean;
  isError: boolean;
  query: string;
}) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-24">
        <Spinner size="lg" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-8 py-24">
        <Text className="text-muted-foreground text-center text-sm">
          Couldn&apos;t reach GIPHY. Try again in a moment.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center px-8 py-24">
      <Text className="text-muted-foreground text-center text-sm">
        {query ? `No GIFs for "${query}".` : 'No GIFs to show.'}
      </Text>
    </View>
  );
}
