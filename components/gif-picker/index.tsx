import { GifPickerGrid } from '@/components/gif-picker/gif-picker-grid';
import { GifPickerSearch } from '@/components/gif-picker/gif-picker-search';
import { Text } from '@/components/ui/text';
import { useGiphySearch, type GiphyGif, type PickedGif } from '@/lib/giphy';
import { THEME } from '@/lib/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';

export type GifPickerRef = {
  present: () => void;
  dismiss: () => void;
};

type GifPickerProps = {
  onSelect: (gif: PickedGif) => void;
};

const SNAP_POINTS = ['90%'];

export const GifPicker = React.forwardRef<GifPickerRef, GifPickerProps>(
  function GifPicker({ onSelect }, forwardedRef) {
    const ref = React.useRef<BottomSheetModal>(null);
    const { theme } = useUniwind();
    const colors = THEME[theme === 'dark' ? 'dark' : 'light'];

    const [query, setQuery] = React.useState('');
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
      debouncedQuery,
    } = useGiphySearch(query);

    const items = React.useMemo(
      () => data?.pages.flatMap((p) => p.items) ?? [],
      [data]
    );

    React.useImperativeHandle(forwardedRef, () => ({
      present: () => ref.current?.present(),
      dismiss: () => ref.current?.dismiss(),
    }));

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleSelect = React.useCallback(
      (gif: GiphyGif) => {
        onSelect({
          id: gif.id,
          url: gif.url,
          width: gif.width,
          height: gif.height,
        });
        setQuery('');
        ref.current?.dismiss();
      },
      [onSelect]
    );

    const handleClear = React.useCallback(() => setQuery(''), []);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        stackBehavior="push"
        onDismiss={handleClear}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}>
        <View style={{ flex: 1 }}>
          <GifPickerSearch value={query} onChange={setQuery} onClear={handleClear} />
          <GifPickerGrid
            items={items}
            query={debouncedQuery}
            isLoading={isLoading}
            isError={isError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFetchNextPage={fetchNextPage}
            onSelect={handleSelect}
          />
          <View className="border-border items-center border-t px-4 py-2">
            <Text className="text-muted-foreground text-[10px] tracking-wider uppercase">
              Powered by GIPHY
            </Text>
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);
